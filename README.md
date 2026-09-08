# ORCA — the communication agent, now with a real orchestrator behind it

Two tiers, same contract throughout:

- **Level 1** (`agent.py`'s `_mock_answer_query`) — keyword-matched canned
  answers. The safety net.
- **Level 2** (`orchestrator.py`) — a real LangGraph tool-calling agent
  that geocodes place names and pulls live sea-surface-temperature,
  chlorophyll, and wave/wind data to actually reason over, then writes a
  persona-tailored answer.

`agent.answer_query()` tries Level 2 first and falls back to Level 1 on
any failure (missing key, network hiccup, dependency not installed) —
see "Resilience" below. Bhashini ASR/translation/TTS sit in front of
both, unchanged, in `main.py`.

## Run it

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env        # fill in BHASHINI_USER_ID / BHASHINI_API_KEY / ANTHROPIC_API_KEY
uvicorn main:app --reload --port 8000
```

`requirements.txt` installs `langchain-anthropic` to match the default
`ORCA_LLM_PROVIDER=anthropic` in `.env.example`. Using OpenAI or Gemini
instead: change `ORCA_LLM_PROVIDER` (and `ORCA_LLM_MODEL`), `pip install
langchain-openai` (or `langchain-google-genai`), and set that provider's
API key — `init_chat_model()` in `orchestrator.py` handles the rest.

You also need `ffmpeg` on the machine (pydub uses it to convert the
browser's recorded audio into the wav format Bhashini expects):

```bash
sudo apt install ffmpeg      # Ubuntu/Debian
brew install ffmpeg          # macOS
```

Then open `frontend/index.html` (or serve it — `python -m http.server`
from the `frontend/` folder works fine). If the backend runs anywhere
other than `http://localhost:8000`, change `API_BASE` near the top of
`index.html`'s `<script>`.

## Getting Bhashini credentials

Register at https://bhashini.gov.in — the "Bhashini Dashboard" / ULCA
signup gives you a `userID` and `ulcaApiKey`. Some hackathons (check the
SIH portal / your nodal center) issue a dedicated set of credentials to
participating teams — worth checking before you register your own.

## What's actually wired up

- **`/api/text`** — typed query in, Bhashini translates it to English if
  needed, `agent.answer_query()` answers, Bhashini translates back and
  synthesizes speech.
- **`/api/voice`** — same thing, but starting from a raw audio blob
  recorded in the browser (`MediaRecorder`), converted to 16kHz mono wav
  server-side, then run through Bhashini ASR.
- The frontend still uses the **browser's own** speech recognition for
  the main mic button, purely because it's instant and needs no network
  round-trip for the "did you say the right thing" moment. That
  recognized text is then sent to `/api/text` for the actual agent
  reasoning + Bhashini voice reply — so the intelligence and the voice
  output are already real, only the input capture is browser-native.
- The new **"Send raw audio (server ASR)"** button demonstrates the fully
  server-side pipeline end to end (audio in, Bhashini ASR, agent, Bhashini
  TTS, audio out) — this is the piece to point at when the differentiator
  ("integrate real audio-to-text, not just the browser's built-in voice
  support") comes up in judging.
- If the backend is unreachable for any reason, the frontend quietly
  falls back to the same canned answers the original prototype used, so
  a flaky network never kills a live demo.

## What the Level-2 orchestrator actually does

`orchestrator.py` is a `langgraph.prebuilt.create_react_agent` — the
model sees your query and four tools, and decides which to call:

- **`geo.geocode_place`** — place name → coordinates, via OpenStreetMap's
  free Nominatim geocoder.
- **`ocean.get_sea_surface_temperature`** / **`get_chlorophyll`** — live
  satellite readings from NOAA CoastWatch's public ERDDAP servers.
- **`hazard.get_marine_conditions`** — live wave height, swell, and wind,
  via Open-Meteo's free Marine + Weather APIs.
- **`fishing.get_pfz_advisory`** — **an honest placeholder.** INCOIS
  doesn't expose Potential Fishing Zone advisories as a public API (they're
  bulletins, not JSON), so this returns a clearly-labeled stub rather than
  a fabricated number. `tools/fishing.py`'s docstring lays out three ways
  to make it real, from quickest to most correct.

None of the Ocean/Hazard sources are MOSDAC/INCOIS/IMD — they're the same
"public fallback dataset" your own idea deck already names for when those
feeds are gated for hackathon-time access. Swapping them for the real ISRO
feeds later means editing the two URLs inside `tools/ocean.py` (and
whatever hazard source you get IMD/INCOIS access to) — `orchestrator.py`,
`agent.py`, and everything upstream of it stays untouched, since they only
know about the tool functions, not what's behind them.

Each tool is a plain Python function with a `@tool` decorator and a
docstring — that docstring is literally what the model reads to decide
when to call it, so keep it accurate if you edit these.

## Resilience: the fallback is real, not aspirational

Tested this while building it: with no `ANTHROPIC_API_KEY` set,
`agent.answer_query()` tries the orchestrator, catches the auth error,
prints it to the console, and returns the Level-1 mock answer instead —
same shape, same fields, nothing upstream even notices. Whatever you're
demoing on judgment day, a bad LLM key, a dead orchestrator dependency, or
a network blip degrades to "still answers, just not from live data"
rather than a stack trace on stage.

## Known rough edges to tidy up before a live demo

- `bhashini.py`'s response parsing (`output[0]['source']`, `output[0]['target']`,
  `audio[0]['audioContent']`) matches Bhashini's documented shape, but
  it's worth printing one real response for each of ASR/translation/TTS
  the first time you call them, in case your account's pipeline version
  differs slightly.
- CORS is wide open (`allow_origins=["*"]`) for development — restrict it
  to your deployed frontend origin before demo day.
- Bhashini is a live government API shared across every team using it —
  latency and occasional downtime are real risks the night before
  judging. Keep the offline fallback in the frontend as your safety net,
  and consider caching a couple of TTS clips for your rehearsed demo
  queries so the "wow" moment never depends on network conditions.
- Replace the placeholder contact email in `tools/geo.py`'s `User-Agent`
  header — Nominatim's usage policy expects a real one, and rate-limits
  around 1 request/second.
- The two ERDDAP dataset IDs in `tools/ocean.py` are real and public today,
  but ERDDAP datasets do occasionally get renamed or retired — if a query
  errors out, ERDDAP's plain-text error message usually says exactly why,
  and https://coastwatch.noaa.gov/erddap and
  https://coastwatch.pfeg.noaa.gov/erddap both have searchable dataset
  catalogs to find a replacement.
- Open-Meteo's Marine API is a global model at 28km resolution (5km over
  Europe) — fine for "is it rough out there today" but not survey-grade;
  say so if a judge asks how precise the wave numbers are.
