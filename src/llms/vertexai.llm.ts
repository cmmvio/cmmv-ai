import { Config, Logger } from '@cmmv/core';
import { AbstractLLM } from './llm.abstract';

export class VertexAILLM extends AbstractLLM {
    protected logger = new Logger('VertexAILLM');

    public override async initialize() {
        const { ChatVertexAI } = await import('@langchain/google-vertexai');
        const model = Config.get('ai.llm.model', 'text-bison@001');
        const apiKey = Config.get('ai.llm.apiKey');
        const options = Config.get('ai.llm', {});

        this.llm = new ChatVertexAI({
            model,
            apiKey,
            ...options,
        });

        this.logger.verbose(`Start LLM: VertexAILLM (${model})`);
    }
}
