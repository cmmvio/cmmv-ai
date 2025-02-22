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

//Module
import { AIConfig } from './ai.config';
import { Tokenizer } from './tokenizer.provider';
import { Dataset } from './dataset.provider';
import { Search } from './search.provider';

export const AIModule = new Module('ai', {
    configs: [AIConfig],
    providers: [Tokenizer, Dataset, Search],
});
