//@ts-nocheck
import { Application, Hook, HooksType } from '@cmmv/core';

class DatasetSample {
    @Hook(HooksType.onInitialize)
    async start() {
        const { Dataset } = await import('../src/dataset.provider');
        const { Search } = await import('../src/search.provider');

        const dataset = new Dataset();
        await dataset.load();
        await dataset.loadAdapter();
        //await dataset.migrationToDatabase();
        const search = new Search(dataset);
        await search.initialize();
        const result = await search.find("como criar um controller do cmmv ?")
    }
}

Application.exec({
    services: [DatasetSample],
});
