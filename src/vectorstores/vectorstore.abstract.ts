import { DatasetEntry } from '../dataset.interface';
import { VectorStore } from '@langchain/core/vectorstores';
import type { EmbeddingsInterface } from '@langchain/core/embeddings';
import type { VectorStoreRetriever } from '@langchain/core/vectorstores';

export abstract class VectorDatabaseAdapter {
    protected vectorStore: VectorStore;
    abstract initialize(embeddings: EmbeddingsInterface): Promise<void>;
    abstract saveVector(entry: DatasetEntry): Promise<void>;
    abstract searchVector(
        queryVector: Float32Array,
        topK: number,
    ): Promise<DatasetEntry[]>;
    abstract clear(): Promise<void>;
    abstract asRetriever(): VectorStoreRetriever<any>;
}
