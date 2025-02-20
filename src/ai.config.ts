import { ConfigSchema } from '@cmmv/core';

export const AIConfig: ConfigSchema = {
  ai: {
    huggingface: {
      required: false,
      type: 'object',
      properties: {
        token: {
          type: 'string',
          required: false,
        },
        localModelPath: {
          type: 'string',
          required: false,
        },
        allowRemoteModels: {
          type: 'boolean',
          required: false,
          default: true,
        },
      },
    },
    tokenizer: {
      type: 'object',
      required: false,
      properties: {
        provider: {
          type: 'string',
          required: true,
          default: 'huggingface',
        },
        embeddingModel: {
          type: 'string',
          required: true,
          default: 'Xenova/all-MiniLM-L6-v2',
        },
        indexSize: {
          type: 'number',
          required: true,
          default: 384,
        },
        chunkSize: {
          type: 'number',
          required: false,
          default: 2000,
        },
        chunkOverlap: {
          type: 'number',
          required: false,
          default: 200,
        },
        patterns: {
          type: 'array',
          required: false,
        },
        ignore: {
          type: 'array',
          required: false,
        },
        exclude: {
          type: 'array',
          required: false,
        },
        output: {
          type: 'string',
          required: true,
        },
        useKeyBERT: {
          type: 'boolean',
          required: false,
          default: false,
        },
      },
    },
    vector: {
      type: 'object',
      required: true,
      properties: {
        provider: {
          type: 'string',
          required: true,
          default: 'faiss',
        },
        qdrant: {
          type: 'object',
          required: false,
          properties: {
            url: {
              type: 'string',
              required: false,
            },
            collection: {
              type: 'string',
              required: false,
            },
            apiKey: {
              type: 'string',
              required: false,
            },
            options: {
              type: 'object',
              required: false,
              default: {},
            },
          },
        },
      },
    },
  },
};
