from pydantic import BaseModel


class MarineData(BaseModel):
    location: str
    temperature: float
    wave_height: float
    wind_speed: float
    risk_level: str