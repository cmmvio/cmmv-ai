import { ConfigSchema } from '@cmmv/core';

export const AIConfig: ConfigSchema = {
    ai: {
        huggingface: {
            required: false,
            type: 'object',
            properties: {
                token: {
                    type: 'string',
                    required: false
                }
            }
        },
        tokenizer: {
            type: 'object',
            required: false,
            properties: {
                indexSize: {
                    type: 'number',
                    required: false
                },
                patterns: {
                    type: 'array',
                    required: false
                },
                ignore: {
                    type: 'array',
                    required: false
                },
                exclude: {
                    type: 'array',
                    required: false
                },
                embeddingModel: {
                    type: 'string',
                    required: true
                },
                output: {
                    type: 'string',
                    required: false
                }
            }
        },
        vector: {
            type: "object",
            required: true,
            properties: {
                provider: {
                    type: "string",
                    required: true
                },
                qdrant: {
                    type: "object",
                    required: false,
                    properties: {
                        url: {
                            type: "string",
                            required: false
                        },
                        collection: {
                            type: "string",
                            required: false
                        },
                    }
                },
                weaviate: {
                    type: "object",
                    required: false,
                    properties: {
                        url: {
                            type: "string",
                            required: false
                        }
                    }
                },
                milvus: {
                    type: "object",
                    required: false,
                    properties: {
                        url: {
                            type: "string",
                            required: false
                        }
                    }
                },
                neo4j: {
                    type: "object",
                    required: false,
                    properties: {
                        url: {
                            type: "string",
                            required: false
                        },
                        user: {
                            type: "string",
                            required: false
                        },
                        password: {
                            type: "string",
                            required: false
                        }
                    }
                }
            }
        }
    },
};
