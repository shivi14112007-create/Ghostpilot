import pandas as pd
import joblib
from sklearn.metrics import mean_absolute_error, r2_score

# Load dataset
data = pd.read_csv("ml/dataset.csv")

# Features
X = data[["latency", "packet_loss", "cpu"]]

# Actual risk
y = data["risk"]

# Load trained model
model = joblib.load("ml/risk_model.pkl")

# Predict
predictions = model.predict(X)

# Metrics
mae = mean_absolute_error(y, predictions)
r2 = r2_score(y, predictions)

print("Model Evaluation")
print("----------------")
print(f"Mean Absolute Error: {mae:.2f}")
print(f"R² Score: {r2:.2f}")