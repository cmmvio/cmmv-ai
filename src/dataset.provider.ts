import { Service, Config, Logger } from '@cmmv/core';
import * as fs from 'node:fs';
import * as faiss from 'faiss-node';

import { DatasetEntry } from './dataset.interface';

@Service('ai-dataset')
export class Dataset {
  private logger = new Logger('Dataset');
  private data: DatasetEntry[] = [];

  addEntry(entry: DatasetEntry) {
    const indexSize = Config.get('ai.tokenizer.indexSize', 384);

    if (!(entry.vector instanceof Float32Array))
      throw new Error('Invalid vector format, expected Float32Array.');

    if (entry.vector.length !== indexSize)
      throw new Error(
        `Vector length mismatch: Expected ${indexSize}, got ${entry.vector.length}`,
      );

    this.logger.verbose(
      `Index ${entry.type}:${entry.value} (${entry.filename})`,
    );
    this.data.push(entry);
  }

  save() {
    const indexSize = Config.get('ai.tokenizer.indexSize', 384);
    const filePath = Config.get('ai.tokenizer.output', './data.bin');
    const buffer = Buffer.alloc(this.data.length * (indexSize * 4));
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
      Buffer.from(entry.vector.buffer).copy(buffer, i * (indexSize * 4));
    });

    this.logger.verbose(`Save dataset: ${filePath}`);

    fs.writeFileSync(filePath, buffer);
  }

  load() {
    const indexSize = Config.get('ai.tokenizer.indexSize', 384);
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
          i * (indexSize * 4),
          indexSize,
        ),
      }));

      console.log(
        `📥 Dataset carregado (${this.data.length} entradas) do binário.`,
      );
    }
  }

  /*search(queryVector: Float32Array, topK = 5): DatasetEntry[] {
        const D = new Float32Array(topK);
        const I = new Int32Array(topK);
        this.index.search(queryVector, topK, D, I);

        return I.map((idx) => (idx >= 0 ? this.data[idx] : null)).filter((item) => item !== null) as DatasetEntry[];
    }*/
}
