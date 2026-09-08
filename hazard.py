"""
Hazard agent — wave/swell conditions and wind, from Open-Meteo's free,
keyless Marine and Weather APIs. Good enough for real numbers today;
swap in IMD cyclone bulletins / INCOIS ocean state forecasts once you
have a real feed for those.
"""

import requests
from langchain_core.tools import tool

MARINE_URL = "https://marine-api.open-meteo.com/v1/marine"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"


def _first(series):
    return series[0] if series else None


@tool
def get_marine_conditions(latitude: float, longitude: float) -> dict:
    """Get current wave height, swell height, wave period, and wind speed at a coastal coordinate."""
    marine = requests.get(
        MARINE_URL,
        params={
            "latitude": latitude,
            "longitude": longitude,
            "hourly": "wave_height,swell_wave_height,wave_period",
            "timezone": "auto",
        },
        timeout=15,
    ).json()

    weather = requests.get(
        WEATHER_URL,
        params={
            "latitude": latitude,
            "longitude": longitude,
            "hourly": "wind_speed_10m",
            "timezone": "auto",
        },
        timeout=15,
    ).json()

    hourly_m = marine.get("hourly", {})
    hourly_w = weather.get("hourly", {})

    return {
        "wave_height_m": _first(hourly_m.get("wave_height", [])),
        "swell_height_m": _first(hourly_m.get("swell_wave_height", [])),
        "wave_period_s": _first(hourly_m.get("wave_period", [])),
        "wind_speed_kmh": _first(hourly_w.get("wind_speed_10m", [])),
        "observed_at": _first(hourly_m.get("time", [])),
    }
