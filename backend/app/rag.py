"""RAG-Teil: PDF einlesen -> in Chunks teilen -> in Chroma speichern -> durchsuchen."""
import io
import uuid

import chromadb
from pypdf import PdfReader

from . import config, llm

_db = chromadb.PersistentClient(path=str(config.CHROMA_DIR))
_collection = _db.get_or_create_collection(config.COLLECTION_NAME)


def _chunk(text: str) -> list[str]:
    text = " ".join(text.split())
    chunks, start = [], 0
    while start < len(text):
        chunks.append(text[start : start + config.CHUNK_SIZE])
        start += config.CHUNK_SIZE - config.CHUNK_OVERLAP
    return [c for c in chunks if len(c.strip()) > 50]


def ingest_pdf(filename: str, data: bytes) -> int:
    """Speichert ein PDF seitenweise. Gibt die Anzahl gespeicherter Chunks zurück."""
    reader = PdfReader(io.BytesIO(data))
    docs, metas = [], []
    for page_no, page in enumerate(reader.pages, start=1):
        for chunk in _chunk(page.extract_text() or ""):
            docs.append(chunk)
            metas.append({"source": filename, "page": page_no})
    if not docs:
        return 0
    _collection.add(
        ids=[str(uuid.uuid4()) for _ in docs],
        documents=docs,
        metadatas=metas,
        embeddings=llm.embed(docs),
    )
    return len(docs)


def search(query: str, k: int = config.TOP_K) -> list[dict]:
    if _collection.count() == 0:
        return []
    res = _collection.query(query_embeddings=llm.embed([query], is_query=True), n_results=k)
    return [
        {"text": doc, "source": meta["source"], "page": meta["page"]}
        for doc, meta in zip(res["documents"][0], res["metadatas"][0])
    ]


def random_chunks(k: int = 3) -> list[dict]:
    """Zufällige Stellen aus dem Material – als Ausgangspunkt für neue Fragen."""
    total = _collection.count()
    if total == 0:
        return []
    import random

    offset = random.randint(0, max(0, total - k))
    res = _collection.get(limit=k, offset=offset)
    return [
        {"text": doc, "source": meta["source"], "page": meta["page"]}
        for doc, meta in zip(res["documents"], res["metadatas"])
    ]


def list_sources() -> list[str]:
    res = _collection.get(include=["metadatas"])
    return sorted({m["source"] for m in res["metadatas"]})


def format_context(chunks: list[dict]) -> str:
    return "\n\n".join(f"[{c['source']}, Seite {c['page']}]\n{c['text']}" for c in chunks)
