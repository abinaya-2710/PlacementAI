"""
services/auth_service.py — Authentication business logic.

All DB operations and password handling live here, keeping routes thin.
"""

from datetime import datetime, timezone
from flask_bcrypt import Bcrypt
from sqlalchemy.exc import IntegrityError

from database import db
from models.user import User
from utils.helpers import is_valid_email, is_valid_password, sanitise_string

bcrypt = Bcrypt()


# ── Register ───────────────────────────────────────────────────────────────────

def register_user(data: dict) -> tuple[User | None, str | None]:
    """
    Create a new user account.

    Returns (user, None) on success, (None, error_message) on failure.
    """
    full_name = sanitise_string(data.get("full_name", ""), 120)
    email     = sanitise_string(data.get("email", ""), 255).lower()
    password  = data.get("password", "")
    role      = data.get("role", "student")

    # ── Validate ───────────────────────────────────────────────────────────
    if not full_name:
        return None, "Full name is required."

    if len(full_name) < 2:
        return None, "Full name must be at least 2 characters."

    if not email:
        return None, "Email address is required."

    if not is_valid_email(email):
        return None, "Please enter a valid email address."

    ok, msg = is_valid_password(password)
    if not ok:
        return None, msg

    if role not in ("student", "admin"):
        role = "student"

    # ── Check duplicate ────────────────────────────────────────────────────
    existing = User.query.filter_by(email=email).first()
    if existing:
        return None, "An account with this email already exists."

    # ── Hash password and persist ──────────────────────────────────────────
    password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    user = User(
        full_name=full_name,
        email=email,
        password_hash=password_hash,
        role=role,
        is_active=True,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )

    try:
        db.session.add(user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return None, "An account with this email already exists."
    except Exception as exc:
        db.session.rollback()
        return None, f"Registration failed: {str(exc)}"

    return user, None


# ── Login ──────────────────────────────────────────────────────────────────────

def login_user(email: str, password: str) -> tuple[User | None, str | None]:
    """
    Verify credentials and return the User if valid.

    Returns (user, None) on success, (None, error_message) on failure.
    """
    email = sanitise_string(email, 255).lower()

    if not email or not password:
        return None, "Email and password are required."

    user = User.query.filter_by(email=email).first()

    if not user:
        # Deliberately vague — don't reveal whether email exists
        return None, "Invalid email or password."

    if not user.is_active:
        return None, "This account has been deactivated. Please contact support."

    if not bcrypt.check_password_hash(user.password_hash, password):
        return None, "Invalid email or password."

    return user, None


# ── Get current user ───────────────────────────────────────────────────────────

def get_user_by_id(user_id: int) -> User | None:
    """Fetch a user by primary key. Returns None if not found."""
    return db.session.get(User, user_id)


# ── Update profile ─────────────────────────────────────────────────────────────

def update_user_profile(user_id: int, data: dict) -> tuple[User | None, str | None]:
    """
    Update full_name (and optionally password) for a user.

    Returns (user, None) on success, (None, error_message) on failure.
    """
    user = get_user_by_id(user_id)
    if not user:
        return None, "User not found."

    if "full_name" in data:
        full_name = sanitise_string(data["full_name"], 120)
        if len(full_name) < 2:
            return None, "Full name must be at least 2 characters."
        user.full_name = full_name

    if "password" in data and data["password"]:
        ok, msg = is_valid_password(data["password"])
        if not ok:
            return None, msg
        user.password_hash = bcrypt.generate_password_hash(data["password"]).decode("utf-8")

    user.updated_at = datetime.now(timezone.utc)

    try:
        db.session.commit()
    except Exception as exc:
        db.session.rollback()
        return None, f"Update failed: {str(exc)}"

    return user, None
