"""
Fishing agent — Potential Fishing Zone (PFZ) advisories.

INCOIS publishes PFZ advisories per coastal district, but not as a
public JSON/REST API — they're bulletins (web pages / PDFs), refreshed
roughly daily and normally distributed to state fisheries departments.
There's no keyless, scrape-free way to pull this programmatically today,
so it stays an honest placeholder rather than a fabricated number.

Real integration paths, roughly in order of effort:
  1. Scrape incois.gov.in's PFZ advisory pages for the relevant coastal
     district on a schedule, cache the parsed result.
  2. Ask your institution's SIH nodal officer about hackathon-time data
     access — ISRO-linked problem statements sometimes get this arranged.
  3. Approximate it yourself in the meantime: PFZ zones are usually where
     chlorophyll fronts and SST fronts coincide, so
     get_sea_surface_temperature() + get_chlorophyll() at a few nearby
     points is a reasonable stand-in heuristic.
"""

from langchain_core.tools import tool


@tool
def get_pfz_advisory(region_name: str) -> dict:
    """Get the latest Potential Fishing Zone advisory for a coastal region. Currently a placeholder — see this module's docstring."""
    return {
        "region_name": region_name,
        "advisory": (
            "PFZ advisory integration is pending real INCOIS access — this is "
            "where it plugs in once that's arranged. In the meantime, "
            "cross-reference sea surface temperature and chlorophyll fronts "
            "near this region as a rough proxy."
        ),
        "source": "placeholder",
    }
