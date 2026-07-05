from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from database import db
from models.practice import Problem, ProblemBookmark, ProblemSolved
from utils.helpers import success_response, error_response

practice_bp = Blueprint("practice", __name__)


def _optional_uid():
    try:
        verify_jwt_in_request(optional=True)
        uid = get_jwt_identity()
        return int(uid) if uid else None
    except Exception:
        return None


@practice_bp.get("/")
def list_problems():
    uid = _optional_uid()
    topic      = request.args.get("topic")
    difficulty = request.args.get("difficulty")
    company    = request.args.get("company")
    search     = request.args.get("search", "").strip()
    page       = max(1, int(request.args.get("page", 1)))
    per_page   = min(50, int(request.args.get("per_page", 20)))

    q = Problem.query.filter_by(is_published=True)
    if topic:      q = q.filter_by(topic=topic)
    if difficulty: q = q.filter_by(difficulty=difficulty)
    if company:    q = q.filter(Problem.companies.contains(company))
    if search:     q = q.filter(Problem.title.ilike(f"%{search}%"))
    q = q.order_by(Problem.order_index)

    total     = q.count()
    problems  = q.offset((page - 1) * per_page).limit(per_page).all()

    solved_ids   = set()
    bookmark_ids = set()
    if uid:
        solved_ids   = {r.problem_id for r in ProblemSolved.query.filter_by(user_id=uid).all()}
        bookmark_ids = {r.problem_id for r in ProblemBookmark.query.filter_by(user_id=uid).all()}

    return success_response(data={
        "problems":  [p.to_dict(solved=p.id in solved_ids, bookmarked=p.id in bookmark_ids) for p in problems],
        "total":     total,
        "page":      page,
        "per_page":  per_page,
        "topics":    sorted({p.topic for p in Problem.query.with_entities(Problem.topic).distinct()}),
    })


@practice_bp.get("/<int:problem_id>")
def get_problem(problem_id: int):
    uid = _optional_uid()
    p = Problem.query.get_or_404(problem_id)
    solved     = bool(uid and ProblemSolved.query.filter_by(user_id=uid, problem_id=problem_id).first())
    bookmarked = bool(uid and ProblemBookmark.query.filter_by(user_id=uid, problem_id=problem_id).first())
    return success_response(data={"problem": p.to_dict(solved=solved, bookmarked=bookmarked, full=True)})


@practice_bp.post("/<int:problem_id>/solve")
@jwt_required()
def mark_solved(problem_id: int):
    uid = int(get_jwt_identity())
    if not Problem.query.get(problem_id):
        return error_response("Problem not found.", 404)
    if not ProblemSolved.query.filter_by(user_id=uid, problem_id=problem_id).first():
        db.session.add(ProblemSolved(user_id=uid, problem_id=problem_id))
        db.session.commit()
    return success_response(message="Marked as solved.")


@practice_bp.delete("/<int:problem_id>/solve")
@jwt_required()
def unmark_solved(problem_id: int):
    uid = int(get_jwt_identity())
    row = ProblemSolved.query.filter_by(user_id=uid, problem_id=problem_id).first()
    if row:
        db.session.delete(row)
        db.session.commit()
    return success_response(message="Unmarked as solved.")


@practice_bp.post("/<int:problem_id>/bookmark")
@jwt_required()
def add_bookmark(problem_id: int):
    uid = int(get_jwt_identity())
    if not Problem.query.get(problem_id):
        return error_response("Problem not found.", 404)
    if not ProblemBookmark.query.filter_by(user_id=uid, problem_id=problem_id).first():
        db.session.add(ProblemBookmark(user_id=uid, problem_id=problem_id))
        db.session.commit()
    return success_response(message="Bookmarked.")


@practice_bp.delete("/<int:problem_id>/bookmark")
@jwt_required()
def remove_bookmark(problem_id: int):
    uid = int(get_jwt_identity())
    row = ProblemBookmark.query.filter_by(user_id=uid, problem_id=problem_id).first()
    if row:
        db.session.delete(row)
        db.session.commit()
    return success_response(message="Bookmark removed.")
