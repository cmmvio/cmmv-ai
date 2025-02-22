import { Config, Logger } from '@cmmv/core';
import { AbstractLLM } from './llm.abstract';

export class MistralLLM extends AbstractLLM {
    protected logger = new Logger('MistralLLM');

    public override async initialize() {
        const { ChatMistralAI } = await import('@langchain/mistralai');
        const model = Config.get('ai.llm.model', 'mistral-large');
        const apiKey = Config.get('ai.llm.apiKey');
        const options = Config.get('ai.llm', {});

        this.llm = new ChatMistralAI({
            model,
            apiKey,
            ...options,
        });

        this.logger.verbose(`Start LLM: MistralLLM (${model})`);
    }
}
