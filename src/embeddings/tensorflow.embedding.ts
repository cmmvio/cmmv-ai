import { Logger } from '@cmmv/core';
import { AbstractEmbedding } from './embedding.abstract';

export class TensorFlowEmbedding extends AbstractEmbedding {
    protected logger = new Logger('TensorFlowEmbedding');

    public override async initialize() {
        const { TensorFlowEmbeddings } = await import(
            '@langchain/community/embeddings/tensorflow'
        );
        this.embedder = new TensorFlowEmbeddings();
        this.logger.verbose(`Start Embedding: TensorFlowEmbedding`);
    }
}
