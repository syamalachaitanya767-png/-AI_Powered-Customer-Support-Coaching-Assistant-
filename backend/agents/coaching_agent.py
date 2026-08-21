from services.openrouter_service import generate_response
from prompts.coaching_prompt import SYSTEM_PROMPT


def generate_coaching_reply(
    customer_message,
    analysis,
    knowledge_answer=""
):

    missing_info = analysis.get("missing_information", [])

    prompt = f"""
{SYSTEM_PROMPT}

Customer Message:
{customer_message}

Customer Analysis

Intent:
{analysis.get("intent")}

Sentiment:
{analysis.get("sentiment")}

Emotion:
{analysis.get("emotion")}

Urgency:
{analysis.get("urgency")}

Entities:
{analysis.get("entities")}

Missing Information:
{missing_info}

Knowledge Base Answer:
{knowledge_answer}

Generate the BEST employee reply.

Instructions:

1. If the customer has already provided enough information,
DO NOT ask unnecessary questions.

2. If information is missing,
ask ONLY ONE follow-up question.

3. If the knowledge base contains the answer,
use it naturally.

4. If the knowledge base does not contain the answer,
tell the customer you will assist them further.

Return ONLY the employee reply.
"""

    reply = generate_response(prompt)

    return {
        "suggestion": reply.strip()
    }