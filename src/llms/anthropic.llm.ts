import { Config, Logger } from '@cmmv/core';
import { AbstractLLM } from './llm.abstract';

export class AnthropicLLM extends AbstractLLM {
    protected logger = new Logger('AnthropicLLM');

    public override async initialize() {
        const { ChatAnthropic } = await import('@langchain/anthropic');
        const model = Config.get('ai.llm.model', 'claude-3-haiku-20240307');
        const apiKey = Config.get('ai.llm.apiKey');
        const options = Config.get('ai.llm', {});

        this.llm = new ChatAnthropic({
            model,
            apiKey,
            ...options,
        });

        this.logger.verbose(`Start LLM: AnthropicLLM (${model})`);
    }
}
