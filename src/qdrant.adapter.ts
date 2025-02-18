import { Config, Logger } from '@cmmv/core';
import { QdrantClient } from '@qdrant/js-client-rest';
import { VectorAdapter } from './vector.abstract';
import { DatasetEntry } from "./dataset.interface";

export class QdrantAdapter extends VectorAdapter {
    private client: QdrantClient;
    private collection: string;
    private logger = new Logger('QdrantAdapter');

    async connect() {
        const url = Config.get('ai.vector.qdrant.url', 'http://localhost:6333');
        this.collection = Config.get('ai.vector.qdrant.collection', 'embeddings');
        this.client = new QdrantClient({ url, timeout: Infinity });
        this.logger.verbose(`Connected to Qdrant at ${url}`);
        await this.ensureCollectionExists();
    }

    private async ensureCollectionExists() {
        try {
            await this.client.getCollection(this.collection);
            this.logger.verbose(`Collection '${this.collection}' already exists.`);
        } catch (error: any) {
            if (error?.status === 404) {
                this.logger.warning(`Collection '${this.collection}' not found, creating...`);

                await this.client.createCollection(this.collection, {
                    vectors: {
                        size: Config.get('ai.tokenizer.indexSize', 384),
                        distance: "Cosine"
                    }
                });

                this.logger.verbose(`Collection '${this.collection}' created.`);
            } else {
                throw new Error(`Error checking collection '${this.collection}': ${error.message}`);
            }
        }
    }

    async saveVector(entry: DatasetEntry) {
        let response;

        try{
            response = await this.client.upsert(this.collection, {
                points: [{ id: entry.id, vector: Array.from(entry.vector), payload: {
                    value: entry.value,
                    type: entry.type,
                    snippet: entry.snippet,
                } }],
            });
        }
        catch(e) {
            console.log(response)
            this.logger.error(e.message);
            console.error(e);
            process.exit(1);
        }
    }

    async searchVector(queryVector: Float32Array, topK = 5): Promise<any[]> {
        const collection = await this.client.getCollection(this.collection);

        const result = await this.client.search(this.collection, {
            vector: Array.from(queryVector),
            limit: topK,
        });

        return result.map((r) => ({
            filename: '',
            type: 'Unknown',
            id: r.id.toString(),
            snippet: '',//@ts-ignore
            vector: new Float32Array(r.vector),
        }));
    }

    async clear() {
        await this.client.deleteCollection(this.collection);

        this.logger.verbose(`Collection '${this.collection}' deleted.`);

        await this.client.createCollection(this.collection, {
            vectors: {
                size: Config.get('ai.tokenizer.indexSize', 384),
                distance: "Cosine"
            }
        });

        this.logger.verbose(`Collection '${this.collection}' created.`);
    }
}
