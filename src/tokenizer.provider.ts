import { Service, Config, Logger } from '@cmmv/core';
import { EventEmitter } from 'node:events';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'node:fs';
import * as fg from 'fast-glob';
import { parse } from '@babel/parser';

import { TokenizerOptions } from './tokenizer.interface';
import { Dataset } from './dataset.provider';
import { DatasetEntry } from './dataset.interface';

@Service('ai-tokenizer')
export class Tokenizer extends EventEmitter {
  private logger = new Logger('Tokenizer');
  private options: TokenizerOptions;
  private embedder: any;
  private dataset: Dataset = new Dataset();

  async initialize() {
    const TransformersApi = Function('return import("@xenova/transformers")')();
    const { pipeline } = await TransformersApi;
    const embeddingModel = Config.get(
      'ai.tokenizer.embeddingModel',
      'codellama',
    );
    const token = Config.get('ai.huggingface.token');
    this.embedder = await pipeline('feature-extraction', embeddingModel, {
      token,
    });
    const provider = Config.get('ai.vector.provider');

    if(provider !== "faiss"){
        await this.dataset.loadAdapter();
        await this.dataset.migrationToDatabase();
    }

    this.logger.verbose(`Start embedder: ${embeddingModel}`);
  }

  async start() {
    const patterns = Config.get('ai.tokenizer.patterns', ['**/*.ts']);
    const ignore = Config.get('ai.tokenizer.ignore', ['**/*.ts']);
    const exclude = Config.get('ai.tokenizer.exclude', []);
    const TraverseApi = Function('return import("@babel/traverse")')();
    const traverse = (await TraverseApi).default;

    if (!this.embedder) await this.initialize();
    this.logger.verbose(`Mapping files: ${patterns.join(',')}`);

    const files = await fg(patterns, {
      onlyFiles: true,
      absolute: true,
      ignore: ['node_modules', ...ignore],
    });

    this.logger.verbose(`Total files: ${files.length}`);

    const promises: Promise<void>[] = [];
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
            promises.push(
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
              promises.push(
                this.processEntity(
                  'AbstractClass',
                  filename,
                  path.node.id.name,
                  content,
                  path,
                ),
              );
            } else if (path.node.id) {
              promises.push(
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
            promises.push(
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
            promises.push(
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
        VariableDeclaration: (path) => {
          if (path.node.kind === 'const') {
            path.node.declarations.forEach((declaration) => {
              if (declaration.id.type === 'Identifier') {
                promises.push(
                  this.processEntity(
                    'Constant',
                    filename,
                    declaration.id.name,
                    content,
                    path,
                  ),
                );
              }
            });
          }
        },
        Decorator: (path) => {
          if (path.node.expression.type === 'Identifier') {
            promises.push(
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
        CallExpression: (path) => {
          if (
            path.node.callee.type === 'Identifier' &&
            path.node.callee.name === 'Symbol'
          ) {
            if (path.node.arguments.length > 0) {
              const symbolName = path.node.arguments[0].value;
              if (typeof symbolName === 'string') {
                promises.push(
                  this.processEntity(
                    'Symbol',
                    filename,
                    symbolName,
                    content,
                    path,
                  ),
                );
              }
            }
          }
        },
      });
    }

    await Promise.all(promises);
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
      const vector = await this.generateEmbedding(snippet);
      this.dataset.addEntry({ id: uuidv4(), filename, type, value: name, snippet, vector });
    } catch (e) {
      this.logger.error(e.message, filename);
    }
  }

  private async generateEmbedding(text: string): Promise<Float32Array> {
    const output = await this.embedder(text, {
      pooling: 'mean',
      normalize: true,
    });

    return new Float32Array(output.data);
  }
}
