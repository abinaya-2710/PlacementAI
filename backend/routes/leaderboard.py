"""routes/leaderboard.py — Leaderboard API (computed from progress data)."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from sqlalchemy import func
from database import db
from models.user    import User
from models.roadmap import UserTopicProgress
from models.progress import UserStreak
from utils.helpers import success_response

leaderboard_bp = Blueprint("leaderboard", __name__)


def _optional_uid():
    try:
        verify_jwt_in_request(optional=True)
        uid = get_jwt_identity()
        return int(uid) if uid else None
    except Exception:
        return None


@leaderboard_bp.get("/")
def leaderboard():
    period   = request.args.get("period", "weekly")   # weekly | monthly | all-time
    page     = max(1, int(request.args.get("page", 1)))
    per_page = min(50, int(request.args.get("per_page", 20)))
    my_uid   = _optional_uid()

    # Score = count of completed topics (simple and fair)
    rows = (
        db.session.query(
            User.id.label("user_id"),
            User.full_name.label("full_name"),
            func.count(UserTopicProgress.id).label("score"),
        )
        .join(UserTopicProgress, UserTopicProgress.user_id == User.id)
        .filter(User.is_active == True)   # noqa: E712
        .group_by(User.id, User.full_name)
        .order_by(func.count(UserTopicProgress.id).desc())
    )

    total    = rows.count()
    entries  = rows.offset((page - 1) * per_page).limit(per_page).all()

    result = []
    for rank, row in enumerate(entries, start=(page - 1) * per_page + 1):
        streak = UserStreak.query.filter_by(user_id=row.user_id).first()
        initials = "".join(w[0].upper() for w in row.full_name.split()[:2])
        result.append({
            "rank":       rank,
            "user_id":    row.user_id,
            "full_name":  row.full_name,
            "initials":   initials,
            "score":      row.score,
            "streak":     streak.current_streak if streak else 0,
            "is_me":      row.user_id == my_uid,
        })

    return success_response(data={"leaderboard": result, "total": total, "period": period})
