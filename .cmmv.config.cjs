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
            chunkSize: 2000,
            chunkOverlap: 100,
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
            provider: "elastic",
            qdrant: {
                url: 'http://localhost:6333',
                collection: 'embeddings'
            },
            elastic: {
                url: "http://127.0.0.1:9200",
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
            embeddingTopk: 20,
            model: "gemini-1.5-pro",
            textMaxTokens: 2048,
            apiKey: process.env.GOOGLE_API_KEY,
            language: 'pt-br'
        }
    }
};
