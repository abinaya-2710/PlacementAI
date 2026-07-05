"""
app.py — Flask application factory.

Usage
-----
  # Development (from backend/ directory):
  python app.py

  # Via Flask CLI:
  set FLASK_APP=app.py
  flask run

  # Production (example with gunicorn):
  gunicorn "app:create_app()"
"""

import os
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from dotenv import load_dotenv

from config import get_config
from database import db
from middleware.error_handler import register_error_handlers
from routes import register_blueprints

# Load environment variables from .env
load_dotenv()

# ── Extension instances (no app bound yet) ─────────────────────────────────────
jwt    = JWTManager()
bcrypt = Bcrypt()


def create_app(config_class=None) -> Flask:
    """
    Application factory — creates and configures the Flask app.

    Parameters
    ----------
    config_class : Config class (optional)
        Override the config class (useful in tests).
    """
    app = Flask(__name__)

    # ── Load config ────────────────────────────────────────────────────────
    cfg = config_class or get_config()
    app.config.from_object(cfg)

    # ── Initialise extensions ──────────────────────────────────────────────
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    CORS(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=True,
    )

    # ── Register error handlers ────────────────────────────────────────────
    register_error_handlers(app)

    # ── Register route blueprints ──────────────────────────────────────────
    register_blueprints(app)

    # ── JWT additional callbacks ───────────────────────────────────────────
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            "success": False,
            "message": "Your session has expired. Please log in again.",
            "error":   "token_expired",
        }), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            "success": False,
            "message": "Invalid token. Please log in again.",
            "error":   "invalid_token",
        }), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            "success": False,
            "message": "Authentication token is missing.",
            "error":   "authorisation_required",
        }), 401

    # ── Create database tables ─────────────────────────────────────────────
    with app.app_context():
        import models  # noqa: F401 — ensures all models are registered
        db.create_all()
        app.logger.info("✅ Database tables created / verified.")

        # Auto-seed if database has no roadmaps
        from models.roadmap import Roadmap
        if Roadmap.query.count() == 0:
            app.logger.info("🌱 Database is empty. Running auto-seeding...")
            try:
                # 1. Seed Roadmaps
                from migrations.seed_roadmaps import ROADMAP_DATA
                from models.roadmap import Topic
                for rm_data in ROADMAP_DATA:
                    roadmap = Roadmap(
                        slug=rm_data["slug"],
                        title=rm_data["title"],
                        description=rm_data["description"],
                        icon=rm_data["icon"],
                        category=rm_data["category"],
                        estimated_hours=rm_data["estimated_hours"],
                        order_index=rm_data["order_index"],
                    )
                    db.session.add(roadmap)
                    db.session.commit()
                    
                    for idx, (title, diff, level, mins, _) in enumerate(rm_data["topics"]):
                        topic = Topic(
                            roadmap_id=roadmap.id,
                            title=title,
                            description="",
                            difficulty=diff,
                            level=level,
                            order_index=idx,
                            estimated_minutes=mins,
                            is_published=True,
                        )
                        db.session.add(topic)
                    db.session.commit()

                # 2. Seed Coding problems, Aptitude, Companies, Interview questions, Resources
                from migrations.seed_all import PROBLEMS, APTITUDE_QUESTIONS, COMPANIES, INTERVIEW_QUESTIONS, RESOURCES
                from models.practice import Problem
                from models.aptitude import AptitudeQuestion
                from models.company import Company
                from models.interview import InterviewQuestion
                from models.resource import Resource

                # Problems
                for title, topic, diff, comps in PROBLEMS:
                    db.session.add(Problem(
                        title=title, topic=topic, difficulty=diff, companies=comps,
                        slug=title.lower().replace(" ", "-"), is_published=True, order_index=0
                    ))
                db.session.commit()
                
                # Aptitude
                for cat, topic, diff, q, a, b, c, d, correct, exp in APTITUDE_QUESTIONS:
                    db.session.add(AptitudeQuestion(
                        category=cat, topic=topic, difficulty=diff, question=q,
                        option_a=a, option_b=b, option_c=c, option_d=d,
                        correct=correct, explanation=exp
                    ))
                db.session.commit()
                
                # Companies
                for name, slug, ctype, diff, logo, rounds, roles, ctc, order, process, skills in COMPANIES:
                    db.session.add(Company(
                        name=name, slug=slug, type=ctype, difficulty=diff, logo_abbr=logo,
                        interview_rounds=rounds, roles=roles, ctc_range=ctc, order_index=order,
                        hiring_process=process, required_skills=skills
                    ))
                db.session.commit()
                
                # Interview questions
                for i, (cat, topic, q, ans, tips, company, starred) in enumerate(INTERVIEW_QUESTIONS):
                    db.session.add(InterviewQuestion(
                        category=cat, topic=topic, question=q, model_answer=ans,
                        tips=tips, company_name=company, is_starred=starred, order_index=i
                    ))
                db.session.commit()
                
                # Resources
                for i, (rtype, topic, title, url, desc, source) in enumerate(RESOURCES):
                    db.session.add(Resource(
                        type=rtype, topic=topic, title=title, url=url,
                        description=desc, source=source, order_index=i
                    ))
                db.session.commit()

                # 3. Create default admin user if database has no users
                from models.user import User
                from services.auth_service import register_user
                if User.query.count() == 0:
                    register_user({
                        'full_name': 'Admin User',
                        'email': 'admin@email.com',
                        'password': 'password123',
                        'role': 'admin'
                    })
                    app.logger.info("👥 Default admin user created (admin@email.com / password123)")

                app.logger.info("✅ Auto-seeding completed successfully!")
            except Exception as e:
                db.session.rollback()
                app.logger.error(f"❌ Auto-seeding failed: {str(e)}")

    app.logger.info(
        "🚀 PlacePrep AI API started  |  ENV=%s  |  DB=%s",
        app.config.get("FLASK_ENV", "development"),
        app.config.get("SQLALCHEMY_DATABASE_URI"),
    )

    return app


# ── Entry point for direct `python app.py` execution ──────────────────────────
if __name__ == "__main__":
    flask_app = create_app()
    port = int(os.environ.get("PORT", 5000))
    flask_app.run(
        host="0.0.0.0",
        port=port,
        debug=os.environ.get("FLASK_DEBUG", "True") == "True",
    )
