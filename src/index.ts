import { Module } from '@cmmv/core';

export * from './dataset.interface';
export * from './dataset.provider';
export * from './tokenizer.interface';
export * from './tokenizer.provider';

//Adapter
export * from "./vector.abstract";
export * from "./qdrant.adapter";

//Module
import { AIConfig } from "./ai.config";
import { Tokenizer } from './tokenizer.provider';
import { Dataset } from './dataset.provider';

export const AIModule = new Module('ai', {
    configs: [AIConfig],
    providers: [Tokenizer, Dataset]
});
