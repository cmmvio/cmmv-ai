import { Service, Config, Logger } from '@cmmv/core';

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

    async initialize() {
        this.embedder = await Embedding.loadEmbedder();
        await this.embedder.initialize();

        //Dataset
        this.dataset = new Dataset();
        await this.dataset.initialize(this.embedder);
        await this.dataset.load();

        //LLM
        this.llm = await LLM.loadLLM();
    }

    async findInVectorStore(query: string | string[]): Promise<DatasetEntry[]> {
        const embeddingTopk = Config.get<number>('ai.llm.embeddingTopk', 10);
        const queryText = Array.isArray(query) ? query.join(' ') : query;

        this.logger.verbose(`Generating embedding for query...`);
        const queryVector = await this.embedder.embedQuery(queryText);

        this.logger.verbose(`Searching in vector database...`);
        const results = await this.dataset.search(
            new Float32Array(queryVector),
            embeddingTopk,
        );

        if (!results.length) {
            this.logger.warning(`No relevant results found for: ${queryText}`);
            return null;
        }

        return results;
    }

    private formatVectorStoreResults(results: DatasetEntry[]): string {
        return JSON.stringify(
            results.map((data) => {
                return { source: data.metadata?.source, content: data.content };
            }),
        );
    }

    async invoke(
        question: string | string[],
        prompt: string,
        chatHistory?: string,
    ) {
        this.logger.verbose(`Await LLM Response...`);
        const vectorStoreResult = await this.findInVectorStore(question);
        const context = this.formatVectorStoreResults(vectorStoreResult);
        const finalResult = await this.llm.invoke(
            [
                'system',
                prompt
                    .replace('{context}', context)
                    .replace('{chat_history}', chatHistory ?? ''),
            ],
            ['human', question],
        );
        return finalResult;
    }
}
