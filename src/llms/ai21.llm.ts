import { Config, Logger } from '@cmmv/core';
import { AbstractLLM } from './llm.abstract';

export class AI21LLM extends AbstractLLM {
    protected logger = new Logger('AI21LLM');

    public override async initialize() {
        const { AI21 } = await import('@langchain/community/llms/ai21');
        const model = Config.get('ai.llm.model', 'j1-jumbo');
        const apiKey = Config.get('ai.llm.apiKey');
        const options = Config.get('ai.llm', {});

        this.llm = new AI21({
            model,
            ai21ApiKey: apiKey,
            ...options,
        });

        this.logger.verbose(`Start LLM: AI21LLM (${model})`);
    }
}
