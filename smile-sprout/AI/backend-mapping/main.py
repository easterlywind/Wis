import os
import httpx
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Cổng EmoTrack service (đã chạy uvicorn app:app --port 8502)
EMOTRACK_URL = os.getenv("EMOTRACK_URL", "http://127.0.0.1:8502/detect-emotion")

AWS2UI = {
    "HAPPY": "HAPPY",
    "SAD": "SAD",
    "ANGRY": "ANGRY",
    "SURPRISED": "SURPRISED",
    "CALM": "NEUTRAL",
    "DISGUSTED": "DISGUST",
    "FEAR": "FEAR",
    "CONFUSED": "UNKNOWN",
}

app = FastAPI(title="Practice Emotion Gateway")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # chỉ để dev; deploy nên siết lại
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictResponse(BaseModel):
    emotion: str
    confidence: float

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict", response_model=PredictResponse)
async def predict(file: UploadFile = File(...)):
    if file.content_type not in {"image/jpeg","image/png","image/jpg"}:
        raise HTTPException(400, "Only JPEG/PNG images are supported.")
    img = await file.read()

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            files = {"file": ("frame.jpg", img, file.content_type)}
            r = await client.post(EMOTRACK_URL, files=files)
            r.raise_for_status()
            data = r.json()
    except Exception as e:
        raise HTTPException(502, f"EmoTrack service error: {e}")

    label = str(data.get("emotion", "UNKNOWN")).upper()
    ui_label = AWS2UI.get(label, "UNKNOWN")
    confidence = float(data.get("confidence", 0.0)) / 100.0

    return {"emotion": ui_label, "confidence": confidence}
