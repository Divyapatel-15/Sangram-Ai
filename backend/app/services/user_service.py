"""User profile / account service (Developer 2) implementing IUserService.

Every query is scoped by the authenticated user's id (taken from the session,
never from the request body or URL).
"""

from typing import Optional

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import security
from app.core.errors import NotFoundError, ValidationError
from app.proposals.entities import Profile, User
from app.schemas.auth import OnboardingRequest, UserPreferences, UserProfileResponse
from app.services.common import VALID_MOTIONS, VALID_THEMES, build_profile, get_tier

MAX_DEFAULT_MODELS = 6


class UserService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def _load(self, user_id: str) -> tuple[User, Profile]:
        row = (
            await self.db.execute(
                select(User, Profile).join(Profile, Profile.user_id == User.id).where(User.id == user_id)
            )
        ).first()
        if row is None:
            raise NotFoundError("User not found.")
        return row[0], row[1]

    async def _response(self, user: User, profile: Profile) -> UserProfileResponse:
        return build_profile(user, profile, await get_tier(self.db, user.id))

    async def get_profile(self, user_id: str) -> UserProfileResponse:
        user, profile = await self._load(user_id)
        return await self._response(user, profile)

    async def update_profile(
        self, user_id: str, name: Optional[str] = None, avatar: Optional[str] = None
    ) -> UserProfileResponse:
        user, profile = await self._load(user_id)
        if name is not None:
            name = name.strip()
            if len(name) < 2:
                raise ValidationError("Name must be at least 2 characters.")
            profile.name = name
        if avatar is not None:
            if avatar == "":
                profile.avatar_url = None
            elif avatar.startswith(("https://", "http://")):
                profile.avatar_url = avatar
            else:
                raise ValidationError("Avatar must be an http(s) URL.")
        await self.db.commit()
        return await self._response(user, profile)

    async def get_preferences(self, user_id: str) -> UserPreferences:
        user, profile = await self._load(user_id)
        return (await self._response(user, profile)).preferences

    async def update_preferences(self, user_id: str, preferences: UserPreferences) -> UserPreferences:
        user, profile = await self._load(user_id)
        if preferences.theme not in VALID_THEMES:
            raise ValidationError(f"theme must be one of {sorted(VALID_THEMES)}.")
        if preferences.motion not in VALID_MOTIONS:
            raise ValidationError(f"motion must be one of {sorted(VALID_MOTIONS)}.")
        if len(preferences.default_models) > MAX_DEFAULT_MODELS:
            raise ValidationError("Too many default models.")
        profile.theme = preferences.theme
        profile.motion = preferences.motion
        profile.default_models = list(preferences.default_models)
        profile.default_archetype = preferences.default_archetype
        await self.db.commit()
        return (await self._response(user, profile)).preferences

    async def complete_onboarding(self, user_id: str, payload: OnboardingRequest) -> UserProfileResponse:
        user, profile = await self._load(user_id)
        profile.occupation = payload.occupation
        profile.default_models = list(dict.fromkeys(payload.models))
        profile.default_archetype = payload.archetype
        profile.onboarding_completed = True
        await self.db.commit()
        return await self._response(user, profile)

    async def delete_account(self, user_id: str, password: str) -> bool:
        user = (await self.db.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
        if user is None:
            raise NotFoundError("User not found.")
        if not security.verify_password(password, user.password_hash):
            raise ValidationError("Password is incorrect.", details=[{"loc": ["password"]}])
        # Core DELETE: the database's ON DELETE CASCADE removes profile, sessions, battles
        # (and their messages/summaries/share links), saved answers, subscription, invoices, usage.
        await self.db.execute(delete(User).where(User.id == user_id))
        await self.db.commit()
        return True
