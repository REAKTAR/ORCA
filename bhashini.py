"""
Minimal wrapper around Bhashini (Digital India's ASR / NMT / TTS mission).

Bhashini's real contract is two calls:

  1. ONE-TIME "which service handles which language" lookup against the
     ULCA auth service. This also hands back a short-lived inference key.
  2. A call PER ASR / translation / TTS request against the Dhruva
     inference endpoint, using the serviceId + key from step 1.

Register at https://bhashini.gov.in (or the hackathon-specific Bhashini
dashboard, if SIH provides one this year) to get BHASHINI_USER_ID and
BHASHINI_API_KEY. Put them in a .env file next to this one — see
.env.example.

Everything here is synchronous `requests` calls for clarity. If latency
becomes an issue once the domain agents are real, swap to `httpx.AsyncClient`
without changing any of the call sites in main.py.
"""

import os
import base64
import requests

USER_ID = os.getenv("BHASHINI_USER_ID")
API_KEY = os.getenv("BHASHINI_API_KEY")
PIPELINE_ID = os.getenv("BHASHINI_PIPELINE_ID", "64392f96daac500b55c543cd")

CONFIG_URL = "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline"
INFER_URL = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"

_pipeline_cache = None


def _pipeline():
    """Fetches and caches the serviceId lookup table + inference key, once per process."""
    global _pipeline_cache
    if _pipeline_cache is not None:
        return _pipeline_cache

    body = {
        "pipelineTasks": [{"taskType": "asr"}, {"taskType": "translation"}, {"taskType": "tts"}],
        "pipelineRequestConfig": {"pipelineId": PIPELINE_ID},
    }
    headers = {"userID": USER_ID, "ulcaApiKey": API_KEY, "Content-Type": "application/json"}
    resp = requests.post(CONFIG_URL, json=body, headers=headers, timeout=15)
    resp.raise_for_status()
    payload = resp.json()

    service_lookup = {}
    for task_config in payload["pipelineResponseConfig"]:
        task_name = task_config["taskType"]
        for lang_config in task_config["config"]:
            src = lang_config["language"]["sourceLanguage"]
            tgt = lang_config["language"].get("targetLanguage")
            service_lookup[(task_name, src, tgt)] = lang_config["serviceId"]

    _pipeline_cache = {
        "inference_key": payload["pipelineInferenceAPIEndPoint"]["inferenceApiKey"]["value"],
        "services": service_lookup,
    }
    return _pipeline_cache


def _call_inference(task_block, input_block):
    pipeline = _pipeline()
    headers = {"Authorization": pipeline["inference_key"], "Content-Type": "application/json"}
    body = {"pipelineTasks": [task_block], "inputData": input_block}
    resp = requests.post(INFER_URL, json=body, headers=headers, timeout=30)
    resp.raise_for_status()
    return resp.json()["pipelineResponse"][0]


def speech_to_text(audio_bytes: bytes, lang: str, audio_format: str = "wav", sample_rate: int = 16000) -> str:
    """lang is a Bhashini language code: hi, ta, bn, en, ..."""
    service_id = _pipeline()["services"][("asr", lang, None)]
    task = {
        "taskType": "asr",
        "config": {
            "language": {"sourceLanguage": lang},
            "serviceId": service_id,
            "audioFormat": audio_format,
            "samplingRate": sample_rate,
        },
    }
    input_block = {"audio": [{"audioContent": base64.b64encode(audio_bytes).decode()}]}
    result = _call_inference(task, input_block)
    # NOTE: verify this key on your first real response — Dhruva's ASR output
    # is documented as pipelineResponse[0]['output'][0]['source']; print(result)
    # once if your account's response shape differs.
    return result["output"][0]["source"]


def translate_text(text: str, src: str, tgt: str) -> str:
    if src == tgt:
        return text
    service_id = _pipeline()["services"][("translation", src, tgt)]
    task = {
        "taskType": "translation",
        "config": {"language": {"sourceLanguage": src, "targetLanguage": tgt}, "serviceId": service_id},
    }
    input_block = {"input": [{"source": text}]}
    result = _call_inference(task, input_block)
    return result["output"][0]["target"]


def text_to_speech(text: str, lang: str, gender: str = "female", sample_rate: int = 8000) -> str:
    """Returns base64-encoded WAV audio, ready to hand to the frontend as a data: URL."""
    service_id = _pipeline()["services"][("tts", lang, None)]
    task = {
        "taskType": "tts",
        "config": {
            "language": {"sourceLanguage": lang},
            "serviceId": service_id,
            "gender": gender,
            "samplingRate": sample_rate,
        },
    }
    input_block = {"input": [{"source": text}]}
    result = _call_inference(task, input_block)
    return result["audio"][0]["audioContent"]
