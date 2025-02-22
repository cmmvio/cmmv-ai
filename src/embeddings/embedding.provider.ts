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
            case 'fireworks':
                const { FireworksEmbedding } = await import(
                    './fireworks.embedding'
                );
                return new FireworksEmbedding();
            case 'huggingface':
            case 'hf':
                const { HuggingFaceEmbedding } = await import(
                    './huggingface.embedding'
                );
                return new HuggingFaceEmbedding();
            case 'jina':
                const { JinaEmbedding } = await import('./jina.embedding');
                return new JinaEmbedding();
            case 'llama':
            case 'llamacpp':
                const { LlamaCppEmbedding } = await import(
                    './llamacpp.embedding'
                );
                return new LlamaCppEmbedding();
            case 'minimax':
                const { MinimaxEmbedding } = await import(
                    './minimax.embedding'
                );
                return new MinimaxEmbedding();
            case 'openai':
            case 'chatgpt':
                const { OpenAIEmbedding } = await import('./openai.embedding');
                return new OpenAIEmbedding();
            case 'pinecone':
                const { PineconeEmbedding } = await import(
                    './pinecone.embedding'
                );
                return new PineconeEmbedding();
            case 'premai':
                const { PremaiEmbedding } = await import('./premai.embedding');
                return new PremaiEmbedding();
            case 'tongyi':
            case 'alibaba':
                const { TongyiEmbedding } = await import('./tongyi.embedding');
                return new TongyiEmbedding();
            case 'watsonx':
            case 'idm':
                const { WatsonxEmbedding } = await import(
                    './watsonx.embedding'
                );
                return new WatsonxEmbedding();
        }
    }
}
