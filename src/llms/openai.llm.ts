import { Config, Logger } from '@cmmv/core';
import { AbstractLLM } from './llm.abstract';

export class OpenAILLM extends AbstractLLM {
    protected logger = new Logger('OpenAILLM');

    public override async initialize() {
        const { ChatOpenAI } = await import('@langchain/openai');
        const model = Config.get('ai.llm.model', 'gpt-3.5-turbo-instruct');
        const apiKey = Config.get('ai.llm.apiKey');
        const options = Config.get('ai.llm', {});
        this.llm = new ChatOpenAI({ apiKey, model, ...options });
        this.logger.verbose(`Start LLM: OpenAILLM (${model})`);
    }
}
