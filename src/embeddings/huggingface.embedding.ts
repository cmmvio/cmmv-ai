import { Config, Logger } from '@cmmv/core';
import { AbstractEmbedding } from './embedding.abstract';

export class HuggingFaceEmbedding extends AbstractEmbedding {
  protected logger = new Logger('HuggingFaceEmbedding');

  public override async initialize() {
    const { HuggingFaceTransformersEmbeddings } = await import(
      '@langchain/community/embeddings/huggingface_transformers'
    );
    const model = Config.get('ai.tokenizer.model', 'Xenova/all-MiniLM-L6-v2');
    this.embedder = new HuggingFaceTransformersEmbeddings({ model });
    this.logger.verbose(`Start Model: ${model}`);
  }
}
