"""
Geo agent — turns a place name ("Kochi", "Kollam district") into
coordinates the Ocean and Hazard tools need.

Uses OpenStreetMap's Nominatim, a free public geocoder. Their usage
policy (operations.osmfoundation.org/policies/nominatim) asks for a
descriptive User-Agent and roughly 1 request/second, which is fine for
a hackathon demo. Self-host Nominatim or move to a paid geocoder before
any real production traffic.
"""

import requests
from langchain_core.tools import tool

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
# Replace the contact email — Nominatim's usage policy asks for a way to reach you.
HEADERS = {"User-Agent": "ORCA-SIH2026/1.0 (contact: your-email@example.com)"}


@tool
def geocode_place(place_name: str) -> dict:
    """Look up latitude/longitude for a coastal place name (town, port, or district)."""
    params = {"q": place_name, "format": "json", "limit": 1}
    resp = requests.get(NOMINATIM_URL, params=params, headers=HEADERS, timeout=10)
    resp.raise_for_status()
    results = resp.json()
    if not results:
        return {"found": False, "place_name": place_name}
    return {
        "found": True,
        "place_name": place_name,
        "latitude": float(results[0]["lat"]),
        "longitude": float(results[0]["lon"]),
        "display_name": results[0]["display_name"],
    }
