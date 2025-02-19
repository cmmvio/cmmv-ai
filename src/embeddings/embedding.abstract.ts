
import { Logger } from "@cmmv/core";
import { Embeddings } from '@langchain/core/embeddings';

export abstract class AbstractEmbedding {
    protected embedder: Embeddings;
    protected logger: Logger;

    public initialize() {}

    public embedQuery(document: string) {
        return this.embedder.embedQuery(document);
    }

    public embedDocuments(document: string[]){
        return this.embedder.embedDocuments(document);
    }
}
