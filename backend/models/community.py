"""models/community.py — Community Forum models."""
from datetime import datetime, timezone
from sqlalchemy import Integer, String, Text, Boolean, DateTime, ForeignKey, Enum as SAEnum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import db


class Post(db.Model):
    __tablename__ = "posts"

    id:           Mapped[int]  = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id:      Mapped[int]  = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title:        Mapped[str]  = mapped_column(String(300), nullable=False)
    body:         Mapped[str]  = mapped_column(Text, nullable=False)
    tag:          Mapped[str]  = mapped_column(SAEnum("DSA","Placement","Resume","Aptitude","Interview","General", name="post_tag"), nullable=False, default="General")
    is_pinned:    Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="0")
    is_published: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, server_default="1")
    created_at:   Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc), index=True)

    comments: Mapped[list["Comment"]] = relationship("Comment", cascade="all, delete-orphan")
    likes:    Mapped[list["PostLike"]] = relationship("PostLike", cascade="all, delete-orphan")

    def to_dict(self, like_count: int = 0, comment_count: int = 0, liked: bool = False) -> dict:
        return {
            "id": self.id, "user_id": self.user_id, "title": self.title,
            "body": self.body, "tag": self.tag, "is_pinned": self.is_pinned,
            "like_count": like_count, "comment_count": comment_count, "liked": liked,
            "created_at": self.created_at.isoformat(),
        }


class Comment(db.Model):
    __tablename__ = "comments"

    id:         Mapped[int]  = mapped_column(Integer, primary_key=True, autoincrement=True)
    post_id:    Mapped[int]  = mapped_column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id:    Mapped[int]  = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    body:       Mapped[str]  = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> dict:
        return {"id": self.id, "post_id": self.post_id, "user_id": self.user_id,
                "body": self.body, "created_at": self.created_at.isoformat()}


class PostLike(db.Model):
    __tablename__ = "post_likes"
    __table_args__ = (UniqueConstraint("user_id","post_id", name="uq_post_like"),)

    id:         Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id:    Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    post_id:    Mapped[int] = mapped_column(Integer, ForeignKey("posts.id",  ondelete="CASCADE"), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
