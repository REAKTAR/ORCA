"""
Level 2 of ORCA: a real LangGraph agent reasoning over live public
ocean/weather data, instead of Level 1's mock answers.

This deliberately keeps the same contract as agent._mock_answer() —
{"intent": ..., "answer_en": ...} in, English text + persona out — so
main.py and the frontend never have to change no matter how much smarter
this file gets.

Follows LangChain's current guidance for this kind of setup: one
tool-calling agent (langgraph.prebuilt.create_react_agent) rather than
the older multi-subgraph "supervisor" pattern — simpler, and enough for
one orchestrator picking between four domain tools.
"""

import os

from langchain.chat_models import init_chat_model
from langgraph.prebuilt import create_react_agent

from tools.geo import geocode_place
from tools.ocean import get_sea_surface_temperature, get_chlorophyll
from tools.hazard import get_marine_conditions
from tools.fishing import get_pfz_advisory

MODEL_PROVIDER = os.getenv("ORCA_LLM_PROVIDER", "anthropic")
MODEL_NAME = os.getenv("ORCA_LLM_MODEL", "claude-sonnet-5")

PERSONA_STYLE = {
    "fisherman": "Keep it short and practical: one clear recommendation, plain language, no jargon.",
    "researcher": "Include the actual numbers (SST, chlorophyll, wave height) with units, and name the data source.",
    "disaster": "Lead with the safety-relevant fact first. Be direct about whether conditions are safe.",
    "maritime": "Frame it around transit safety: route, wave/wind conditions, and any restrictions.",
}

SYSTEM_PROMPT = (
    "You are ORCA, a marine assistant for Indian coastal stakeholders — "
    "fishermen, researchers, disaster managers, and maritime operators. "
    "You have tools for geocoding place names, sea surface temperature, "
    "chlorophyll (a proxy for fish activity), marine/wave/wind conditions, "
    "and fishing-zone advisories. Always geocode a place name first if a "
    "data tool needs coordinates. If the user doesn't name a place, assume "
    "the coast near Kochi, Kerala. Answer in 2-4 plain-English sentences — "
    "a separate translation layer handles the user's actual language, so "
    "don't mention translation or which language you're replying in."
)

_model = init_chat_model(MODEL_NAME, model_provider=MODEL_PROVIDER)

_tools = [
    geocode_place,
    get_sea_surface_temperature,
    get_chlorophyll,
    get_marine_conditions,
    get_pfz_advisory,
]

_agent = create_react_agent(_model, _tools, prompt=SYSTEM_PROMPT)


def answer_query(text_en: str, persona: str) -> dict:
    style_note = PERSONA_STYLE.get(persona)
    user_message = text_en if not style_note else f"{text_en}\n\n(Style note for your reply: {style_note})"

    result = _agent.invoke({"messages": [("human", user_message)]})
    messages = result["messages"]

    # Which domain tools actually fired, for the same "intent" field the
    # Level-1 mock used — now reflecting real tool calls instead of a
    # keyword guess.
    tool_names = sorted({
        m.name for m in messages
        if getattr(m, "type", None) == "tool" and getattr(m, "name", None)
    })

    return {
        "intent": ",".join(tool_names) or "general",
        "answer_en": messages[-1].content,
    }
