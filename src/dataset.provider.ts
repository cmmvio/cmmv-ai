import { Service, Config, Logger } from '@cmmv/core';
import * as fs from 'node:fs';
import * as faiss from 'faiss-node';

import { AbstractEmbedding } from './embeddings';
import { DatasetEntry } from './dataset.interface';

import { VectorStore, VectorDatabaseAdapter } from './vectorstores';

@Service('ai-dataset')
export class Dataset {
    private logger = new Logger('Dataset');
    private data: DatasetEntry[] = [];
    private indexSize: any;
    private indexFAISS: faiss.IndexFlatL2;
    private adapter?: VectorDatabaseAdapter;

    async initialize(embedder: AbstractEmbedding) {
        const indexSize = Config.get('ai.tokenizer.indexSize', 384);
        this.indexSize = indexSize;
        this.indexFAISS = new faiss.IndexFlatL2(indexSize);
        this.adapter = await VectorStore.loadStore(embedder);
    }

    async addEntry(entry: DatasetEntry, metadata: any) {
        if (!(entry.vector instanceof Float32Array))
            throw new Error('Invalid vector format, expected Float32Array.');

        this.logger.verbose(`Index ${entry.id}: ${entry.metadata.source}`);
        this.data.push({ ...entry, document: metadata });
        this.indexFAISS.add(Array.from(entry.vector));

        if (this.adapter) await this.adapter.saveVector(entry);
    }

    save() {
        //Index
        const filePath = Config.get('ai.tokenizer.output', './data.bin');
        const buffer = Buffer.alloc(this.data.length * (this.indexSize * 4));
        fs.writeFileSync(
            filePath.replace('.bin', '.json'),
            JSON.stringify(
                this.data.map(({ vector, ...rest }) => rest),
                null,
                2,
            ),
            { encoding: 'utf-8' },
        );

        this.logger.verbose(`Save Index: ${filePath.replace('.bin', '.json')}`);

        //Dataset
        this.data.forEach((entry, i) => {
            Buffer.from(entry.vector.buffer).copy(
                buffer,
                i * (this.indexSize * 4),
            );
        });

        this.logger.verbose(`Save Dataset: ${filePath}`);
        fs.writeFileSync(filePath, buffer, { encoding: 'utf-8' });
    }

    load() {
        const filePath = Config.get('ai.tokenizer.output', './data.bin');

        if (fs.existsSync(filePath)) {
            const jsonData = JSON.parse(
                fs.readFileSync(filePath.replace('.bin', '.json'), 'utf-8'),
            );
            const buffer = fs.readFileSync(filePath);

            this.data = jsonData.map((entry: any, i: number) => ({
                ...entry,
                vector: new Float32Array(
                    buffer.buffer,
                    i * (this.indexSize * 4),
                    this.indexSize,
                ),
            }));

            this.data.map(({ vector }) =>
                this.indexFAISS.add(Array.from(vector)),
            );
            this.logger.verbose(
                `Loaded dataset: ${filePath} (${this.data.length} inputs)`,
            );
        }
    }

    migrationToDatabase() {
        if (this.adapter && this.data && this.data.length > 0)
            this.data.map(
                async (entry) => await this.adapter.saveVector(entry),
            );
    }

    async clearDatabase() {
        if (this.adapter) {
            this.logger.verbose(`Clear Vector Database`);
            await this.adapter.clear();
        }
    }

    async search(queryVector: Float32Array, topK = 5): Promise<DatasetEntry[]> {
        if (!(queryVector instanceof Float32Array)) {
            throw new Error(
                'Invalid query vector format, expected Float32Array.',
            );
        }

        this.logger.verbose(`Searching for top ${topK} matches`);

        if (this.adapter) {
            const dbResult = await this.adapter.searchVector(queryVector, topK);
            return dbResult
                .map((result) => {
                    const registry = this.data.find(
                        (item) => item.id === result.id,
                    );
                    return registry ? { ...registry } : null;
                })
                .filter((item) => item);
        } else {
            const queryArray = Array.from(queryVector);
            const result = this.indexFAISS.search(queryArray, topK);

            return result.labels.map((idx, index) => {
                let data = this.data[idx];
                data.score = result.distances[index];
                return data;
            });
        }
    }
}
