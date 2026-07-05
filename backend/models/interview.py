"""models/interview.py — Interview Preparation models."""
from datetime import datetime, timezone
from sqlalchemy import Integer, String, Text, Boolean, DateTime, ForeignKey, Enum as SAEnum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from database import db


class InterviewQuestion(db.Model):
    __tablename__ = "interview_questions"

    id:           Mapped[int]  = mapped_column(Integer, primary_key=True, autoincrement=True)
    category:     Mapped[str]  = mapped_column(SAEnum("hr","technical","behavioral","company", name="int_cat"), nullable=False, index=True)
    topic:        Mapped[str]  = mapped_column(String(100), nullable=False)
    question:     Mapped[str]  = mapped_column(Text, nullable=False)
    model_answer: Mapped[str]  = mapped_column(Text, nullable=True)
    tips:         Mapped[str]  = mapped_column(Text, nullable=True)
    company_name: Mapped[str]  = mapped_column(String(120), nullable=True)   # for company-specific questions
    is_starred:   Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="0")
    order_index:  Mapped[int]  = mapped_column(Integer, nullable=False, default=0)
    is_published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="1")
    created_at:   Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {
            "id": self.id, "category": self.category, "topic": self.topic,
            "question": self.question, "model_answer": self.model_answer or "",
            "tips": self.tips or "", "company_name": self.company_name,
            "is_starred": self.is_starred,
        }


class InterviewBookmark(db.Model):
    __tablename__ = "interview_bookmarks"
    __table_args__ = (UniqueConstraint("user_id","question_id", name="uq_int_bm"),)

    id:          Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id:     Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id: Mapped[int] = mapped_column(Integer, ForeignKey("interview_questions.id", ondelete="CASCADE"), nullable=False)
    created_at:  Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))


class InterviewExperience(db.Model):
    __tablename__ = "interview_experiences"

    id:           Mapped[int]  = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id:      Mapped[int]  = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    company_name: Mapped[str]  = mapped_column(String(120), nullable=False)
    role:         Mapped[str]  = mapped_column(String(120), nullable=False)
    rounds:       Mapped[int]  = mapped_column(Integer, nullable=False, default=3)
    result:       Mapped[str]  = mapped_column(SAEnum("Selected","Rejected","Pending", name="exp_result"), nullable=False, default="Pending")
    experience:   Mapped[str]  = mapped_column(Text, nullable=False)
    year:         Mapped[int]  = mapped_column(Integer, nullable=True)
    is_published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="1")
    created_at:   Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {
            "id": self.id, "company_name": self.company_name, "role": self.role,
            "rounds": self.rounds, "result": self.result,
            "experience": self.experience, "year": self.year,
            "created_at": self.created_at.isoformat(),
        }
