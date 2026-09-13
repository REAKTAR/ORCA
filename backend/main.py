from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Orca Marine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5183"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Orca Marine Backend is Running"
    }


@app.get("/api/marine-data")
def get_marine_data():
    return {
        "status": "success",
        "data": {
            "location": "Arabian Sea",
            "temperature": 28,
            "wave_height": 1.8,
            "wind_speed": 15,
            "risk_level": "Moderate"
        }
    }