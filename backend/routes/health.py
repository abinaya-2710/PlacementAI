"""
routes/health.py — Health check endpoints.

Endpoints
---------
GET /api/health          — Basic liveness probe
GET /api/health/db       — Database connectivity check
GET /api/health/detailed — Full system status (version, config summary)
"""

import sys
import sqlite3
from datetime import datetime, timezone
from flask import Blueprint, jsonify, current_app
from sqlalchemy import text
from database import db

health_bp = Blueprint("health", __name__)


@health_bp.get("/health")
def health():
    """Basic liveness probe — returns 200 if the server is running."""
    return jsonify({
        "success":   True,
        "status":    "ok",
        "message":   "PlacePrep AI API is running.",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }), 200


@health_bp.get("/health/db")
def health_db():
    """Database connectivity check — verifies SQLAlchemy can query the DB."""
    try:
        db.session.execute(text("SELECT 1"))
        db_status = "ok"
        db_message = "Database connection successful."
    except Exception as exc:
        return jsonify({
            "success":   False,
            "status":    "error",
            "message":   "Database connection failed.",
            "error":     str(exc),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }), 500

    return jsonify({
        "success":    True,
        "status":     db_status,
        "message":    db_message,
        "database":   current_app.config.get("SQLALCHEMY_DATABASE_URI", ""),
        "timestamp":  datetime.now(timezone.utc).isoformat(),
    }), 200


@health_bp.get("/health/detailed")
def health_detailed():
    """Full system status — useful during development and deployment checks."""
    # DB check
    try:
        db.session.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False

    return jsonify({
        "success": True,
        "status":  "ok" if db_ok else "degraded",
        "api": {
            "name":    "PlacePrep AI API",
            "version": "1.0.0",
            "env":     current_app.config.get("ENV", "development"),
        },
        "database": {
            "status":   "ok" if db_ok else "error",
            "engine":   "SQLite",
            "uri":      current_app.config.get("SQLALCHEMY_DATABASE_URI", ""),
        },
        "python": {
            "version": sys.version,
        },
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }), 200
