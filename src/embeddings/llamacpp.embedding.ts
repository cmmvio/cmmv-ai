import { Config, Logger } from '@cmmv/core';
import { AbstractEmbedding } from "./embedding.abstract";

export class LlamaCppEmbedding extends AbstractEmbedding {
    protected logger = new Logger("LlamaCppEmbedding");

    public override async initialize() {
        const { LlamaCppEmbeddings } = await import('@langchain/community/embeddings/llama_cpp');
        const model = Config.get('ai.tokenizer.model');
        this.embedder = new LlamaCppEmbeddings({ modelPath: model });
        this.logger.verbose(`Start Model: ${model}`);
    }
}
