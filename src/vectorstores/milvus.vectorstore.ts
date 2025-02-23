import { Config, Logger } from '@cmmv/core';
import type { EmbeddingsInterface } from '@langchain/core/embeddings';
import { VectorDatabaseAdapter } from './vectorstore.abstract';

export class MilvusVectorStore extends VectorDatabaseAdapter {
    protected logger = new Logger('MilvusVectorStore');

    async initialize(embeddings: EmbeddingsInterface) {
        const { Milvus } = await import(
            '@langchain/community/vectorstores/milvus'
        );

        const url = Config.get(
            'ai.vector.milvus.url',
            'http://127.0.0.1:19530',
        );
        const username = Config.get('ai.vector.milvus.username');
        const password = Config.get('ai.vector.milvus.password');
        const collectionName = Config.get('ai.vector.milvus.collectionName');
        const options = Config.get('ai.vector');

        this.logger.verbose(`Connecting to Milvus at ${url}`);

        this.vectorStore = new Milvus(embeddings, {
            url,
            username,
            password,
            collectionName,
            ...options,
        });
    }
}
