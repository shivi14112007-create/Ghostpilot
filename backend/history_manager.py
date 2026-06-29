import json
import os
from datetime import datetime


def save_report(report):

    os.makedirs("history", exist_ok=True)

    filename = datetime.now().strftime(
        "history/analysis_%Y%m%d_%H%M%S.json"
    )

    with open(filename, "w") as file:
        json.dump(report, file, indent=4)

    return filename