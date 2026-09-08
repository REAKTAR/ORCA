"""
Normalizes browser-recorded audio (usually audio/webm or audio/ogg from
MediaRecorder) into 16kHz mono WAV, which is the format bhashini.py always
asks the ASR service for.

Requires ffmpeg on the system (pydub shells out to it):
  Ubuntu/Debian: sudo apt install ffmpeg
  macOS:         brew install ffmpeg
"""

import io
from pydub import AudioSegment


def to_wav_bytes(raw_audio: bytes) -> bytes:
    segment = AudioSegment.from_file(io.BytesIO(raw_audio))
    segment = segment.set_frame_rate(16000).set_channels(1)
    out = io.BytesIO()
    segment.export(out, format="wav")
    return out.getvalue()
