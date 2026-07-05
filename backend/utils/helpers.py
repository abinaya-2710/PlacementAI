"""
utils/helpers.py — Shared utility functions used across the backend.
"""

import re
from datetime import datetime, timezone
from flask import jsonify
from typing import Any


# ── Response helpers ───────────────────────────────────────────────────────────

def success_response(data: Any = None, message: str = "Success", status_code: int = 200):
    """Return a standardised JSON success response."""
    payload: dict = {"success": True, "message": message}
    if data is not None:
        payload["data"] = data
    return jsonify(payload), status_code


def error_response(message: str = "An error occurred", status_code: int = 400, errors: Any = None):
    """Return a standardised JSON error response."""
    payload: dict = {"success": False, "message": message}
    if errors is not None:
        payload["errors"] = errors
    return jsonify(payload), status_code


# ── Validation helpers ─────────────────────────────────────────────────────────

EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def is_valid_email(email: str) -> bool:
    """Quick regex email validation (supplement with email-validator for full RFC check)."""
    return bool(EMAIL_REGEX.match(email.strip().lower()))


def is_valid_password(password: str) -> tuple[bool, str]:
    """
    Validate password strength.
    Returns (is_valid, error_message).
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    if not re.search(r"[A-Za-z]", password):
        return False, "Password must contain at least one letter."
    if not re.search(r"\d", password):
        return False, "Password must contain at least one number."
    return True, ""


# ── Time helpers ───────────────────────────────────────────────────────────────

def utcnow() -> datetime:
    """Return the current UTC datetime (timezone-aware)."""
    return datetime.now(timezone.utc)


def format_datetime(dt: datetime | None) -> str | None:
    """Format a datetime to ISO 8601 string."""
    if dt is None:
        return None
    return dt.isoformat()


# ── String helpers ─────────────────────────────────────────────────────────────

def sanitise_string(value: str, max_length: int = 255) -> str:
    """Strip whitespace and truncate to max_length."""
    return value.strip()[:max_length] if value else ""
