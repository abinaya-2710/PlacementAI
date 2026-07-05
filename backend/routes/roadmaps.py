"""
routes/roadmaps.py — Roadmap API endpoints.

Public  : GET  /api/roadmaps/, GET /api/roadmaps/<slug>
Protected: GET /<slug>/progress,
           POST   /topics/<id>/complete,
           DELETE /topics/<id>/complete
"""

from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request

from services.roadmap_service import (
    get_all_roadmaps,
    get_roadmap_by_slug,
    get_user_progress,
    mark_topic_complete,
    unmark_topic_complete,
)
from services.progress_service import log_activity
from models.roadmap import Topic
from utils.helpers import success_response, error_response

roadmaps_bp = Blueprint("roadmaps", __name__)


def _optional_user_id() -> int | None:
    try:
        verify_jwt_in_request(optional=True)
        uid = get_jwt_identity()
        return int(uid) if uid else None
    except Exception:
        return None


@roadmaps_bp.get("/")
def list_roadmaps():
    user_id = _optional_user_id()
    roadmaps = get_all_roadmaps(user_id=user_id)
    return success_response(data={"roadmaps": roadmaps, "count": len(roadmaps)})


@roadmaps_bp.get("/<slug>")
def get_roadmap(slug: str):
    user_id = _optional_user_id()
    roadmap = get_roadmap_by_slug(slug=slug, user_id=user_id)
    if not roadmap:
        return error_response(f"Roadmap '{slug}' not found.", 404)
    return success_response(data={"roadmap": roadmap})


@roadmaps_bp.get("/<slug>/progress")
@jwt_required()
def roadmap_progress(slug: str):
    user_id = int(get_jwt_identity())
    progress = get_user_progress(slug=slug, user_id=user_id)
    if not progress:
        return error_response(f"Roadmap '{slug}' not found.", 404)
    return success_response(data={"progress": progress})


@roadmaps_bp.post("/topics/<int:topic_id>/complete")
@jwt_required()
def complete_topic(topic_id: int):
    user_id = int(get_jwt_identity())
    result, err = mark_topic_complete(user_id=user_id, topic_id=topic_id)
    if err:
        return error_response(err, 400)

    # Log activity (streak update included)
    if not result.get("already_done"):
        topic = Topic.query.get(topic_id)
        if topic and topic.roadmap:
            log_activity(
                user_id=user_id,
                activity_type="topic_completed",
                description=f"Completed: {topic.title} in {topic.roadmap.title}",
                roadmap_slug=topic.roadmap.slug,
                topic_id=topic_id,
            )

    return success_response(data=result, message="Topic marked as complete.")


@roadmaps_bp.delete("/topics/<int:topic_id>/complete")
@jwt_required()
def uncomplete_topic(topic_id: int):
    user_id = int(get_jwt_identity())
    ok, err = unmark_topic_complete(user_id=user_id, topic_id=topic_id)
    if not ok:
        return error_response(err or "Failed to update.", 400)

    # Log uncomplete activity
    topic = Topic.query.get(topic_id)
    if topic and topic.roadmap:
        log_activity(
            user_id=user_id,
            activity_type="topic_uncompleted",
            description=f"Uncompleted: {topic.title} in {topic.roadmap.title}",
            roadmap_slug=topic.roadmap.slug,
            topic_id=topic_id,
        )

    return success_response(message="Topic marked as incomplete.")
