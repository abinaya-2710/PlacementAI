"""models/profile.py — Extended user profile fields."""
from datetime import datetime, timezone
from sqlalchemy import Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from database import db


class UserProfile(db.Model):
    __tablename__ = "user_profiles"

    id:          Mapped[int]  = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id:     Mapped[int]  = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    college:     Mapped[str]  = mapped_column(String(200), nullable=True)
    year:        Mapped[str]  = mapped_column(String(20),  nullable=True)   # "3rd Year"
    branch:      Mapped[str]  = mapped_column(String(100), nullable=True)
    location:    Mapped[str]  = mapped_column(String(100), nullable=True)
    bio:         Mapped[str]  = mapped_column(Text, nullable=True)
    skills:      Mapped[str]  = mapped_column(Text, nullable=True)   # comma-separated
    linkedin_url:Mapped[str]  = mapped_column(String(300), nullable=True)
    github_url:  Mapped[str]  = mapped_column(String(300), nullable=True)
    portfolio_url:Mapped[str] = mapped_column(String(300), nullable=True)
    updated_at:  Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False,
                     default=lambda: datetime.now(timezone.utc),
                     onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {
            "college": self.college or "", "year": self.year or "",
            "branch": self.branch or "", "location": self.location or "",
            "bio": self.bio or "", "skills": self.skills or "",
            "linkedin_url": self.linkedin_url or "",
            "github_url": self.github_url or "",
            "portfolio_url": self.portfolio_url or "",
        }
