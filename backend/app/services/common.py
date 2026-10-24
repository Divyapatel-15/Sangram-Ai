"""Shared helpers for the auth/user services (Developer 2)."""

import json
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.proposals.entities import Profile, Subscription, User
from app.schemas.auth import UserPreferences, UserProfileResponse

VALID_THEMES = {"obsidian", "navy"}
VALID_MOTIONS = {"full", "reduced"}
ACTIVE_SUB_STATES = {"active", "trialing"}


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def aware(dt: Optional[datetime]) -> Optional[datetime]:
    """SQLite returns naive datetimes; PostgreSQL returns aware ones. Normalise to aware UTC."""
    if dt is not None and dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


def normalize_email(email: str) -> str:
    return email.strip().lower()


async def get_tier(db: AsyncSession, user_id: str) -> str:
    row = (
        await db.execute(select(Subscription.plan_id, Subscription.status).where(Subscription.user_id == user_id))
    ).first()
    if row and row.status in ACTIVE_SUB_STATES:
        return row.plan_id
    return "free"


def build_profile(user: User, profile: Optional[Profile], tier: str) -> UserProfileResponse:
    models = profile.default_models if profile and profile.default_models else []
    if isinstance(models, str):  # defensive: legacy JSON-as-text
        models = json.loads(models)
    return UserProfileResponse(
        id=user.id,
        name=profile.name if profile else "",
        email=user.email,
        role=user.role,
        tier=tier,
        avatar=profile.avatar_url if profile else None,
        occupation=profile.occupation if profile else None,
        email_verified=user.is_verified,
        onboarding_completed=profile.onboarding_completed if profile else False,
        preferences=UserPreferences(
            theme=profile.theme if profile else "obsidian",
            motion=profile.motion if profile else "full",
            default_models=list(models),
            default_archetype=profile.default_archetype if profile else None,
        ),
        created_at=aware(user.created_at),
    )
