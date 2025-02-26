import { Config, Logger } from '@cmmv/core';
import { AbstractLLM } from './llm.abstract';

export class DeepSeekLLM extends AbstractLLM {
    protected logger = new Logger('DeepSeekLLM');

    public override async initialize() {
        const { ChatDeepSeek } = await import('@langchain/deepseek');
        const model = Config.get('ai.llm.model', 'deepseek-reasoner');
        const apiKey = Config.get('ai.llm.apiKey');
        const options = Config.get('ai.llm', {});

        this.llm = new ChatDeepSeek({
            model,
            apiKey,
            ...options,
        });

        this.logger.verbose(`Start LLM: GoogleLLM (${model})`);
    }
}
