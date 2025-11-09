from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import uvicorn
import json
import time
import os
from datetime import datetime
import hashlib
import uuid

# Import QML prediction module
from qml_prediction import run_quantum_prediction

app = FastAPI(title="QuantumCrowd API", description="FastAPI backend for QuantumCrowd platform with QML predictions")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock database (replace with actual database in production)
STARTUPS_DB = []
PREDICTIONS_DB = []
INVESTMENTS_DB = []

# Load mock data
try:
    with open("mock_data.json", "r") as f:
        data = json.load(f)
        STARTUPS_DB = data.get("startups", [])
        PREDICTIONS_DB = data.get("predictions", [])
        INVESTMENTS_DB = data.get("investments", [])
except FileNotFoundError:
    # Initialize with sample data if file doesn't exist
    STARTUPS_DB = [
        {
            "id": 1,
            "owner": "0x1234...5678",
            "title": "EcoTech Solutions",
            "tagline": "Sustainable energy for everyone",
            "sector": "CleanTech",
            "goal": 50,
            "raised": 30,
            "metadataHash": "QmXyz..."
        },
        {
            "id": 2,
            "owner": "0xabcd...ef01",
            "title": "MediChain",
            "tagline": "Blockchain for medical records",
            "sector": "Healthcare",
            "goal": 100,
            "raised": 15,
            "metadataHash": "QmUvw..."
        }
    ]
    
    PREDICTIONS_DB = [
        {
            "startupId": 1,
            "prediction": 72,
            "confidence": 86,
            "modelVersion": "QML-v2.0",
            "signature": "0xabc...",
            "ipfsHash": "QmAbc...",
            "txHash": "0xdef...",
            "breakdown": {
                "team": 0.8,
                "traction": 0.7,
                "market": 0.6,
                "innovation": 0.9,
                "financials": 0.7
            },
            "quantum_data": {
                "circuit_depth": 15,
                "execution_time": 3.2,
                "backend": "Aer QASM Simulator",
                "shots": 1024
            },
            "time": int(time.time()) - 86400  # 1 day ago
        }
    ]

# Models
class StartupBase(BaseModel):
    title: str
    tagline: str
    sector: str
    goal: float
    owner: str
    metadataHash: Optional[str] = None

class Startup(StartupBase):
    id: int
    raised: float = 0

class PredictionFeatures(BaseModel):
    team: float
    traction: float
    market: float
    innovation: float
    financials: float

class PredictionRequest(BaseModel):
    startupId: int
    features: PredictionFeatures

class PredictionResponse(BaseModel):
    startupId: int
    prediction: float
    confidence: float
    modelVersion: str
    signature: str
    ipfsHash: str
    breakdown: Dict[str, float]
    quantum_data: Optional[Dict[str, Any]] = None
    time: int

class InvestmentIntent(BaseModel):
    startupId: int
    investor: str
    amount: float

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to QuantumCrowd API"}

@app.get("/api/startups", response_model=List[Startup])
async def get_startups():
    return STARTUPS_DB

@app.get("/api/startups/{startup_id}")
async def get_startup(startup_id: int):
    startup = next((s for s in STARTUPS_DB if s["id"] == startup_id), None)
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    
    # Get prediction if available
    prediction = next((p for p in PREDICTIONS_DB if p["startupId"] == startup_id), None)
    
    return {
        "startup": startup,
        "prediction": prediction
    }

@app.post("/api/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest, background_tasks: BackgroundTasks):
    startup_id = request.startupId
    
    # Check if startup exists
    startup = next((s for s in STARTUPS_DB if s["id"] == startup_id), None)
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    
    # Run prediction in background
    background_tasks.add_task(
        process_prediction, 
        startup_id, 
        request.features.dict()
    )
    
    # Return immediate response with job ID
    return {
        "startupId": startup_id,
        "prediction": 0,  # Will be updated
        "confidence": 0,  # Will be updated
        "modelVersion": "QML-v2.0",
        "signature": "pending",
        "ipfsHash": "pending",
        "breakdown": {
            "team": 0,
            "traction": 0,
            "market": 0,
            "innovation": 0,
            "financials": 0
        },
        "quantum_data": {
            "circuit_depth": 0,
            "execution_time": 0,
            "backend": "pending",
            "shots": 0
        },
        "time": int(time.time())
    }

@app.post("/api/invest-intent")
async def invest_intent(intent: InvestmentIntent):
    startup_id = intent.startupId
    
    # Check if startup exists
    startup = next((s for s in STARTUPS_DB if s["id"] == startup_id), None)
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    
    # Generate pre-signing data
    intent_id = str(uuid.uuid4())
    
    return {
        "intentId": intent_id,
        "startupId": startup_id,
        "investor": intent.investor,
        "amount": intent.amount,
        "timestamp": int(time.time()),
        "signature": f"0x{hashlib.sha256(intent_id.encode()).hexdigest()}"
    }

@app.post("/api/webhook/prediction-published")
async def prediction_webhook(data: dict):
    # This would be called by the oracle when a prediction is published on-chain
    startup_id = data.get("startupId")
    prediction = data.get("prediction")
    tx_hash = data.get("txHash")
    
    # Update prediction in database
    for p in PREDICTIONS_DB:
        if p["startupId"] == startup_id:
            p["txHash"] = tx_hash
            break
    
    return {"status": "success"}

# Background task for prediction
async def process_prediction(startup_id: int, features: dict):
    # Run quantum prediction with actual quantum circuits
    print(f"Processing quantum prediction for startup {startup_id} with features: {features}")
    result = run_quantum_prediction(features)
    
    # Create prediction record
    prediction = {
        "startupId": startup_id,
        "prediction": result["prediction"],
        "confidence": result["confidence"],
        "modelVersion": result["model_version"],
        "signature": f"0x{hashlib.sha256(str(result).encode()).hexdigest()}",
        "ipfsHash": f"Qm{hashlib.sha256(str(result).encode()).hexdigest()[:44]}",
        "txHash": None,  # Will be set when published on-chain
        "breakdown": {
            "team": features.get("team", 0),
            "traction": features.get("traction", 0),
            "market": features.get("market", 0),
            "innovation": features.get("innovation", 0),
            "financials": features.get("financials", 0)
        },
        "quantum_data": {
            "circuit_depth": result["circuit_depth"],
            "execution_time": result["execution_time"],
            "backend": result["backend"],
            "shots": result["shots"]
        },
        "time": int(time.time())
    }
    
    # Update or add to predictions database
    existing_idx = next((i for i, p in enumerate(PREDICTIONS_DB) if p["startupId"] == startup_id), None)
    if existing_idx is not None:
        PREDICTIONS_DB[existing_idx] = prediction
    else:
        PREDICTIONS_DB.append(prediction)
    
    # In a real implementation, this would:
    # 1. Store the prediction in a database
    # 2. Store detailed results on IPFS
    # 3. Sign the prediction with the oracle's key
    # 4. Submit the prediction to the blockchain

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)