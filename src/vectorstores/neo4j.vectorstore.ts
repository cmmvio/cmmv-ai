import { Config, Logger } from '@cmmv/core';
import { Neo4jGraphQL } from '@neo4j/graphql';
import { Driver, auth, session } from 'neo4j-driver';
import type { VectorStoreRetriever } from '@langchain/core/vectorstores';
import type { EmbeddingsInterface } from '@langchain/core/embeddings';
import { VectorDatabaseAdapter } from './vectorstore.abstract';
import { DatasetEntry } from '../dataset.interface';

export class Neo4jVectorStore extends VectorDatabaseAdapter {
    private logger = new Logger('Neo4jVectorStore');
    private session: any;
    private batchQueue: any[] = [];

    async initialize(embeddings: EmbeddingsInterface) {
        const config = Config.get('ai.vector.neo4j');
        this.logger.verbose(`Connecting to Neo4j at ${config.url}`);

        const { Neo4jVectorStore } = await import(
            '@langchain/community/vectorstores/neo4j_vector'
        );

        this.vectorStore = await Neo4jVectorStore.fromExistingGraph(
            embeddings,
            {
                ...config,
                url: config.url,
                username: config.username,
                password: config.password,
                searchType: 'vector' as const,
                textNodeProperty: 'text',
                textNodeProperties: ['text'],
                embeddingNodeProperty: 'embedding',
            },
        );

        setInterval(() => this.sendToDatabase(), 1000);
    }

    async saveVector(entry: DatasetEntry) {
        this.batchQueue.push({
            id: entry.id,
            content: entry.content,
            vector: entry.vector,
            metadata: entry.metadata,
        });
    }

    async sendToDatabase() {
        if (this.batchQueue.length === 0) return;

        try {
            const documents = this.batchQueue.map(
                ({ content, vector, metadata }) => ({
                    pageContent: content,
                    metadata,
                }),
            );

            await this.vectorStore.addDocuments(documents);
            this.batchQueue = [];
        } catch (error) {
            this.logger.error(`Error inserting into Neo4j: ${error.message}`);
        }
    }

    async searchVector(queryVector: Float32Array, topK = 5): Promise<any[]> {
        try {
            const results =
                await this.vectorStore.similaritySearchVectorWithScore(
                    Array.from(queryVector),
                    topK,
                );

            //@ts-ignore
            return results.map(({ metadata, score }) => ({
                id: metadata?.id || '',
                score,
            }));
        } catch (error) {
            this.logger.error(`Error searching Neo4j: ${error.message}`);
            return [];
        }
    }

    async clear() {
        try {
            if (this.vectorStore) await this.vectorStore.delete({ filter: {} });
        } catch (error) {
            this.logger.error(
                `Error clearing Neo4j Vector Store: ${error.message}`,
            );
        }
    }

    public asRetriever(): VectorStoreRetriever<any> {
        return this.vectorStore.asRetriever();
    }
}
