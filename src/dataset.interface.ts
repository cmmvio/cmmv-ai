export interface DatasetEntry {
    id: string;
    filename: string;
    type:
        | 'Function'
        | 'Class'
        | 'Interface'
        | 'Enum'
        | 'Variable'
        | 'Symbol'
        | 'Decorator'
        | 'AbstractClass'
        | 'Constant'
        | 'Documentation';
    value?: string;
    snippet: string;
    vector: Float32Array;
    score?: number;
    keywords?: string[]
}
