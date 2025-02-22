import { Config, Logger } from '@cmmv/core';
import { AbstractEmbedding } from './embedding.abstract';

export class DeepInfraEmbedding extends AbstractEmbedding {
    protected logger = new Logger('DeepInfraEmbedding');

    public override async initialize() {
        const { DeepInfraEmbeddings } = await import(
            '@langchain/community/embeddings/deepinfra'
        );
        const apiToken = Config.get('ai.tokenizer.apiKey');
        this.embedder = new DeepInfraEmbeddings({ apiToken });
        this.logger.verbose(`Start Embedding: DeepInfraEmbedding`);
    }
}
