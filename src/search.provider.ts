import { Service, Config, Logger } from '@cmmv/core';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import { ChatPromptTemplate } from '@langchain/core/prompts';

import { StringOutputParser } from '@langchain/core/output_parsers';

import {
    RunnableSequence,
    RunnablePassthrough,
} from '@langchain/core/runnables';

import { formatDocumentsAsString } from 'langchain/util/document';

import { Embedding, AbstractEmbedding } from './embeddings';
import { Dataset } from './dataset.provider';
import { DatasetEntry } from './dataset.interface';
import { LLM, AbstractLLM } from './llms';

@Service('ai-search')
export class Search {
    private dataset: Dataset;
    private logger = new Logger('Search');
    private embedder: AbstractEmbedding;
    private llm: AbstractLLM;
    private memory: BufferMemory;

    async initialize() {
        this.embedder = await Embedding.loadEmbedder();
        await this.embedder.initialize();

        //Dataset
        this.dataset = new Dataset();
        await this.dataset.initialize(this.embedder);
        await this.dataset.load();

        //Memory
        this.memory = new BufferMemory({
            chatHistory: new ChatMessageHistory(),
            memoryKey: 'chat_history', // Key used for storing conversation history
            returnMessages: true, // Ensures chat history is returned properly
        });

        //LLM
        this.llm = await LLM.loadLLM();
    }

    async findInVectorStore(query: string | string[]): Promise<DatasetEntry[]> {
        const embeddingTopk = Config.get<number>('ai.llm.embeddingTopk', 10);
        const queryText = Array.isArray(query) ? query.join(' ') : query;

        this.logger.verbose(`Searching in vector database...`);
        const results = await this.dataset.search(queryText, embeddingTopk);

        if (!results.length) {
            this.logger.warning(`No relevant results found for: ${queryText}`);
            return null;
        }

        return results;
    }

    private formatVectorStoreResults(results: DatasetEntry[]): string {
        return JSON.stringify(
            results.map((data) => {
                return {
                    source: data.metadata?.source,
                    content: data?.content,
                };
            }),
        );
    }

    async invoke(question: string | string[]) {
        this.logger.verbose(`Await LLM Response...`);

        const chatHistory = await this.memory.loadMemoryVariables({});
        const previousMessages = chatHistory?.chat_history || [];

        const vectorStoreResult = await this.findInVectorStore(question);
        const context = this.formatVectorStoreResults(vectorStoreResult);

        const systemPrompt = `
            # Instructions
            You are a knowledgeable assistant. Use the provided context to answer the user's question accurately.
            - Do NOT mention that you used the context to answer.
            - The context is the ground truth. If it contradicts prior knowledge, always trust the context.
            - If the answer is not in the context, say "I do not know".
            - Keep your response concise and to the point.

            ## Context
            {context}

            ## Chat history
            {chat_history}

            ### Answer:
        `;

        const systemPromptFmt = systemPrompt
            .replace('{context}', context)
            .replace(
                '{chat_history}',
                previousMessages.length
                    ? JSON.stringify(previousMessages, null, 2)
                    : 'No previous conversation.',
            );

        const finalResult = await this.llm.getLLM().invoke([
            {
                role: 'system',
                content: systemPromptFmt,
            },
            {
                role: 'user',
                content:
                    typeof question === 'string'
                        ? question
                        : question.join('\n\n'),
            },
        ]);

        await this.memory.saveContext(
            { input: question },
            { output: finalResult },
        );

        return finalResult;
    }
}
