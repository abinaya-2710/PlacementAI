"""
routes/__init__.py — Registers all API blueprints.
"""

from flask import Flask


def register_blueprints(app: Flask) -> None:
    from routes.health     import health_bp
    from routes.auth       import auth_bp
    from routes.roadmaps   import roadmaps_bp
    from routes.progress   import progress_bp
    from routes.practice   import practice_bp
    from routes.aptitude   import aptitude_bp
    from routes.companies  import companies_bp
    from routes.interview  import interview_bp
    from routes.resume     import resume_bp
    from routes.profile    import profile_bp
    from routes.notifications import notifications_bp
    from routes.leaderboard   import leaderboard_bp
    from routes.community  import community_bp
    from routes.resources  import resources_bp
    from routes.admin      import admin_bp

    app.register_blueprint(health_bp,        url_prefix="/api")
    app.register_blueprint(auth_bp,          url_prefix="/api/auth")
    app.register_blueprint(roadmaps_bp,      url_prefix="/api/roadmaps")
    app.register_blueprint(progress_bp,      url_prefix="/api/progress")
    app.register_blueprint(practice_bp,      url_prefix="/api/practice")
    app.register_blueprint(aptitude_bp,      url_prefix="/api/aptitude")
    app.register_blueprint(companies_bp,     url_prefix="/api/companies")
    app.register_blueprint(interview_bp,     url_prefix="/api/interview")
    app.register_blueprint(resume_bp,        url_prefix="/api/resume")
    app.register_blueprint(profile_bp,       url_prefix="/api/profile")
    app.register_blueprint(notifications_bp, url_prefix="/api/notifications")
    app.register_blueprint(leaderboard_bp,   url_prefix="/api/leaderboard")
    app.register_blueprint(community_bp,     url_prefix="/api/community")
    app.register_blueprint(resources_bp,     url_prefix="/api/resources")
    app.register_blueprint(admin_bp,         url_prefix="/api/admin")
