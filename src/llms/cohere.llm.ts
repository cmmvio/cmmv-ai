import { Config, Logger } from '@cmmv/core';
import { AbstractLLM } from './llm.abstract';

export class CohereLLM extends AbstractLLM {
    protected logger = new Logger('CohereLLM');

    public override async initialize() {
        const { ChatCohere } = await import('@langchain/cohere');
        const model = Config.get('ai.llm.model', 'command-r-plus');
        const apiKey = Config.get('ai.llm.apiKey');
        const options = Config.get('ai.llm', {});

        this.llm = new ChatCohere({
            model,
            apiKey,
            ...options,
        });

        this.logger.verbose(`Start LLM: CohereLLM (${model})`);
    }
}
