import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

# Load dataset
data = pd.read_csv("ml/dataset.csv")

# Features (inputs)
X = data[["latency", "packet_loss", "cpu"]]

# Target (output)
y = data["risk"]

# Create Random Forest model
model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

# Train the model
model.fit(X, y)

# Save the trained model
joblib.dump(model, "ml/risk_model.pkl")

print("✅ Model trained successfully!")
print("✅ Saved as ml/risk_model.pkl")