<p align="center">
  <a href="https://cmmv.io/" target="blank"><img src="https://raw.githubusercontent.com/cmmvio/docs.cmmv.io/main/public/assets/logo_CMMV2_icon.png" width="300" alt="CMMV Logo" /></a>
</p>
<p align="center">Contract-Model-Model-View (CMMV) <br/> Building scalable and modular applications using contracts.</p>
<p align="center">
    <a href="https://www.npmjs.com/package/@cmmv/core"><img src="https://img.shields.io/npm/v/@cmmv/core.svg" alt="NPM Version" /></a>
    <a href="https://github.com/cmmvio/cmmv/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@cmmv/core.svg" alt="Package License" /></a>
</p>

<p align="center">
  <a href="https://cmmv.io">Documentation</a> &bull;
  <a href="https://github.com/cmmvio/cmmv/issues">Report Issue</a>
</p>

`@cmmv/ai` is a module for integrating **LLMs (Large Language Models)** with **tokenization, dataset creation for RAG (Retrieval-Augmented Generation)**, and **FAISS-based vector search**. It allows efficient **code indexing and semantic search** for models like **CodeLlama** and **DeepSeek Code**.  

## 🚀 **Features**  
✅ **Tokenization & Code Mapping** – Extracts structured tokens from TypeScript/JavaScript files.  
✅ **RAG Dataset Creation** – Generates binary datasets for vector search.  
✅ **Vector Search with FAISS** – In-memory search for fast retrieval.  
✅ **Hugging Face Integration** – Uses `transformers` for embeddings.  
✅ **Custom Embedding Models** – Supports `Xenova/all-MiniLM-L6-v2`, `CodeLlama`, `DeepSeek`, and others.  
✅ **Future Database Integration** – Plans for **Neo4j, Elasticsearch, Pinecone, etc.**  


## ⚙ **Configuration (`.cmmv.config.js`)**  

The module is configured via a `.cmmv.config.js` file (or equivalent environment variables).  

```javascript
require('dotenv').config();

module.exports = {
    env: process.env.NODE_ENV,

    ai: {
        huggingface: {
            token: process.env.HUGGINGFACE_HUB_TOKEN
        },
        tokenizer: {
            patterns: [
                '../cmmv-*/**/*.ts',
                '../cmmv-*/src/*.ts',
                '../cmmv-*/src/**/*.ts',
                '../cmmv-*/packages/**/*.ts'
            ],
            indexSize: 1024,
            embeddingModel: process.env.EMBEDDING_MODEL || "Xenova/all-MiniLM-L6-v2",
            output: "./data.bin",
            ignore: [
                "node_modules", "*.d.ts", "*.cjs",
                "*.spec.ts", "*.test.ts"
            ],
            exclude: [
                "cmmv-formbuilder", "cmmv-ui",
                "cmmv-language-tools", "cmmv-vue",
                "cmmv-reactivity"
            ]
        }
    }
};
```

| Config Option           | Description |
|-------------------------|------------|
| `huggingface.token`     | API token for Hugging Face models. |
| `tokenizer.indexSize`    | Embedding Dimenions. |
| `tokenizer.patterns`    | File search patterns for tokenization. |
| `tokenizer.embeddingModel` | Default embedding model (`MiniLM`, `CodeLlama`, `DeepSeek`, etc.). |
| `tokenizer.output`      | Path to save the binary dataset. |
| `tokenizer.ignore`      | List of ignored files/extensions. |
| `tokenizer.exclude`     | List of excluded submodules. |

## Common Embedding Models

| Model Name                                   | Downloads   | Embedding Dimenions   |
|----------------------------------------------|------------|--------------------------|
| WhereIsAI/UAE-Large-V1                       | 3.07m        | 1024                      |
| mixedbread-ai/mxbai-embed-large-v1           | 1.06m        | 1024                      |
| Xenova/bge-base-en-v1.5                      | 910k        | 768                      |
| Supabase/gte-small                           | 453k        | 384                      |
| Xenova/all-MiniLM-L6-v2                      | 226k        | 384                      |
| Xenova/all-mpnet-base-v2                     | 124k        | 768                      |
| Xenova/paraphrase-multilingual-MiniLM-L12-v2 | 101k        | 384                      |
| Supabase/all-MiniLM-L6-v2                    | 99.7k        | 384                      |

*[https://huggingface.co/models?pipeline_tag=feature-extraction&library=transformers.js&sort=downloads](https://huggingface.co/models?pipeline_tag=feature-extraction&library=transformers.js&sort=downloads)*

## 🧠 **Tokenization - Extracting Code for RAG**  

The **Tokenizer** class scans directories, extracts tokens, and generates vector embeddings using a `transformers` model.  

### 📌 **Example Usage:**
```typescript
import { Application, Hook, HooksType } from '@cmmv/core';
import { AIModule } from '@cmmv/ai';

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
```

### 🔹 **How It Works**
1. **Scans project directories** based on the `patterns` config.
2. **Parses TypeScript/JavaScript files**, extracting **functions, classes, enums, interfaces, constants, and decorators**.
3. **Generates embeddings** using Hugging Face models.
4. **Stores the dataset** in a binary `.bin` file.


## 📂 **Dataset - FAISS & Vector Storage**  

The **Dataset** class manages **vectorized storage** for quick retrieval.  

### 🔹 **Current Functionality**
✅ Saves embeddings in **binary format** (`.bin`).  
✅ In-memory **FAISS-based search**.  
✅ Future support for **Neo4j, Elasticsearch, Pinecone**.  

### 📌 **Dataset Storage Example**
```typescript
const dataset = new Dataset();
dataset.save(); // Saves the dataset in binary format
dataset.load(); // Loads the dataset into memory
```


## 🔥 **Future Integration - Using LLMs with RAG**  

The next step is integrating **pre-trained models** for **code understanding and generation** using the tokenized dataset.

### **Planned LLM Support**
✅ **DeepSeek Code**  
✅ **CodeLlama**  
✅ **Other Hugging Face models**  

### **Planned Vector Database Support**
✅ **Neo4j**  
✅ **Elasticsearch**  
✅ **Pinecone / Weaviate**  

## 📖 **Roadmap**
- [x] Tokenization of **functions, classes, interfaces, decorators**.
- [x] **FAISS-based vector search** for in-memory retrieval.
- [ ] Integration with **vector databases** (Neo4j, Elasticsearch).
- [ ] Using **DeepSeek Code** for **LLM-powered code generation**.
