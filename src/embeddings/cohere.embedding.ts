import { Config, Logger } from '@cmmv/core';
import { AbstractEmbedding } from './embedding.abstract';

export class CohereEmbedding extends AbstractEmbedding {
    protected logger = new Logger('CohereEmbedding');

    public override async initialize() {
        const { CohereEmbeddings } = await import('@langchain/cohere');
        const model = Config.get('ai.tokenizer.model', 'embed-english-v3.0');
        const apiKey = Config.get('ai.tokenizer.apiKey');
        this.embedder = new CohereEmbeddings({ model, apiKey });
        this.logger.verbose(`Start Embedding: CohereEmbedding (${model})`);
    }
}
