import { Config, Logger } from '@cmmv/core';
import { AbstractEmbedding } from './embedding.abstract';

export class TogetherAIEmbedding extends AbstractEmbedding {
    protected logger = new Logger('TogetherAIEmbedding');

    public override async initialize() {
        const { TogetherAIEmbeddings } = await import(
            '@langchain/community/embeddings/togetherai'
        );
        const model = Config.get(
            'ai.tokenizer.model',
            'togethercomputer/m2-bert-80M-8k-retrieval',
        );
        const apiKey = Config.get('ai.tokenizer.apiKey');
        this.embedder = new TogetherAIEmbeddings({ apiKey, model });
        this.logger.verbose(`Start Embedding: TogetherAIEmbedding`);
    }
}
