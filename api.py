from datetime import datetime
from fastapi import FastAPI
from parser import parse_report
from pydantic import BaseModel
from history_manager import save_report
from rule_engine import evaluate_network
from prompt_builder import create_prompt
from ollama_client import ask_phi3
from ml.predict import predict_risk
import os
import json
app = FastAPI(
    title="GhostPilot AI Backend",
    description="Offline AI Network Copilot for ISRO Hackathon PS-13",
    version="1.0.0"
)


class Telemetry(BaseModel):
    latency: int
    packet_loss: int
    cpu: int
    


@app.get("/")
def home():
    return {
        "message": "GhostPilot Backend is Running!"
    }
@app.get("/health")
def health():
    return {
        "status": "OK",
        "service": "GhostPilot AI Backend"
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

@app.post("/analyze")
def analyze(data: Telemetry):
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
        "network_status": status,
        "predicted_risk": risk,
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "model": "phi3",

        "reason": parsed_report["reason"],
        "possible_root_cause": parsed_report["possible_root_cause"],
        "potential_impact": parsed_report["potential_impact"],
        "recommended_actions": parsed_report["recommended_actions"],
        "summary": parsed_report["summary"]
}

        save_report(response)

        return response