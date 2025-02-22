import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AbstractEmbedding } from '../../src/embeddings/embedding.abstract';
import { Logger } from '@cmmv/core';
import { Embeddings } from '@langchain/core/embeddings';

class MockEmbedding extends AbstractEmbedding {
    public override async initialize() {
        this.embedder = {
            embedQuery: vi.fn(async (doc: string) => [0.1, 0.2, 0.3]),
            embedDocuments: vi.fn(async (docs: string[]) =>
                docs.map(() => [0.1, 0.2, 0.3]),
            ),
        } as unknown as Embeddings;
    }
}

vi.mock('@cmmv/core', async () => {
    const actual = await vi.importActual<any>('@cmmv/core');
    return {
        ...actual,
        Logger: vi.fn().mockImplementation(() => ({
            verbose: vi.fn(),
            info: vi.fn(),
            error: vi.fn(),
            warn: vi.fn(),
        })),
    };
});

describe('AbstractEmbedding', () => {
    let embedding: MockEmbedding;

    beforeEach(async () => {
        vi.clearAllMocks();
        embedding = new MockEmbedding();
        await embedding.initialize();
    });

    it('should be an instance of AbstractEmbedding', () => {
        expect(embedding).toBeInstanceOf(AbstractEmbedding);
    });

    it('should initialize and set an embedder', () => {
        expect(embedding['embedder']).toBeDefined();
    });

    it('should return the correct embedder from getInterfaceEmbedder', () => {
        const embedder = embedding.getInterfaceEmbedder();
        expect(embedder).toHaveProperty('embedQuery');
        expect(embedder).toHaveProperty('embedDocuments');
        expect(typeof embedder.embedQuery).toBe('function');
        expect(typeof embedder.embedDocuments).toBe('function');
    });

    it('should return an array of numbers from embedQuery', async () => {
        const result = await embedding.embedQuery('test query');
        expect(Array.isArray(result)).toBe(true);
        expect(result.every((num) => typeof num === 'number')).toBe(true);
    });

    it('should return an array of arrays from embedDocuments', async () => {
        const result = await embedding.embedDocuments(['doc1', 'doc2']);
        expect(Array.isArray(result)).toBe(true);
        expect(result.every((arr) => Array.isArray(arr))).toBe(true);
        expect(
            result.every((arr) => arr.every((num) => typeof num === 'number')),
        ).toBe(true);
    });
});
