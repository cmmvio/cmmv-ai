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
                },
                localModelPath: {
                    type: 'string',
                    required: false
                },
                allowRemoteModels: {
                    type: 'boolean',
                    required: false,
                    default: true
                }
            }
        },
        tokenizer: {
            type: 'object',
            required: false,
            properties: {
                provider: {
                    type: 'string',
                    required: true,
                    default: "huggingface"
                },
                embeddingModel: {
                    type: 'string',
                    required: true,
                    default: "sentence-transformers/all-mpnet-base-v2"
                },
                indexSize: {
                    type: 'number',
                    required: true,
                    default: 768
                },
                chunkSize: {
                    type: 'number',
                    required: false,
                    default: 500
                },
                chunkOverlap: {
                    type: 'number',
                    required: false,
                    default: 0
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
                output: {
                    type: 'string',
                    required: true
                },
                useKeyBERT: {
                    type: 'boolean',
                    required: false,
                    default: false
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
