import { Config, Logger } from '@cmmv/core';
import { AbstractEmbedding } from './embedding.abstract';

export class TongyiEmbedding extends AbstractEmbedding {
    protected logger = new Logger('TongyiEmbedding');

    public override async initialize() {
        const { AlibabaTongyiEmbeddings } = await import(
            '@langchain/community/embeddings/alibaba_tongyi'
        );
        const apiKey = Config.get('ai.tokenizer.apiKey');
        this.embedder = new AlibabaTongyiEmbeddings({ apiKey });
        this.logger.verbose(`Start Embedding: TongyiEmbedding`);
    }
}
