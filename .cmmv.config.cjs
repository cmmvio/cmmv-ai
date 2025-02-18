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
