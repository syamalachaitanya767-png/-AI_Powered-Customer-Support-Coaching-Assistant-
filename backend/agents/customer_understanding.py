import json
import re
from collections import OrderedDict

from services.openrouter_service import generate_response
from prompts.customer_understanding_prompt import SYSTEM_PROMPT


def calculate_priority(data):
    """
    Calculate priority from the AI analysis.
    """
    urgency = str(data.get("urgency", "")).lower()
    sentiment = str(data.get("sentiment", "")).lower()
    emotion = str(data.get("emotion", "")).lower()

    if (
        urgency in ["high", "urgent", "critical"]
        or emotion in ["anger", "angry", "frustrated", "frustration", "urgent"]
        or sentiment in ["very negative", "negative"]
    ):
        return "High"

    if (
        urgency in ["medium", "moderate"]
        or emotion in ["anxiety", "anxious", "worried", "confused", "disappointed"]
    ):
        return "Medium"

    return "Low"


def fallback_extraction(message, raw_response=""):
    """
    Heuristic fallback extractor if AI output is not strict JSON.
    """
    msg_lower = (message or "").lower()
    resp_lower = (raw_response or "").lower()
    combined = msg_lower + " " + resp_lower

    # Intent
    if any(k in combined for k in ["ac", "air conditioner", "cooling", "router", "wifi", "wi-fi", "internet", "signal", "los", "technical", "hardware", "not working", "broken", "light"]):
        intent = "Technical Support"
    elif any(k in combined for k in ["refund", "double charge", "charged twice", "deducted", "billing", "payment", "invoice"]):
        intent = "Billing & Refund Request"
    elif any(k in combined for k in ["delivery", "delivered", "package", "parcel", "courier", "order", "shipped", "tracking"]):
        intent = "Delivery & Order Issue"
    elif any(k in combined for k in ["password", "login", "otp", "account", "locked", "unlock", "access"]):
        intent = "Account & Access Support"
    else:
        intent = "Customer Support Inquiry"

    # Sentiment
    if any(k in combined for k in ["frustrated", "angry", "terrible", "worst", "broken", "unacceptable", "immediately", "urgent", "not working", "disappointed", "negative"]):
        sentiment = "Negative"
    elif any(k in combined for k in ["thank", "great", "good", "appreciate", "helpful", "positive"]):
        sentiment = "Positive"
    else:
        sentiment = "Neutral"

    # Emotion
    if any(k in combined for k in ["angry", "furious", "mad"]):
        emotion = "Angry"
    elif any(k in combined for k in ["frustrated", "frustration", "annoyed"]):
        emotion = "Frustrated"
    elif any(k in combined for k in ["worried", "anxious", "concerned"]):
        emotion = "Worried"
    elif any(k in combined for k in ["urgent", "immediately", "asap", "emergency"]):
        emotion = "Urgent"
    elif any(k in combined for k in ["confused", "not sure", "don't understand"]):
        emotion = "Confused"
    else:
        emotion = "Concerned" if sentiment == "Negative" else "Calm"

    # Urgency
    if any(k in combined for k in ["immediately", "asap", "urgent", "critical", "emergency", "work", "down"]):
        urgency = "Critical" if "immediately" in combined or "emergency" in combined else "High"
    elif any(k in combined for k in ["delayed", "waiting", "few days", "soon"]):
        urgency = "Medium"
    else:
        urgency = "Low"

    # Product
    if any(k in msg_lower for k in ["ac", "air conditioner", "cooling"]):
        product = "Air Conditioner"
    elif any(k in msg_lower for k in ["router", "wifi", "wi-fi", "internet", "broadband", "fiber"]):
        product = "Broadband & Wi-Fi"
    elif any(k in msg_lower for k in ["laptop", "computer"]):
        product = "Laptop / Hardware"
    elif any(k in msg_lower for k in ["card", "credit card", "bank", "payment"]):
        product = "Payment & Billing"
    elif any(k in msg_lower for k in ["package", "parcel", "order", "delivery"]):
        product = "E-Commerce Delivery"
    else:
        product = "General Product / Service"

    # Duration
    duration_match = re.search(r"(\d+\s*(?:day|days|hour|hours|week|weeks|month|months|min|minutes))", msg_lower)
    duration = duration_match.group(1) if duration_match else ""

    # Issue
    issue = message.split(".")[0] if message else "Reported customer problem"
    if len(issue) > 70:
        issue = issue[:67] + "..."

    return {
        "intent": intent,
        "sentiment": sentiment,
        "emotion": emotion,
        "urgency": urgency,
        "priority": "High" if urgency in ["Critical", "High"] else "Medium",
        "entities": OrderedDict([
            ("product", product),
            ("issue", issue),
            ("duration", duration)
        ]),
        "missing_information": ["Account ID / Reference Number"] if intent != "Customer Support Inquiry" else []
    }


def analyze_customer_message(message):
    prompt = f"""{SYSTEM_PROMPT}

Customer Message:
{message}
"""

    response = generate_response(prompt)
    if not response or not isinstance(response, str):
        return fallback_extraction(message)

    try:
        # Strip markdown code fences if present
        clean_resp = re.sub(r"```json\s*", "", response)
        clean_resp = re.sub(r"```\s*", "", clean_resp)

        # Find first JSON object
        match = re.search(r"\{[\s\S]*\}", clean_resp)

        if not match:
            return fallback_extraction(message, response)

        data = json.loads(match.group())

        result = OrderedDict()

        result["intent"] = data.get("intent") or fallback_extraction(message, response)["intent"]
        result["sentiment"] = data.get("sentiment") or fallback_extraction(message, response)["sentiment"]
        result["emotion"] = data.get("emotion") or fallback_extraction(message, response)["emotion"]
        result["urgency"] = data.get("urgency") or fallback_extraction(message, response)["urgency"]

        priority = data.get("priority")
        if not priority:
            priority = calculate_priority(result)
        result["priority"] = priority

        entities = data.get("entities", {})
        if not isinstance(entities, dict):
            entities = {}

        fb = fallback_extraction(message, response)
        result["entities"] = OrderedDict([
            ("product", entities.get("product") or fb["entities"]["product"]),
            ("issue", entities.get("issue") or fb["entities"]["issue"]),
            ("duration", entities.get("duration") or fb["entities"]["duration"])
        ])

        missing = data.get("missing_information", [])
        if isinstance(missing, str):
            missing = [] if missing.lower() in ["none", "[]", ""] else [missing]
        elif not isinstance(missing, list):
            missing = []

        result["missing_information"] = missing

        return result

    except Exception:
        return fallback_extraction(message, response)