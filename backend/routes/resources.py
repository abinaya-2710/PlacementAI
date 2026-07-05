"""routes/resources.py — Learning Resources API."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models.resource import Resource, ResourceBookmark
from utils.helpers import success_response, error_response

resources_bp = Blueprint("resources", __name__)


@resources_bp.get("/")
def list_resources():
    rtype  = request.args.get("type")
    topic  = request.args.get("topic")
    search = request.args.get("search", "").strip()

    q = Resource.query.filter_by(is_published=True)
    if rtype:  q = q.filter_by(type=rtype)
    if topic:  q = q.filter_by(topic=topic)
    if search: q = q.filter(Resource.title.ilike(f"%{search}%"))
    resources = q.order_by(Resource.order_index).all()

    topics = sorted({r.topic for r in Resource.query.with_entities(Resource.topic).distinct()})
    return success_response(data={"resources": [r.to_dict() for r in resources], "topics": topics})


@resources_bp.post("/<int:rid>/bookmark")
@jwt_required()
def bookmark(rid: int):
    uid = int(get_jwt_identity())
    if not Resource.query.get(rid):
        return error_response("Resource not found.", 404)
    if not ResourceBookmark.query.filter_by(user_id=uid, resource_id=rid).first():
        db.session.add(ResourceBookmark(user_id=uid, resource_id=rid))
        db.session.commit()
    return success_response(message="Bookmarked.")


@resources_bp.delete("/<int:rid>/bookmark")
@jwt_required()
def unbookmark(rid: int):
    uid = int(get_jwt_identity())
    row = ResourceBookmark.query.filter_by(user_id=uid, resource_id=rid).first()
    if row:
        db.session.delete(row)
        db.session.commit()
    return success_response(message="Removed.")
