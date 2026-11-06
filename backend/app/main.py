"""FastAPI-Backend der Quizshow. Start: uvicorn app.main:app --reload --port 2002 (im Ordner backend)."""
from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from . import config, guardrails, llm, quiz, rag

app = FastAPI(title="Quizinni")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(llm.LLMBusyError)
def llm_busy(_: Request, exc: llm.LLMBusyError):
    return JSONResponse(status_code=503, content={"detail": str(exc)})


class QuestionRequest(BaseModel):
    level: int = 1
    topic: str | None = None


class AnswerRequest(BaseModel):
    question: str
    reference: str
    answer: str


class HintRequest(BaseModel):
    question: str
    reference: str


@app.get("/api/health")
def health():
    return {"status": "ok", "provider": config.LLM_PROVIDER, "model": config.CHAT_MODEL, "sources": rag.list_sources()}


@app.post("/api/upload")
async def upload(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Bitte nur PDF-Dateien hochladen.")
    data = await file.read()
    if len(data) > 20 * 1024 * 1024:
        raise HTTPException(400, "Datei ist zu groß (max. 20 MB).")
    n = rag.ingest_pdf(file.filename, data)
    if n == 0:
        raise HTTPException(400, "Im PDF wurde kein Text gefunden.")
    return {"file": file.filename, "chunks": n}


@app.post("/api/question")
def question(req: QuestionRequest):
    q = quiz.generate_question(req.level, req.topic)
    if q is None:
        raise HTTPException(400, "Noch kein Lernmaterial hochgeladen.")
    return q


@app.post("/api/answer")
def answer(req: AnswerRequest):
    ok, reason = guardrails.check_input(req.answer)
    if not ok:
        return {"verdict": "blockiert", "feedback": reason}
    result = quiz.grade_answer(req.question, req.reference, req.answer)
    return guardrails.check_grading(result)


@app.post("/api/hint")
def hint(req: HintRequest):
    return {"hint": quiz.hint(req.question, req.reference)}
