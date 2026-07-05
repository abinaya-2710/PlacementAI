"""routes/profile.py — User Profile API."""
from datetime import datetime, timezone
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models.user    import User
from models.profile import UserProfile
from models.roadmap import UserTopicProgress
from models.practice import ProblemSolved
from utils.helpers import success_response, error_response

profile_bp = Blueprint("profile", __name__)


def _get_or_create_profile(user_id: int) -> UserProfile:
    p = UserProfile.query.filter_by(user_id=user_id).first()
    if not p:
        p = UserProfile(user_id=user_id)
        db.session.add(p)
        db.session.flush()
    return p


@profile_bp.get("/")
@jwt_required()
def get_profile():
    uid  = int(get_jwt_identity())
    user = User.query.get(uid)
    if not user:
        return error_response("User not found.", 404)
    prof = _get_or_create_profile(uid)
    db.session.commit()

    topics_done  = UserTopicProgress.query.filter_by(user_id=uid).count()
    problems_done = ProblemSolved.query.filter_by(user_id=uid).count()

    return success_response(data={
        "user": user.to_dict(),
        "profile": prof.to_dict(),
        "stats": {"topics_completed": topics_done, "problems_solved": problems_done},
    })


@profile_bp.patch("/")
@jwt_required()
def update_profile():
    uid  = int(get_jwt_identity())
    user = User.query.get(uid)
    if not user:
        return error_response("User not found.", 404)
    prof = _get_or_create_profile(uid)
    data = request.get_json(silent=True) or {}

    if "full_name"     in data: user.full_name  = data["full_name"][:120]
    if "college"       in data: prof.college    = data["college"][:200]
    if "year"          in data: prof.year       = data["year"][:20]
    if "branch"        in data: prof.branch     = data["branch"][:100]
    if "location"      in data: prof.location   = data["location"][:100]
    if "bio"           in data: prof.bio        = data["bio"]
    if "skills"        in data: prof.skills     = data["skills"]
    if "linkedin_url"  in data: prof.linkedin_url  = data["linkedin_url"][:300]
    if "github_url"    in data: prof.github_url    = data["github_url"][:300]
    if "portfolio_url" in data: prof.portfolio_url = data["portfolio_url"][:300]
    user.updated_at = datetime.now(timezone.utc)
    prof.updated_at = datetime.now(timezone.utc)
    db.session.commit()

    return success_response(data={"user": user.to_dict(), "profile": prof.to_dict()}, message="Profile updated.")
