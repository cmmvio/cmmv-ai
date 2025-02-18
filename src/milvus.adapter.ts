import { MilvusClient } from '@zilliz/milvus2-sdk-node';
import { Config, Logger } from '@cmmv/core';
import { VectorAdapter } from './vector.abstract';
import { DatasetEntry } from "./dataset.interface";

export class MilvusAdapter extends VectorAdapter {
    private client: MilvusClient;
    private logger = new Logger('MilvusAdapter');

    async connect() {
        const url = Config.get('ai.vector.milvus.url', 'localhost:19530');
        this.client = new MilvusClient({ address: url });
        this.logger.verbose(`Connected to Milvus at ${url}`);
    }

    async saveVector(entry: DatasetEntry) {
        await this.client.insert({
            collection_name: 'embeddings',
            fields_data: [{ name: entry.value, vector: Array.from(entry.vector) }],
        });

        this.logger.verbose(`Saved vector: ${entry.value}`);
    }

    async searchVector(queryVector: Float32Array, topK = 5): Promise<any[]> {
        const result = await this.client.search({
            collection_name: 'embeddings',
            vector: Array.from(queryVector),
            topk: topK,
        });

        return result.results.map((r: any) => ({
            filename: '',
            type: 'Unknown',
            value: r.id.toString(),
            snippet: '',
            vector: new Float32Array(r.vector),
        }));
    }
}
