# GhostPilot

GhostPilot is an offline AI-powered Network Copilot developed for ISRO Hackathon PS-13.

## Features

- Offline AI using Ollama
- Phi-3 Language Model
- Network Rule Engine
- AI-based Network Analysis
- JSON Telemetry Input

## Tech Stack

- Python
- Ollama
- Phi-3
- JSON

## Run

```bash
python app.py

```
## API Endpoints

### Health Check

GET /health

Response:

```json
{
  "status": "OK",
  "service": "GhostPilot AI Backend"
}
```

---

### Analyze Network

POST /analyze

Request:

```json
{
  "latency": 45,
  "packet_loss": 2,
  "cpu": 60
}
```

Response:

```json
{
  "network_status": "Warning",
  "predicted_risk": 55,
  "generated_at": "2026-06-28 17:20:00",
  "model": "phi3",
  "reason": "...",
  "possible_root_cause": "...",
  "potential_impact": "...",
  "recommended_actions": "...",
  "summary": "..."
}
```

---

### Analysis History

GET /history

Returns all previous analysis reports stored in the history folder.