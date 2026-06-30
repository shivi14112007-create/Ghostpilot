# GhostPilot

GhostPilot is an offline AI-powered Network Copilot developed for ISRO Hackathon PS-13.

## Features

- Offline AI using Ollama
- Phi-3 Language Model
- Network Rule Engine
- AI-based Network Analysis
- JSON Telemetry Input
- Future Risk Trajectory Prediction using Machine Learning

## Tech Stack

- Python
- FastAPI
- Scikit-learn
- Ollama
- Phi-3
- JSON

## Run

```bash
python app.py
```

## API Endpoints

### Health Check

```
GET /health
```

Response:

```json
{
  "status": "OK",
  "service": "GhostPilot AI Backend"
}
```

---

### Analyze Network

```
POST /analyze
```

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

```
GET /history
```

Returns all previously generated network analysis reports stored in the `history/` folder.

---

### Future Risk Trajectory Prediction

```
GET /predict/trajectory
```

Predicts the future network risk trend using a **Linear Regression** model trained on historical risk scores.

Response:

```json
{
  "history": [
    {
      "time": 0,
      "risk": 100
    },
    {
      "time": 1,
      "risk": 99
    }
  ],
  "prediction": [
    {
      "time": 20,
      "risk": 26
    },
    {
      "time": 21,
      "risk": 23
    }
  ]
}
```

**Description**

- Reads historical risk values from the `history/` directory.
- Trains a Linear Regression model using previous risk scores.
- Forecasts the next **10** risk values.
- Supplies data for the **Future ML Trajectory Predictions** chart displayed on the GhostPilot dashboard.
