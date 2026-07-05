# Migrations

Currently using `db.create_all()` for development (SQLite).

When upgrading to PostgreSQL for production, initialise Flask-Migrate:

```bash
pip install Flask-Migrate
flask db init
flask db migrate -m "initial schema"
flask db upgrade
```
