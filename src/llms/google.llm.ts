import { Config, Logger } from '@cmmv/core';
import { AbstractLLM } from './llm.abstract';

export class GoogleLLM extends AbstractLLM {
    protected logger = new Logger('GoogleChat');

    public override async initialize() {
        const { ChatGoogleGenerativeAI } = await import(
            '@langchain/google-genai'
        );
        const model = Config.get('ai.llm.model', 'gemini-1.5-pro');
        const maxOutputTokens = Config.get<number>(
            'ai.llm.maxOutputTokens',
            2048,
        );
        const apiKey = Config.get('ai.llm.apiKey');

        this.llm = new ChatGoogleGenerativeAI({
            modelName: model,
            apiKey,
            maxOutputTokens,
        });

        this.logger.verbose(`Start LLM: GoogleLLM (${model})`);
    }
}
