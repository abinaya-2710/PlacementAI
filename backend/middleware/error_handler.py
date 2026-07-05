"""
middleware/error_handler.py — Global error handlers for the Flask app.

Registered in the app factory so every error returns a consistent
JSON structure:  { "success": false, "message": "...", "error": "..." }
"""

from flask import Flask, jsonify
from flask_jwt_extended.exceptions import NoAuthorizationError, InvalidHeaderError
from werkzeug.exceptions import HTTPException


def register_error_handlers(app: Flask) -> None:
    """Attach all error handlers to the Flask application instance."""

    # ── 400 Bad Request ────────────────────────────────────────────────────
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({
            "success": False,
            "message": "Bad request.",
            "error": str(e.description) if hasattr(e, "description") else str(e),
        }), 400

    # ── 401 Unauthorised ───────────────────────────────────────────────────
    @app.errorhandler(401)
    def unauthorised(e):
        return jsonify({
            "success": False,
            "message": "Authentication required.",
            "error": str(e.description) if hasattr(e, "description") else str(e),
        }), 401

    # ── 403 Forbidden ──────────────────────────────────────────────────────
    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({
            "success": False,
            "message": "You do not have permission to access this resource.",
            "error": str(e.description) if hasattr(e, "description") else str(e),
        }), 403

    # ── 404 Not Found ──────────────────────────────────────────────────────
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({
            "success": False,
            "message": "The requested resource was not found.",
            "error": str(e.description) if hasattr(e, "description") else str(e),
        }), 404

    # ── 405 Method Not Allowed ─────────────────────────────────────────────
    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({
            "success": False,
            "message": "HTTP method not allowed on this endpoint.",
            "error": str(e.description) if hasattr(e, "description") else str(e),
        }), 405

    # ── 409 Conflict ───────────────────────────────────────────────────────
    @app.errorhandler(409)
    def conflict(e):
        return jsonify({
            "success": False,
            "message": "Resource conflict.",
            "error": str(e.description) if hasattr(e, "description") else str(e),
        }), 409

    # ── 422 Unprocessable Entity ───────────────────────────────────────────
    @app.errorhandler(422)
    def unprocessable(e):
        return jsonify({
            "success": False,
            "message": "Validation error.",
            "error": str(e.description) if hasattr(e, "description") else str(e),
        }), 422

    # ── 429 Too Many Requests ──────────────────────────────────────────────
    @app.errorhandler(429)
    def too_many_requests(e):
        return jsonify({
            "success": False,
            "message": "Too many requests. Please slow down.",
            "error": str(e.description) if hasattr(e, "description") else str(e),
        }), 429

    # ── 500 Internal Server Error ──────────────────────────────────────────
    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({
            "success": False,
            "message": "An internal server error occurred.",
            "error": "Internal server error.",
        }), 500

    # ── Generic HTTP exceptions ────────────────────────────────────────────
    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        return jsonify({
            "success": False,
            "message": e.description,
            "error": e.name,
        }), e.code

    # ── JWT errors ─────────────────────────────────────────────────────────
    @app.errorhandler(NoAuthorizationError)
    def handle_missing_token(e):
        return jsonify({
            "success": False,
            "message": "Missing or invalid authorisation token.",
            "error": str(e),
        }), 401

    @app.errorhandler(InvalidHeaderError)
    def handle_invalid_header(e):
        return jsonify({
            "success": False,
            "message": "Invalid authorisation header format.",
            "error": str(e),
        }), 401
