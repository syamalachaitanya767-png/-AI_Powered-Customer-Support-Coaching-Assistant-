from flask import Blueprint, jsonify
from database.session_database import get_all_sessions, get_session, delete_session

session_routes = Blueprint("session_routes", __name__)


@session_routes.route("/api/sessions", methods=["GET"])
def sessions():
    sessions = get_all_sessions()

    return jsonify({
        "sessions": sessions
    })


@session_routes.route("/api/sessions/<int:session_id>", methods=["GET"])
def session_details(session_id):
    session = get_session(session_id)

    if not session:
        return jsonify({
            "error": "Session not found"
        }), 404

    return jsonify(session)


@session_routes.route("/api/sessions/<int:session_id>", methods=["DELETE"])
def delete_session_api(session_id):
    deleted = delete_session(session_id)

    if not deleted:
        return jsonify({
            "error": "Session not found"
        }), 404

    return jsonify({
        "message": "Session deleted successfully"
    })