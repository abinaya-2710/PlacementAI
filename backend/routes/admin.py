"""routes/admin.py — Admin API (admin role required)."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from database import db
from models.user     import User
from models.roadmap  import UserTopicProgress
from models.practice import Problem
from models.company  import Company
from models.resource import Resource
from utils.helpers   import success_response, error_response

admin_bp = Blueprint("admin", __name__)


def _require_admin():
    uid  = int(get_jwt_identity())
    user = User.query.get(uid)
    if not user or user.role != "admin":
        return None, error_response("Admin access required.", 403)
    return uid, None


@admin_bp.get("/dashboard")
@jwt_required()
def dashboard():
    _, err = _require_admin()
    if err: return err

    user_count    = User.query.count()
    active_users  = User.query.filter_by(is_active=True).count()
    problem_count = Problem.query.count()
    company_count = Company.query.count()
    resource_count= Resource.query.count()
    solved_count  = UserTopicProgress.query.count()

    return success_response(data={
        "users":            user_count,
        "active_users":     active_users,
        "problems":         problem_count,
        "companies":        company_count,
        "resources":        resource_count,
        "total_completions": solved_count,
    })


@admin_bp.get("/users")
@jwt_required()
def list_users():
    _, err = _require_admin()
    if err: return err
    page     = max(1, int(request.args.get("page", 1)))
    per_page = min(50, int(request.args.get("per_page", 20)))
    search   = request.args.get("search", "").strip()

    q = User.query
    if search: q = q.filter(User.email.ilike(f"%{search}%"))
    total = q.count()
    users = q.order_by(User.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    return success_response(data={"users": [u.to_dict() for u in users], "total": total})


@admin_bp.patch("/users/<int:uid>/toggle")
@jwt_required()
def toggle_user(uid: int):
    _, err = _require_admin()
    if err: return err
    user = User.query.get_or_404(uid)
    user.is_active = not user.is_active
    db.session.commit()
    return success_response(data={"is_active": user.is_active})
