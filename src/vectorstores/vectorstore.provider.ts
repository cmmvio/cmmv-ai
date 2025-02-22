import { Config } from '@cmmv/core';

import { VectorDatabaseAdapter } from './vectorstore.abstract';
import { AbstractEmbedding } from '../embeddings';

export class VectorStore {
  static async loadStore(
    embedder: AbstractEmbedding,
  ): Promise<VectorDatabaseAdapter> {
    const provider = Config.get<string>('ai.vector.provider', 'faiss');

    switch (provider) {
      case 'qdrant':
        const { QdrantVectorStore } = await import('./qdrant.vectorstore');
        const qdrantVectorStore = new QdrantVectorStore();
        await qdrantVectorStore.initialize(embedder.getInterfaceEmbedder());
        return qdrantVectorStore;
      case 'neo4j':
        const { Neo4jVectorStore } = await import('./neo4j.vectorstore');
        const neo4jVectorStore = new Neo4jVectorStore();
        await neo4jVectorStore.initialize(embedder.getInterfaceEmbedder());
        return neo4jVectorStore;
      default:
        return null;
    }
  }
}
