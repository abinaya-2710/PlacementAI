"""routes/notifications.py — Notifications API."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models.notification import Notification
from utils.helpers import success_response, error_response

notifications_bp = Blueprint("notifications", __name__)


@notifications_bp.get("/")
@jwt_required()
def list_notifications():
    uid      = int(get_jwt_identity())
    page     = max(1, int(request.args.get("page", 1)))
    per_page = min(50, int(request.args.get("per_page", 20)))
    unread   = request.args.get("unread") == "true"

    q = Notification.query.filter_by(user_id=uid)
    if unread: q = q.filter_by(is_read=False)
    q = q.order_by(Notification.created_at.desc())

    total  = q.count()
    notifs = q.offset((page - 1) * per_page).limit(per_page).all()
    unread_count = Notification.query.filter_by(user_id=uid, is_read=False).count()

    return success_response(data={
        "notifications": [n.to_dict() for n in notifs],
        "total": total, "unread_count": unread_count,
    })


@notifications_bp.post("/<int:nid>/read")
@jwt_required()
def mark_read(nid: int):
    uid = int(get_jwt_identity())
    n   = Notification.query.filter_by(id=nid, user_id=uid).first()
    if not n:
        return error_response("Notification not found.", 404)
    n.is_read = True
    db.session.commit()
    return success_response(message="Marked as read.")


@notifications_bp.post("/read-all")
@jwt_required()
def mark_all_read():
    uid = int(get_jwt_identity())
    Notification.query.filter_by(user_id=uid, is_read=False).update({"is_read": True})
    db.session.commit()
    return success_response(message="All notifications marked as read.")


@notifications_bp.get("/unread-count")
@jwt_required()
def unread_count():
    uid   = int(get_jwt_identity())
    count = Notification.query.filter_by(user_id=uid, is_read=False).count()
    return success_response(data={"count": count})
