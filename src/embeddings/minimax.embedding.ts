import { Config, Logger } from '@cmmv/core';
import { AbstractEmbedding } from './embedding.abstract';

export class MinimaxEmbedding extends AbstractEmbedding {
    protected logger = new Logger('CohereEmbedding');

    public override async initialize() {
        const { MinimaxEmbeddings } = await import(
            '@langchain/community/embeddings/minimax'
        );
        const model = Config.get('ai.tokenizer.model', 'embo-01');
        const apiKey = Config.get('ai.tokenizer.apiKey');
        this.embedder = new MinimaxEmbeddings({ model, apiKey });
        this.logger.verbose(`Start Embedding: MinimaxEmbeddings (${model})`);
    }
}
