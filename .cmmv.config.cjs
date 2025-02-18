require('dotenv').config();

module.exports = {
    env: process.env.NODE_ENV,

    ai: {
        huggingface: {
            token: process.env.HUGGINGFACE_HUB_TOKEN
        },
        tokenizer: {
            indexSize: 1024,
            patterns: [
                '../cmmv-*/**/*.ts',
                '../cmmv-*/src/*.ts',
                '../cmmv-*/src/**/*.ts',
                '../cmmv-*/packages/**/*.ts'
            ],
            embeddingModel: process.env.EMBEDDING_MODEL || "WhereIsAI/UAE-Large-V1",
            output: "./samples/data.bin",
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
            provider: "qdrant",
            qdrant: {
                url: 'http://localhost:6333',
                collection: 'embeddings'
            }
        }
    }
};
