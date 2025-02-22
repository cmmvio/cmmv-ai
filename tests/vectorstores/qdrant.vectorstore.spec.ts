import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QdrantVectorStore } from '../../src/vectorstores/qdrant.vectorstore';
import { QdrantClient } from '@qdrant/js-client-rest';
import { EmbeddingsInterface } from '@langchain/core/embeddings';

vi.mock('@qdrant/js-client-rest', () => ({
    QdrantClient: vi.fn().mockImplementation(() => ({
        upsert: vi.fn(),
        search: vi.fn(),
        getCollection: vi.fn(),
        createCollection: vi.fn(),
        deleteCollection: vi.fn(),
        collectionExists: vi.fn().mockResolvedValue(true),
    })),
}));

vi.mock('@cmmv/core', () => ({
    Config: {
        get: vi.fn((key, defaultValue) => defaultValue),
    },
    Logger: vi.fn().mockImplementation(() => ({
        verbose: vi.fn(),
        warning: vi.fn(),
        error: vi.fn(),
    })),
}));

vi.mock('@langchain/qdrant', () => ({
    QdrantVectorStore: {
        fromExistingCollection: vi.fn().mockResolvedValue({
            asRetriever: vi.fn(),
        }),
    },
}));

describe('QdrantVectorStore', () => {
    let vectorStore: QdrantVectorStore;
    let embeddings: EmbeddingsInterface;

    beforeEach(async () => {
        vi.clearAllMocks();
        vectorStore = new QdrantVectorStore();
        embeddings = {} as EmbeddingsInterface;
        await vectorStore.initialize(embeddings);
    });

    it('should initialize correctly', async () => {
        expect(QdrantClient).toHaveBeenCalled();
        expect(vectorStore['client'].getCollection).toHaveBeenCalled();
        expect(vectorStore['logger'].verbose).toHaveBeenCalledWith(
            expect.stringContaining('Connecting to Qdrant'),
        );
        expect(vectorStore['vectorStore']).toBeDefined();
    });

    it('should save vector data', async () => {
        const entry = {
            id: '123',
            vector: new Float32Array([0.1, 0.2, 0.3]),
            content: 'Test content',
            metadata: { source: 'test' },
        };

        await vectorStore.saveVector(entry);

        expect(vectorStore['points'].length).toBe(1);
        expect(vectorStore['points'][0]).toEqual({
            id: '123',
            vector: Array.from(entry.vector),
            payload: { content: entry.content, metadata: entry.metadata },
        });
    });

    it('should send stored vectors to database', async () => {
        vectorStore['client'].upsert = vi.fn().mockResolvedValue({});

        vectorStore['points'].push({
            id: '123',
            vector: [0.1, 0.2, 0.3],
            payload: { content: 'Test content', metadata: { source: 'test' } },
        });

        await vectorStore.sendToDatabase();

        expect(vectorStore['client'].upsert).toHaveBeenCalled();
        expect(vectorStore['points']).toEqual([]);
    });

    it('should search vectors and return results', async () => {
        vectorStore['client'].search = vi.fn().mockResolvedValue([
            { id: '123', score: 0.9 },
            { id: '456', score: 0.8 },
        ]);

        const result = await vectorStore.searchVector(
            new Float32Array([0.1, 0.2, 0.3]),
        );

        expect(vectorStore['client'].search).toHaveBeenCalled();
        expect(result).toEqual([{ id: '123' }, { id: '456' }]);
    });

    it('should clear collection when requested', async () => {
        vectorStore['client'].deleteCollection = vi.fn().mockResolvedValue({});
        vectorStore['client'].createCollection = vi.fn().mockResolvedValue({});

        await vectorStore.clear();

        expect(vectorStore['client'].deleteCollection).toHaveBeenCalled();
        expect(vectorStore['client'].createCollection).toHaveBeenCalled();
    });
});
