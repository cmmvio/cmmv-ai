import { Config } from '@cmmv/core';

import { AbstractLLM } from './llm.abstract';

export class LLM {
    static async loadLLM(): Promise<AbstractLLM> {
        const provider = Config.get<string>('ai.llm.provider', 'faiss');

        switch (provider) {
            case 'google':
            case 'gemini':
                const { GoogleLLM } = await import('./google.llm');
                const googleLLM = new GoogleLLM();
                await googleLLM.initialize();
                return googleLLM;
            case 'huggingface':
            case 'hf':
                const { HuggingFaceLLM } = await import('./huggingface.llm');
                const huggingFaceLLM = new HuggingFaceLLM();
                await huggingFaceLLM.initialize();
                return huggingFaceLLM;
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
