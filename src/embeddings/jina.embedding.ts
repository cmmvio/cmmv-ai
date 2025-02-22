import { Config, Logger } from '@cmmv/core';
import { AbstractEmbedding } from './embedding.abstract';

export class JinaEmbedding extends AbstractEmbedding {
    protected logger = new Logger('JinaEmbedding');

    public override async initialize() {
        const { JinaEmbeddings } = await import(
            '@langchain/community/embeddings/jina'
        );
        const model = Config.get('ai.tokenizer.model', 'jina-clip-v2');
        const apiKey = Config.get('ai.tokenizer.apiKey');
        this.embedder = new JinaEmbeddings({ model, apiKey });
        this.logger.verbose(`Start Embedding: JinaEmbeddings (${model})`);
    }
}
