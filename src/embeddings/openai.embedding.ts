import { Config, Logger } from '@cmmv/core';
import { AbstractEmbedding } from './embedding.abstract';

export class OpenAIEmbedding extends AbstractEmbedding {
  protected logger = new Logger('OpenAIEmbedding');

  public override async initialize() {
    const { OpenAIEmbeddings } = await import('@langchain/openai');
    const model = Config.get('ai.tokenizer.model', 'text-embedding-3-large');
    this.embedder = new OpenAIEmbeddings({ model: model });
    this.logger.verbose(`Start Model: ${model}`);
  }
}
