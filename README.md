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
            token: process.env.HUGGINGFACE_HUB_TOKEN,
            localModelPath: './models',
            allowRemoteModels: true
        },
        tokenizer: {
            provider: "huggingface",
            model: "sentence-transformers/distilbert-base-nli-mean-tokens",
            indexSize: 768,
            useKeyBERT: false,
            chunkSize: 1000,
            chunkOverlap: 0,
            patterns: [
                //'../cmmv/**/*.ts',
                //'../cmmv/src/**/*.ts',
                //'../cmmv/packages/**/*.ts',
                //'../cmmv-*/**/*.ts',
                //'../cmmv-*/src/*.ts',
                //'../cmmv-*/src/**/*.ts',
                //'../cmmv-*/packages/**/*.ts',
                '../cmmv-*/**/*.md',
                '../cmmv-docs/docs/en/**/*.md'
            ],
            output: "./samples/data.bin",
            ignore: [
                "node_modules", "*.d.ts", "*.cjs",
                "*.spec.ts", "*.test.ts", "/tools/gulp/"
            ],
            exclude: [
                "cmmv-formbuilder", "cmmv-ui",
                "cmmv-language-tools", "cmmv-vue",
                "cmmv-reactivity", "cmmv-vite-plugin",
                "eslint.config.ts", "vitest.config.ts",
                "auto-imports.d.ts", ".d.ts", ".cjs",
                ".spec.ts", ".test.ts", "/tools/gulp/",
                "node_modules"
            ]
        },
        vector: {
            provider: "neo4j",
            qdrant: {
                url: 'http://localhost:6333',
                collection: 'embeddings'
            },
            neo4j: {
                url: "bolt://localhost:7687",
                username: process.env.NEO4J_USERNAME,
                password: process.env.NEO4J_PASSWORD,
                indexName: "vector",
                keywordIndexName: "keyword",
                nodeLabel: "Chunk",
                embeddingNodeProperty: "embedding"
            }
        },
        llm: {
            provider: "google",
            embeddingTopk: 10,
            model: "gemini-1.5-pro",
            textMaxTokens: 2048,
            apiKey: process.env.GOOGLE_API_KEY,
            language: 'pt-br'
        }
    }
};
```

| **Path**                                      | **Description**                                      | **Default Value / Example**                         |
|-----------------------------------------------|--------------------------------------------------|------------------------------------------------|
| `ai.huggingface.token`                        | API token for Hugging Face Hub                   | `process.env.HUGGINGFACE_HUB_TOKEN`            |
| `ai.huggingface.localModelPath`               | Path for local models                            | `./models`                                     |
| `ai.huggingface.allowRemoteModels`            | Allow downloading models from Hugging Face Hub  | `true`                                         |
| `ai.tokenizer.provider`                       | Tokenizer provider                              | `"huggingface"`                                |
| `ai.tokenizer.model`                          | Tokenizer model                                 | `"sentence-transformers/distilbert-base-nli-mean-tokens"` |
| `ai.tokenizer.indexSize`                      | Token embedding index size                      | `768`                                          |
| `ai.tokenizer.useKeyBERT`                     | Enable KeyBERT for keyword extraction          | `false`                                        |
| `ai.tokenizer.chunkSize`                      | Size of text chunks for processing             | `1000`                                         |
| `ai.tokenizer.chunkOverlap`                   | Overlap size between text chunks               | `0`                                            |
| `ai.tokenizer.patterns`                       | File patterns to scan for tokenization         | `['../cmmv-*/**/*.md', '../cmmv-docs/docs/en/**/*.md']` |
| `ai.tokenizer.output`                         | Output file for tokenized data                 | `"./samples/data.bin"`                         |
| `ai.tokenizer.ignore`                         | File patterns to ignore                        | `["node_modules", "*.d.ts", "*.cjs", "*.spec.ts", "*.test.ts", "/tools/gulp/"]` |
| `ai.tokenizer.exclude`                        | Files and directories to exclude               | `["cmmv-formbuilder", "cmmv-ui", "cmmv-language-tools", "cmmv-vue", "cmmv-reactivity", "cmmv-vite-plugin", "eslint.config.ts", "vitest.config.ts", "auto-imports.d.ts", ".d.ts", ".cjs", ".spec.ts", ".test.ts", "/tools/gulp/", "node_modules"]` |
| `ai.vector.provider`                          | Provider for vector storage                    | `"neo4j"`                                      |
| `ai.vector.qdrant.url`                        | Qdrant service URL                             | `"http://localhost:6333"`                      |
| `ai.vector.qdrant.collection`                 | Collection name for Qdrant                     | `"embeddings"`                                 |
| `ai.vector.neo4j.url`                         | Neo4j database URL                             | `"bolt://localhost:7687"`                      |
| `ai.vector.neo4j.username`                    | Neo4j username                                 | `process.env.NEO4J_USERNAME`                   |
| `ai.vector.neo4j.password`                    | Neo4j password                                 | `process.env.NEO4J_PASSWORD`                   |
| `ai.vector.neo4j.indexName`                   | Index name for vector storage                  | `"vector"`                                     |
| `ai.vector.neo4j.keywordIndexName`            | Index name for keyword search                  | `"keyword"`                                    |
| `ai.vector.neo4j.nodeLabel`                   | Label for vectorized nodes                     | `"Chunk"`                                      |
| `ai.vector.neo4j.embeddingNodeProperty`       | Property storing vector embeddings             | `"embedding"`                                  |
| `ai.llm.provider`                             | LLM provider                                  | `"google"`                                     |
| `ai.llm.embeddingTopk`                        | Number of top-k results for embeddings        | `10`                                           |
| `ai.llm.model`                                | LLM model name                                | `"gemini-1.5-pro"`                             |
| `ai.llm.textMaxTokens`                        | Maximum tokens per request                    | `2048`                                         |
| `ai.llm.apiKey`                               | API key for the LLM provider                  | `process.env.GOOGLE_API_KEY`                   |
| `ai.llm.language`                             | Default language                              | `"pt-br"`                                      |

## Download Models

### 1️⃣ **Install Python**

Before installing the Hugging Face CLI, ensure that **Python** is installed on your system.

Run the following command to install Python on Ubuntu:

```sh
sudo apt update && sudo apt install python3 python3-pip -y
```

For other operating systems, refer to the official [Python download page](https://www.python.org/downloads/).

### 2️⃣ **Install Hugging Face CLI**
Once Python is installed, install the Hugging Face CLI using **pip**:

```sh
pip3 install -U "huggingface_hub[cli]"
```

### 3️⃣ **Ensure the CLI is Recognized**

If your terminal does not recognize `huggingface-cli`, add `~/.local/bin` to your system **PATH**:

```sh
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Run the following command to verify installation:

```sh
huggingface-cli --help
```

If the command works, the installation was successful! 🎉

### 4️⃣ **Authenticate with Hugging Face**

To access and download models, you need to authenticate.

Run:

```sh
huggingface-cli login
```

You will be prompted to enter your **Hugging Face access token**.  
Generate one at: [Hugging Face Tokens](https://huggingface.co/settings/tokens)  
Ensure the token has **READ** permissions.

## 📥 **Downloading Models**

To download a model, use the following command:

```sh
huggingface-cli download meta-llama/CodeLlama-7B-Python-hf --local-dir ./models/CodeLlama-7B
```

This will download the **CodeLlama 7B Python** model into the `./models/CodeLlama-7B` directory.

For **CMMV**, set the model path in `.cmmv.config.cjs`:

```js
huggingface: {
    token: process.env.HUGGINGFACE_HUB_TOKEN,
    localModelPath: './models',
    allowRemoteModels: false
},
tokenizer: {
    provider: "huggingface",
    model: "sentence-transformers/distilbert-base-nli-mean-tokens",
    indexSize: 768,
    chunkSize: 1000,
    chunkOverlap: 0,
},
llm: {
    provider: "google",
    embeddingTopk: 10,
    model: "gemini-1.5-pro",
    textMaxTokens: 2048,
    apiKey: process.env.GOOGLE_API_KEY,
    language: 'pt-br'
}
```

Now your environment is set up to use Hugging Face models with **CMMV**! 🚀

## 🔄 Converting Models

Some **LLMs (Large Language Models)** are not natively compatible with all inference frameworks. A key example is **Google’s Gemma**, which is not directly supported by many tools. To use such models efficiently, you need to **convert them to ONNX format**.

ONNX (**Open Neural Network Exchange**) is an open format that optimizes models for efficient inference across multiple platforms. Many inference frameworks, such as **ONNX Runtime**, **TensorRT**, and **OpenVINO**, support ONNX for faster and more scalable deployment.

Before converting, install the necessary packages:

```sh
pip install -U "optimum[exporters]" onnx onnxruntime
```

To convert **Google's Gemma 2B model**, run:

```sh
python3 -m optimum.exporters.onnx --model google/gemma-2b ./models/gemma-2b-onnx
```

## Common Embedding Models

| **Embedding**   | **Default Model**                     | **Requires API Key** |
|----------------|-------------------------------------|---------------------|
| Cohere        | embed-english-v3.0                 | No                  |
| DeepInfra     | -                                   | Yes                 |
| Doubao        | -                                   | Yes                 |
| Fireworks     | nomic-ai/nomic-embed-text-v1.5     | Yes                 |
| HuggingFace   | Xenova/all-MiniLM-L6-v2            | No                  |
| LlamaCpp      | (requires local model file)      | No                  |
| OpenAI        | text-embedding-3-large             | Yes                 |
| Pinecone      | multilingual-e5-large              | No                  |
| Tongyi        | -                                   | Yes                 |
| Watsonx       | -                                   | Yes                 |

*[https://huggingface.co/models?pipeline_tag=feature-extraction&library=transformers.js&sort=downloads](https://huggingface.co/models?pipeline_tag=feature-extraction&library=transformers.js&sort=downloads)*

## Others Embeddings Support

| Name      | Model                                      | Documentation Link |
|-----------|-------------------------------------------|--------------------|
| OpenAI    | text-embedding-3-large                   | [OpenAI](https://js.langchain.com/docs/integrations/text_embedding/openai/) |
| Google    | gemini-pro                               | [Google](https://js.langchain.com/docs/integrations/text_embedding/google_generativeai/) |
| Pinecone  | multilingual-e5-large                    | [Pinecone](https://js.langchain.com/docs/integrations/text_embedding/pinecone/) |
| Cohere    | embed-english-v3.0                       | [Cohere](https://js.langchain.com/docs/integrations/text_embedding/cohere/) |
| LlamaCpp  | gguf-llama3-Q4_0.bin                     | [LlamaCpp](https://js.langchain.com/docs/integrations/text_embedding/llama_cpp/) |

## 🧠 Tokenization - Extracting Code for RAG 

The **Tokenizer** class scans directories, extracts tokens, and generates vector embeddings using a `transformers` model.  

### 📌 **Example Usage:**
```typescript
import { Application, Hook, HooksType } from '@cmmv/core';

class TokenizerSample {
    @Hook(HooksType.onInitialize)
    async start() {
        const { Tokenizer } = await import('@cmmv/ai');
        const tokenizer = new Tokenizer();
        tokenizer.start();
    }
}

Application.exec({
    services: [TokenizerSample],
});
```

### 🔹 **How It Works**
1. **Scans project directories** based on the `patterns` config.
2. **Parses TypeScript/JavaScript/Markdown files**, extracting **functions, classes, enums, interfaces, constants, and decorators**.
3. **Generates embeddings** using Hugging Face models.
4. **Stores the dataset** in a binary `.bin` file.

## 🔍 Using KeyBERT

KeyBERT is an optional feature that enhances indexing by extracting relevant keywords. It helps refine search results in **FAISS** or vector databases, improving the accuracy of **LLM queries**.

Unlike **TF-IDF**, **YAKE!**, or **RAKE**, which rely on statistical methods, **KeyBERT** leverages **BERT embeddings** to generate more meaningful keywords. This results in better search filtering, leading to more precise **LLM-based responses**.

If KeyBERT is **not enabled**, the default keyword extraction method will be **TF-IDF**, which may not be as accurate but is significantly faster.

Before using KeyBERT, ensure you have **Python 3** installed. Then, install KeyBERT using **pip**:

```bash
pip install keybert
```

Once installed, KeyBERT will be used **during tokenization** to generate **filtering keywords**. These keywords improve the ranking of indexed content, making vector-based search results more relevant.

If you prefer **faster processing**, you can disable KeyBERT, and the system will fall back to **TF-IDF**.

To enable **KeyBERT**, update your `.cmmv.config.cjs` file:

```javascript
module.exports = {
    ai: {
        tokenizer: {
            useKeyBERT: true // Set to false to use TF-IDF instead
        }
    }
};
```

With **KeyBERT enabled**, search filtering becomes more **context-aware**, leading to more **accurate LLM responses**.

For more details on KeyBERT, visit: [KeyBERT Documentation](https://github.com/MaartenGr/KeyBERT).

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
