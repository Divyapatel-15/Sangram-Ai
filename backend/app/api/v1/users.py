"""User Profile and Preferences Endpoints (Developer 2 Boundary).

Endpoints for current user profile, display preferences, and account deletion.
Requires authentication and delegates to IUserService.
"""

from typing import Optional
from fastapi import APIRouter, Depends, Response, status
from pydantic import Field

from app.api.deps import get_current_principal, get_user_service
from app.interfaces.auth import IUserService
from app.core.config import get_settings
from app.schemas.auth import (
    CurrentPrincipal,
    DeleteAccountRequest,
    OnboardingRequest,
    UserPreferences,
    UserProfileResponse,
)
from app.schemas.common import BaseSchema

router = APIRouter(prefix="/users/me", tags=["User Profile & Preferences"])


class UpdateProfileRequest(BaseSchema):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    avatar: Optional[str] = Field(None, max_length=512)
    occupation: Optional[str] = Field(None, max_length=64)


@router.get(
    "/profile",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Get User Profile",
    openapi_extra={"x-owner": "developer-2"},
)
async def get_profile(
    principal: CurrentPrincipal = Depends(get_current_principal),
    user_service: IUserService = Depends(get_user_service),
) -> UserProfileResponse:
    """Retrieves profile of current user. Owned by Developer 2."""
    return await user_service.get_profile(user_id=principal.user_id)


@router.put(
    "/profile",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Update User Profile",
    openapi_extra={"x-owner": "developer-2"},
)
async def update_profile(
    payload: UpdateProfileRequest,
    principal: CurrentPrincipal = Depends(get_current_principal),
    user_service: IUserService = Depends(get_user_service),
) -> UserProfileResponse:
    """Updates display name or avatar. Owned by Developer 2."""
    return await user_service.update_profile(
        user_id=principal.user_id, name=payload.name, avatar=payload.avatar, occupation=payload.occupation
    )


@router.get(
    "/preferences",
    response_model=UserPreferences,
    status_code=status.HTTP_200_OK,
    summary="Get User Preferences",
    openapi_extra={"x-owner": "developer-2"},
)
async def get_preferences(
    principal: CurrentPrincipal = Depends(get_current_principal),
    user_service: IUserService = Depends(get_user_service),
) -> UserPreferences:
    """Retrieves theme and motion preferences. Owned by Developer 2."""
    return await user_service.get_preferences(user_id=principal.user_id)


@router.put(
    "/preferences",
    response_model=UserPreferences,
    status_code=status.HTTP_200_OK,
    summary="Update User Preferences",
    openapi_extra={"x-owner": "developer-2"},
)
async def update_preferences(
    payload: UserPreferences,
    principal: CurrentPrincipal = Depends(get_current_principal),
    user_service: IUserService = Depends(get_user_service),
) -> UserPreferences:
    """Updates UI preferences. Owned by Developer 2."""
    return await user_service.update_preferences(
        user_id=principal.user_id, preferences=payload
    )


@router.put(
    "/onboarding",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Complete Onboarding",
)
async def complete_onboarding(
    payload: OnboardingRequest,
    principal: CurrentPrincipal = Depends(get_current_principal),
    user_service: IUserService = Depends(get_user_service),
) -> UserProfileResponse:
    """Stores role, default combatant models and cognitive lens; marks onboarding done."""
    return await user_service.complete_onboarding(user_id=principal.user_id, payload=payload)


@router.delete(
    "",
    status_code=status.HTTP_200_OK,
    summary="Delete User Account",
)
async def delete_account(
    payload: DeleteAccountRequest,
    response: Response,
    principal: CurrentPrincipal = Depends(get_current_principal),
    user_service: IUserService = Depends(get_user_service),
) -> dict:
    """Permanently deletes the account and all owned data after password confirmation."""
    success = await user_service.delete_account(user_id=principal.user_id, password=payload.password)
    st = get_settings()
    response.delete_cookie(st.ACCESS_COOKIE_NAME, path="/", domain=st.COOKIE_DOMAIN)
    response.delete_cookie(st.REFRESH_COOKIE_NAME, path=f"{st.API_V1_PREFIX}/auth", domain=st.COOKIE_DOMAIN)
    return {"deleted": success, "userId": principal.user_id}
