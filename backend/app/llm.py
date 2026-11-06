"""Dünner Wrapper um das LLM, damit der Rest des Codes nicht vom Anbieter abhängt.

LLM_PROVIDER=ollama  -> lokales Modell über Ollama
LLM_PROVIDER=gemini  -> Gemini über die Google-AI-Studio-API
Embeddings laufen in beiden Fällen lokal über Ollama.
"""
import json
import time

import ollama

from . import config

_ollama = ollama.Client(host=config.OLLAMA_HOST)

if config.LLM_PROVIDER == "gemini":
    if not config.GEMINI_API_KEY:
        raise RuntimeError("LLM_PROVIDER=gemini, aber GEMINI_API_KEY fehlt (backend/.env).")
    from google import genai
    from google.genai import errors as genai_errors
    from google.genai import types as genai_types

    _gemini = genai.Client(api_key=config.GEMINI_API_KEY)


class LLMBusyError(RuntimeError):
    """Rate-Limit erreicht – das Frontend kann eine freundliche Meldung zeigen."""


def _gemini_generate(system: str, user: str, temperature: float, as_json: bool) -> str:
    cfg = genai_types.GenerateContentConfig(
        system_instruction=system,
        temperature=temperature,
        response_mime_type="application/json" if as_json else None,
    )
    for attempt in range(3):
        try:
            resp = _gemini.models.generate_content(model=config.GEMINI_MODEL, contents=user, config=cfg)
            return resp.text or ""
        except genai_errors.APIError as e:
            if e.code in (429, 503) and attempt < 2:
                time.sleep(2 * (attempt + 1))  # kurz warten, dann neu versuchen
                continue
            if e.code == 429:
                raise LLMBusyError("Der Djinni braucht eine Pause (Rate-Limit). Bitte gleich nochmal.") from e
            raise
    raise LLMBusyError("Der Djinni ist gerade nicht erreichbar.")


def chat(system: str, user: str, temperature: float = 0.3) -> str:
    if config.LLM_PROVIDER == "gemini":
        return _gemini_generate(system, user, temperature, as_json=False)
    resp = _ollama.chat(
        model=config.OLLAMA_MODEL,
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        options={"temperature": temperature},
    )
    return resp["message"]["content"]


def chat_json(system: str, user: str, temperature: float = 0.2) -> dict:
    """Wie chat(), erzwingt aber eine JSON-Antwort und parst sie."""
    if config.LLM_PROVIDER == "gemini":
        return json.loads(_gemini_generate(system, user, temperature, as_json=True))
    resp = _ollama.chat(
        model=config.OLLAMA_MODEL,
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        format="json",
        options={"temperature": temperature},
    )
    return json.loads(resp["message"]["content"])


def embed(texts: list[str]) -> list[list[float]]:
    resp = _ollama.embed(model=config.EMBED_MODEL, input=texts)
    return resp["embeddings"]
