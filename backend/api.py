from datetime import datetime
from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.linear_model import LinearRegression
import numpy as np
from parser import parse_report
from history_manager import save_report
from rule_engine import evaluate_network
from prompt_builder import create_prompt
from ollama_client import ask_phi3
from ml.predict import predict_risk
from glob import glob
import os
import json


app = FastAPI(
    title="GhostPilot AI Backend",
    description="Offline AI Network Copilot for ISRO Hackathon PS-13",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Telemetry(BaseModel):
    latency: int
    packet_loss: int
    cpu: int
def load_risk_history():
    history = []

    files = sorted(glob("history/analysis_*.json"))

    for file in files:
        with open(file, "r") as f:
            data = json.load(f)

        if "predicted_risk" in data:
            history.append(data["predicted_risk"])

    return history


@app.get("/")
def home():
    return {
        "message": "GhostPilot Backend is Running!"
    }


@app.get("/health")
def health():
    return {
        "status": "OK",
        "service": "GhostPilot AI Backend",
        "model": "phi3",
        "version": "1.0"
    }


@app.get("/history")
def get_history():

    reports = []

    if not os.path.exists("history"):
        return reports

    for file in sorted(os.listdir("history"), reverse=True):
        if file.endswith(".json"):
            with open(os.path.join("history", file), "r") as f:
                reports.append(json.load(f))

    return reports
@app.get("/predict/trajectory")
def predict_trajectory():
    history = load_risk_history()

    X = np.arange(len(history)).reshape(-1, 1)
    y = np.array(history)

    model = LinearRegression()
    model.fit(X, y)

    future_x = np.arange(len(history), len(history) + 10).reshape(-1, 1)
    future_y = model.predict(future_x)

    return {
        "history": [
            {"time": i, "risk": int(r)}
            for i, r in enumerate(history)
        ],
        "prediction": [
    {
        "time": len(history) + i,
        "risk": max(0, min(100, int(round(r))))
    }
    for i, r in enumerate(future_y)
]
    }
@app.post("/analyze")
def analyze(data: Telemetry):
 try:

    risk = predict_risk(
        data.latency,
        data.packet_loss,
        data.cpu
    )

    status = evaluate_network(
        data.latency,
        data.packet_loss,
        data.cpu,
        risk
    )

    prompt = create_prompt(
        status,
        data.latency,
        data.packet_loss,
        data.cpu,
        risk
    )


    report = ask_phi3(prompt)
    parsed_report = parse_report(report)

    response = {
        "status": "success",
        "network_status": status,
        "predicted_risk": risk,
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "model": "phi3",

        "telemetry": {
            "latency": data.latency,
            "packet_loss": data.packet_loss,
            "cpu": data.cpu
        },

        "reason": parsed_report["reason"],
        "possible_root_cause": parsed_report["possible_root_cause"],
        "potential_impact": parsed_report["potential_impact"],
        "recommended_actions": parsed_report["recommended_actions"],
        "summary": parsed_report["summary"]
    }

    save_report(response)

    return response
 except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )