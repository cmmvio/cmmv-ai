import * as path from "node:path";
import { Service, Config, Logger } from '@cmmv/core';

@Service('ai-models')
export class Models {
    private logger = new Logger('Models');

    async load() {
        const ExecaApi = Function('return import("execa")')();
        const { execa } = await ExecaApi;

        const TransformersApi = Function('return import("@xenova/transformers")')();
        const { pipeline, env } = await TransformersApi;

        const localModelPath = path.resolve(Config.get<string>('ai.huggingface.localModelPath', "./models"));
        const allowRemoteModels = Config.get<boolean>('ai.huggingface.allowRemoteModels', true);
        const embeddingModel = Config.get<boolean>('ai.tokenizer.embeddingModel');

        process.env.TRANSFORMERS_VERBOSITY = "off";
        process.env.HUGGINGFACE_HUB_CACHE = localModelPath;
        process.env.ORT_LOG_SEVERITY_LEVEL = "3";
        env.localModelPath = localModelPath;
        env.allowRemoteModels = allowRemoteModels;

        const run = async (bin, args, opts = {}) => {
            try {
                await execa(bin, args, { stdio: 'inherit', ...opts });
            } catch (err) {
                this.logger.error(err.message);
                process.exit(1);
            }
        };

        run("huggingface-cli", ['download', embeddingModel, '--local-dir', `${localModelPath}/${embeddingModel.split("/")[1]}`]);

        //run("python", ['-m', 'convert.py', '--quantize', '--model_id', embeddingModel]);
    }
}
