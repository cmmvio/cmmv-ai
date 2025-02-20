import { Config, Logger } from '@cmmv/core';
import { AbstractEmbedding } from './embedding.abstract';

export class PineconeEmbedding extends AbstractEmbedding {
  protected logger = new Logger('PineconeEmbedding');

  public override async initialize() {
    const { PineconeEmbeddings } = await import('@langchain/pinecone');
    const model = Config.get('ai.tokenizer.model');
    this.embedder = new PineconeEmbeddings({ model: model });
    this.logger.verbose(`Start Model: ${model}`);
  }
}
