"""
Ocean agent — sea surface temperature and chlorophyll-a, pulled live from
NOAA CoastWatch's public ERDDAP servers.

This isn't MOSDAC/INCOIS — it's the "public fallback dataset" the idea
deck itself already names for when the ISRO feeds are gated for
hackathon-time access. Same category of data (satellite-derived SST and
chlorophyll), no registration required, so it gives you a genuinely live
number to reason over today. Swap the two URLs below for MOSDAC/Bhuvan
endpoints once you have real access — nothing else in this file, or in
orchestrator.py, needs to change.
"""

import requests
from langchain_core.tools import tool

SST_URL = "https://coastwatch.pfeg.noaa.gov/erddap/griddap/jplMURSST41.json"
CHLOROPHYLL_URL = "https://coastwatch.noaa.gov/erddap/griddap/noaacwS3BOLCIchlaDaily.json"


def _erddap_point(base_url: str, variable: str, lat: float, lon: float, extra_dims: str = "") -> dict:
    """extra_dims covers datasets with a dimension between time and lat/lon (e.g. altitude)."""
    query = f"{variable}[(last)]{extra_dims}[({lat})][({lon})]"
    resp = requests.get(f"{base_url}?{query}", timeout=20)
    resp.raise_for_status()  # ERDDAP's error bodies are plain text and usually tell you exactly what's wrong
    table = resp.json()["table"]
    return dict(zip(table["columnNames"], table["rows"][0]))


@tool
def get_sea_surface_temperature(latitude: float, longitude: float) -> dict:
    """Get the most recent satellite-observed sea surface temperature (°C) at a coordinate."""
    row = _erddap_point(SST_URL, "analysed_sst", latitude, longitude)
    return {"sst_celsius": row.get("analysed_sst"), "observed_at": row.get("time")}


@tool
def get_chlorophyll(latitude: float, longitude: float) -> dict:
    """Get the most recent satellite-observed chlorophyll-a (mg/m^3) at a coordinate — a proxy for fish activity."""
    row = _erddap_point(CHLOROPHYLL_URL, "chlor_a", latitude, longitude, extra_dims="[(0.0)]")
    return {"chlorophyll_mg_m3": row.get("chlor_a"), "observed_at": row.get("time")}
