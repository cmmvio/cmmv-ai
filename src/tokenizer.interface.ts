import * as fg from 'fast-glob';

export interface TokenizerOptions {
  patterns: fg.Pattern | fg.Pattern[];
  embeddingModel?: 'all-MiniLM-L6-v2' | 'codellama';
}

export interface TokenizedSnippet {
  filename: string;
  type: string;
  value: string;
  snippet: string;
  vector: any;
}
