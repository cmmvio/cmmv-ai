import { Config, Logger } from '@cmmv/core';
import { AbstractLLM } from './llm.abstract';

export class GroqLLM extends AbstractLLM {
    protected logger = new Logger('GroqLLM');

    public override async initialize() {
        const { ChatGroq } = await import('@langchain/groq');
        const model = Config.get('ai.llm.model', 'mixtral-8x7b-32768');
        const apiKey = Config.get('ai.llm.apiKey');
        const options = Config.get('ai.llm', {});

        this.llm = new ChatGroq({
            model,
            apiKey,
            ...options,
        });

        this.logger.verbose(`Start LLM: GroqLLM (${model})`);
    }
}
