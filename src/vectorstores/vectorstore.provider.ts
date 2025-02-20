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
      default:
        return null;
    }
  }
}
