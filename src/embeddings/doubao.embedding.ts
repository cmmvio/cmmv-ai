import { Config, Logger } from '@cmmv/core';
import { AbstractEmbedding } from './embedding.abstract';

export class DoubaoEmbedding extends AbstractEmbedding {
    protected logger = new Logger('DoubaoEmbedding');

    public override async initialize() {
        const { ByteDanceDoubaoEmbeddings } = await import(
            '@langchain/community/embeddings/bytedance_doubao'
        );
        const apiKey = Config.get('ai.tokenizer.apiKey');
        this.embedder = new ByteDanceDoubaoEmbeddings({ model: apiKey });
        this.logger.verbose(`Start Embedding: ByteDanceDoubaoEmbeddings`);
    }
}
