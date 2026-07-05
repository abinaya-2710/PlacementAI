"""
models/user.py — User database model.

Columns
-------
id            : Primary key (auto-increment integer)
full_name     : Student's full name
email         : Unique email address used for login
password_hash : bcrypt-hashed password — never store plain text
role          : 'student' (default) or 'admin'
is_active     : Soft-disable accounts without deleting
created_at    : UTC timestamp when record was inserted
updated_at    : UTC timestamp auto-updated on every save
"""

from datetime import datetime, timezone
from sqlalchemy import Integer, String, Boolean, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column
from database import db


class User(db.Model):
    __tablename__ = "users"

    # ── Primary key ────────────────────────────────────────────────────────
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # ── Identity fields ────────────────────────────────────────────────────
    full_name: Mapped[str] = mapped_column(
        String(120), nullable=False
    )
    email: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False, index=True
    )
    password_hash: Mapped[str] = mapped_column(
        String(255), nullable=False
    )

    # ── Role ───────────────────────────────────────────────────────────────
    role: Mapped[str] = mapped_column(
        SAEnum("student", "admin", name="user_role"),
        nullable=False,
        default="student",
        server_default="student",
    )

    # ── Status ─────────────────────────────────────────────────────────────
    is_active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=True, server_default="1"
    )

    # ── Timestamps ─────────────────────────────────────────────────────────
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # ── Helpers ────────────────────────────────────────────────────────────
    def to_dict(self) -> dict:
        """Return a safe public representation (no password_hash)."""
        return {
            "id":         self.id,
            "full_name":  self.full_name,
            "email":      self.email,
            "role":       self.role,
            "is_active":  self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r} role={self.role!r}>"
