import { DatasetEntry } from "./dataset.interface";

export abstract class VectorDatabaseAdapter {
    abstract connect(): Promise<void>;
    abstract saveVector(entry: DatasetEntry): Promise<void>;
    abstract searchVector(queryVector: Float32Array, topK: number): Promise<DatasetEntry[]>;
}
