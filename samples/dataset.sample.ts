//@ts-nocheck
import { Application, Hook, HooksType } from '@cmmv/core';

class DatasetSample {
    @Hook(HooksType.onInitialize)
    async start() {
        const { Dataset } = await import('../src/dataset.provider')
        const dataset = new Dataset();
        await dataset.load();
        await dataset.loadAdapter();
        await dataset.migrationToDatabase();
    }
}

Application.exec({
    services: [DatasetSample],
});
