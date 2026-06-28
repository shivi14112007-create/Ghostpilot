from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {
        "message": "GhostPilot Backend is Running!"
    }