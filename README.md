# GhostPilot

GhostPilot is an offline AI-powered Network Copilot developed for **ISRO Hackathon PS-13**. It analyzes satellite network telemetry using Machine Learning, a rule engine, and the Phi-3 Large Language Model running locally through Ollama to generate intelligent network diagnostics and future risk predictions.

---

# Features

- Offline AI inference using Ollama
- Phi-3 Large Language Model
- Machine Learning-based Risk Prediction
- Future Risk Trajectory Prediction
- Rule-based Network Health Evaluation
- AI-generated Network Analysis
- Historical Report Storage
- JSON Telemetry Input

---

# Tech Stack

- Python
- FastAPI
- Scikit-learn
- Ollama
- Phi-3
- NumPy
- JSON

---

# Run

```bash
python app.py
```

---

# API Endpoints

## 1. Health Check

### GET `/health`

Returns the backend health status.

### Response

```json
{
  "status": "OK",
  "service": "GhostPilot AI Backend",
  "model": "phi3",
  "version": "1.0"
}
```

---

## 2. Analyze Network

### POST `/analyze`

Analyzes satellite telemetry using the ML model and Phi-3 LLM.

### Request

```json
{
  "latency": 45,
  "packet_loss": 2,
  "cpu": 60
}
```

### Response

```json
{
  "status": "success",
  "network_status": "Warning",
  "predicted_risk": 55,
  "generated_at": "2026-06-28 17:20:00",
  "model": "phi3",
  "telemetry": {
    "latency": 45,
    "packet_loss": 2,
    "cpu": 60
  },
  "reason": "...",
  "possible_root_cause": "...",
  "potential_impact": "...",
  "recommended_actions": "...",
  "summary": "..."
}
```

---

## 3. Analysis History

### GET `/history`

Returns all previously generated network analysis reports stored in the `history/` folder.

---

## 4. Future Risk Trajectory Prediction

### GET `/predict/trajectory`

Predicts future network risk values using a **Linear Regression** model trained on historical risk scores.

### Response

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

### Description

- Loads historical risk scores from the `history/` directory.
- Trains a Linear Regression model using previous analysis results.
- Forecasts the next **10** network risk values.
- Supplies data for the **Future ML Trajectory Predictions** chart in the GhostPilot dashboard.

---

# Project Workflow

1. Receive network telemetry.
2. Predict network risk using the ML model.
3. Evaluate network status using the rule engine.
4. Generate AI-powered diagnostics using Phi-3 via Ollama.
5. Save the analysis report.
6. Train a Linear Regression model on historical risk scores.
7. Predict future network risk trajectory for visualization.
