import { Config, Logger } from '@cmmv/core';
import { AbstractEmbedding } from './embedding.abstract';

export class HunyuanEmbedding extends AbstractEmbedding {
    protected logger = new Logger('HunyuanEmbedding');

    public override async initialize() {
        const { TencentHunyuanEmbeddings } = await import(
            '@langchain/community/embeddings/tencent_hunyuan'
        );
        const options = Config.get('ai.tokenizer');
        this.embedder = new TencentHunyuanEmbeddings(options);
        this.logger.verbose(`Start Embedding: HunyuanEmbedding`);
    }
}
