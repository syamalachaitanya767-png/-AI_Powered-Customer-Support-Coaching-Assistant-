from agents.customer_understanding import analyze_customer_message
from agents.knowledge_agent import get_knowledge
from agents.escalation_agent import analyze_escalation
from agents.coaching_agent import generate_coaching_reply
from agents.summary_agent import generate_summary

# Memory Agent
from agents.memory_agent import (
    add_message,
    get_conversation_text
)

# Session Database
from database.session_database import save_session


def analyze_session(customer_message):
    raw_text = (customer_message or "").strip()
    
    # Parse latest customer message if full conversation was passed
    lines = [line for line in raw_text.splitlines() if line.strip()]
    latest_customer_msg = raw_text
    for line in reversed(lines):
        if line.lower().startswith("customer:"):
            latest_customer_msg = line.split(":", 1)[1].strip()
            break
        elif not line.lower().startswith("employee:"):
            latest_customer_msg = line.strip()
            break

    # =====================================
    # Store customer message in memory
    # =====================================
    add_message(
        "customer",
        latest_customer_msg
    )

    # Complete conversation till now
    conversation = get_conversation_text()

    print("\n" + "=" * 70)
    print("CONVERSATION MEMORY")
    print("=" * 70)
    print(conversation)
    print("=" * 70)

    # =====================================
    # Customer Understanding Agent
    # =====================================
    analysis = analyze_customer_message(
        latest_customer_msg
    )

    # =====================================
    # Knowledge Agent (RAG)
    # =====================================
    knowledge = get_knowledge(
        latest_customer_msg
    )

    # =====================================
    # Escalation Agent
    # =====================================
    escalation = analyze_escalation(
        conversation
    )

    # =====================================
    # Coaching Agent
    # =====================================
    coaching = generate_coaching_reply(
        latest_customer_msg,
        analysis,
        knowledge.get("answer", "")
    )

    # =====================================
    # Store AI reply in memory
    # =====================================
    add_message(
        "employee",
        coaching["suggestion"]
    )

    # Updated conversation
    updated_conversation = get_conversation_text()

    # =====================================
    # Summary Agent
    # =====================================
    summary = generate_summary(
        updated_conversation
    )

    # =====================================
    # Agent Execution Status
    # =====================================
    agent_execution = {
        "Customer Understanding Agent": "Completed",
        "Knowledge Agent": "Completed",
        "Escalation Agent": "Completed",
        "Coaching Agent": "Completed",
        "Summary Agent": "Completed"
    }

    # =====================================
    # Complete Session Result
    # =====================================
    result = {
        "analysis": analysis,
        "knowledge": knowledge,
        "coaching": coaching,
        "escalation": escalation,
        "summary": summary,
        "agent_execution": agent_execution
    }

    # =====================================
    # Save Complete Session
    # =====================================
    session_id = save_session(
        customer_message,
        result
    )

    print("\n" + "=" * 70)
    print("SESSION SAVED")
    print("Session ID:", session_id)
    print("=" * 70)

    # =====================================
    # Return Result
    # =====================================
    return {
        "session_id": session_id,
        "analysis": analysis,
        "knowledge": knowledge,
        "coaching": coaching,
        "escalation": escalation,
        "summary": summary,
        "agent_execution": agent_execution
    }