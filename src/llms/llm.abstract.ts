import { Logger } from '@cmmv/core';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { type BaseLanguageModelInput } from '@langchain/core/language_models/base';
import { LLM } from '@langchain/core/language_models/llms';

export abstract class AbstractLLM {
    protected llm: BaseChatModel | LLM;
    protected logger: Logger;

    public initialize() {}

    invoke(input: BaseLanguageModelInput, options?: any): Promise<any> {
        return this.llm.invoke(input, options);
    }
}
