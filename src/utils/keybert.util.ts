import * as path from 'path';

export async function extractKeywords(text, top_n = 5) {
    try {
        const ExecaApi = Function('return import("execa")')();
        const { $ } = await ExecaApi;
        const scriptPath = path.resolve('./src/utils/extract_keywords.py');
        const { stdout: keywords } =
            await $`python3 ${scriptPath} ${JSON.stringify({ text, top_n })}`;
        const result = JSON.parse(keywords);
        return result.keywords || [];
    } catch (error) {
        console.error('Error extracting keywords:', error);
        return [];
    }
}
