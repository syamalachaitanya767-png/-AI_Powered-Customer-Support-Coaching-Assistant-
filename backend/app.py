import sys
try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

try:
    import truststore
    truststore.inject_into_ssl()
except Exception:
    pass

from flask import Flask, jsonify, request
from flask_cors import CORS

from services.openrouter_service import generate_response

from agents.customer_understanding import analyze_customer_message
from agents.coaching_agent import generate_coaching_reply
from agents.knowledge_agent import get_knowledge
from agents.escalation_agent import analyze_escalation
from agents.summary_agent import generate_summary
from agents.simulator_agent import generate_customer, simulate_customer_reply
from build_vectordb import rebuild_vector_database
import os

from orchestrator.session_orchestrator import analyze_session

# Memory Agent
from agents.memory_agent import clear_conversation

# Database
from database.session_database import (
    init_database,
    save_session,
    get_all_sessions,
    get_session,
    delete_session
)

# ==========================================
# Flask App
# ==========================================

app = Flask(__name__)

app.json.sort_keys = False

CORS(app)

# ==========================================
# Initialize Database
# ==========================================

init_database()


from pathlib import Path
from flask import send_from_directory

FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"


# ==========================================
# API TEST
# ==========================================

@app.route("/api/test")
def test():
    return jsonify({
        "status": "success",
        "message": "React connected successfully with Flask 🎉"
    })


# ==========================================
# TEST AI
# ==========================================

@app.route("/test-ai")
def test_ai():

    reply = generate_response(
        "Say Hello from OpenRouter!"
    )

    return {
        "response": reply
    }


# ==========================================
# CUSTOMER UNDERSTANDING
# ==========================================

@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.get_json() or {}

    message = data.get("message", "")

    result = analyze_customer_message(message)

    return jsonify(result)


# ==========================================
# CUSTOMER UNDERSTANDING TEST
# ==========================================

@app.route("/analyze-test")
def analyze_test():

    sample_message = (
        "I ordered a laptop 10 days ago "
        "but it has not arrived. I am very frustrated."
    )

    result = analyze_customer_message(
        sample_message
    )

    return jsonify(result)


# ==========================================
# COACHING AGENT
# ==========================================

@app.route("/coach", methods=["POST"])
def coach():

    data = request.get_json() or {}

    message = data.get("message", "")
    analysis = data.get("analysis", {})

    result = generate_coaching_reply(
        message,
        analysis
    )

    return jsonify(result)


# ==========================================
# KNOWLEDGE AGENT
# ==========================================

@app.route("/api/knowledge", methods=["POST"])
def knowledge():

    data = request.get_json() or {}

    message = data.get("message", "")

    result = get_knowledge(message)

    return jsonify(result)


# ==========================================
# ESCALATION AGENT
# ==========================================

@app.route("/api/escalation", methods=["POST"])
def escalation():

    data = request.get_json() or {}

    message = data.get("message", "")

    result = analyze_escalation(message)

    return jsonify(result)


# ==========================================
# SUMMARY AGENT
# ==========================================

@app.route("/api/summary", methods=["POST"])
def summary():

    data = request.get_json() or {}

    conversation = data.get(
        "conversation",
        ""
    )

    result = generate_summary(
        conversation
    )

    return jsonify(result)


# ==========================================
# CUSTOMER SIMULATOR
# ==========================================

@app.route("/api/simulator")
def simulator():
    return jsonify(
        generate_customer()
    )


# ==========================================
# SIMULATE CUSTOMER FOLLOW-UP REPLY
# ==========================================

@app.route("/api/simulate-reply", methods=["POST"])
def simulate_reply_api():
    data = request.get_json() or {}
    conversation = data.get("conversation", "").strip()

    if not conversation:
        return jsonify({"error": "Conversation is required"}), 400

    reply = simulate_customer_reply(conversation)
    return jsonify(reply)


# ==========================================
# REBUILD VECTOR DATABASE API
# ==========================================

@app.route("/api/rebuild-vectordb", methods=["POST"])
def rebuild_vectordb_api():
    try:
        data_path = os.path.join(os.path.dirname(__file__), "documents")
        db_path = os.path.join(os.path.dirname(__file__), "vector_db")
        result = rebuild_vector_database(data_path, db_path)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# ==========================================
# SYSTEM STATUS & HEALTH CHECK
# ==========================================

@app.route("/api/system-status", methods=["GET"])
def system_status_api():
    try:
        from dotenv import load_dotenv
        load_dotenv()
        model_name = os.getenv("MODEL_NAME", "nvidia/nemotron-3-nano-30b-a3b:free")
        has_api_key = bool(os.getenv("OPENROUTER_API_KEY"))

        sessions = get_all_sessions()
        total_sessions = len(sessions)

        # Check Chroma DB count
        try:
            from agents.knowledge_agent import vectordb
            chunk_count = vectordb._collection.count()
        except Exception:
            chunk_count = "Available"

        return jsonify({
            "status": "online",
            "model": model_name,
            "api_key_configured": has_api_key,
            "total_sessions": total_sessions,
            "vector_chunks": chunk_count,
            "active_agents": [
                "Customer Understanding Agent",
                "Knowledge Agent (RAG)",
                "Escalation Risk Agent",
                "AI Coaching Agent",
                "Summary Agent",
                "Memory Agent",
                "Simulator Agent"
            ]
        })
    except Exception as e:
        return jsonify({
            "status": "degraded",
            "error": str(e)
        }), 500


# ==========================================
# EXPORT SESSIONS
# ==========================================

@app.route("/api/export-sessions", methods=["GET"])
def export_sessions_api():
    format_type = request.args.get("format", "json").lower()
    sessions = get_all_sessions()

    if format_type == "json":
        return jsonify(sessions)

    # Simple CSV export format
    import io
    import csv
    from flask import Response

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Session ID",
        "Created At",
        "Customer Message",
        "Intent",
        "Emotion",
        "Sentiment",
        "Priority",
        "Escalation Risk",
        "AI Coaching Suggestion",
        "Summary"
    ])

    for s in sessions:
        res = s.get("result", {})
        analysis = res.get("analysis", {})
        escalation = res.get("escalation", {})
        coaching = res.get("coaching", {})
        summary = res.get("summary", {})

        writer.writerow([
            s.get("id"),
            s.get("created_at"),
            s.get("customer_message"),
            analysis.get("intent", ""),
            analysis.get("emotion", ""),
            analysis.get("sentiment", ""),
            analysis.get("priority", ""),
            f"{escalation.get('risk_score', '')}% ({escalation.get('risk_level', '')})",
            coaching.get("suggestion", ""),
            summary.get("summary", "") if isinstance(summary, dict) else str(summary)
        ])

    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=customer_support_sessions.csv"}
    )


# ==========================================
# ORCHESTRATOR
# ==========================================

@app.route(
    "/api/analyze-session",
    methods=["POST"]
)
def analyze_session_api():

    data = request.get_json() or {}

    message = data.get(
        "message",
        ""
    ).strip()

    if not message:

        return jsonify({
            "error": "Message is required"
        }), 400

    # Run complete AI analysis
    result = analyze_session(message)

    return jsonify(result)


# ==========================================
# SESSION REPORTS
# ==========================================

# Get all saved sessions
@app.route(
    "/api/sessions",
    methods=["GET"]
)
def get_sessions_api():

    sessions = get_all_sessions()

    return jsonify(sessions)


# ==========================================
# Get One Session
# ==========================================

@app.route(
    "/api/sessions/<int:session_id>",
    methods=["GET"]
)
def get_session_api(session_id):

    session = get_session(
        session_id
    )

    if not session:

        return jsonify({
            "error": "Session not found"
        }), 404

    return jsonify(session)


# ==========================================
# Delete One Session
# ==========================================

@app.route(
    "/api/sessions/<int:session_id>",
    methods=["DELETE"]
)
def delete_session_api(session_id):

    deleted = delete_session(
        session_id
    )

    if not deleted:

        return jsonify({
            "error": "Session not found"
        }), 404

    return jsonify({
        "message": "Session deleted successfully."
    })


# ==========================================
# RESET MEMORY
# ==========================================

@app.route(
    "/api/reset-session",
    methods=["POST"]
)
def reset_session():

    clear_conversation()

    return jsonify({
        "message": "Conversation memory cleared."
    })


# ==========================================
# STATIC FRONTEND SERVING & SPA ROUTING
# ==========================================

@app.route("/assets/<path:filename>")
def serve_assets(filename):
    assets_dir = FRONTEND_DIST / "assets"
    if assets_dir.exists():
        return send_from_directory(str(assets_dir), filename)
    return jsonify({"error": "Asset not found"}), 404


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_spa(path):
    # Guard backend & API routes
    if path.startswith("api/") or path in ["analyze", "analyze-test", "coach", "test-ai"]:
        return jsonify({"error": "API route not found"}), 404

    # Serve static assets in dist (favicon.svg, icons, etc.)
    if path:
        target_file = FRONTEND_DIST / path
        if target_file.is_file():
            return send_from_directory(str(FRONTEND_DIST), path)

    # Serve React SPA index.html
    index_file = FRONTEND_DIST / "index.html"
    if index_file.exists():
        return send_from_directory(str(FRONTEND_DIST), "index.html")

    return jsonify({
        "message": "AI Customer Support Coaching Assistant Backend Running 🚀",
        "status": "online"
    })


# ==========================================
# RUN APPLICATION
# ==========================================

if __name__ == "__main__":
    import threading
    from agents.knowledge_agent import get_vectordb

    port = int(os.environ.get("PORT", 5000))
    host = os.environ.get("HOST", "0.0.0.0" if os.environ.get("PORT") else "127.0.0.1")

    print("\n" + "=" * 65)
    print(" 🚀 AI Customer Support Coaching Assistant - Production Server")
    print(f" 🔗 Running on: http://{host}:{port}")
    print("=" * 65)

    # Pre-warm vector database in a background thread so server starts instantly
    prewarm_thread = threading.Thread(target=get_vectordb, daemon=True)
    prewarm_thread.start()

    app.run(
        host=host,
        port=port,
        debug=False,
        use_reloader=False
    )