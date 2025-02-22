import { Config } from '@cmmv/core';

import { AbstractEmbedding } from './embedding.abstract';

export class Embedding {
    static async loadEmbedder(): Promise<AbstractEmbedding> {
        const provider = Config.get('ai.tokenizer.provider', 'huggingface');

        switch (provider) {
            case 'cohere':
                const { CohereEmbedding } = await import('./cohere.embedding');
                return new CohereEmbedding();
            case 'deepinfra':
                const { DeepInfraEmbedding } = await import(
                    './deepinfra.embedding'
                );
                return new DeepInfraEmbedding();
            case 'doubao':
                const { DoubaoEmbedding } = await import('./doubao.embedding');
                return new DoubaoEmbedding();
            case 'huggingface':
                const { HuggingFaceEmbedding } = await import(
                    './huggingface.embedding'
                );
                return new HuggingFaceEmbedding();
            case 'llama':
                const { LlamaCppEmbedding } = await import(
                    './llamacpp.embedding'
                );
                return new LlamaCppEmbedding();
            case 'openai':
                const { OpenAIEmbedding } = await import('./openai.embedding');
                return new OpenAIEmbedding();
            case 'pinecone':
                const { PineconeEmbedding } = await import(
                    './pinecone.embedding'
                );
                return new PineconeEmbedding();
            case 'tongyi':
                const { TongyiEmbedding } = await import('./tongyi.embedding');
                return new TongyiEmbedding();
        }
    }
}
