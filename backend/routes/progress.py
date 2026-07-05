"""
routes/progress.py — Progress & Dashboard API (all JWT-protected).

GET  /api/progress/summary   — full dashboard payload (stats, streak, roadmaps, activity)
GET  /api/progress/activity  — recent activity log  (?limit=20)
GET  /api/progress/heatmap   — 16-week activity heatmap grid (?weeks=16)
GET  /api/progress/roadmaps  — per-roadmap completion bars
"""

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from services.progress_service import (
    get_summary,
    get_activity_log,
    get_heatmap,
    get_roadmap_progress,
)
from utils.helpers import success_response, error_response

progress_bp = Blueprint("progress", __name__)


@progress_bp.get("/summary")
@jwt_required()
def summary():
    user_id = int(get_jwt_identity())
    try:
        data = get_summary(user_id)
        return success_response(data=data)
    except Exception as exc:
        return error_response(f"Failed to load summary: {exc}", 500)


@progress_bp.get("/activity")
@jwt_required()
def activity():
    user_id = int(get_jwt_identity())
    limit   = min(int(request.args.get("limit", 20)), 50)
    try:
        rows = get_activity_log(user_id, limit=limit)
        return success_response(data={"activity": rows, "count": len(rows)})
    except Exception as exc:
        return error_response(f"Failed to load activity: {exc}", 500)


@progress_bp.get("/heatmap")
@jwt_required()
def heatmap():
    user_id = int(get_jwt_identity())
    weeks   = min(int(request.args.get("weeks", 16)), 52)
    try:
        grid = get_heatmap(user_id, weeks=weeks)
        return success_response(data={"heatmap": grid, "weeks": weeks})
    except Exception as exc:
        return error_response(f"Failed to load heatmap: {exc}", 500)


@progress_bp.get("/roadmaps")
@jwt_required()
def roadmaps():
    user_id = int(get_jwt_identity())
    try:
        data = get_roadmap_progress(user_id)
        return success_response(data={"roadmaps": data})
    except Exception as exc:
        return error_response(f"Failed to load roadmap progress: {exc}", 500)
