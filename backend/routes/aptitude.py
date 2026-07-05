"""routes/aptitude.py — Aptitude Practice API."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from database import db
from models.aptitude import AptitudeQuestion, AptitudeAttempt
from utils.helpers import success_response, error_response

aptitude_bp = Blueprint("aptitude", __name__)


def _optional_uid():
    try:
        verify_jwt_in_request(optional=True)
        uid = get_jwt_identity()
        return int(uid) if uid else None
    except Exception:
        return None


@aptitude_bp.get("/")
def list_questions():
    category   = request.args.get("category")
    topic      = request.args.get("topic")
    difficulty = request.args.get("difficulty")
    limit      = min(50, int(request.args.get("limit", 20)))
    page       = max(1, int(request.args.get("page", 1)))

    q = AptitudeQuestion.query.filter_by(is_published=True)
    if category:   q = q.filter_by(category=category)
    if topic:      q = q.filter_by(topic=topic)
    if difficulty: q = q.filter_by(difficulty=difficulty)
    q = q.order_by(AptitudeQuestion.order_index)

    total     = q.count()
    questions = q.offset((page - 1) * limit).limit(limit).all()
    topics    = sorted({r.topic for r in AptitudeQuestion.query.with_entities(AptitudeQuestion.topic).distinct()})

    return success_response(data={
        "questions": [q.to_dict(hide_answer=True) for q in questions],
        "total": total, "page": page, "topics": topics,
    })


@aptitude_bp.get("/<int:qid>")
def get_question(qid: int):
    q = AptitudeQuestion.query.get_or_404(qid)
    return success_response(data={"question": q.to_dict(hide_answer=False)})


@aptitude_bp.post("/<int:qid>/attempt")
@jwt_required()
def attempt(qid: int):
    uid  = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    selected = data.get("selected", "").upper()
    if selected not in ("A", "B", "C", "D"):
        return error_response("selected must be A, B, C, or D.", 400)

    q = AptitudeQuestion.query.get_or_404(qid)
    is_correct = q.correct == selected
    db.session.add(AptitudeAttempt(user_id=uid, question_id=qid, selected=selected, is_correct=is_correct))
    db.session.commit()

    return success_response(data={"correct": is_correct, "answer": q.correct, "explanation": q.explanation or ""})


@aptitude_bp.get("/stats")
@jwt_required()
def stats():
    uid = int(get_jwt_identity())
    total    = AptitudeAttempt.query.filter_by(user_id=uid).count()
    correct  = AptitudeAttempt.query.filter_by(user_id=uid, is_correct=True).count()
    accuracy = round(correct / total * 100) if total else 0
    return success_response(data={"total_attempts": total, "correct": correct, "accuracy": accuracy})
