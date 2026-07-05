"""
migrations/init_db.py — Manual database initialisation script.

Run from the backend/ directory:
    python migrations/init_db.py

This drops and recreates all tables — use only in development.
"""

import sys
import os

# Add backend root to path so imports resolve correctly
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
from database import db
import models  # noqa: F401


def init_db(drop_first: bool = False) -> None:
    app = create_app()
    with app.app_context():
        if drop_first:
            print("⚠️  Dropping all tables…")
            db.drop_all()
        print("🔧 Creating all tables…")
        db.create_all()
        print("✅ Database initialised successfully.")
        # List created tables
        from sqlalchemy import inspect
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        print(f"📋 Tables: {', '.join(tables)}")


if __name__ == "__main__":
    drop = "--drop" in sys.argv
    init_db(drop_first=drop)
