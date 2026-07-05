"""models/resource.py — Learning Resources model."""
from datetime import datetime, timezone
from sqlalchemy import Integer, String, Text, Boolean, DateTime, ForeignKey, Enum as SAEnum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from database import db


class Resource(db.Model):
    __tablename__ = "resources"

    id:           Mapped[int]  = mapped_column(Integer, primary_key=True, autoincrement=True)
    title:        Mapped[str]  = mapped_column(String(300), nullable=False)
    type:         Mapped[str]  = mapped_column(SAEnum("video","notes","pdf","link","cheatsheet", name="res_type"), nullable=False, default="link")
    topic:        Mapped[str]  = mapped_column(String(100), nullable=False, index=True)
    url:          Mapped[str]  = mapped_column(String(800), nullable=False)
    description:  Mapped[str]  = mapped_column(Text, nullable=True)
    source:       Mapped[str]  = mapped_column(String(200), nullable=True)   # e.g. "YouTube", "GeeksForGeeks"
    is_free:      Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="1")
    order_index:  Mapped[int]  = mapped_column(Integer, nullable=False, default=0)
    is_published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="1")
    created_at:   Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {
            "id": self.id, "title": self.title, "type": self.type,
            "topic": self.topic, "url": self.url,
            "description": self.description or "", "source": self.source or "",
            "is_free": self.is_free,
        }


class ResourceBookmark(db.Model):
    __tablename__ = "resource_bookmarks"
    __table_args__ = (UniqueConstraint("user_id","resource_id", name="uq_res_bm"),)

    id:          Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id:     Mapped[int] = mapped_column(Integer, ForeignKey("users.id",    ondelete="CASCADE"), nullable=False, index=True)
    resource_id: Mapped[int] = mapped_column(Integer, ForeignKey("resources.id",ondelete="CASCADE"), nullable=False)
    created_at:  Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
