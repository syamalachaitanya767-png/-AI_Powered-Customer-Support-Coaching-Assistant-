try:
    import truststore
    truststore.inject_into_ssl()
except Exception:
    pass

import os
import shutil
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = str(BASE_DIR / "documents")
DB_PATH = str(BASE_DIR / "vector_db")

def rebuild_vector_database(data_path=DATA_PATH, db_path=DB_PATH):
    """
    Rebuild the Chroma vector database from all PDF documents.
    Returns a dictionary of statistics.
    """
    from pypdf import PdfReader
    from langchain_core.documents import Document
    from langchain_text_splitters import RecursiveCharacterTextSplitter
    from langchain_chroma import Chroma
    from langchain_huggingface import HuggingFaceEmbeddings

    # 1. Clear old vector database to avoid stale or duplicate records
    if os.path.exists(db_path):
        print(f"Clearing old vector database at {db_path}...")
        try:
            shutil.rmtree(db_path)
        except Exception as e:
            print(f"Warning clearing DB: {e}")

    documents = []
    print("Loading PDFs from:", data_path)

    if not os.path.exists(data_path):
        return {
            "success": False,
            "error": f"Directory '{data_path}' does not exist."
        }

    files_processed = []
    for file in sorted(os.listdir(data_path)):
        if file.lower().endswith(".pdf"):
            pdf_path = os.path.join(data_path, file)
            print(f"  -> Loading: {file}")
            try:
                reader = PdfReader(pdf_path)
                pages_count = len(reader.pages)
                loaded_pages = 0
                for page_idx, page in enumerate(reader.pages):
                    text = page.extract_text() or ""
                    if text.strip():
                        documents.append(
                            Document(
                                page_content=text,
                                metadata={"source": pdf_path, "page": page_idx + 1}
                            )
                        )
                        loaded_pages += 1
                files_processed.append({"filename": file, "pages": pages_count, "extracted": loaded_pages})
                print(f"     ({pages_count} pages processed)")
            except Exception as e:
                print(f"     [Error loading {file}: {e}]")

    print(f"\nTotal loaded pages: {len(documents)}")

    # 2. Split into chunks suitable for RAG scenarios
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=700,
        chunk_overlap=120
    )

    docs = splitter.split_documents(documents)
    print(f"Created {len(docs)} chunks from all documents.")

    # 3. Generate embeddings and store in Chroma
    print("\nCreating Embeddings & Building Vector Database (all-MiniLM-L6-v2)...")
    embedding = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    db = Chroma.from_documents(
        docs,
        embedding=embedding,
        persist_directory=db_path
    )

    print("=" * 70)
    print(f"SUCCESS! Vector Database Built with {len(docs)} Chunks.")
    print("=" * 70)

    return {
        "success": True,
        "total_files": len(files_processed),
        "files": files_processed,
        "total_pages": len(documents),
        "total_chunks": len(docs)
    }


if __name__ == "__main__":
    rebuild_vector_database(DATA_PATH, DB_PATH)