import re

def extract(text, start, end=None):
    try:
        if end:
            pattern = rf"{re.escape(start)}(.*?){re.escape(end)}"
        else:
            pattern = rf"{re.escape(start)}(.*)"

        match = re.search(pattern, text, re.DOTALL | re.IGNORECASE)

        if match:
            return match.group(1).strip()

        return "Insufficient Data"

    except:
        return "Insufficient Data"


def parse_report(report):

    sections = {
        "reason": extract(report, "Reason:", "Possible Root Cause:"),
        "possible_root_cause": extract(report, "Possible Root Cause:", "Potential Impact:"),
        "potential_impact": extract(report, "Potential Impact:", "Recommended Actions:"),
        "recommended_actions": extract(report, "Recommended Actions:", "Summary:"),
        "summary": extract(report, "Summary:")
    }

    return sections
    if sections["summary"] == "Insufficient Data":
        sections["summary"] = (
          f"The network status is {report.split('Network Status:')[1].split('Reason:')[0].strip()} "
          "based on the provided telemetry."
        )