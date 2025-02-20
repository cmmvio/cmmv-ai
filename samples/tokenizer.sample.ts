//@ts-nocheck
import { Application, Hook, HooksType } from '@cmmv/core';

import { Tokenizer } from '../src/main';

class TokenizerSample {
  @Hook(HooksType.onInitialize)
  async start() {
    const tokenizer = new Tokenizer();
    tokenizer.initialize();
  }
}

Application.exec({
  services: [TokenizerSample],
});
