import { Config } from '@cmmv/core';

import { AbstractLLM } from './llm.abstract';

export class LLM {
    static async loadLLM(): Promise<AbstractLLM> {
        const provider = Config.get<string>('ai.llm.provider', 'faiss');

        switch (provider) {
            case 'anthropic':
                const { AnthropicLLM } = await import('./anthropic.llm');
                const anthropicLLM = new AnthropicLLM();
                await anthropicLLM.initialize();
                return anthropicLLM;
            case 'deepseek':
                const { DeepSeekLLM } = await import('./deepseek.llm');
                const deepSeekLLM = new DeepSeekLLM();
                await deepSeekLLM.initialize();
                return deepSeekLLM;
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
            default:
                return null;
        }
    }
}
