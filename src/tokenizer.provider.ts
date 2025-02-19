import { Service, Config, Logger } from '@cmmv/core';
import { EventEmitter } from 'node:events';
import { v5 as uuidv5 } from 'uuid';
import * as fs from 'node:fs';
import { glob } from 'glob';

import {
	RecursiveCharacterTextSplitter
} from 'langchain/text_splitter';

import { TokenizerOptions } from './tokenizer.interface';
import { Dataset } from './dataset.provider';
import { DatasetEntry } from './dataset.interface';
import { extractKeywords } from "./utils/keybert.util";
import { Embedding, AbstractEmbedding } from './embeddings';


const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

@Service('ai-tokenizer')
export class Tokenizer extends EventEmitter {
	private logger = new Logger('Tokenizer');
	private embedder: AbstractEmbedding;
	private dataset: Dataset = new Dataset();

	async initialize() {
        //Emedder
		this.embedder = await Embedding.loadEmbedder();
        await this.embedder.initialize();

        const databaseProvider = Config.get('ai.vector.provider', 'faiss');

		if(databaseProvider !== "faiss"){
            await this.dataset.loadAdapter();
            await this.dataset.clearDatabase();
		}

		const patterns = Config.get('ai.tokenizer.patterns', ['**/*.ts']);
		const ignore = Config.get('ai.tokenizer.ignore', ['**/*.ts']);
		const exclude = Config.get('ai.tokenizer.exclude', []);
        const chunkSize = Config.get<number>('ai.tokenizer.chunkSize', 500);
        const chunkOverlap = Config.get<number>('ai.tokenizer.chunkOverlap', 100);

		const splitterJs = RecursiveCharacterTextSplitter.fromLanguage("js", {
            chunkSize,
            chunkOverlap,
        });

        const splitterMarkdown = RecursiveCharacterTextSplitter.fromLanguage("markdown", {
            chunkSize,
            chunkOverlap,
        });

		this.logger.verbose(`Mapping files: ${patterns.join(',')}`);

		const files = await glob(patterns, {
			follow: true,
			absolute: true,
			dot: false,
			ignore: ['**/node_modules/**', ...ignore],
		});

		this.logger.verbose(`Total files: ${files.length}`);

		for (const filename of files) {
			if (
                ignore.some((ext) => filename.includes(ext)) ||
                exclude.some((ext) => filename.includes(ext))
            )
                continue;

            this.logger.verbose(`Parsing: ${filename}`);
            const content = fs.readFileSync(filename, 'utf-8');
            let output = null;

            if(filename.includes('.md'))
                output = await splitterMarkdown.createDocuments([content]);
            else
                output = await splitterJs.createDocuments([content]);

            output = output.filter(doc => doc.pageContent.length >= 100);
            output = await this.embeddingDocuments(output);
            await this.processDocuments(output, filename);
		}

		this.dataset.save();
	}

    private async embeddingDocuments<T>(output: any[]): Promise<T[]> {
        return Promise.all(output.map(async (document) => ({
            ...document,
            vector: new Float32Array(await this.embedder.embedQuery(document.pageContent))
        })));
    }

    private async processDocuments<T>(output: any[], filename: string): Promise<void[]> {
        return Promise.all(output.map(async (document) => await this.processEntity(filename, document)));
    }

	private async processEntity(
		filename: string,
		document: any
	) {
		try {
            const hash = uuidv5(document.pageContent, NAMESPACE);

            await this.dataset.addEntry({
                id: hash,
                content: document.pageContent,
                vector: document.vector,
                metadata: {
                    source: filename,
                    loc: document.metadata.loc ?? {}
                }
            }, document.metadata);
		} catch (e) {
		    this.logger.error(e.message, filename);
		}
	}

    async getKeywords(query: string, topN = 10): Promise<string[]> {
        const useKeyBERT = Config.get('ai.tokenizer.useKeyBERT', false);

        if(useKeyBERT){
            this.logger.verbose(`Await KeyBERT Return Keywords...`);
            const keywords = await extractKeywords(query, topN);
            return keywords;
        }

        return [];
    }
}
