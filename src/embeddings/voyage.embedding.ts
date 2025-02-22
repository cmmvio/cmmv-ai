import { Config, Logger } from '@cmmv/core';
import { AbstractEmbedding } from './embedding.abstract';

export class VoyageEmbedding extends AbstractEmbedding {
    protected logger = new Logger('VoyageEmbedding');

    public override async initialize() {
        const { VoyageEmbeddings } = await import(
            '@langchain/community/embeddings/voyage'
        );
        const model = Config.get('ai.tokenizer.model', 'voyage-01');
        const apiKey = Config.get('ai.tokenizer.apiKey');
        this.embedder = new VoyageEmbeddings({ apiKey, modelName: model });
        this.logger.verbose(`Start Embedding: VoyageEmbedding (${model})`);
    }
}
