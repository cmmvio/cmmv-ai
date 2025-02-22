import { Config, Logger } from '@cmmv/core';
import { AbstractLLM } from './llm.abstract';

export class OllamaLLM extends AbstractLLM {
    protected logger = new Logger('OllamaLLM');

    public override async initialize() {
        const { ChatOllama } = await import('@langchain/ollama');
        const model = Config.get('ai.llm.model', 'deepseek-reasoner');
        const options = Config.get('ai.llm', {});

        this.llm = new ChatOllama({
            model,
            ...options,
        });

        this.logger.verbose(`Start LLM: GoogleLLM (${model})`);
    }
}
