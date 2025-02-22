import { Config, Logger } from '@cmmv/core';
import { AbstractLLM } from './llm.abstract';

export class AlephAlphaLLM extends AbstractLLM {
    protected logger = new Logger('AlephAlphaLLM');

    public override async initialize() {
        const { AlephAlpha } = await import(
            '@langchain/community/llms/aleph_alpha'
        );
        const model = Config.get('ai.llm.model', 'luminous-base');
        const apiKey = Config.get('ai.llm.apiKey');
        const options = Config.get('ai.llm', {});

        this.llm = new AlephAlpha({
            aleph_alpha_api_key: apiKey,
            model,
            ...options,
        });

        this.logger.verbose(`Start LLM: AlephAlphaLLM (${model})`);
    }
}
