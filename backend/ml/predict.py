import joblib
import pandas as pd

# Load the trained model once
model = joblib.load("ml/risk_model.pkl")


def predict_risk(latency, packet_loss, cpu):
    data = pd.DataFrame([{
        "latency": latency,
        "packet_loss": packet_loss,
        "cpu": cpu
    }])

    risk = model.predict(data)[0]

    return int(round(risk))