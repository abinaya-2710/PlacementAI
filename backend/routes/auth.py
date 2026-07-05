"""
routes/auth.py — Authentication API endpoints.

Endpoints
---------
POST /api/auth/register   — Create new account
POST /api/auth/login      — Login, returns access + refresh tokens
POST /api/auth/logout     — Logout (client drops tokens; blocklist hook ready)
POST /api/auth/refresh    — Issue new access token using refresh token
GET  /api/auth/me         — Return current authenticated user's profile
PATCH /api/auth/me        — Update current user's profile / password
"""

from flask import Blueprint, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)

from services.auth_service import (
    register_user,
    login_user,
    get_user_by_id,
    update_user_profile,
)
from utils.helpers import success_response, error_response

auth_bp = Blueprint("auth", __name__)


# ── POST /api/auth/register ────────────────────────────────────────────────────

@auth_bp.post("/register")
def register():
    """
    Register a new student account.

    Request body (JSON):
        full_name  : str  — required
        email      : str  — required, unique
        password   : str  — required, min 8 chars
        role       : str  — optional, defaults to "student"

    Returns 201 with user object and tokens on success.
    """
    data = request.get_json(silent=True)
    if not data:
        return error_response("Request body must be JSON.", 400)

    user, err = register_user(data)
    if err:
        return error_response(err, 409 if "already exists" in err else 400)

    access_token  = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return success_response(
        data={
            "user":          user.to_dict(),
            "access_token":  access_token,
            "refresh_token": refresh_token,
        },
        message="Account created successfully. Welcome to PlacePrep AI!",
        status_code=201,
    )


# ── POST /api/auth/login ───────────────────────────────────────────────────────

@auth_bp.post("/login")
def login():
    """
    Authenticate with email + password.

    Request body (JSON):
        email    : str — required
        password : str — required

    Returns 200 with user object and tokens on success.
    """
    data = request.get_json(silent=True)
    if not data:
        return error_response("Request body must be JSON.", 400)

    email    = data.get("email", "")
    password = data.get("password", "")

    user, err = login_user(email, password)
    if err:
        return error_response(err, 401)

    access_token  = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    return success_response(
        data={
            "user":          user.to_dict(),
            "access_token":  access_token,
            "refresh_token": refresh_token,
        },
        message="Login successful. Welcome back!",
    )


# ── POST /api/auth/logout ──────────────────────────────────────────────────────

@auth_bp.post("/logout")
@jwt_required()
def logout():
    """
    Logout the current user.

    The client is responsible for discarding the access and refresh tokens.
    A server-side token blocklist can be added here later via JTI tracking.
    """
    return success_response(message="Logged out successfully.")


# ── POST /api/auth/refresh ─────────────────────────────────────────────────────

@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    """
    Issue a new access token using a valid refresh token.

    Requires the refresh token in the Authorization header:
        Authorization: Bearer <refresh_token>
    """
    user_id      = get_jwt_identity()
    access_token = create_access_token(identity=user_id)

    return success_response(
        data={"access_token": access_token},
        message="Access token refreshed.",
    )


# ── GET /api/auth/me ───────────────────────────────────────────────────────────

@auth_bp.get("/me")
@jwt_required()
def get_me():
    """
    Return the currently authenticated user's profile.

    Requires:  Authorization: Bearer <access_token>
    """
    user_id = int(get_jwt_identity())
    user    = get_user_by_id(user_id)

    if not user:
        return error_response("User not found.", 404)

    if not user.is_active:
        return error_response("Account is deactivated.", 403)

    return success_response(data={"user": user.to_dict()})


# ── PATCH /api/auth/me ────────────────────────────────────────────────────────

@auth_bp.patch("/me")
@jwt_required()
def update_me():
    """
    Update the current user's full_name or password.

    Request body (JSON) — all fields optional:
        full_name : str — new display name
        password  : str — new password (min 8 chars)
    """
    data = request.get_json(silent=True)
    if not data:
        return error_response("Request body must be JSON.", 400)

    user_id     = int(get_jwt_identity())
    user, err   = update_user_profile(user_id, data)

    if err:
        return error_response(err, 400)

    return success_response(
        data={"user": user.to_dict()},
        message="Profile updated successfully.",
    )
