import { Config } from '@cmmv/core';

import { AbstractLLM } from './llm.abstract';

export class LLM {
    static async loadLLM(): Promise<AbstractLLM> {
        const provider = Config.get<string>('ai.llm.provider', 'faiss');

        switch (provider) {
            case 'ai21':
                const { AI21LLM } = await import('./ai21.llm');
                const aI21LLM = new AI21LLM();
                await aI21LLM.initialize();
                return aI21LLM;
            case 'alephalpha':
                const { AlephAlphaLLM } = await import('./alephalpha.llm');
                const alephAlphaLLM = new AlephAlphaLLM();
                await alephAlphaLLM.initialize();
                return alephAlphaLLM;
            case 'anthropic':
                const { AnthropicLLM } = await import('./anthropic.llm');
                const anthropicLLM = new AnthropicLLM();
                await anthropicLLM.initialize();
                return anthropicLLM;
            case 'bedrock':
                const { BedrockLLM } = await import('./bedrock.llm');
                const bedrockLLM = new BedrockLLM();
                await bedrockLLM.initialize();
                return bedrockLLM;
            case 'cohere':
                const { CohereLLM } = await import('./cohere.llm');
                const cohereLLM = new CohereLLM();
                await cohereLLM.initialize();
                return cohereLLM;
            case 'deepinfra':
                const { DeepInfraLLM } = await import('./deepinfra.llm');
                const deepInfraLLM = new DeepInfraLLM();
                await deepInfraLLM.initialize();
                return deepInfraLLM;
            case 'deepseek':
                const { DeepSeekLLM } = await import('./deepseek.llm');
                const deepSeekLLM = new DeepSeekLLM();
                await deepSeekLLM.initialize();
                return deepSeekLLM;
            case 'fireworks':
                const { FireworksLLM } = await import('./fireworks.llm');
                const fireworksLLM = new FireworksLLM();
                await fireworksLLM.initialize();
                return fireworksLLM;
            case 'google':
            case 'gemini':
                const { GoogleLLM } = await import('./google.llm');
                const googleLLM = new GoogleLLM();
                await googleLLM.initialize();
                return googleLLM;
            case 'groq':
                const { GroqLLM } = await import('./groq.llm');
                const groqLLM = new GroqLLM();
                await groqLLM.initialize();
                return groqLLM;
            case 'huggingface':
            case 'hf':
                const { HuggingFaceLLM } = await import('./huggingface.llm');
                const huggingFaceLLM = new HuggingFaceLLM();
                await huggingFaceLLM.initialize();
                return huggingFaceLLM;
            case 'mistralai':
                const { MistralLLM } = await import('./mistralai.llm');
                const mistralLLM = new MistralLLM();
                await mistralLLM.initialize();
                return mistralLLM;
            case 'ollama':
                const { OllamaLLM } = await import('./ollama.llm');
                const ollamaLLM = new OllamaLLM();
                await ollamaLLM.initialize();
                return ollamaLLM;
            case 'openai':
            case 'chatgpt':
                const { OpenAILLM } = await import('./openai.llm');
                const openAILLM = new OpenAILLM();
                await openAILLM.initialize();
                return openAILLM;
            case 'togetherai':
                const { TogetherAILLM } = await import('./togetherai.llm');
                const togetherAILLM = new TogetherAILLM();
                await togetherAILLM.initialize();
                return togetherAILLM;
            case 'vertexai':
                const { VertexAILLM } = await import('./vertexai.llm');
                const vertexAILLM = new VertexAILLM();
                await vertexAILLM.initialize();
                return vertexAILLM;
            default:
                return null;
        }
    }
}
