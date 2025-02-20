import { Logger } from '@cmmv/core';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { type BaseLanguageModelInput } from '@langchain/core/language_models/base';

export abstract class AbstractChat {
  protected llm: BaseChatModel;
  protected logger: Logger;

  public initialize() {}

  invoke(input: BaseLanguageModelInput, options?: any): Promise<any> {
    return this.llm.invoke(input, options);
  }
}
