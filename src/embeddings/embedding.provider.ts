import { Config } from '@cmmv/core';

import {
    AbstractEmbedding
} from "./embedding.abstract";

export class Embedding {
    static async loadEmbedder(): Promise<AbstractEmbedding>{
        const provider = Config.get('ai.tokenizer.provider', 'huggingface');

        switch(provider){
            case "huggingface":
                const { HuggingFaceEmbedding } = await import("./huggingface.embedding");
                return new HuggingFaceEmbedding();
            case "llama":
                const { LlamaCppEmbedding } = await import("./llamacpp.embedding");
                return new LlamaCppEmbedding();
        }
    }
}
