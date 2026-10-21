"""Tests for Centralized Settings and Production Validation.

Verifies:
1. Valid development settings with safe defaults.
2. Production rejection of DEBUG=True.
3. Production rejection of placeholder/insecure secret keys.
4. Production rejection of wildcard CORS origins.
5. Production rejection of default postgres:postgres@localhost database URL.
"""

import pytest
from pydantic import ValidationError
from app.core.config import Settings


def test_development_settings_defaults():
    """Development settings load with safe local defaults."""
    settings = Settings(ENVIRONMENT="development")
    assert settings.ENVIRONMENT == "development"
    assert settings.DEBUG is False
    assert len(settings.ALLOWED_ORIGINS) == 2
    assert "http://localhost:3000" in settings.ALLOWED_ORIGINS


def test_production_rejects_debug_true():
    """Production settings must reject DEBUG=True."""
    with pytest.raises(ValidationError) as exc:
        Settings(
            ENVIRONMENT="production",
            DEBUG=True,
            SECRET_KEY="super-secure-production-secret-key-32-chars-long!",
            ALLOWED_ORIGINS=["https://app.sangram.ai"],
            DATABASE_URL="postgresql+asyncpg://prod_user:strong_password@db.prod.internal:5432/sangram",
        )
    assert "DEBUG mode must be set to False in production" in str(exc.value)


def test_production_rejects_insecure_secret_key():
    """Production settings must reject insecure or placeholder secret keys."""
    with pytest.raises(ValidationError) as exc:
        Settings(
            ENVIRONMENT="production",
            DEBUG=False,
            SECRET_KEY="dev-insecure-secret-key-change-in-production-min32chars!",
            ALLOWED_ORIGINS=["https://app.sangram.ai"],
            DATABASE_URL="postgresql+asyncpg://prod_user:strong_password@db.prod.internal:5432/sangram",
        )
    assert "cannot be a development placeholder" in str(exc.value)


def test_production_rejects_short_secret_key():
    """Production settings must reject secret keys under 32 characters."""
    with pytest.raises(ValidationError) as exc:
        Settings(
            ENVIRONMENT="production",
            DEBUG=False,
            SECRET_KEY="short-secret-key-less-32",
            ALLOWED_ORIGINS=["https://app.sangram.ai"],
            DATABASE_URL="postgresql+asyncpg://prod_user:strong_password@db.prod.internal:5432/sangram",
        )
    assert "at least 32 characters long" in str(exc.value)


def test_production_rejects_wildcard_cors():
    """Production settings must reject wildcard '*' in ALLOWED_ORIGINS."""
    with pytest.raises(ValidationError) as exc:
        Settings(
            ENVIRONMENT="production",
            DEBUG=False,
            SECRET_KEY="super-secure-production-secret-key-32-chars-long!",
            ALLOWED_ORIGINS=["*"],
            DATABASE_URL="postgresql+asyncpg://prod_user:strong_password@db.prod.internal:5432/sangram",
        )
    assert "Wildcard '*' in ALLOWED_ORIGINS is prohibited" in str(exc.value)


def test_production_rejects_default_db_credentials():
    """Production settings must reject default postgres:postgres localhost URL."""
    with pytest.raises(ValidationError) as exc:
        Settings(
            ENVIRONMENT="production",
            DEBUG=False,
            SECRET_KEY="super-secure-production-secret-key-32-chars-long!",
            ALLOWED_ORIGINS=["https://app.sangram.ai"],
            DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/sangram_ai",
        )
    assert "DATABASE_URL cannot use the default" in str(exc.value)


def test_valid_production_configuration_passes():
    """Properly configured production settings pass validation successfully."""
    settings = Settings(
        ENVIRONMENT="production",
        DEBUG=False,
        SECRET_KEY="a-very-strong-and-cryptographically-secure-production-key-2026",
        ALLOWED_ORIGINS=["https://sangram.ai", "https://app.sangram.ai"],
        DATABASE_URL="postgresql+asyncpg://prod_user:strong_password@db.prod.internal:5432/sangram",
    )
    assert settings.ENVIRONMENT == "production"
    assert settings.DEBUG is False
    assert len(settings.ALLOWED_ORIGINS) == 2
