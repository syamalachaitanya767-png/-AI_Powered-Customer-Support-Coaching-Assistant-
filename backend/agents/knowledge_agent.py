import sys
try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

try:
    import truststore
    truststore.inject_into_ssl()
except Exception:
    pass

import threading
import math
import os

from pathlib import Path

from services.openrouter_service import generate_response
from prompts.knowledge_prompt import SYSTEM_PROMPT

BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = str(BASE_DIR / "vector_db")

_db_lock = threading.Lock()
_embedding = None
_vectordb = None


def get_vectordb():
    """
    Lazy-load vector database and embedding model on demand to allow
    instant startup of the backend Flask server without import blocking.
    """
    global _embedding, _vectordb
    if _vectordb is None:
        with _db_lock:
            if _vectordb is None:
                print("\n" + "=" * 60)
                print("[RAG Engine] Loading Chroma Vector DB & Embeddings...")
                print("=" * 60)
                
                from langchain_chroma import Chroma
                from langchain_huggingface import HuggingFaceEmbeddings

                _embedding = HuggingFaceEmbeddings(
                    model_name="sentence-transformers/all-MiniLM-L6-v2"
                )

                _vectordb = Chroma(
                    persist_directory=DB_PATH,
                    embedding_function=_embedding
                )

                try:
                    count = _vectordb._collection.count()
                    print(f"[RAG Engine] Vector DB loaded with {count} indexed chunks.")
                except Exception:
                    pass
                print("=" * 60 + "\n")

    return _vectordb


def get_knowledge(customer_message):

    print("\n")
    print("=" * 70)
    print("Customer Question:")
    print(customer_message)
    print("=" * 70)

    db = get_vectordb()
    results = db.similarity_search_with_score(
        customer_message,
        k=3
    )

    print(f"\nRetrieved {len(results)} document(s)\n")

    context = ""
    sources = []

    for i, (doc, distance) in enumerate(results, start=1):

        raw_source = doc.metadata.get("source", "Knowledge Base")
        filename = raw_source.replace("\\", "/").split("/")[-1]

        # Convert distance to similarity percentage
        similarity = math.exp(-float(distance)) * 100
        similarity = round(similarity, 1)

        print(f"Document {i}")
        print("File      :", filename)
        print("Distance  :", distance)
        print("Similarity:", similarity, "%")
        print("Content:")
        print(doc.page_content[:400])
        print("-" * 70)

        context += f"""
Source: {filename}

{doc.page_content}

"""

        sources.append({
            "title": filename,
            "content": doc.page_content,
            "score": similarity
        })

    if len(sources) == 0:
        return {
            "answer": "No relevant knowledge found.",
            "articles": []
        }

    prompt = f"""
{SYSTEM_PROMPT}

Retrieved Knowledge:

{context}

Customer Question:
{customer_message}

Answer:
"""

    answer = generate_response(prompt)

    print("\nAI Answer\n")
    print(answer)
    print("=" * 70)

    return {
        "answer": answer.strip(),
        "articles": sources
    }