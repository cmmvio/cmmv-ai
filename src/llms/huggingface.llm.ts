import { Config, Logger } from '@cmmv/core';
import { AbstractLLM } from './llm.abstract';

export class HuggingFaceLLM extends AbstractLLM {
    protected logger = new Logger('OpenAIChat');

    public override async initialize() {
        const { HuggingFaceInference } = await import(
            '@langchain/community/llms/hf'
        );
        const model = Config.get('ai.llm.modelName', 'gpt2');
        const apiKey = Config.get('ai.llm.apiKey');
        this.llm = new HuggingFaceInference({ apiKey, model });
        this.logger.verbose(`Start Model: ${model}`);
    }
}
