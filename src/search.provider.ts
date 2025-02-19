import * as path from "node:path";
import { Service, Config, Logger } from '@cmmv/core';

import { Dataset } from "./dataset.provider";
import { DatasetEntry } from "./dataset.interface";

@Service('ai-search')
export class Search {
    private dataset: Dataset;
    private logger = new Logger('Search');
    private embedder: any;
    private llmCode: any;
    private llmNL: any;

    constructor(dataset: Dataset){
        this.dataset = dataset;
    }

    async initialize() {
        const TransformersApi = Function('return import("@xenova/transformers")')();
        const { pipeline, env } = await TransformersApi;

        const localModelPath = path.resolve(Config.get<string>('ai.huggingface.localModelPath', "./models"));
        const allowRemoteModels = Config.get<string>('ai.huggingface.allowRemoteModels', true);
        const embeddingModel = Config.get<string>('ai.tokenizer.embeddingModel', 'Xenova/all-MiniLM-L6-v2');
        let modelCoder = Config.get<string>('ai.search.codeModel', 'onnx-community/Qwen2.5-Coder-3B-Instruct');
        const modelCodeMaxTokens = Config.get<number>('ai.search.codeMaxTokens', 1024);
        let modelText = Config.get<string>('ai.search.textModel', 'onnx-community/Llama-3.2-1B-Instruct-q4f16');
        const modelTextMaxTokens = Config.get<number>('ai.search.textMaxTokens', 4000);
        const token = Config.get<string>('ai.huggingface.token');

        process.env.TRANSFORMERS_VERBOSITY = "off";
        process.env.HUGGINGFACE_HUB_TOKEN = token;
        process.env.HUGGINGFACE_HUB_CACHE = localModelPath;
        process.env.ORT_LOG_SEVERITY_LEVEL = "3";
        env.HUGGINGFACE_HUB_TOKEN = token;
        env.localModelPath = localModelPath;
        env.allowRemoteModels = allowRemoteModels;

        this.logger.verbose(`Initializing Embedding: ${embeddingModel}`);
        this.logger.verbose(`Initializing LLM Coder: ${modelCoder} (${modelCodeMaxTokens} tokens)`);
        this.logger.verbose(`Initializing LLM Text Generation: ${modelText} (${modelTextMaxTokens} tokens)`);

        this.embedder = await pipeline('feature-extraction', embeddingModel, {
            token,
            use_auth_token: token,
            ort: { log_level: "error" }
        });

        this.logger.verbose(`Loading embedding model: ${embeddingModel}`);

        this.llmCode = await pipeline('text-generation', modelCoder, {
            token,
            use_auth_token: token,
            max_new_tokens: modelCodeMaxTokens,
            ort: { log_level: "off" },
        });

        this.logger.verbose(`Loading code model: ${modelCoder}`);

        /*this.llmNL = await pipeline('text-generation', modelText, {
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
        const queryVector = await this.generateEmbedding(queryText);

        this.logger.verbose(`Searching in vector database...`);
        const results = await this.dataset.search(queryVector, embeddingTopk);

        if (!results.length) {
            this.logger.warning(`No relevant results found for: ${queryText}`);
            return "No relevant information found.";
        }

        this.logger.verbose(`Pre-processing query with Code LLM...`);
        const optimizedQuery = await this.optimizeQueryWithLLM(queryText, results);

        console.log(optimizedQuery);
        process.exit(1);

        this.logger.verbose(`Processing results with LLM for final response...`);

        console.log(results);
        return null;
    }

    private async generateEmbedding(text: string): Promise<Float32Array> {
        const indexSize = Config.get('ai.tokenizer.indexSize', 384);
        const output = await this.embedder(text, { pooling: 'mean', normalize: true });

        if (output.data.length !== indexSize)
            throw new Error(`Embedding size mismatch: Expected ${indexSize}, got ${output.data.length}`);

        return new Float32Array(output.data);
    }

    private async optimizeQueryWithLLM(query: string, context: DatasetEntry[]): Promise<string> {
        if (!this.llmCode) return query;

        const modelCodeMaxTokens = Config.get<number>('ai.search.codeMaxTokens', 1024);
        const maxInputToken = Config.get<number>('ai.search.maxInputToken', 2000);
        const baseCodeQuestion = Config.get<string>('ai.search.baseCodeQuestion', 'Based on the following context, generate an optimized query to retrieve information about:\n\n');
        const contextText = context.map(r => `Filename: ${r.filename}\nSnippet: ${r.snippet}`).join("\n\n").substring(0, maxInputToken);
        const prompt = `${baseCodeQuestion}\n\n${contextText}\n\nOriginal Question: ${query}\n\nOptimized Query:`;

        this.logger.verbose(`Process Prompt: \n\n${prompt}`);

        const response = await this.llmCode(prompt, {
            max_new_tokens: modelCodeMaxTokens,
            return_full_text: false
        });

        return response[0]?.generated_text || query;
    }

    private async generateFinalAnswer(query: string, results: any[]): Promise<string> {
        if (!this.llmNL) return results.map(r => r.snippet).join("\n\n");

        const modelTextMaxTokens = Config.get<number>('ai.search.textMaxTokens', 4000);
        const context = results.map(r => r.snippet).join("\n\n");
        const prompt = `Question: ${query}\n\nContext:\n${context}\n\nResponse:`;

        const response = await this.llmNL(prompt, {
            max_new_tokens: modelTextMaxTokens,
            return_full_text: false
        });

        return response[0]?.generated_text || "No clear response found.";
    }
}
