import { Config, Logger } from '@cmmv/core';
import type { EmbeddingsInterface } from '@langchain/core/embeddings';
import { VectorDatabaseAdapter } from './vectorstore.abstract';

export class PgVectorStore extends VectorDatabaseAdapter {
    protected logger = new Logger('PgVectorStore');

    async initialize(embeddings: EmbeddingsInterface) {
        const {} = await import('pg');

        type DistanceStrategy = 'cosine' | 'innerProduct' | 'euclidean';

        const { PGVectorStore } = await import(
            '@langchain/community/vectorstores/pgvector'
        );

        const host = Config.get('ai.vector.pg.host', '127.0.0.1');
        const port = Config.get<number>('ai.vector.pg.port', 5433);
        const user = Config.get('ai.vector.pg.user');
        const password = Config.get('ai.vector.pg.password');
        const database = Config.get('ai.vector.pg.database');
        const tableName = Config.get('ai.vector.pg.tableName');

        const config = {
            postgresConnectionOptions: {
                type: 'postgres',
                host,
                port,
                user,
                password,
                database,
            },
            tableName,
            columns: {
                idColumnName: 'id',
                vectorColumnName: 'vector',
                contentColumnName: 'content',
                metadataColumnName: 'metadata',
            },
            distanceStrategy: 'cosine' as DistanceStrategy,
        };

        this.logger.verbose(`Connecting to PgVector at ${host}:${port}`);
        this.vectorStore = await PGVectorStore.initialize(embeddings, config);
    }
}
