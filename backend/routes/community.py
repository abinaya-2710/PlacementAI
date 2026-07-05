"""routes/community.py — Community Forum API."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from sqlalchemy import func
from database import db
from models.community import Post, Comment, PostLike
from models.user import User
from utils.helpers import success_response, error_response

community_bp = Blueprint("community", __name__)


def _optional_uid():
    try:
        verify_jwt_in_request(optional=True)
        uid = get_jwt_identity()
        return int(uid) if uid else None
    except Exception:
        return None


def _enrich(post: Post, uid: int | None) -> dict:
    like_count    = PostLike.query.filter_by(post_id=post.id).count()
    comment_count = Comment.query.filter_by(post_id=post.id).count()
    liked         = bool(uid and PostLike.query.filter_by(post_id=post.id, user_id=uid).first())
    user          = User.query.get(post.user_id)
    d             = post.to_dict(like_count=like_count, comment_count=comment_count, liked=liked)
    d["author"]   = user.full_name if user else "Unknown"
    return d


@community_bp.get("/posts")
def list_posts():
    uid      = _optional_uid()
    tag      = request.args.get("tag")
    search   = request.args.get("search", "").strip()
    page     = max(1, int(request.args.get("page", 1)))
    per_page = min(30, int(request.args.get("per_page", 10)))

    q = Post.query.filter_by(is_published=True)
    if tag:    q = q.filter_by(tag=tag)
    if search: q = q.filter(Post.title.ilike(f"%{search}%"))
    q = q.order_by(Post.is_pinned.desc(), Post.created_at.desc())

    total = q.count()
    posts = q.offset((page - 1) * per_page).limit(per_page).all()
    return success_response(data={"posts": [_enrich(p, uid) for p in posts], "total": total})


@community_bp.post("/posts")
@jwt_required()
def create_post():
    uid  = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    if not data.get("title") or not data.get("body"):
        return error_response("title and body are required.", 400)
    post = Post(user_id=uid, title=data["title"][:300], body=data["body"],
                tag=data.get("tag", "General"))
    db.session.add(post)
    db.session.commit()
    return success_response(data={"post": _enrich(post, uid)}, status_code=201)


@community_bp.get("/posts/<int:pid>")
def get_post(pid: int):
    uid  = _optional_uid()
    post = Post.query.get_or_404(pid)
    comments = Comment.query.filter_by(post_id=pid).order_by(Comment.created_at).all()
    d = _enrich(post, uid)
    
    enriched_comments = []
    for c in comments:
        cd = c.to_dict()
        user = User.query.get(c.user_id)
        cd["author"] = user.full_name if user else "Unknown"
        enriched_comments.append(cd)
        
    d["comments"] = enriched_comments
    return success_response(data={"post": d})


@community_bp.post("/posts/<int:pid>/like")
@jwt_required()
def toggle_like(pid: int):
    uid  = int(get_jwt_identity())
    like = PostLike.query.filter_by(post_id=pid, user_id=uid).first()
    if like:
        db.session.delete(like)
        db.session.commit()
        return success_response(message="Unliked.")
    db.session.add(PostLike(post_id=pid, user_id=uid))
    db.session.commit()
    return success_response(message="Liked.")


@community_bp.post("/posts/<int:pid>/comments")
@jwt_required()
def add_comment(pid: int):
    uid  = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    if not data.get("body"):
        return error_response("body is required.", 400)
    c = Comment(post_id=pid, user_id=uid, body=data["body"])
    db.session.add(c)
    db.session.commit()
    
    cd = c.to_dict()
    user = User.query.get(uid)
    cd["author"] = user.full_name if user else "Unknown"
    
    return success_response(data={"comment": cd}, status_code=201)
