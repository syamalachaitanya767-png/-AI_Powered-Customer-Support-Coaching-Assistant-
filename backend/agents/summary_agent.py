import json
import re

from services.openrouter_service import generate_response
from prompts.summary_prompt import SYSTEM_PROMPT


def fallback_summary(conversation, raw_response=""):
    """
    Fallback summary extraction when JSON parsing fails or conversation is in early stage.
    """
    conv_lines = [l.strip() for l in (conversation or "").splitlines() if l.strip()]
    first_msg = ""
    for line in conv_lines:
        if line.lower().startswith("customer:"):
            first_msg = line.split(":", 1)[1].strip()
            break
        elif not line.lower().startswith("employee:"):
            first_msg = line
            break

    if not first_msg:
        first_msg = conversation[:120] if conversation else "Support inquiry started."

    return {
        "summary": f"Customer contacted support regarding: {first_msg[:150]}. Conversation is in progress with AI coaching guidance.",
        "customer_issue": first_msg[:120],
        "resolution": "In progress (Troubleshooting steps provided by AI Coach).",
        "follow_up_required": "Yes"
    }


def generate_summary(conversation):
    if not (conversation or "").strip():
        return {
            "summary": "No active conversation to summarize.",
            "customer_issue": "None",
            "resolution": "None",
            "follow_up_required": "No"
        }

    prompt = f"""
{SYSTEM_PROMPT}

Conversation:

{conversation}
"""

    response = generate_response(prompt)

    try:
        clean = re.sub(r"^```(?:json)?\s*", "", (response or "").strip(), flags=re.IGNORECASE)
        clean = re.sub(r"\s*```$", "", clean)

        match = re.search(r"\{.*\}", clean, re.DOTALL)
        if match:
            data = json.loads(match.group())
            return {
                "summary": data.get("summary") or fallback_summary(conversation, response)["summary"],
                "customer_issue": data.get("customer_issue") or fallback_summary(conversation, response)["customer_issue"],
                "resolution": data.get("resolution") or "In progress / Guidance provided",
                "follow_up_required": data.get("follow_up_required") or "Yes"
            }
        else:
            return fallback_summary(conversation, response)

    except Exception:
        return fallback_summary(conversation, response)