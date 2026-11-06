# Quizinni

Eine Lern-Quizshow: Du lädst dein Vorlesungsskript (PDF) hoch, der „Djinni des Wissens“ stellt dir Fragen dazu,
du antwortest in eigenen Worten und eine lokale KI bewertet deine Antwort.

**Bausteine (laut Projektspezifikation):**

| Baustein | Umsetzung | Status |
|---|---|---|
| RAG | PDF → Chunks → Chroma (Embeddings: `nomic-embed-text`) | Grundgerüst ✅ |
| Agent / Quiz-Logik | Frage generieren, Antwort bewerten, Joker | Grundgerüst ✅ |
| Input-Guardrails | Regeln gegen Prompt Injection / Schummeln | erste Version ✅, LLM-Klassifikator folgt |
| Output-Guardrails | Grader-Ergebnis validieren | erste Version ✅, Groundedness-Check folgt |
| Monitoring | Langfuse | offen |
| Evaluation | Testset + Skript | offen |

## Projektstruktur

```
backend/            Python, FastAPI
  app/main.py       API-Endpunkte (/api/upload, /api/question, /api/answer, /api/hint)
  app/rag.py        PDF einlesen, Chunking, Vektorsuche
  app/quiz.py       Prompts für Fragen, Bewertung, Hinweise
  app/guardrails.py Input-/Output-Prüfungen
  app/llm.py        Ollama-Anbindung
  app/config.py     Modelle und Einstellungen
frontend/           React + Vite (Spiel-UI im orientalischen Stil: Djinni, Palast-Hintergrund, Punkte-Leiter, Konfetti)
```

## Einrichtung

**Voraussetzungen:** Python **3.10 oder neuer** und Node.js.

Auf dem Mac ist das vorinstallierte `python3` oft noch 3.9 (prüfen mit `python3 --version`). Dann eine neuere Version per [Homebrew](https://brew.sh) installieren:

```bash
brew install python@3.12 node
```

### 1. Ollama installieren und Modelle laden

Nur nötig, wenn du lokal mit Ollama arbeitest. Mit Gemini diesen Schritt überspringen (siehe [Gemini statt Ollama verwenden](#gemini-statt-ollama-verwenden)).

Ollama von https://ollama.com herunterladen und installieren, dann:

```bash
ollama pull qwen2.5:7b
ollama pull nomic-embed-text
```

### 2. Backend starten

**Windows:**

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 2002
```

**macOS / Linux:**

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 2002
```

Das venv nur einmal anlegen. Bei jedem weiteren Start reichen `cd backend`, `source .venv/bin/activate` (Windows: `.venv\Scripts\activate`) und der `uvicorn`-Befehl.

Läuft auf http://localhost:2002 (API-Doku: http://localhost:2002/docs).

### 3. Frontend starten (zweites Terminal)

```bash
cd frontend
npm install
npm run dev
```

Dann http://localhost:5173 öffnen, PDF hochladen, „Spiel starten“.

## Gemini statt Ollama verwenden

1. API-Key in [Google AI Studio](https://aistudio.google.com) erstellen.
2. `backend/.env.example` nach `backend/.env` kopieren und `GEMINI_API_KEY` eintragen.
3. Backend neu starten. `http://localhost:2002/api/health` zeigt `"provider": "gemini"`.

Zurück zum lokalen Modell: in der `.env` `LLM_PROVIDER=ollama` setzen.
Die Embeddings laufen standardmäßig über denselben Anbieter (Gemini: `gemini-embedding-001`), mit Gemini wird Ollama also gar nicht gebraucht.
Mit `EMBED_PROVIDER=ollama` bleiben sie lokal. Jeder Embedding-Anbieter hat eine eigene Collection, nach einem Wechsel PDFs neu hochladen.
Die `.env` ist in `.gitignore` und wird nie committet.

## Anderes Ollama-Modell verwenden

In der `.env` z. B. `OLLAMA_MODEL=llama3.1:8b` setzen.
