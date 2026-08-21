import json
import re

from services.openrouter_service import generate_response
from prompts.escalation_prompt import SYSTEM_PROMPT


def calculate_risk_score(risk_level):

    risk = str(risk_level).lower().strip()

    if risk == "high":
        return 80

    if risk == "medium":
        return 50

    if risk == "low":
        return 20

    return 50


def analyze_escalation(message):

    prompt = f"""
{SYSTEM_PROMPT}

Conversation:

{message}
"""

    response = generate_response(prompt)

    try:

        # Find JSON object
        match = re.search(r"\{.*\}", response, re.DOTALL)

        if not match:
            raise Exception("No JSON found")

        data = json.loads(match.group())

        # -----------------------------
        # Risk Level
        # -----------------------------

        risk_level = data.get(
            "risk_level",
            "Medium"
        )

        # -----------------------------
        # Risk Score
        # -----------------------------

        risk_score = data.get("risk_score")

        if risk_score is None:
            risk_score = calculate_risk_score(
                risk_level
            )

        # Make sure score is numeric
        try:
            risk_score = int(float(risk_score))
        except (ValueError, TypeError):
            risk_score = calculate_risk_score(
                risk_level
            )

        # Keep score between 0 and 100
        risk_score = max(
            0,
            min(100, risk_score)
        )

        # -----------------------------
        # Return result
        # -----------------------------

        return {

            "risk_level": risk_level,

            "risk_score": risk_score,

            "reason": data.get(
                "reason",
                "Unable to analyze."
            ),

            "recommended_action": data.get(
                "recommended_action",
                "Monitor conversation"
            )
        }

    except Exception as e:

        return {

            "risk_level": "Medium",

            "risk_score": 50,

            "reason": "Unable to analyze.",

            "recommended_action":
                "Monitor conversation",

            "error": str(e)
        }