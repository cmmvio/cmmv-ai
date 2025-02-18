//@ts-nocheck
import { Application, Hook, HooksType } from '@cmmv/core';

class DatasetSample {
    @Hook(HooksType.onInitialize)
    async start() {
        const { Dataset } = await import('../src/dataset.provider')
        const dataset = new Dataset();
        dataset.load();
    }
}

Application.exec({
    services: [DatasetSample],
});
