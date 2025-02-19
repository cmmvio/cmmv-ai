import * as path from "node:path";
import { Service, Config, Logger } from '@cmmv/core';

import { Embedding, AbstractEmbedding } from './embeddings';
import { Dataset } from "./dataset.provider";
import { DatasetEntry } from "./dataset.interface";

@Service('ai-search')
export class Search {
    private dataset: Dataset;
    private logger = new Logger('Search');
    private embedder: AbstractEmbedding;
    private llmCode: any;
    private llmNL: any;

    constructor(dataset: Dataset){
        this.dataset = dataset;
    }

    async initialize() {
        this.embedder = await Embedding.loadEmbedder();
        await this.embedder.initialize();

        /*this.llmCode = await pipeline('text-generation', modelCoder, {
            token,
            use_auth_token: token,
            max_new_tokens: modelCodeMaxTokens,
            ort: { log_level: "off" },
        });

        this.logger.verbose(`Loading code model: ${modelCoder}`);

        this.llmNL = await pipeline('text-generation', modelText, {
            token,
            use_auth_token: token,
            max_new_tokens: modelTextMaxTokens,
            ort: { log_level: "error" }
        });*/
    }

    async find(query: string | string[]): Promise<string> {
        const embeddingTopk = Config.get<number>('ai.search.embeddingTopk', 10);
        const queryText = Array.isArray(query) ? query.join(' ') : query;

        this.logger.verbose(`Generating embedding for query...`);
        const queryVector = await this.embedder.embedQuery(queryText);

        this.logger.verbose(`Searching in vector database...`);
        const results = await this.dataset.search(new Float32Array(queryVector), embeddingTopk);

        if (!results.length) {
            this.logger.warning(`No relevant results found for: ${queryText}`);
            return "No relevant information found.";
        }

        //this.logger.verbose(`Pre-processing query with Code LLM...`);
        //const optimizedQuery = await this.optimizeQueryWithLLM(queryText, results);

        console.log(results);
        process.exit(1);

        this.logger.verbose(`Processing results with LLM for final response...`);

        console.log(results);
        return null;
    }
}
