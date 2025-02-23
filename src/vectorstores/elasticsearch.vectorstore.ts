import * as fs from 'node:fs';
import { Config, Logger } from '@cmmv/core';
import type { EmbeddingsInterface } from '@langchain/core/embeddings';
import { VectorDatabaseAdapter } from './vectorstore.abstract';

export class ElasticSearchVectorStore extends VectorDatabaseAdapter {
    protected logger = new Logger('ElasticSearchVectorStore');

    async initialize(embeddings: EmbeddingsInterface) {
        const { Client } = await import('@elastic/elasticsearch');

        const { ElasticVectorSearch } = await import(
            '@langchain/community/vectorstores/elasticsearch'
        );

        const url = Config.get(
            'ai.vector.elastic.url',
            'http://127.0.0.1:9200',
        );
        const apiKey = Config.get('ai.vector.elastic.apiKey');
        const username = Config.get('ai.vector.elastic.username');
        const password = Config.get('ai.vector.elastic.password');
        const indexName = Config.get('ai.vector.elastic.indexName');
        const certPath = Config.get('ai.vector.elastic.certPath');

        const config: any = { node: url };

        if (apiKey) config.auth = { apiKey };
        else if (username && password) config.auth = { username, password };

        if (certPath) {
            config.tls = {
                ca: fs.readFileSync(certPath),
                rejectUnauthorized: false,
            };
        }

        this.logger.verbose(`Connecting to Elastic at ${url}`);

        const clientArgs = {
            client: new Client(config),
            indexName,
        };

        this.vectorStore = new ElasticVectorSearch(embeddings, clientArgs);
    }
}
