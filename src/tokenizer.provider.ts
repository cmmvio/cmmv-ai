import { Service, Config, Logger } from '@cmmv/core';
import { EventEmitter } from 'node:events';
import { v5 as uuidv5 } from 'uuid';
import * as fs from 'node:fs';
import { glob } from 'glob';
import { parse } from '@babel/parser';

import { TokenizerOptions } from './tokenizer.interface';
import { Dataset } from './dataset.provider';
import { DatasetEntry } from './dataset.interface';
import { extractKeywords } from "./keybert.util";

const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

@Service('ai-tokenizer')
export class Tokenizer extends EventEmitter {
	private logger = new Logger('Tokenizer');
	private options: TokenizerOptions;
	private embedder: any;
    private bgeBase: any;
	private dataset: Dataset = new Dataset();

	async initialize() {
		const TransformersApi = Function('return import("@xenova/transformers")')();
		const { pipeline } = await TransformersApi;
		const embeddingModel = Config.get('ai.tokenizer.embeddingModel','Xenova/all-MiniLM-L6-v2',);
		const token = Config.get('ai.huggingface.token');
		const provider = Config.get('ai.vector.provider');
		this.embedder = await pipeline('feature-extraction', embeddingModel, { token });
        this.bgeBase = await pipeline("feature-extraction", "Xenova/bge-base-en-v1.5");

		if(provider !== "faiss"){
            await this.dataset.loadAdapter();
            await this.dataset.clearDatabase();
		}

		this.logger.verbose(`Start embedder: ${embeddingModel}`);
	}

	async start() {
		const patterns = Config.get('ai.tokenizer.patterns', ['**/*.ts']);
		const ignore = Config.get('ai.tokenizer.ignore', ['**/*.ts']);
		const exclude = Config.get('ai.tokenizer.exclude', []);
        const provider = Config.get('ai.vector.provider');
		const TraverseApi = Function('return import("@babel/traverse")')();
		const traverse = (await TraverseApi).default;

		if (!this.embedder) await this.initialize();

		this.logger.verbose(`Mapping files: ${patterns.join(',')}`);

		const files = await glob(patterns, {
			follow: true,
			absolute: true,
			dot: true,
			ignore: ['node_modules', ...ignore],
		});

		this.logger.verbose(`Total files: ${files.length}`);

		const promises: Function[] = [];
		const ignoreDefault = [
			'node_modules',
			'.d.ts',
			'.cjs',
			'.spec.ts',
			'.test.ts',
			'.mjs',
		];

		for (const filename of files) {
			if (
                ignore.some((ext) => filename.includes(ext)) ||
                ignoreDefault.some((ext) => filename.includes(ext)) ||
                exclude.some((ext) => filename.includes(ext))
            )
                continue;

            this.logger.verbose(`Parsing: ${filename}`);

            if(filename.includes('.md')){
                await this.processMarkdownFile(filename);
            }
            else {
                const content = fs.readFileSync(filename, 'utf-8');

                const ast = parse(content, {
                    sourceType: 'module',
                    strictMode: false,
                    plugins: [
                        'typescript',
                        'jsx',
                        'decorators-legacy',//@ts-ignore
                        ['@babel/plugin-proposal-decorators', { legacy: true }],//@ts-ignore
                        'babel-plugin-parameter-decorator',
                    ],
                });

                traverse.default(ast, {
                    FunctionDeclaration: (path) => {
                        if (path.node.id) {
                            promises.push(() =>
                                this.processEntity(
                                    'Function',
                                    filename,
                                    path.node.id.name,
                                    content,
                                    path,
                                ),
                            );
                        }
                    },
                    ClassDeclaration: (path) => {
                        if (path.node.id && path.node.abstract) {
                            promises.push(() =>
                                this.processEntity(
                                    'AbstractClass',
                                    filename,
                                    path.node.id.name,
                                    content,
                                    path,
                                ),
                            );
                        } else if (path.node.id) {
                            promises.push(() =>
                                this.processEntity(
                                    'Class',
                                    filename,
                                    path.node.id.name,
                                    content,
                                    path,
                                ),
                            );
                        }
                    },
                    TSInterfaceDeclaration: (path) => {
                        if (path.node.id) {
                            promises.push(() =>
                                this.processEntity(
                                    'Interface',
                                    filename,
                                    path.node.id.name,
                                    content,
                                    path,
                                ),
                            );
                        }
                    },
                    TSEnumDeclaration: (path) => {
                        if (path.node.id) {
                            promises.push(() =>
                                this.processEntity(
                                    'Enum',
                                    filename,
                                    path.node.id.name,
                                    content,
                                    path,
                                ),
                            );
                        }
                    },
                    Decorator: (path) => {
                        if (path.node.expression.type === 'Identifier') {
                            promises.push(() =>
                                this.processEntity(
                                    'Decorator',
                                    filename,
                                    path.node.expression.name,
                                    content,
                                    path,
                                ),
                            );
                        }
                    },
                });
            }
		}

        for(let key in promises)
            await promises[key].call(this);

		this.dataset.save();
	}

	private async processEntity(
		type: DatasetEntry['type'],
		filename: string,
		name: string,
		content: string,
		path: any,
	) {
		try {
            const snippet = content.slice(path.node.start!, path.node.end!);
            const combinedText = `Filename: ${filename}\nName: ${name}\nSnippet: ${snippet}`;
            const vector = await this.generateEmbedding(combinedText);
            const keywords = await this.getKeywords(combinedText);

            const hash = uuidv5(snippet, NAMESPACE);
            this.dataset.addEntry({ id: hash, filename, type, value: name, snippet, keywords, vector });
		} catch (e) {
		    this.logger.error(e.message, filename);
		}
	}

	private async generateEmbedding(text: string, weight = 1): Promise<Float32Array> {
		const output = await this.embedder(text, { pooling: 'mean', normalize: true });
		return new Float32Array(output.data.map(v => v * weight));
	}

	async parseMarkdown(filePath: string): Promise<{ extractedText: string[], topic: string }> {
		const content = fs.readFileSync(filePath, "utf-8");
        const UnifiedApi = Function('return import("unified")')();
        const RemarkParseApi = Function('return import("remark-parse")')();
		const { unified } = await UnifiedApi;
        const remarkParse = await RemarkParseApi;
		const tree = unified().use(remarkParse.default).parse(content);

		let extractedText: string[] = [];
        let topic = "";

		function extract(node: any) {
			if (node.type === "text")
				extractedText.push(node.value);
            if (node.type === "paragraph")
				extractedText.push(node.children.map((item) => item.value).join("\n\n"));
            else if (node.type === "heading" && node.depth === 1)
				topic = node.children[0].value;
			else if (node.children)
				node.children.forEach(extract);
		}

		extract(tree);

		return { extractedText: [extractedText.join("\n\n")], topic };
	}

    async processMarkdownFile(filePath: string) {
        const { extractedText, topic } = await this.parseMarkdown(filePath);

        for(let key in extractedText){
            const snippetText = extractedText[key];
            const vector = await this.generateEmbedding(snippetText);
            const hash = uuidv5(snippetText, NAMESPACE);
            const keywords = await this.getKeywords(snippetText);

            await this.dataset.addEntry({
                id: hash,
                filename: filePath,
                value: topic,
                type: "Documentation",
                snippet: snippetText,
                keywords,
                vector
            });
        }
    }

    async getKeywords(query: string, topN = 10): Promise<string[]> {
        const useKeyBERT = Config.get('ai.tokenizer.useKeyBERT', false);

        if(useKeyBERT){
            this.logger.verbose(`Await KeyBERT Return Keywords...`);
            const keywords = await extractKeywords(query, 10);
            return keywords;
        }

        return [];
    }
}
