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

### 1. Ollama installieren und Modelle laden

Ollama von https://ollama.com herunterladen und installieren, dann:

```bash
ollama pull qwen2.5:7b
ollama pull nomic-embed-text
```

### 2. Backend starten

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 2002
```

Läuft auf http://localhost:2002 (API-Doku: http://localhost:2002/docs).

### 3. Frontend starten (zweites Terminal)

```bash
cd frontend
npm install
npm run dev
```

Dann http://localhost:5173 öffnen, PDF hochladen, „Spiel starten“.

## Anderes Modell verwenden

Per Umgebungsvariable, z. B. `set CHAT_MODEL=llama3.1:8b` vor dem Start des Backends.
