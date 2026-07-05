"""models/practice.py — Coding Practice models."""
from datetime import datetime, timezone
from sqlalchemy import Integer, String, Text, Boolean, DateTime, ForeignKey, Enum as SAEnum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from database import db


class Problem(db.Model):
    __tablename__ = "problems"

    id:          Mapped[int]  = mapped_column(Integer, primary_key=True, autoincrement=True)
    title:       Mapped[str]  = mapped_column(String(200), nullable=False)
    slug:        Mapped[str]  = mapped_column(String(200), unique=True, nullable=False, index=True)
    topic:       Mapped[str]  = mapped_column(String(80),  nullable=False, index=True)
    difficulty:  Mapped[str]  = mapped_column(SAEnum("Easy","Medium","Hard", name="prob_diff"), nullable=False, default="Easy")
    description: Mapped[str]  = mapped_column(Text, nullable=False, default="")
    examples:    Mapped[str]  = mapped_column(Text, nullable=True)     # JSON string
    constraints: Mapped[str]  = mapped_column(Text, nullable=True)
    editorial:   Mapped[str]  = mapped_column(Text, nullable=True)
    companies:   Mapped[str]  = mapped_column(String(500), nullable=True)  # comma-separated
    order_index: Mapped[int]  = mapped_column(Integer, nullable=False, default=0)
    is_published:Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="1")
    created_at:  Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))

    def to_dict(self, solved: bool = False, bookmarked: bool = False, full: bool = False) -> dict:
        d = {
            "id": self.id, "title": self.title, "slug": self.slug,
            "topic": self.topic, "difficulty": self.difficulty,
            "companies": self.companies or "",
            "solved": solved, "bookmarked": bookmarked,
        }
        if full:
            d.update({"description": self.description, "examples": self.examples,
                      "constraints": self.constraints, "editorial": self.editorial})
        return d


class ProblemSolved(db.Model):
    __tablename__ = "problem_solved"
    __table_args__ = (UniqueConstraint("user_id","problem_id", name="uq_solved"),)

    id:         Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id:    Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    problem_id: Mapped[int] = mapped_column(Integer, ForeignKey("problems.id", ondelete="CASCADE"), nullable=False, index=True)
    solved_at:  Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))


class ProblemBookmark(db.Model):
    __tablename__ = "problem_bookmarks"
    __table_args__ = (UniqueConstraint("user_id","problem_id", name="uq_prob_bm"),)

    id:         Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id:    Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    problem_id: Mapped[int] = mapped_column(Integer, ForeignKey("problems.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
