import { Config, Logger } from '@cmmv/core';
import { AbstractLLM } from './llm.abstract';

export class BedrockLLM extends AbstractLLM {
    protected logger = new Logger('BedrockLLM');

    public override async initialize() {
        const { ChatBedrockConverse } = await import('@langchain/aws');
        const options = Config.get('ai.llm', {});

        this.llm = new ChatBedrockConverse({
            ...options,
        });

        this.logger.verbose(`Start LLM: BedrockLLM`);
    }
}
