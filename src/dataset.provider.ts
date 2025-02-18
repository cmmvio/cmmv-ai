import { Service, Config, Logger } from '@cmmv/core';
import * as fs from 'node:fs';
import * as faiss from 'faiss-node';

import { DatasetEntry } from './dataset.interface';
import { VectorAdapter } from "./vector-database.abstract";

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

	addEntry(entry: DatasetEntry) {
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
            this.adapter.saveVector(entry);
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
		);

		this.logger.verbose(`Save index: ${filePath.replace('.bin', '.json')}`);

		this.data.forEach((entry, i) => {
			Buffer.from(entry.vector.buffer).copy(buffer, i * (this.indexSize * 4));
		});

		this.logger.verbose(`Save dataset: ${filePath}`);
		fs.writeFileSync(filePath, buffer);
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
            return this.adapter.searchVector(queryVector, topK);
        }
        else{
            const queryArray = Array.from(queryVector);
            const results = this.indexFAISS.search(queryArray, topK);
            console.log(results);

            /*const results = I.map((idx, i) => ({
                entry: idx >= 0 ? this.data[idx] : null,
                distance: D[i],
            })).filter(result => result.entry !== null) as { entry: DatasetEntry, distance: number }[];*/
            //return results.map(result => result.entry);
        }
    }
}
