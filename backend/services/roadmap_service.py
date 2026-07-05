"""
services/roadmap_service.py — Roadmap business logic.

Functions
---------
get_all_roadmaps(user_id)          — list all published roadmaps with per-user progress
get_roadmap_by_slug(slug, user_id) — single roadmap with topics + per-topic completed flag
get_user_progress(slug, user_id)   — summary stats for one roadmap
mark_topic_complete(user_id, topic_id) — idempotent upsert
unmark_topic_complete(user_id, topic_id) — remove progress row
"""

from datetime import datetime, timezone
from sqlalchemy.exc import IntegrityError

from database import db
from models.roadmap import Roadmap, Topic, UserTopicProgress


# ── helpers ────────────────────────────────────────────────────────────────────

def _completed_topic_ids(user_id: int, roadmap_id: int) -> set[int]:
    """Return set of topic IDs the user has completed in a roadmap."""
    rows = (
        db.session.query(UserTopicProgress.topic_id)
        .join(Topic, Topic.id == UserTopicProgress.topic_id)
        .filter(
            UserTopicProgress.user_id == user_id,
            Topic.roadmap_id == roadmap_id,
        )
        .all()
    )
    return {r.topic_id for r in rows}


# ── public API ─────────────────────────────────────────────────────────────────

def get_all_roadmaps(user_id: int | None = None) -> list[dict]:
    """
    Return all published roadmaps ordered by order_index.
    If user_id given, include real progress counts.
    """
    roadmaps = (
        Roadmap.query
        .filter_by(is_published=True)
        .order_by(Roadmap.order_index)
        .all()
    )
    result = []
    for rm in roadmaps:
        completed = 0
        if user_id:
            completed = len(_completed_topic_ids(user_id, rm.id))
        result.append(rm.to_dict(completed_count=completed))
    return result


def get_roadmap_by_slug(slug: str, user_id: int | None = None) -> dict | None:
    """
    Return one roadmap with full topic list and per-topic completed flag.
    Returns None if not found or not published.
    """
    rm = Roadmap.query.filter_by(slug=slug, is_published=True).first()
    if not rm:
        return None

    completed_ids: set[int] = set()
    if user_id:
        completed_ids = _completed_topic_ids(user_id, rm.id)

    data = rm.to_dict(completed_count=len(completed_ids))
    data["topics"] = [
        t.to_dict(completed=(t.id in completed_ids))
        for t in rm.topics
        if t.is_published
    ]
    return data


def get_user_progress(slug: str, user_id: int) -> dict | None:
    """
    Return progress summary for user in a specific roadmap.
    { roadmap_slug, total_topics, completed_topics, progress_pct,
      completed_at_list }
    """
    rm = Roadmap.query.filter_by(slug=slug, is_published=True).first()
    if not rm:
        return None

    total = len([t for t in rm.topics if t.is_published])
    completed_ids = _completed_topic_ids(user_id, rm.id)

    return {
        "roadmap_slug":      rm.slug,
        "roadmap_title":     rm.title,
        "total_topics":      total,
        "completed_topics":  len(completed_ids),
        "progress_pct":      round(len(completed_ids) / total * 100) if total else 0,
    }


def mark_topic_complete(
    user_id: int, topic_id: int
) -> tuple[dict | None, str | None]:
    """
    Mark a topic as completed for a user (idempotent).
    Returns (progress_entry_dict, None) on success, (None, error) on failure.
    """
    topic = db.session.get(Topic, topic_id)
    if not topic:
        return None, "Topic not found."

    existing = UserTopicProgress.query.filter_by(
        user_id=user_id, topic_id=topic_id
    ).first()
    if existing:
        return {"topic_id": topic_id, "completed": True, "already_done": True}, None

    entry = UserTopicProgress(
        user_id=user_id,
        topic_id=topic_id,
        completed_at=datetime.now(timezone.utc),
    )
    try:
        db.session.add(entry)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return {"topic_id": topic_id, "completed": True, "already_done": True}, None
    except Exception as exc:
        db.session.rollback()
        return None, str(exc)

    return {"topic_id": topic_id, "completed": True, "already_done": False}, None


def unmark_topic_complete(
    user_id: int, topic_id: int
) -> tuple[bool, str | None]:
    """
    Remove completion record for a user + topic.
    Returns (True, None) on success, (False, error) on failure.
    """
    entry = UserTopicProgress.query.filter_by(
        user_id=user_id, topic_id=topic_id
    ).first()
    if not entry:
        return True, None   # idempotent — not marked is fine

    try:
        db.session.delete(entry)
        db.session.commit()
    except Exception as exc:
        db.session.rollback()
        return False, str(exc)

    return True, None
