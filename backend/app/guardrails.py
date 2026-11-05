"""Input- und Output-Guardrails.

Erste, einfache Version mit Regeln. Später ergänzen wir einen LLM-basierten
Klassifikator (Schritt 4 im Projektplan).
"""
import re

_INJECTION_PATTERNS = [
    r"ignorier\w*\s+(alle|deine|die)",
    r"vergiss\s+(alle|deine|die)",
    r"ignore\s+(all|previous|your)",
    r"system\s*prompt",
    r"(gib|vergib)\s+mir\s+(volle|alle)\s+punkte",
    r"(diese|meine)\s+antwort\s+ist\s+(richtig|korrekt)",
    r"bewerte\s+(das|dies|sie)\s+als\s+richtig",
]

MAX_ANSWER_LEN = 1000


def check_input(text: str) -> tuple[bool, str | None]:
    """Gibt (ok, grund) zurück. ok=False heißt: Eingabe wird blockiert."""
    if not text.strip():
        return False, "Leere Eingabe."
    if len(text) > MAX_ANSWER_LEN:
        return False, "Antwort ist zu lang."
    lowered = text.lower()
    for pattern in _INJECTION_PATTERNS:
        if re.search(pattern, lowered):
            return False, "Netter Versuch, aber schummeln gilt nicht!"
    return True, None


def check_grading(result: dict) -> dict:
    """Output-Guardrail: Grader-Ergebnis validieren und auf erlaubte Werte begrenzen."""
    verdict = result.get("verdict")
    if verdict not in {"richtig", "teilweise", "falsch"}:
        verdict = "falsch"
    return {
        "verdict": verdict,
        "feedback": str(result.get("feedback", ""))[:600],
    }
