"""models/aptitude.py — Aptitude Practice models."""
from datetime import datetime, timezone
from sqlalchemy import Integer, String, Text, Boolean, DateTime, ForeignKey, Enum as SAEnum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from database import db


class AptitudeQuestion(db.Model):
    __tablename__ = "aptitude_questions"

    id:           Mapped[int]  = mapped_column(Integer, primary_key=True, autoincrement=True)
    category:     Mapped[str]  = mapped_column(SAEnum("quant","logical","verbal", name="apt_cat"), nullable=False, index=True)
    topic:        Mapped[str]  = mapped_column(String(100), nullable=False)
    difficulty:   Mapped[str]  = mapped_column(SAEnum("Easy","Medium","Hard", name="apt_diff"), nullable=False, default="Easy")
    question:     Mapped[str]  = mapped_column(Text, nullable=False)
    option_a:     Mapped[str]  = mapped_column(String(300), nullable=False)
    option_b:     Mapped[str]  = mapped_column(String(300), nullable=False)
    option_c:     Mapped[str]  = mapped_column(String(300), nullable=False)
    option_d:     Mapped[str]  = mapped_column(String(300), nullable=False)
    correct:      Mapped[str]  = mapped_column(String(1), nullable=False)  # A/B/C/D
    explanation:  Mapped[str]  = mapped_column(Text, nullable=True)
    order_index:  Mapped[int]  = mapped_column(Integer, nullable=False, default=0)
    is_published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="1")
    created_at:   Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))

    def to_dict(self, hide_answer: bool = True) -> dict:
        d = {
            "id": self.id, "category": self.category, "topic": self.topic,
            "difficulty": self.difficulty, "question": self.question,
            "option_a": self.option_a, "option_b": self.option_b,
            "option_c": self.option_c, "option_d": self.option_d,
        }
        if not hide_answer:
            d["correct"] = self.correct
            d["explanation"] = self.explanation
        return d


class AptitudeAttempt(db.Model):
    __tablename__ = "aptitude_attempts"

    id:          Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id:     Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id: Mapped[int] = mapped_column(Integer, ForeignKey("aptitude_questions.id", ondelete="CASCADE"), nullable=False)
    selected:    Mapped[str] = mapped_column(String(1), nullable=False)   # A/B/C/D
    is_correct:  Mapped[bool]= mapped_column(Boolean, nullable=False)
    attempted_at:Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
