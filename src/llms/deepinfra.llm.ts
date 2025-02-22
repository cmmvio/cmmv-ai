import { Config, Logger } from '@cmmv/core';
import { AbstractLLM } from './llm.abstract';

export class DeepInfraLLM extends AbstractLLM {
    protected logger = new Logger('DeepInfraLLM');

    public override async initialize() {
        const { DeepInfraLLM } = await import(
            '@langchain/community/llms/deepinfra'
        );
        const model = Config.get('ai.llm.model', 'deepinfra-ai/deepinfra-llm');
        const apiKey = Config.get('ai.llm.apiKey');
        const options = Config.get('ai.llm', {});

        this.llm = new DeepInfraLLM({
            model,
            apiKey,
            ...options,
        });

        this.logger.verbose(`Start LLM: DeepInfraLLM (${model})`);
    }
}
