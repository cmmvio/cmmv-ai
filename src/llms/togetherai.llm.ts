import { Config, Logger } from '@cmmv/core';
import { AbstractLLM } from './llm.abstract';

export class TogetherAILLM extends AbstractLLM {
    protected logger = new Logger('TogetherAILLM');

    public override async initialize() {
        const { TogetherAI } = await import(
            '@langchain/community/llms/togetherai'
        );
        const model = Config.get(
            'ai.llm.model',
            'togethercomputer/m2-bert-80M-8k-retrieval',
        );
        const apiKey = Config.get('ai.llm.apiKey');
        const options = Config.get('ai.llm', {});

        this.llm = new TogetherAI({
            model,
            apiKey,
            ...options,
        });

        this.logger.verbose(`Start LLM: TogetherAILLM (${model})`);
    }
}
