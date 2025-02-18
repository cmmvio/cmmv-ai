import { Application, Hook, HooksType } from '@cmmv/core';

import { AIModule, Tokenizer } from '../src/index';

class TokenizerSample {
  @Hook(HooksType.onInitialize)
  async start() {
    const tokenizer = new Tokenizer();
    tokenizer.start();
  }
}

Application.exec({
  modules: [AIModule],
  services: [TokenizerSample],
});
