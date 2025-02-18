import { Config, Logger } from '@cmmv/core';
import { QdrantClient } from '@qdrant/js-client-rest';
import { VectorDatabaseAdapter } from './vector-database.abstract';
import { DatasetEntry } from "./dataset.interface";

export class QdrantAdapter extends VectorDatabaseAdapter {
    private client: QdrantClient;
    private collection: string;
    private logger = new Logger('QdrantAdapter');

    async connect() {
        const url = Config.get('ai.vector.qdrant.url', 'http://localhost:6333');
        this.collection = Config.get('ai.vector.qdrant.collection', 'embeddings');

        this.client = new QdrantClient({ url });
        this.logger.verbose(`Connected to Qdrant at ${url}`);
    }

    async saveVector(entry: DatasetEntry) {
        await this.client.upsert(this.collection, {
            points: [{ id: entry.value, vector: Array.from(entry.vector) }],
        });
    }

    async searchVector(queryVector: Float32Array, topK = 5): Promise<any[]> {
        const result = await this.client.search(this.collection, {
            vector: Array.from(queryVector),
            limit: topK,
        });

        return result.map((r) => ({
            filename: '',
            type: 'Unknown',
            value: r.id.toString(),
            snippet: '',//@ts-ignore
            vector: new Float32Array(r.vector),
        }));
    }
}
