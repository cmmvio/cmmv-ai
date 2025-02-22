import { Config, Logger } from '@cmmv/core';
import { AbstractEmbedding } from './embedding.abstract';

export class WatsonxEmbedding extends AbstractEmbedding {
    protected logger = new Logger('WatsonxEmbedding');

    public override async initialize() {
        const { WatsonxEmbeddings } = await import(
            '@langchain/community/embeddings/ibm'
        );
        const serviceUrl = Config.get('ai.tokenizer.serviceUrl');
        const version = Config.get('ai.tokenizer.version');
        const projectId = Config.get('ai.tokenizer.projectId');
        const model = Config.get('ai.tokenizer.model');
        this.embedder = new WatsonxEmbeddings({
            model,
            serviceUrl,
            version,
            projectId,
        });
        this.logger.verbose(`Start Embedding: WatsonxEmbeddings (${model})`);
    }
}
