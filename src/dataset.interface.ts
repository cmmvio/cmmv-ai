export interface DatasetEntry {
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
    | 'Constant';
  value: string;
  snippet: string;
  vector: Float32Array;
}
