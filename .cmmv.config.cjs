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
            indexSize: 384,
            useKeyBERT: true,
            patterns: [
                '../cmmv/**/*.ts',
                '../cmmv/src/**/*.ts',
                '../cmmv/packages/**/*.ts',
                '../cmmv-*/**/*.ts',
                '../cmmv-*/src/*.ts',
                '../cmmv-*/src/**/*.ts',
                '../cmmv-*/packages/**/*.ts',
                '../cmmv-docs/docs/en/**/*.md'
            ],
            embeddingModel: "Xenova/all-MiniLM-L6-v2",
            output: "./samples/data.bin",
            ignore: [
                "node_modules", "*.d.ts", "*.cjs",
                "*.spec.ts", "*.test.ts", "/tools/gulp/"
            ],
            exclude: [
                "cmmv-formbuilder", "cmmv-ui",
                "cmmv-language-tools", "cmmv-vue",
                "cmmv-reactivity", "cmmv-vite-plugin",
                "eslint.config.ts", "vitest.config.ts"
            ]
        },
        vector: {
            provider: "faiss",
            qdrant: {
                url: 'http://localhost:6333',
                collection: 'embeddings'
            }
        },
        search: {
            embeddingTopk: 10,
            useCodeModel: true,
            codeModel: "Xenova/codegen-350M-mono",
            codeMaxTokens: 328,
            textModel: "google-bert/bert-base-uncased",
            textMaxTokens: 4000,
            baseCodeQuestion: ""
        }
    }
};
