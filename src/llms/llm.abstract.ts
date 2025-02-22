import { Logger } from '@cmmv/core';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { type BaseLanguageModelInput } from '@langchain/core/language_models/base';
import { LLM, BaseLLM } from '@langchain/core/language_models/llms';

export abstract class AbstractLLM {
    protected llm: BaseChatModel | LLM | BaseLLM;
    protected logger: Logger;

    public initialize() {}

    invoke(input: BaseLanguageModelInput, options?: any): Promise<any> {
        return this.llm.invoke(input, options);
    }
}
