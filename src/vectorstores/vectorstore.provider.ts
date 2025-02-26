import { Config } from '@cmmv/core';

import { VectorDatabaseAdapter } from './vectorstore.abstract';
import { AbstractEmbedding } from '../embeddings';

export class VectorStore {
    static async loadStore(
        embedder: AbstractEmbedding,
    ): Promise<VectorDatabaseAdapter> {
        const provider = Config.get<string>('ai.vector.provider', 'faiss');

        switch (provider) {
            case 'elastic':
            case 'elasticsearch':
                const { ElasticSearchVectorStore } = await import(
                    './elasticsearch.vectorstore'
                );
                const elasticSearchVectorStore = new ElasticSearchVectorStore();
                await elasticSearchVectorStore.initialize(
                    embedder.getInterfaceEmbedder(),
                );
                return elasticSearchVectorStore;
            case 'neo4j':
                const { MilvusVectorStore } = await import(
                    './milvus.vectorstore'
                );
                const milvusVectorStore = new MilvusVectorStore();
                await milvusVectorStore.initialize(
                    embedder.getInterfaceEmbedder(),
                );
                return milvusVectorStore;
            case 'neo4j':
                const { Neo4jVectorStore } = await import(
                    './neo4j.vectorstore'
                );
                const neo4jVectorStore = new Neo4jVectorStore();
                await neo4jVectorStore.initialize(
                    embedder.getInterfaceEmbedder(),
                );
                return neo4jVectorStore;
            case 'pgvector':
                const { PgVectorStore } = await import(
                    './pgvector.vectorstore'
                );
                const pgVectorStore = new PgVectorStore();
                await pgVectorStore.initialize(embedder.getInterfaceEmbedder());
                return pgVectorStore;
            case 'qdrant':
                const { QdrantVectorStore } = await import(
                    './qdrant.vectorstore'
                );
                const qdrantVectorStore = new QdrantVectorStore();
                await qdrantVectorStore.initialize(
                    embedder.getInterfaceEmbedder(),
                );
                return qdrantVectorStore;
            default:
                return null;
        }
    }
}
