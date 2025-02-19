
import { Logger } from "@cmmv/core";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export abstract class AbstractChat {
    protected model: BaseChatModel;
    protected logger: Logger;

    public initialize() {}
}
