import { Config, Logger } from '@cmmv/core';
import { AbstractEmbedding } from './embedding.abstract';

export class BedrockEmbedding extends AbstractEmbedding {
    protected logger = new Logger('BedrockEmbedding');

    public override async initialize() {
        const { BedrockEmbeddings } = await import('@langchain/aws');
        const AWSSettings = Config.get('ai.aws', {});
        const model = Config.get(
            'ai.tokenizer.model',
            'amazon.titan-embed-text-v1',
        );
        this.embedder = new BedrockEmbeddings({ ...AWSSettings, model });
        this.logger.verbose(`Start Embedding: BedrockEmbedding (${model})`);
    }
}
