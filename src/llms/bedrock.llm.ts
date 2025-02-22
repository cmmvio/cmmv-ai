import { Config, Logger } from '@cmmv/core';
import { AbstractLLM } from './llm.abstract';

export class BedrockLLM extends AbstractLLM {
    protected logger = new Logger('BedrockLLM');

    public override async initialize() {
        const { ChatBedrockConverse } = await import('@langchain/aws');
        const model = Config.get(
            'ai.llm.model',
            'anthropic.claude-3-5-sonnet-20240620-v1:0',
        );
        const AWSSettings = Config.get('ai.aws', {});
        const options = Config.get('ai.llm', {});

        this.llm = new ChatBedrockConverse({
            model,
            ...AWSSettings,
            ...options,
        });

        this.logger.verbose(`Start LLM: BedrockLLM`);
    }
}
