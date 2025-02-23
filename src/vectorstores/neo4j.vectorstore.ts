import { Config, Logger } from '@cmmv/core';
import type { EmbeddingsInterface } from '@langchain/core/embeddings';
import { VectorDatabaseAdapter } from './vectorstore.abstract';
import { DatasetEntry } from '../dataset.interface';

export class Neo4jVectorStore extends VectorDatabaseAdapter {
    protected logger = new Logger('Neo4jVectorStore');

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
    }
}
