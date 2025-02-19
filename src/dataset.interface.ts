export interface DatasetEntry {
    id: string;
    content: string;
    vector: Float32Array;
    metadata?: any;
    score?: number;
    document?: any;
}
