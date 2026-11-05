"""Dünner Wrapper um Ollama, damit der Rest des Codes nicht vom Anbieter abhängt."""
import json

import ollama

from . import config

_client = ollama.Client(host=config.OLLAMA_HOST)


def chat(system: str, user: str, temperature: float = 0.3) -> str:
    resp = _client.chat(
        model=config.CHAT_MODEL,
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        options={"temperature": temperature},
    )
    return resp["message"]["content"]


def chat_json(system: str, user: str, temperature: float = 0.2) -> dict:
    """Wie chat(), erzwingt aber eine JSON-Antwort und parst sie."""
    resp = _client.chat(
        model=config.CHAT_MODEL,
        messages=[{"role": "system", "content": system}, {"role": "user", "content": user}],
        format="json",
        options={"temperature": temperature},
    )
    return json.loads(resp["message"]["content"])


def embed(texts: list[str]) -> list[list[float]]:
    resp = _client.embed(model=config.EMBED_MODEL, input=texts)
    return resp["embeddings"]
