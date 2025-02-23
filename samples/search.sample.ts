//@ts-nocheck
import { Application, Hook, HooksType } from '@cmmv/core';

import {
    PromptTemplate,
    RunnableSequence,
    RunnablePassthrough,
    StringOutputParser,
    Embedding,
    Dataset,
    Search,
} from '../src/main';

class SearchSample {
    @Hook(HooksType.onInitialize)
    async start() {
        const question = 'como criar um controller do cmmv ?';

        const search = new Search();
        await search.initialize();

        const finalResult = await search.invoke(question);
        console.log(`LLM Response: `, finalResult.content);
    }
}

Application.exec({
    services: [SearchSample],
});
