"""routes/interview.py — Interview Preparation API."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models.interview import InterviewQuestion, InterviewBookmark, InterviewExperience
from utils.helpers import success_response, error_response

interview_bp = Blueprint("interview", __name__)


@interview_bp.get("/questions")
def list_questions():
    category = request.args.get("category")
    topic    = request.args.get("topic")
    search   = request.args.get("search", "").strip()
    page     = max(1, int(request.args.get("page", 1)))
    per_page = min(50, int(request.args.get("per_page", 20)))

    q = InterviewQuestion.query.filter_by(is_published=True)
    if category: q = q.filter_by(category=category)
    if topic:    q = q.filter_by(topic=topic)
    if search:   q = q.filter(InterviewQuestion.question.ilike(f"%{search}%"))
    q = q.order_by(InterviewQuestion.order_index)

    total     = q.count()
    questions = q.offset((page - 1) * per_page).limit(per_page).all()
    return success_response(data={"questions": [q.to_dict() for q in questions], "total": total, "page": page})


@interview_bp.post("/questions/<int:qid>/bookmark")
@jwt_required()
def bookmark(qid: int):
    uid = int(get_jwt_identity())
    if not InterviewBookmark.query.filter_by(user_id=uid, question_id=qid).first():
        db.session.add(InterviewBookmark(user_id=uid, question_id=qid))
        db.session.commit()
    return success_response(message="Bookmarked.")


@interview_bp.delete("/questions/<int:qid>/bookmark")
@jwt_required()
def unbookmark(qid: int):
    uid = int(get_jwt_identity())
    row = InterviewBookmark.query.filter_by(user_id=uid, question_id=qid).first()
    if row:
        db.session.delete(row)
        db.session.commit()
    return success_response(message="Removed.")


@interview_bp.get("/experiences")
def list_experiences():
    page     = max(1, int(request.args.get("page", 1)))
    per_page = min(20, int(request.args.get("per_page", 10)))
    company  = request.args.get("company", "").strip()

    q = InterviewExperience.query.filter_by(is_published=True)
    if company: q = q.filter(InterviewExperience.company_name.ilike(f"%{company}%"))
    q = q.order_by(InterviewExperience.created_at.desc())

    total = q.count()
    experiences = q.offset((page - 1) * per_page).limit(per_page).all()
    return success_response(data={"experiences": [e.to_dict() for e in experiences], "total": total})


@interview_bp.post("/experiences")
@jwt_required()
def add_experience():
    uid  = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    if not data.get("company_name") or not data.get("experience"):
        return error_response("company_name and experience are required.", 400)

    exp = InterviewExperience(
        user_id=uid,
        company_name=data.get("company_name", "")[:120],
        role=data.get("role", "Software Engineer")[:120],
        rounds=int(data.get("rounds", 3)),
        result=data.get("result", "Pending"),
        experience=data.get("experience", ""),
        year=data.get("year"),
    )
    db.session.add(exp)
    db.session.commit()
    return success_response(data={"experience": exp.to_dict()}, status_code=201)
