"""models/resume.py — Resume Builder model."""
from datetime import datetime, timezone
from sqlalchemy import Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from database import db


class Resume(db.Model):
    __tablename__ = "resumes"

    id:           Mapped[int]  = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id:      Mapped[int]  = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title:        Mapped[str]  = mapped_column(String(200), nullable=False, default="My Resume")
    template:     Mapped[str]  = mapped_column(String(50),  nullable=False, default="classic")
    # Store resume sections as JSON text blobs
    personal:     Mapped[str]  = mapped_column(Text, nullable=True)     # JSON
    education:    Mapped[str]  = mapped_column(Text, nullable=True)     # JSON array
    skills:       Mapped[str]  = mapped_column(Text, nullable=True)     # JSON
    projects:     Mapped[str]  = mapped_column(Text, nullable=True)     # JSON array
    internships:  Mapped[str]  = mapped_column(Text, nullable=True)     # JSON array
    experience:   Mapped[str]  = mapped_column(Text, nullable=True)     # JSON array
    is_primary:   Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="1")
    created_at:   Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at:   Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False,
                                        default=lambda: datetime.now(timezone.utc),
                                        onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {
            "id": self.id, "user_id": self.user_id, "title": self.title,
            "template": self.template, "personal": self.personal,
            "education": self.education, "skills": self.skills,
            "projects": self.projects, "internships": self.internships,
            "experience": self.experience, "is_primary": self.is_primary,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
