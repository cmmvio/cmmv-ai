import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FireworksEmbedding } from '../../src/embeddings/fireworks.embedding';
import { AbstractEmbedding } from '../../src/embeddings/embedding.abstract';

vi.mock('@langchain/community/embeddings/fireworks', () => ({
    FireworksEmbeddings: vi.fn().mockImplementation(() => ({
        embedQuery: vi.fn(async (doc: string) => [0.4, 0.7, 0.9]),
        embedDocuments: vi.fn(async (docs: string[]) =>
            docs.map(() => [0.4, 0.7, 0.9]),
        ),
    })),
}));

vi.mock('@cmmv/core', () => ({
    Config: {
        get: vi.fn(
            (key: string, defaultValue?: any) =>
                defaultValue || `mocked-${key}`,
        ),
    },
    Logger: vi.fn().mockImplementation(() => ({
        verbose: vi.fn(),
    })),
}));

describe('FireworksEmbedding', () => {
    let embedding: FireworksEmbedding;

    beforeEach(() => {
        vi.clearAllMocks();
        embedding = new FireworksEmbedding();
    });

    it('should extend AbstractEmbedding', () => {
        expect(embedding).toBeInstanceOf(AbstractEmbedding);
    });

    it('should initialize and create a valid embedder', async () => {
        await embedding.initialize();
        expect(embedding['embedder']).toBeDefined();
    });

    it('should return a valid object from getInterfaceEmbedder', async () => {
        await embedding.initialize();
        const embedder = embedding.getInterfaceEmbedder();
        expect(embedder).toHaveProperty('embedQuery');
        expect(embedder).toHaveProperty('embedDocuments');
        expect(typeof embedder.embedQuery).toBe('function');
        expect(typeof embedder.embedDocuments).toBe('function');
    });

    it('should return an array of numbers from embedQuery', async () => {
        await embedding.initialize();
        const result = await embedding.embedQuery('test query');
        expect(Array.isArray(result)).toBe(true);
        expect(result.every((num) => typeof num === 'number')).toBe(true);
    });

    it('should return an array of arrays from embedDocuments', async () => {
        await embedding.initialize();
        const result = await embedding.embedDocuments(['doc1', 'doc2']);
        expect(Array.isArray(result)).toBe(true);
        expect(result.every((arr) => Array.isArray(arr))).toBe(true);
        expect(
            result.every((arr) => arr.every((num) => typeof num === 'number')),
        ).toBe(true);
    });
});
