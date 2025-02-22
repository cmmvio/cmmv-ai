import { Config, Logger } from '@cmmv/core';
import { AbstractEmbedding } from './embedding.abstract';

export class PremaiEmbedding extends AbstractEmbedding {
    protected logger = new Logger('PremaiEmbedding');

    public override async initialize() {
        const { PremEmbeddings } = await import(
            '@langchain/community/embeddings/premai'
        );
        const model = Config.get('ai.tokenizer.model');
        const apiKey = Config.get('ai.tokenizer.apiKey');
        this.embedder = new PremEmbeddings({ model, apiKey });
        this.logger.verbose(`Start Embedding: PremaiEmbedding (${model})`);
    }
}
