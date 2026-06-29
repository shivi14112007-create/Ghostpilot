import json
from rule_engine import evaluate_network
from prompt_builder import create_prompt
from ollama_client import ask_phi3


def main():

    with open("examples/healthy.json", "r") as file:
        telemetry = json.load(file)
        status = evaluate_network(
            telemetry["latency"],
            telemetry["packet_loss"],
            telemetry["cpu"],
            telemetry["risk"]
        )

    prompt = create_prompt(
        status,
        telemetry["latency"],
        telemetry["packet_loss"],
        telemetry["cpu"],
        telemetry["risk"]
    )

    response = ask_phi3(prompt)

    print("\n========== GhostPilot AI Report ==========\n")
    print(response)
    print("\n==========================================\n")


if __name__ == "__main__":
    main()