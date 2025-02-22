import { Logger } from '@cmmv/core';
import { Embeddings } from '@langchain/core/embeddings';

export abstract class AbstractEmbedding {
    protected embedder: Embeddings;
    protected logger: Logger;

    public initialize() {}

    public getInterfaceEmbedder(): Embeddings {
        return this.embedder;
    }

    public embedQuery(document: string): Promise<number[]> {
        return this.embedder.embedQuery(document);
    }

    public embedDocuments(document: string[]): Promise<number[][]> {
        return this.embedder.embedDocuments(document);
    }
}
