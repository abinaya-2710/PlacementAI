"""routes/resume.py — Resume Builder API."""
import json
from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models.resume import Resume
from utils.helpers import success_response, error_response

resume_bp = Blueprint("resume", __name__)


@resume_bp.get("/")
@jwt_required()
def list_resumes():
    uid = int(get_jwt_identity())
    resumes = Resume.query.filter_by(user_id=uid).order_by(Resume.created_at.desc()).all()
    return success_response(data={"resumes": [r.to_dict() for r in resumes]})


@resume_bp.get("/<int:rid>")
@jwt_required()
def get_resume(rid: int):
    uid = int(get_jwt_identity())
    r   = Resume.query.filter_by(id=rid, user_id=uid).first()
    if not r:
        return error_response("Resume not found.", 404)
    return success_response(data={"resume": r.to_dict()})


@resume_bp.post("/")
@jwt_required()
def create_resume():
    uid  = int(get_jwt_identity())
    data = request.get_json(silent=True) or {}
    r = Resume(
        user_id=uid,
        title=data.get("title", "My Resume")[:200],
        template=data.get("template", "classic"),
        personal=json.dumps(data.get("personal", {})),
        education=json.dumps(data.get("education", [])),
        skills=json.dumps(data.get("skills", {})),
        projects=json.dumps(data.get("projects", [])),
        internships=json.dumps(data.get("internships", [])),
        experience=json.dumps(data.get("experience", [])),
    )
    db.session.add(r)
    db.session.commit()
    return success_response(data={"resume": r.to_dict()}, status_code=201)


@resume_bp.put("/<int:rid>")
@jwt_required()
def update_resume(rid: int):
    uid  = int(get_jwt_identity())
    r    = Resume.query.filter_by(id=rid, user_id=uid).first()
    if not r:
        return error_response("Resume not found.", 404)
    data = request.get_json(silent=True) or {}
    if "title"       in data: r.title       = data["title"][:200]
    if "template"    in data: r.template    = data["template"]
    if "personal"    in data: r.personal    = json.dumps(data["personal"])
    if "education"   in data: r.education   = json.dumps(data["education"])
    if "skills"      in data: r.skills      = json.dumps(data["skills"])
    if "projects"    in data: r.projects    = json.dumps(data["projects"])
    if "internships" in data: r.internships = json.dumps(data["internships"])
    if "experience"  in data: r.experience  = json.dumps(data["experience"])
    db.session.commit()
    return success_response(data={"resume": r.to_dict()})


@resume_bp.delete("/<int:rid>")
@jwt_required()
def delete_resume(rid: int):
    uid = int(get_jwt_identity())
    r   = Resume.query.filter_by(id=rid, user_id=uid).first()
    if not r:
        return error_response("Resume not found.", 404)
    db.session.delete(r)
    db.session.commit()
    return success_response(message="Deleted.")
