//@ts-nocheck
import { Application, Hook, HooksType } from '@cmmv/core';
import { env } from '@huggingface/transformers';

class DownloadSample {
    @Hook(HooksType.onInitialize)
    async start() {
        const { Models } = await import('../src/models.provider');
        const models = new Models();
        await models.load();
    }
}

Application.exec({
    services: [DownloadSample],
});
