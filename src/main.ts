import { Module } from '@cmmv/core';

export * from './dataset.interface';
export * from './dataset.provider';
export * from './tokenizer.interface';
export * from './tokenizer.provider';
export * from './search.provider';

export * from './embeddings';
export * from './llms';
export * from './utils';
export * from './vectorstores';

// LangChain Core Abstractions
export {
    PromptTemplate,
    AIMessagePromptTemplate,
    BaseChatPromptTemplate,
    BasePromptTemplate,
    ChatPromptTemplate,
    MessagesPlaceholder,
} from '@langchain/core/prompts';

export {
    RunnableSequence,
    RunnablePassthrough,
} from '@langchain/core/runnables';

export {
    StringOutputParser,
    JsonOutputParser,
    BaseOutputParser,
    BaseLLMOutputParser,
} from '@langchain/core/output_parsers';

export {
    BaseRetriever,
    BaseRetrieverInput,
    BaseRetrieverInterface,
} from '@langchain/core/retrievers';

export {
    BaseMemory,
    InputValues,
    MemoryVariables,
    OutputValues,
} from '@langchain/core/memory';

export {
    BaseLLM,
    BaseLLMCallOptions,
    BaseLLMParams,
    LLM,
    SerializedLLM,
} from '@langchain/core/language_models/llms';

export {
    BaseChatModel,
    BaseChatModelCallOptions,
    BaseChatModelParams,
    SerializedChatModel,
    SimpleChatModel,
} from '@langchain/core/language_models/chat_models';

export { Document } from '@langchain/core/documents';

export {
    Embeddings,
    EmbeddingsInterface,
    EmbeddingsParams,
} from '@langchain/core/embeddings';

export {
    VectorStoreRetriever,
    VectorStore,
    VectorStoreInterface,
} from '@langchain/core/vectorstores';

// Module
import { AIConfig } from './ai.config';
import { Tokenizer } from './tokenizer.provider';
import { Dataset } from './dataset.provider';
import { Search } from './search.provider';

export const AIModule = new Module('ai', {
    configs: [AIConfig],
    providers: [Tokenizer, Dataset, Search],
});
