import { Config, Logger } from '@cmmv/core';
import { AbstractEmbedding } from './embedding.abstract';

export class FireworksEmbedding extends AbstractEmbedding {
    protected logger = new Logger('FireworksEmbedding');

    public override async initialize() {
        const { FireworksEmbeddings } = await import(
            '@langchain/community/embeddings/fireworks'
        );
        const apiKey = Config.get('ai.tokenizer.apiKey');
        const model = Config.get(
            'ai.tokenizer.model',
            'nomic-ai/nomic-embed-text-v1.5',
        );
        this.embedder = new FireworksEmbeddings({ apiKey, model });
        this.logger.verbose(`Start Embedding: FireworksEmbedding (${model})`);
    }
}
