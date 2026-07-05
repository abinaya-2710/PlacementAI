"""models/company.py — Company Preparation models."""
from datetime import datetime, timezone
from sqlalchemy import Integer, String, Text, Boolean, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column
from database import db


class Company(db.Model):
    __tablename__ = "companies"

    id:               Mapped[int]  = mapped_column(Integer, primary_key=True, autoincrement=True)
    name:             Mapped[str]  = mapped_column(String(120), unique=True, nullable=False, index=True)
    slug:             Mapped[str]  = mapped_column(String(120), unique=True, nullable=False, index=True)
    type:             Mapped[str]  = mapped_column(SAEnum("product","service","finance","startup", name="company_type"), nullable=False, default="service")
    difficulty:       Mapped[str]  = mapped_column(SAEnum("Easy","Medium","Hard", name="company_diff"), nullable=False, default="Medium")
    logo_abbr:        Mapped[str]  = mapped_column(String(4),   nullable=False, default="CO")
    description:      Mapped[str]  = mapped_column(Text, nullable=True)
    hiring_process:   Mapped[str]  = mapped_column(Text, nullable=True)   # JSON/markdown
    required_skills:  Mapped[str]  = mapped_column(Text, nullable=True)   # comma-separated
    interview_rounds: Mapped[int]  = mapped_column(Integer, nullable=False, default=3)
    roles:            Mapped[str]  = mapped_column(String(300), nullable=True)  # comma-separated
    bond_years:       Mapped[int]  = mapped_column(Integer, nullable=True)
    ctc_range:        Mapped[str]  = mapped_column(String(80), nullable=True)
    order_index:      Mapped[int]  = mapped_column(Integer, nullable=False, default=0)
    is_published:     Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="1")
    created_at:       Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {
            "id": self.id, "name": self.name, "slug": self.slug,
            "type": self.type, "difficulty": self.difficulty,
            "logo_abbr": self.logo_abbr, "description": self.description or "",
            "hiring_process": self.hiring_process or "",
            "required_skills": self.required_skills or "",
            "interview_rounds": self.interview_rounds,
            "roles": self.roles or "",
            "ctc_range": self.ctc_range or "",
        }
