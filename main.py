"""
ORCA backend — Level 1: the communication agent.

  POST /api/text   { text, lang, persona }              — typed queries
  POST /api/voice   multipart: audio file + lang + persona — spoken queries

Both return:
  { transcript, answer_text, answer_lang, audio_base64, intent }

audio_base64 is null whenever Bhashini TTS isn't configured or the call
fails — the frontend falls back to the browser's own speechSynthesis in
that case, so a flaky demo-day API never kills the demo.

Run it:
  pip install -r requirements.txt
  cp .env.example .env   # fill in your Bhashini keys
  uvicorn main:app --reload --port 8000
"""

import os

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import bhashini
from agent import answer_query
from audio_utils import to_wav_bytes

app = FastAPI(title="ORCA Communication Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten to your deployed frontend origin before the actual demo
    allow_methods=["*"],
    allow_headers=["*"],
)


class TextQuery(BaseModel):
    text: str
    lang: str = "en"       # "en" | "hi" | "ta" | "bn"
    persona: str = "fisherman"


def _bhashini_configured() -> bool:
    return bool(os.getenv("BHASHINI_USER_ID") and os.getenv("BHASHINI_API_KEY"))


def _respond(query_en: str, user_lang: str, persona: str, transcript: str) -> dict:
    result = answer_query(query_en, persona)

    answer_native = result["answer_en"]
    if user_lang != "en" and _bhashini_configured():
        try:
            answer_native = bhashini.translate_text(result["answer_en"], "en", user_lang)
        except Exception as exc:
            print("Translation failed, replying in English instead:", exc)

    audio_b64 = None
    if _bhashini_configured():
        try:
            audio_b64 = bhashini.text_to_speech(answer_native, user_lang)
        except Exception as exc:
            print("TTS failed, frontend will fall back to browser voice:", exc)

    return {
        "transcript": transcript,
        "answer_text": answer_native,
        "answer_lang": user_lang,
        "audio_base64": audio_b64,
        "intent": result["intent"],
    }


@app.get("/api/health")
def health():
    return {"ok": True, "bhashini_configured": _bhashini_configured()}


@app.post("/api/text")
def query_text(q: TextQuery):
    query_en = q.text
    if q.lang != "en" and _bhashini_configured():
        try:
            query_en = bhashini.translate_text(q.text, q.lang, "en")
        except Exception as exc:
            print("Translation to English failed, using raw text:", exc)
    return _respond(query_en, q.lang, q.persona, transcript=q.text)


@app.post("/api/voice")
async def query_voice(
    audio: UploadFile = File(...),
    lang: str = Form("en"),
    persona: str = Form("fisherman"),
):
    raw_bytes = await audio.read()
    wav_bytes = to_wav_bytes(raw_bytes)  # MediaRecorder's webm/ogg -> 16kHz mono wav
    transcript = bhashini.speech_to_text(wav_bytes, lang, audio_format="wav", sample_rate=16000)
    query_en = transcript
    if lang != "en":
        query_en = bhashini.translate_text(transcript, lang, "en")
    return _respond(query_en, lang, persona, transcript=transcript)
