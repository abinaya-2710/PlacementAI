"""
services/progress_service.py — Progress tracking business logic.

Public API
----------
log_activity(user_id, activity_type, description, roadmap_slug, topic_id)
    — write a UserActivity row and update the streak

get_summary(user_id)
    — full dashboard/progress payload: stats, streak, readiness, roadmaps

get_activity_log(user_id, limit)
    — recent activity rows

get_heatmap(user_id, weeks)
    — 2-D grid of daily completion counts for the activity heatmap

get_roadmap_progress(user_id)
    — per-roadmap progress list (same shape as /api/roadmaps but scoped to user)
"""

from datetime import datetime, timezone, date, timedelta
from sqlalchemy import func

from database import db
from models.progress import UserActivity, UserStreak
from models.roadmap  import Roadmap, Topic, UserTopicProgress


# ── Constants ──────────────────────────────────────────────────────────────────

# Weight each roadmap category contributes to the overall readiness score (must sum to 1)
CATEGORY_WEIGHTS = {
    "programming": 0.30,
    "cs-core":     0.30,
    "aptitude":    0.25,
    "interview":   0.15,
}


# ── Streak helpers ─────────────────────────────────────────────────────────────

def _get_or_create_streak(user_id: int) -> UserStreak:
    streak = UserStreak.query.filter_by(user_id=user_id).first()
    if not streak:
        streak = UserStreak(user_id=user_id, current_streak=0, best_streak=0)
        db.session.add(streak)
        db.session.flush()
    return streak


def _update_streak(user_id: int) -> UserStreak:
    """
    Called whenever the user does any productive activity today.
    Rules:
      - If last_active == today  → no change (already counted)
      - If last_active == yesterday → increment streak
      - Else (gap > 1 day)       → reset streak to 1
    """
    streak = _get_or_create_streak(user_id)
    today = date.today()

    if streak.last_active == today:
        return streak

    if streak.last_active == today - timedelta(days=1):
        streak.current_streak += 1
    else:
        streak.current_streak = 1

    streak.best_streak = max(streak.best_streak, streak.current_streak)
    streak.last_active = today
    streak.updated_at  = datetime.now(timezone.utc)
    return streak


# ── Log activity ───────────────────────────────────────────────────────────────

def log_activity(
    user_id:       int,
    activity_type: str,
    description:   str,
    roadmap_slug:  str | None = None,
    topic_id:      int | None = None,
) -> UserActivity:
    """
    Persist a UserActivity row and refresh the user's streak.
    Returns the created activity.
    """
    activity = UserActivity(
        user_id=user_id,
        activity_type=activity_type,
        description=description,
        roadmap_slug=roadmap_slug,
        topic_id=topic_id,
        created_at=datetime.now(timezone.utc),
    )
    db.session.add(activity)
    _update_streak(user_id)
    db.session.commit()
    return activity


# ── Readiness score ────────────────────────────────────────────────────────────

def _readiness_score(user_id: int) -> int:
    """
    Weighted average completion % across roadmap categories.
    Returns integer 0–100.
    """
    roadmaps = Roadmap.query.filter_by(is_published=True).all()
    if not roadmaps:
        return 0

    # Build { category → (total_topics, completed_topics) }
    cat_totals: dict[str, list[int]] = {c: [0, 0] for c in CATEGORY_WEIGHTS}

    for rm in roadmaps:
        cat = rm.category
        if cat not in cat_totals:
            continue
        total = len([t for t in rm.topics if t.is_published])
        if total == 0:
            continue
        completed = (
            db.session.query(func.count(UserTopicProgress.id))
            .join(Topic, Topic.id == UserTopicProgress.topic_id)
            .filter(
                UserTopicProgress.user_id == user_id,
                Topic.roadmap_id == rm.id,
            )
            .scalar() or 0
        )
        cat_totals[cat][0] += total
        cat_totals[cat][1] += completed

    score = 0.0
    for cat, weight in CATEGORY_WEIGHTS.items():
        total, completed = cat_totals[cat]
        if total:
            score += (completed / total) * weight

    return round(score * 100)


# ── Summary (dashboard payload) ────────────────────────────────────────────────

def get_summary(user_id: int) -> dict:
    """
    Full progress summary used by both Dashboard and ProgressPage.
    """
    streak = _get_or_create_streak(user_id)

    # Total topics completed across all roadmaps
    total_completed = (
        db.session.query(func.count(UserTopicProgress.id))
        .filter(UserTopicProgress.user_id == user_id)
        .scalar() or 0
    )

    # Total published topics
    total_topics = (
        db.session.query(func.count(Topic.id))
        .filter(Topic.is_published == True)  # noqa: E712
        .scalar() or 0
    )

    readiness = _readiness_score(user_id)

    # Per-roadmap progress (for "continue learning" section)
    roadmaps = Roadmap.query.filter_by(is_published=True).order_by(Roadmap.order_index).all()
    roadmap_progress = []
    for rm in roadmaps:
        topics_count = len([t for t in rm.topics if t.is_published])
        if topics_count == 0:
            continue
        completed = (
            db.session.query(func.count(UserTopicProgress.id))
            .join(Topic, Topic.id == UserTopicProgress.topic_id)
            .filter(
                UserTopicProgress.user_id == user_id,
                Topic.roadmap_id == rm.id,
            )
            .scalar() or 0
        )
        pct = round(completed / topics_count * 100)
        roadmap_progress.append({
            "slug":            rm.slug,
            "title":           rm.title,
            "icon":            rm.icon,
            "category":        rm.category,
            "topic_count":     topics_count,
            "completed_count": completed,
            "progress_pct":    pct,
        })

    # Recent activity (last 10)
    recent = (
        UserActivity.query
        .filter_by(user_id=user_id)
        .order_by(UserActivity.created_at.desc())
        .limit(10)
        .all()
    )

    return {
        "streak": streak.to_dict(),
        "stats": {
            "topics_completed": total_completed,
            "total_topics":     total_topics,
            "readiness_score":  readiness,
        },
        "roadmap_progress":  roadmap_progress,
        "recent_activity":   [a.to_dict() for a in recent],
    }


# ── Activity log ───────────────────────────────────────────────────────────────

def get_activity_log(user_id: int, limit: int = 20) -> list[dict]:
    rows = (
        UserActivity.query
        .filter_by(user_id=user_id)
        .order_by(UserActivity.created_at.desc())
        .limit(limit)
        .all()
    )
    return [r.to_dict() for r in rows]


# ── Heatmap ────────────────────────────────────────────────────────────────────

def get_heatmap(user_id: int, weeks: int = 16) -> list[list[int]]:
    """
    Return a weeks×7 grid of daily activity counts (0 = none, capped at 4).
    Index [0][0] is the oldest Sunday, [-1][-1] is today.
    """
    today = date.today()
    # Start on the most recent Sunday (or today if it's Sunday)
    start = today - timedelta(days=(today.weekday() + 1) % 7)
    start = start - timedelta(weeks=weeks - 1)

    # Pull daily counts from DB
    rows = (
        db.session.query(
            func.date(UserActivity.created_at).label("day"),
            func.count(UserActivity.id).label("cnt"),
        )
        .filter(
            UserActivity.user_id == user_id,
            UserActivity.activity_type == "topic_completed",
            func.date(UserActivity.created_at) >= start.isoformat(),
        )
        .group_by(func.date(UserActivity.created_at))
        .all()
    )
    counts: dict[str, int] = {str(r.day): r.cnt for r in rows}

    grid: list[list[int]] = []
    for w in range(weeks):
        week_col: list[int] = []
        for d in range(7):
            day = start + timedelta(weeks=w, days=d)
            raw = counts.get(day.isoformat(), 0)
            week_col.append(min(raw, 4))   # cap at 4 for display intensity
        grid.append(week_col)
    return grid


# ── Per-roadmap progress list ──────────────────────────────────────────────────

def get_roadmap_progress(user_id: int) -> list[dict]:
    """Return progress for every roadmap — used on ProgressPage subject bars."""
    roadmaps = Roadmap.query.filter_by(is_published=True).order_by(Roadmap.order_index).all()
    result = []
    for rm in roadmaps:
        total = len([t for t in rm.topics if t.is_published])
        if total == 0:
            continue
        completed = (
            db.session.query(func.count(UserTopicProgress.id))
            .join(Topic, Topic.id == UserTopicProgress.topic_id)
            .filter(
                UserTopicProgress.user_id == user_id,
                Topic.roadmap_id == rm.id,
            )
            .scalar() or 0
        )
        result.append({
            "slug":            rm.slug,
            "title":           rm.title,
            "icon":            rm.icon,
            "category":        rm.category,
            "topic_count":     total,
            "completed_count": completed,
            "progress_pct":    round(completed / total * 100),
        })
    return result
