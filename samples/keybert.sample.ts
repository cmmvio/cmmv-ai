import { extractKeywords } from "../src/keybert.util";

(async () => {
    const keywords = await extractKeywords("No CMMV, um Controller é uma classe que gerencia requisições HTTP e interage com serviços.");
    console.log(keywords);
})();
