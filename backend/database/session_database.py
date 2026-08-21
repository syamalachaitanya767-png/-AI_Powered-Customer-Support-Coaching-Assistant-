import sqlite3
import json
from datetime import datetime
from pathlib import Path


# Database file will be created inside backend/database/
BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "sessions.db"


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


# ==========================================
# Create Sessions Table
# ==========================================

def init_database():

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_message TEXT NOT NULL,
            result TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()


# ==========================================
# Save Session
# ==========================================

def save_session(customer_message, result):

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO sessions (
            customer_message,
            result,
            created_at
        )
        VALUES (?, ?, ?)
    """, (
        customer_message,
        json.dumps(result),
        datetime.now().isoformat()
    ))

    session_id = cursor.lastrowid

    connection.commit()
    connection.close()

    return session_id


# ==========================================
# Get All Sessions
# ==========================================

def get_all_sessions():

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        SELECT
            id,
            customer_message,
            result,
            created_at
        FROM sessions
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    connection.close()

    sessions = []
    for row in rows:
        item = dict(row)
        try:
            item["result"] = json.loads(item["result"])
        except Exception:
            item["result"] = {}
        sessions.append(item)

    return sessions


# ==========================================
# Get One Session
# ==========================================

def get_session(session_id):

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        SELECT *
        FROM sessions
        WHERE id = ?
    """, (session_id,))

    row = cursor.fetchone()

    connection.close()

    if not row:
        return None

    session = dict(row)

    session["result"] = json.loads(session["result"])

    return session


# ==========================================
# Delete Session
# ==========================================

def delete_session(session_id):

    connection = get_connection()

    cursor = connection.cursor()

    cursor.execute("""
        DELETE FROM sessions
        WHERE id = ?
    """, (session_id,))

    deleted = cursor.rowcount

    connection.commit()
    connection.close()

    return deleted > 0