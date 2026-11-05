"""Zentrale Einstellungen. Alles per Umgebungsvariable überschreibbar."""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Ollama-Modelle (vorher mit `ollama pull <name>` herunterladen)
CHAT_MODEL = os.getenv("CHAT_MODEL", "qwen2.5:7b")
EMBED_MODEL = os.getenv("EMBED_MODEL", "nomic-embed-text")
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")

# Vektor-Datenbank
CHROMA_DIR = Path(os.getenv("CHROMA_DIR", BASE_DIR / "data" / "chroma"))
COLLECTION_NAME = "lernmaterial"

# Chunking
CHUNK_SIZE = 800      # Zeichen pro Chunk
CHUNK_OVERLAP = 150   # Überlappung zwischen Chunks
TOP_K = 4             # Anzahl Chunks pro Suche
