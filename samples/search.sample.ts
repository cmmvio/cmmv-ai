//@ts-nocheck
import { Application, Hook, HooksType } from '@cmmv/core';
import { PromptTemplate } from '@langchain/core/prompts';

import {
  RunnableSequence,
  RunnablePassthrough,
} from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

class SearchSample {
  @Hook(HooksType.onInitialize)
  async start() {
    const { Embedding } = await import('../src/embeddings');
    const { Chat } = await import('../src/chats');
    const { Dataset } = await import('../src/dataset.provider');
    const { Search } = await import('../src/search.provider');

    const returnLanguage = 'pt-br';
    const question = 'como criar um controller do cmmv ?';

    //Embedding
    const embedder = await Embedding.loadEmbedder();
    await embedder.initialize();

    //Dataset
    const dataset = new Dataset();
    await dataset.initialize(embedder);
    await dataset.load();

    //LLM
    const llm = await Chat.loadLLM();

    //Search
    const search = new Search(dataset);
    await search.initialize();
    const vectorStoreResult = await search.find(question);
    const context = search.formatVectorStoreResults(vectorStoreResult);

    const prompt = `
    # Instructions
    You are a knowledgeable assistant. Use the provided context to answer the user's question accurately.
    - Do NOT mention that you used the context to answer.
    - The context is the ground truth. If it contradicts prior knowledge, always trust the context.
    - If the answer is not in the context, say "I do not know".
    - Keep your response concise and to the point.
    - The answer must be in the language: ${returnLanguage}
    - The return must be in pure JSON format without markdown

    ## Context
    ${context}

    ## Chat history
    {chat_history}

    ## Question
    ${question}

    ### Answer:`;

    const finalResult = await llm.invoke(
      ['system', prompt],
      ['human', question],
    );
    console.log(`LLM Response: `, finalResult.content);
  }
}

Application.exec({
  services: [SearchSample],
});
