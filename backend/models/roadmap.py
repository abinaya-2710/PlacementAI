"""
models/roadmap.py — Roadmap, Topic, and UserTopicProgress models.

Schema
------
roadmaps
    id, slug, title, description, icon, category, estimated_hours,
    is_published, order_index, created_at, updated_at

topics
    id, roadmap_id (FK), title, description, difficulty,
    level (beginner/intermediate/advanced), order_index,
    estimated_minutes, resources_url, is_published, created_at

user_topic_progress
    id, user_id (FK), topic_id (FK), completed_at
    — UNIQUE (user_id, topic_id)
"""

from datetime import datetime, timezone
from sqlalchemy import (
    Integer, String, Text, Boolean, DateTime,
    ForeignKey, Enum as SAEnum, UniqueConstraint
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import db


# ── Roadmap ────────────────────────────────────────────────────────────────────

class Roadmap(db.Model):
    __tablename__ = "roadmaps"

    id: Mapped[int]  = mapped_column(Integer, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    icon: Mapped[str] = mapped_column(String(10), nullable=False, default="📚")
    category: Mapped[str] = mapped_column(
        SAEnum("programming", "cs-core", "aptitude", "interview", name="roadmap_category"),
        nullable=False,
        default="programming",
    )
    estimated_hours: Mapped[int] = mapped_column(Integer, nullable=False, default=10)
    is_published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="1")
    order_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationship
    topics: Mapped[list["Topic"]] = relationship(
        "Topic", back_populates="roadmap",
        order_by="Topic.order_index",
        cascade="all, delete-orphan",
    )

    def to_dict(self, completed_count: int = 0) -> dict:
        topic_count = len(self.topics)
        pct = round((completed_count / topic_count) * 100) if topic_count else 0
        return {
            "id":              self.id,
            "slug":            self.slug,
            "title":           self.title,
            "description":     self.description,
            "icon":            self.icon,
            "category":        self.category,
            "estimated_hours": self.estimated_hours,
            "topic_count":     topic_count,
            "completed_count": completed_count,
            "progress_pct":    pct,
            "order_index":     self.order_index,
        }

    def __repr__(self) -> str:
        return f"<Roadmap slug={self.slug!r}>"


# ── Topic ──────────────────────────────────────────────────────────────────────

class Topic(db.Model):
    __tablename__ = "topics"

    id: Mapped[int]  = mapped_column(Integer, primary_key=True, autoincrement=True)
    roadmap_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("roadmaps.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    difficulty: Mapped[str] = mapped_column(
        SAEnum("Easy", "Medium", "Hard", name="topic_difficulty"),
        nullable=False, default="Easy",
    )
    level: Mapped[str] = mapped_column(
        SAEnum("beginner", "intermediate", "advanced", name="topic_level"),
        nullable=False, default="beginner",
    )
    order_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    estimated_minutes: Mapped[int] = mapped_column(Integer, nullable=False, default=30)
    resources_url: Mapped[str] = mapped_column(String(500), nullable=True)
    is_published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="1")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    roadmap: Mapped["Roadmap"] = relationship("Roadmap", back_populates="topics")
    progress_entries: Mapped[list["UserTopicProgress"]] = relationship(
        "UserTopicProgress", back_populates="topic", cascade="all, delete-orphan"
    )

    def to_dict(self, completed: bool = False) -> dict:
        return {
            "id":                self.id,
            "roadmap_id":        self.roadmap_id,
            "title":             self.title,
            "description":       self.description,
            "difficulty":        self.difficulty,
            "level":             self.level,
            "order_index":       self.order_index,
            "estimated_minutes": self.estimated_minutes,
            "resources_url":     self.resources_url,
            "completed":         completed,
        }

    def __repr__(self) -> str:
        return f"<Topic id={self.id} title={self.title!r}>"


# ── UserTopicProgress ──────────────────────────────────────────────────────────

class UserTopicProgress(db.Model):
    __tablename__ = "user_topic_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "topic_id", name="uq_user_topic"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    topic_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("topics.id", ondelete="CASCADE"), nullable=False, index=True
    )
    completed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    topic: Mapped["Topic"] = relationship("Topic", back_populates="progress_entries")

    def __repr__(self) -> str:
        return f"<UserTopicProgress user={self.user_id} topic={self.topic_id}>"
