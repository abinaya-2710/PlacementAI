"""
app.py — Flask application factory.

Usage
-----
  # Development (from backend/ directory):
  python app.py

  # Via Flask CLI:
  set FLASK_APP=app.py
  flask run

  # Production (example with gunicorn):
  gunicorn "app:create_app()"
"""

import os
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from dotenv import load_dotenv

from config import get_config
from database import db
from middleware.error_handler import register_error_handlers
from routes import register_blueprints

# Load environment variables from .env
load_dotenv()

# ── Extension instances (no app bound yet) ─────────────────────────────────────
jwt    = JWTManager()
bcrypt = Bcrypt()


def create_app(config_class=None) -> Flask:
    """
    Application factory — creates and configures the Flask app.

    Parameters
    ----------
    config_class : Config class (optional)
        Override the config class (useful in tests).
    """
    app = Flask(__name__)

    # ── Load config ────────────────────────────────────────────────────────
    cfg = config_class or get_config()
    app.config.from_object(cfg)

    # ── Initialise extensions ──────────────────────────────────────────────
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    CORS(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=True,
    )

    # ── Register error handlers ────────────────────────────────────────────
    register_error_handlers(app)

    # ── Register route blueprints ──────────────────────────────────────────
    register_blueprints(app)

    # ── JWT additional callbacks ───────────────────────────────────────────
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            "success": False,
            "message": "Your session has expired. Please log in again.",
            "error":   "token_expired",
        }), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            "success": False,
            "message": "Invalid token. Please log in again.",
            "error":   "invalid_token",
        }), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            "success": False,
            "message": "Authentication token is missing.",
            "error":   "authorisation_required",
        }), 401

    # ── Create database tables ─────────────────────────────────────────────
    with app.app_context():
        import models  # noqa: F401 — ensures all models are registered
        db.create_all()
        app.logger.info("✅ Database tables created / verified.")

    app.logger.info(
        "🚀 PlacePrep AI API started  |  ENV=%s  |  DB=%s",
        app.config.get("FLASK_ENV", "development"),
        app.config.get("SQLALCHEMY_DATABASE_URI"),
    )

    return app


# ── Entry point for direct `python app.py` execution ──────────────────────────
if __name__ == "__main__":
    flask_app = create_app()
    port = int(os.environ.get("PORT", 5000))
    flask_app.run(
        host="0.0.0.0",
        port=port,
        debug=os.environ.get("FLASK_DEBUG", "True") == "True",
    )
