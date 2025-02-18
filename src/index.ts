import { Module } from '@cmmv/core';

export * from './dataset.interface';
export * from './dataset.provider';
export * from './tokenizer.interface';
export * from './tokenizer.provider';

import { Tokenizer } from './tokenizer.provider';
import { Dataset } from './dataset.provider';

export const AIModule = new Module('ai', {
  configs: [],
  providers: [Tokenizer, Dataset],
});
