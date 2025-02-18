//@ts-nocheck
import { Application, Hook, HooksType } from '@cmmv/core';

import { Tokenizer } from '../src/index';

class TokenizerSample {
    @Hook(HooksType.onInitialize)
    async start() {
        const tokenizer = new Tokenizer();
        tokenizer.start();
    }
}

Application.exec({
    services: [TokenizerSample],
});
