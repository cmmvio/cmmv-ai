import { Application, Hook, HooksType } from '@cmmv/core';

import { AIModule } from './index';

class TokenizerSample {
  @Hook(HooksType.onInitialize)
  async start() {
    const { Tokenizer } = await import('./tokenizer.provider');
    const tokenizer = new Tokenizer();
    tokenizer.start();
  }
}

Application.exec({
  modules: [AIModule],
  services: [TokenizerSample],
});
