"""routes/companies.py — Company Preparation API."""
from flask import Blueprint, request
from models.company import Company
from utils.helpers import success_response, error_response

companies_bp = Blueprint("companies", __name__)


@companies_bp.get("/")
def list_companies():
    ctype      = request.args.get("type")
    difficulty = request.args.get("difficulty")
    search     = request.args.get("search", "").strip()

    q = Company.query.filter_by(is_published=True)
    if ctype:      q = q.filter_by(type=ctype)
    if difficulty: q = q.filter_by(difficulty=difficulty)
    if search:     q = q.filter(Company.name.ilike(f"%{search}%"))
    companies = q.order_by(Company.order_index).all()

    return success_response(data={"companies": [c.to_dict() for c in companies], "count": len(companies)})


@companies_bp.get("/<slug>")
def get_company(slug: str):
    c = Company.query.filter_by(slug=slug, is_published=True).first()
    if not c:
        return error_response(f"Company '{slug}' not found.", 404)
    return success_response(data={"company": c.to_dict()})
