import random

from services.openrouter_service import generate_response
from prompts.simulator_prompt import SYSTEM_PROMPT


PRODUCTS = [
    "Internet Service",
    "Broadband",
    "Fiber Connection",
    "Mobile Network",
    "Online Shopping",
    "Banking",
    "Credit Card",
    "Electricity Service",
    "Water Supply",
    "Insurance",
    "Healthcare",
    "Streaming Service",
    "Food Delivery",
    "Courier Service",
    "Travel Booking",
    "Airline",
    "Hotel Booking",
    "E-commerce",
    "Laptop",
    "Smartphone"
]

ISSUES = [
    "internet not working",
    "very slow internet",
    "router not connecting",
    "payment failed",
    "double payment charged",
    "refund delayed",
    "order not delivered",
    "wrong item delivered",
    "damaged product",
    "account locked",
    "unable to login",
    "password reset not working",
    "OTP not received",
    "bill amount incorrect",
    "subscription cancelled automatically",
    "service disconnected",
    "network outage",
    "SIM activation failed",
    "installation delayed",
    "appointment missed",
    "application crashed",
    "website not loading",
    "delivery delayed",
    "parcel lost",
    "payment deducted but order failed"
]

EMOTIONS = [
    "calm",
    "polite",
    "confused",
    "frustrated",
    "very frustrated",
    "angry",
    "upset",
    "impatient",
    "worried",
    "disappointed"
]

CUSTOMERS = [
    "college student",
    "software engineer",
    "teacher",
    "doctor",
    "business owner",
    "working professional",
    "senior citizen",
    "homemaker",
    "frequent online shopper",
    "traveller"
]

URGENCY = [
    "low",
    "medium",
    "high",
    "critical"
]


def generate_customer():

    product = random.choice(PRODUCTS)
    issue = random.choice(ISSUES)
    emotion = random.choice(EMOTIONS)
    customer = random.choice(CUSTOMERS)
    urgency = random.choice(URGENCY)

    prompt = f"""
{SYSTEM_PROMPT}

Scenario Details

Product:
{product}

Issue:
{issue}

Customer Type:
{customer}

Emotion:
{emotion}

Urgency:
{urgency}

Generate one realistic customer support message.
"""

    message = generate_response(prompt)

    return {
        "message": message.strip(),
        "details": {
            "product": product,
            "issue": issue,
            "customer_type": customer,
            "emotion": emotion,
            "urgency": urgency
        }
    }


def simulate_customer_reply(conversation_history):
    """
    Given the current conversation history (Customer and Support Agent exchanges),
    simulate how the customer would realistically reply.
    """
    prompt = f"""
You are a customer roleplaying in a customer support chat.
Here is the conversation so far:

{conversation_history}

Rules for your response:
1. Stay in character based on the customer's issue and emotion.
2. If the agent asked for information (like account ID, error code, router lights, symptoms), provide realistic answers.
3. If the agent provided helpful troubleshooting steps, describe attempting them or asking clarifying questions.
4. Keep the response natural, conversational, and under 3 sentences.
5. Do NOT include prefixes like 'Customer:' or markdown quotes. Return only the customer's reply.

Customer Reply:
"""
    reply = generate_response(prompt)
    clean_reply = reply.strip().replace("Customer:", "").replace('"', '').strip()
    return {
        "reply": clean_reply,
        "message": clean_reply
    }