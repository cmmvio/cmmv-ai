import { Logger } from '@cmmv/core';
import { DatasetEntry } from '../dataset.interface';
import { VectorStore } from '@langchain/core/vectorstores';
import type { EmbeddingsInterface } from '@langchain/core/embeddings';
import type { VectorStoreRetriever } from '@langchain/core/vectorstores';

export abstract class VectorDatabaseAdapter {
    protected logger: Logger;
    protected vectorStore: VectorStore;
    abstract initialize(embeddings: EmbeddingsInterface): Promise<void>;

    protected datasetEntryToDocument(entry: DatasetEntry) {
        return {
            id: entry.id,
            pageContent: entry.content,
            metadata: { ...entry.metadata, id: entry.id },
        };
    }

    public async searchVector(
        queryVector: string | Float32Array,
        topK: number = 5,
    ): Promise<any[]> {
        const similaritySearch =
            queryVector instanceof Float32Array
                ? await this.vectorStore.similaritySearchVectorWithScore(
                      Array.from(queryVector),
                      topK,
                  )
                : await this.vectorStore.similaritySearchWithScore(
                      queryVector,
                      topK,
                  );

        let result = [];

        for (const [doc, score] of similaritySearch)
            result.push({ doc, score });

        return result;
    }

    public async saveVector(entry: DatasetEntry) {
        await this.vectorStore.addDocuments([
            this.datasetEntryToDocument(entry),
        ]);
    }

    public asRetriever(topK: number = 10): VectorStoreRetriever<any> {
        return this.vectorStore.asRetriever(topK);
    }

    public async delete(_params?: Record<string, any>) {
        await this.vectorStore.delete(_params);
    }

    async clear() {
        try {
            if (this.vectorStore) await this.vectorStore.delete({ filter: {} });
        } catch (error) {
            this.logger.error(`Error clearing Vector Store: ${error.message}`);
        }
    }
}
