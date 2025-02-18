import { Service, Config, Logger } from '@cmmv/core';
import * as fs from 'node:fs';
import * as faiss from 'faiss-node';

import { DatasetEntry } from './dataset.interface';
import { VectorAdapter } from "./vector.abstract";

@Service('ai-dataset')
export class Dataset {
  	private logger = new Logger('Dataset');
	private data: DatasetEntry[] = [];
	private indexSize: any;
    private indexFAISS: faiss.IndexFlatL2;
	private adapter?: VectorAdapter;

	constructor() {
		const indexSize = Config.get('ai.tokenizer.indexSize', 384);
        this.indexSize = indexSize;
		this.indexFAISS = new faiss.IndexFlatL2(indexSize);
	}

	public async loadAdapter() {
        const provider = Config.get('ai.vector.provider', 'faiss');

        switch (provider) {
            case 'qdrant':
                const { QdrantAdapter } = await import('./qdrant.adapter');
                this.adapter = new QdrantAdapter();
                this.adapter.connect()
            break;
            case 'milvus':
                const { MilvusAdapter } = await import('./milvus.adapter');
                this.adapter = new MilvusAdapter();
                this.adapter.connect()
            break;
            case 'neo4j':
                const { Neo4jAdapter } = await import('./neo4j.adapter');
                this.adapter = new Neo4jAdapter();
                this.adapter.connect()
            break;
            default:
              this.adapter = undefined;
        }
	}

	async addEntry(entry: DatasetEntry) {
		if (!(entry.vector instanceof Float32Array))
			throw new Error('Invalid vector format, expected Float32Array.');

		if (entry.vector.length !== this.indexSize){
			throw new Error(
				`Vector length mismatch: Expected ${this.indexSize}, got ${entry.vector.length}`,
			);
		}

		this.logger.verbose(`Index ${entry.type}:${entry.value} (${entry.filename})`);
		this.data.push(entry);
        this.indexFAISS.add(Array.from(entry.vector));

        if (this.adapter)
            await this.adapter.saveVector(entry);
	}

	save() {
		const filePath = Config.get('ai.tokenizer.output', './data.bin');
		const buffer = Buffer.alloc(this.data.length * (this.indexSize * 4));
		fs.writeFileSync(
			filePath.replace('.bin', '.json'),
			JSON.stringify(
				this.data.map(({ vector, ...rest }) => rest),
				null,
				2,
			),
            { encoding: "utf-8" }
		);

		this.logger.verbose(`Save Index: ${filePath.replace('.bin', '.json')}`);

		this.data.forEach((entry, i) => {
			Buffer.from(entry.vector.buffer).copy(buffer, i * (this.indexSize * 4));
		});

		this.logger.verbose(`Save Dataset: ${filePath}`);
		fs.writeFileSync(filePath, buffer, { encoding: "utf-8" });
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

            this.data.map(({ vector }) => this.indexFAISS.add(Array.from(vector)));
			this.logger.verbose(`Loaded dataset: ${filePath} (${this.data.length} inputs)`);
		}
	}

    migrationToDatabase(){
        if (this.adapter && this.data && this.data.length > 0)
            this.data.map(async(entry) => await this.adapter.saveVector(entry));
    }

    async clearDatabase(){
        if (this.adapter){
            this.logger.verbose(`Clear Vector Database`);
            await this.adapter.clear();
        }
    }

    async search(queryVector: Float32Array, topK = 5): Promise<DatasetEntry[]> {
        if (!(queryVector instanceof Float32Array)) {
            throw new Error('Invalid query vector format, expected Float32Array.');
        }

        if (queryVector.length !== this.indexSize) {
            throw new Error(
                `Vector length mismatch: Expected ${this.indexSize}, got ${queryVector.length}`,
            );
        }

        this.logger.verbose(`Searching for top ${topK} matches`);

        if (this.adapter) {
            const dbResult = await this.adapter.searchVector(queryVector, topK);
            return dbResult.map((result) => {
                const registry = this.data.find((item) => item.id === result.id);
                return registry ? { ...registry } : null;
            }).filter(item => item);
        }
        else{
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
