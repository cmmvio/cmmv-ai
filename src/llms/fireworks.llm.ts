import { Config, Logger } from '@cmmv/core';
import { AbstractLLM } from './llm.abstract';

export class FireworksLLM extends AbstractLLM {
    protected logger = new Logger('FireworksLLM');

    public override async initialize() {
        const { Fireworks } = await import(
            '@langchain/community/llms/fireworks'
        );
        const model = Config.get('ai.llm.model', 'fireworks-ai/fireworks-1b');
        const apiKey = Config.get('ai.llm.apiKey');
        const options = Config.get('ai.llm', {});

        this.llm = new Fireworks({
            model,
            apiKey,
            ...options,
        });

        this.logger.verbose(`Start LLM: FireworksLLM (${model})`);
    }
}
