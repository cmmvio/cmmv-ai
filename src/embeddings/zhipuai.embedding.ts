import { Config, Logger } from '@cmmv/core';
import { AbstractEmbedding } from './embedding.abstract';

export class ZhipuAIEmbedding extends AbstractEmbedding {
    protected logger = new Logger('ZhipuAIEmbedding');

    public override async initialize() {
        const { ZhipuAIEmbeddings } = await import(
            '@langchain/community/embeddings/zhipuai'
        );
        const model = Config.get('ai.tokenizer.model', 'embedding-2');
        const apiKey = Config.get('ai.tokenizer.apiKey');
        this.embedder = new ZhipuAIEmbeddings({ apiKey, modelName: model });
        this.logger.verbose(`Start Embedding: ZhipuAIEmbedding (${model})`);
    }
}
