"""
models/progress.py — UserActivity and UserStreak models.

UserActivity  — one row per meaningful user action (topic completed, etc.)
UserStreak    — one row per user; tracks current/best streak + last active date
"""

from datetime import datetime, timezone, date
from sqlalchemy import (
    Integer, String, Text, Date, DateTime,
    ForeignKey, Enum as SAEnum
)
from sqlalchemy.orm import Mapped, mapped_column
from database import db


class UserActivity(db.Model):
    """One record per user action worth tracking."""
    __tablename__ = "user_activities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, index=True
    )
    activity_type: Mapped[str] = mapped_column(
        SAEnum(
            "topic_completed",
            "topic_uncompleted",
            "roadmap_started",
            "roadmap_completed",
            name="activity_type_enum",
        ),
        nullable=False,
    )
    # Human-readable description e.g. "Completed: Arrays & Strings in DSA"
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    # Optional foreign-key hints for future filtering
    roadmap_slug: Mapped[str] = mapped_column(String(80), nullable=True)
    topic_id: Mapped[int]     = mapped_column(
        Integer, ForeignKey("topics.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False,
        default=lambda: datetime.now(timezone.utc), index=True
    )

    def to_dict(self) -> dict:
        return {
            "id":            self.id,
            "activity_type": self.activity_type,
            "description":   self.description,
            "roadmap_slug":  self.roadmap_slug,
            "topic_id":      self.topic_id,
            "created_at":    self.created_at.isoformat() if self.created_at else None,
        }


class UserStreak(db.Model):
    """One row per user — maintains rolling streak counters."""
    __tablename__ = "user_streaks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, unique=True, index=True
    )
    current_streak: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    best_streak:    Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_active:    Mapped[date] = mapped_column(Date, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self) -> dict:
        return {
            "current_streak": self.current_streak,
            "best_streak":    self.best_streak,
            "last_active":    self.last_active.isoformat() if self.last_active else None,
        }
