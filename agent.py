"""
Communication agent — the single seam main.py talks to.

answer_query() now tries the real Level-2 orchestrator (orchestrator.py —
a LangGraph agent reasoning over live ocean/weather data) first. If that's
not set up yet (no LLM key, dependencies not installed, network hiccup),
it quietly falls back to the Level-1 mock answers below, which are a
direct Python port of the TEMPLATES/NOTES objects originally hard-coded
into the HTML prototype's JavaScript.

Nothing in main.py or the frontend needs to know which tier actually
answered — both return the same {"intent": ..., "answer_en": ...} shape.
"""

KEYWORDS = {
    "fishing": ["fish", "fishing", "catch", "pfz", "zone"],
    "weather": ["weather", "storm", "cyclone", "wave", "wind", "alert", "warning"],
    "ocean": ["temperature", "sst", "chlorophyll", "ocean", "sea", "water"],
}

# Stand-in for a real call to the Ocean/Fishing/Hazard agents (MOSDAC, INCOIS, IMD).
MOCK_ANSWERS = {
    "fishing": (
        "Good fishing conditions southwest of Kochi, about 12 nautical miles out. "
        "Sea surface temperature is 28.4°C with a strong chlorophyll signal — "
        "a promising zone for the next 24 hours."
    ),
    "weather": (
        "No cyclone alert right now for the Kerala coast. Wave height is moderate, "
        "around 1.2 metres. Light to moderate winds expected through tomorrow."
    ),
    "ocean": (
        "Current sea surface temperature near your coast is 28.4°C, slightly above the "
        "weekly average. Chlorophyll levels are moderate to high."
    ),
    "help": (
        "I'm ORCA. Ask me about fishing zones, weather and sea conditions, or ocean "
        "temperature — by voice or by typing."
    ),
}

PERSONA_NOTES = {
    "fisherman": "Tip: head straight for this zone — it saves both time and fuel.",
    "researcher": "Full profile: SST, chlorophyll-a and wind data available for export.",
    "disaster": "No hazard escalation detected at this time — conditions stable.",
    "maritime": "Recommended for coastal transit; no restrictions currently in effect.",
}


def classify_intent(text_en: str) -> str:
    low = text_en.lower()
    for intent, words in KEYWORDS.items():
        if any(word in low for word in words):
            return intent
    return "help"


def _mock_answer_query(text_en: str, persona: str) -> dict:
    intent = classify_intent(text_en)
    answer = MOCK_ANSWERS[intent]
    if intent != "help":
        answer = answer + " " + PERSONA_NOTES.get(persona, "")
    return {"intent": intent, "answer_en": answer}


def answer_query(text_en: str, persona: str) -> dict:
    """
    Input and output are always plain English — translation in/out of the
    user's spoken language is handled by main.py, not here.
    """
    try:
        from orchestrator import answer_query as _real_answer_query
        return _real_answer_query(text_en, persona)
    except Exception as exc:
        print("Orchestrator unavailable, falling back to Level-1 mock answers:", exc)
        return _mock_answer_query(text_en, persona)
