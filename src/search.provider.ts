import * as path from 'node:path';
import { Service, Config, Logger } from '@cmmv/core';

import { Embedding, AbstractEmbedding } from './embeddings';
import { Dataset } from './dataset.provider';
import { DatasetEntry } from './dataset.interface';

@Service('ai-search')
export class Search {
  private dataset: Dataset;
  private logger = new Logger('Search');
  private embedder: AbstractEmbedding;
  private llmCode: any;
  private llmNL: any;

  constructor(dataset: Dataset) {
    this.dataset = dataset;
  }

  async initialize() {
    this.embedder = await Embedding.loadEmbedder();
    await this.embedder.initialize();
  }

  async find(query: string | string[]): Promise<DatasetEntry[]> {
    const embeddingTopk = Config.get<number>('ai.search.embeddingTopk', 10);
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

  formatVectorStoreResults(results: DatasetEntry[]): string {
    return JSON.stringify(
      results.map((data) => {
        return { source: data.metadata?.source, content: data.content };
      }),
    );
  }
}
