"""models/notification.py — Notifications model."""
from datetime import datetime, timezone
from sqlalchemy import Integer, String, Text, Boolean, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column
from database import db


class Notification(db.Model):
    __tablename__ = "notifications"

    id:          Mapped[int]  = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id:     Mapped[int]  = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type:        Mapped[str]  = mapped_column(SAEnum("streak","achievement","reminder","system", name="notif_type"), nullable=False, default="system")
    title:       Mapped[str]  = mapped_column(String(200), nullable=False)
    body:        Mapped[str]  = mapped_column(Text, nullable=False)
    is_read:     Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="0")
    created_at:  Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc), index=True)

    def to_dict(self) -> dict:
        return {
            "id": self.id, "type": self.type, "title": self.title,
            "body": self.body, "is_read": self.is_read,
            "created_at": self.created_at.isoformat(),
        }
