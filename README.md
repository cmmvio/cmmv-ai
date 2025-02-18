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

## 🚀 Features  
✅ **Tokenization & Code Mapping** – Extracts structured tokens from TypeScript/JavaScript files.  
✅ **RAG Dataset Creation** – Generates binary datasets for vector search.  
✅ **Vector Search with FAISS & Vector Databases** – Supports **Qdrant, Milvus, Neo4j**.  
✅ **Hugging Face Integration** – Uses `transformers` for embeddings.  
✅ **Custom Embedding Models** – Supports `WhereIsAI/UAE-Large-V1`, `MiniLM`, `CodeLlama`, `DeepSeek`, and others.  
✅ **Future Database Integration** – Plans for **Elasticsearch, Pinecone, etc.**  


## ⚙ Configuration  

The module is configured via a `.cmmv.config.cjs` file (or equivalent environment variables).  

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
        },
        vector: {
            provider: "qdrant", // Available: "qdrant", "milvus", "neo4j"
            qdrant: { url: "http://localhost:6333", collection: "embeddings" },
            milvus: { url: "localhost:19530" },
            neo4j: { url: "bolt://localhost:7687", user: "neo4j", password: "password" }
        }
    }
};
```

| Config Option           | Description |
|-------------------------|------------|
| `huggingface.token`     | API token for Hugging Face models. |
| `tokenizer.indexSize`    | Embedding Dimenions. |
| `tokenizer.patterns`    | File search patterns for tokenization. |
| `tokenizer.embeddingModel` | Default embedding model (`WhereIsAI/UAE-Large-V1`, `mixedbread-ai/mxbai-embed-large-v1`, etc.). |
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

## 🧠 Tokenization - Extracting Code for RAG 

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

## 📂 Dataset - FAISS & Vector Storage

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

# 🧠 Vector Database Integration

To efficiently store and search **embeddings**, `@cmmv/ai` supports **Qdrant, Weaviate, Milvus, and Neo4j**.

### **🔹 Supported Vector Databases**
| Database  | Open Source | Node.js Support | Storage Backend | Similarity Search |
|-----------|------------|----------------|-----------------|-------------------|
| **Qdrant** | ✅ Yes | ✅ Yes (`@qdrant/js-client-rest`) | Disk/Memory | Cosine, Euclidean, Dot Product |
| **Milvus** | ✅ Yes | ✅ Yes (`@zilliz/milvus2-sdk-node`) | Disk/Memory | IVF_FLAT, HNSW, PQ |
| **Neo4j** | ✅ Yes (Community) | ✅ Yes (`neo4j-driver`) | GraphDB | Cypher-based vector search |

To run these databases locally, use the following **Docker commands**:

### **🔹 Qdrant**
```bash
docker run -p 6333:6333 --name qdrant-server qdrant/qdrant
```
- Runs a **Qdrant** server on port `6333`.
- API available at `http://localhost:6333`.

### **🔹 Milvus**
```bash
docker run -p 19530:19530 --name milvus-server milvusdb/milvus
```
- Runs **Milvus** on port `19530`.
- Requires **Python/Node SDK** for interaction.

### **🔹 Neo4j**
```bash
docker run --publish=7474:7474 --publish=7687:7687 --volume=$HOME/neo4j/data:/data --name neo4j-server neo4j
```
- Runs **Neo4j** on ports `7474` (HTTP) and `7687` (Bolt).
- Data is stored persistently in `$HOME/neo4j/data`.

## 🔥 Future Integration - Using LLMs with RAG 

The next step is integrating **pre-trained models** for **code understanding and generation** using the tokenized dataset.

## 📖 **Roadmap**
- [x] Tokenization of **functions, classes, interfaces, decorators**.
- [x] **FAISS-based vector search** for in-memory retrieval.
- [ ] Integration with **Qdrant, Milvus, Neo4j**.
- [ ] Adding support for **Elasticsearch, Pinecone**.
- [ ] Using **DeepSeek Code** for **LLM-powered code generation**.

## 📚 **References**
- **Qdrant:** [Qdrant Documentation](https://qdrant.tech/documentation/)  
- **Weaviate:** [Weaviate Documentation](https://weaviate.io/developers/weaviate)  
- **Milvus:** [Milvus Documentation](https://milvus.io/docs/)  
- **Neo4j:** [Neo4j Documentation](https://neo4j.com/developer/)  
