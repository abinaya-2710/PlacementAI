"""
config.py — Application configuration classes.

Uses the factory pattern so different environments (development,
testing, production) can be selected at startup via FLASK_ENV.
"""

import os
from datetime import timedelta
from dotenv import load_dotenv

# Load .env before reading any os.environ values
load_dotenv()


class BaseConfig:
    """Settings shared across all environments."""

    # ── Flask ──────────────────────────────────────────────────────────────
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "fallback-dev-secret-key")
    JSON_SORT_KEYS: bool = False

    # ── SQLAlchemy ─────────────────────────────────────────────────────────
    SQLALCHEMY_DATABASE_URI: str = os.environ.get(
        "DATABASE_URL", "sqlite:///placeprep.db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False
    SQLALCHEMY_ECHO: bool = False          # Set True in Dev to log SQL queries

    # ── JWT ────────────────────────────────────────────────────────────────
    JWT_SECRET_KEY: str = os.environ.get(
        "JWT_SECRET_KEY", "fallback-dev-jwt-secret-key"
    )
    JWT_ACCESS_TOKEN_EXPIRES  = timedelta(
        hours=int(os.environ.get("JWT_ACCESS_TOKEN_EXPIRES_HOURS", 24))
    )
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(
        days=int(os.environ.get("JWT_REFRESH_TOKEN_EXPIRES_DAYS", 30))
    )
    JWT_TOKEN_LOCATION: list  = ["headers"]
    JWT_HEADER_NAME: str      = "Authorization"
    JWT_HEADER_TYPE: str      = "Bearer"

    # ── CORS ───────────────────────────────────────────────────────────────
    CORS_ORIGINS: list = [
        o.strip()
        for o in os.environ.get(
            "CORS_ORIGINS", "http://localhost:5173,http://localhost:3000"
        ).split(",")
    ]


class DevelopmentConfig(BaseConfig):
    """Development-specific overrides."""
    DEBUG: bool = True
    SQLALCHEMY_ECHO: bool = False   # Flip to True to see SQL in terminal


class TestingConfig(BaseConfig):
    """Testing-specific overrides — uses an in-memory DB."""
    TESTING: bool = True
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///:memory:"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)


class ProductionConfig(BaseConfig):
    """Production-specific overrides."""
    DEBUG: bool = False
    SQLALCHEMY_ECHO: bool = False


# ── Config selector ────────────────────────────────────────────────────────────
CONFIG_MAP: dict = {
    "development": DevelopmentConfig,
    "testing":     TestingConfig,
    "production":  ProductionConfig,
}


def get_config() -> type:
    """Return the correct config class based on FLASK_ENV."""
    env = os.environ.get("FLASK_ENV", "development").lower()
    return CONFIG_MAP.get(env, DevelopmentConfig)
