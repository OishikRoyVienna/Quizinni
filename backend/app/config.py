"""Zentrale Einstellungen. Alles per Umgebungsvariable oder backend/.env überschreibbar."""
import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# Welches LLM antwortet: "ollama" (lokal) oder "gemini" (Google AI Studio)
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "ollama").lower()

# Ollama (vorher mit `ollama pull <name>` herunterladen)
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", os.getenv("CHAT_MODEL", "qwen2.5:7b"))
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")

# Gemini (API-Key aus https://aistudio.google.com, NIE committen)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

CHAT_MODEL = GEMINI_MODEL if LLM_PROVIDER == "gemini" else OLLAMA_MODEL

# Embeddings bleiben lokal (Ollama). Ein Wechsel würde ein Neu-Indexieren aller PDFs erfordern.
EMBED_MODEL = os.getenv("EMBED_MODEL", "nomic-embed-text")

# Vektor-Datenbank
CHROMA_DIR = Path(os.getenv("CHROMA_DIR", BASE_DIR / "data" / "chroma"))
COLLECTION_NAME = "lernmaterial"

# Chunking
CHUNK_SIZE = 800      # Zeichen pro Chunk
CHUNK_OVERLAP = 150   # Überlappung zwischen Chunks
TOP_K = 4             # Anzahl Chunks pro Suche
