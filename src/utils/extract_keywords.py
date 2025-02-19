import sys
import json
from keybert import KeyBERT

def extract_keywords(text, top_n=5):
    kw_model = KeyBERT()
    keywords = kw_model.extract_keywords(text, keyphrase_ngram_range=(1, 2), top_n=top_n)
    return [kw[0] for kw in keywords]

if __name__ == "__main__":
    try:
        # Captura argumentos da linha de comando
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No input provided"}))
            sys.exit(1)

        # Converte o argumento JSON para um dicionário
        data = json.loads(sys.argv[1])
        text = data.get("text", "")
        top_n = data.get("top_n", 5)

        if not text:
            print(json.dumps({"error": "No text provided"}))
            sys.exit(1)

        # Extração de palavras-chave
        keywords = extract_keywords(text, top_n)
        print(json.dumps(keywords))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
