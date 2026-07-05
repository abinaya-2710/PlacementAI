"""
database.py — SQLAlchemy database instance.

Centralised here so all models can import `db` from a single location
without creating circular imports.
"""

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """
    Shared declarative base for all models.
    Using the new SQLAlchemy 2.x style with Flask-SQLAlchemy 3.x.
    """
    pass


# Single shared SQLAlchemy instance — imported by every model and app factory
db = SQLAlchemy(model_class=Base)
