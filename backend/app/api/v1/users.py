"""User Profile and Preferences Endpoints (Developer 2 Boundary).

Endpoints for current user profile, display preferences, and account deletion.
Requires authentication and delegates to IUserService.
"""

from typing import Optional
from fastapi import APIRouter, Depends, status
from pydantic import Field

from app.api.deps import get_current_principal, get_user_service
from app.interfaces.auth import IUserService
from app.schemas.auth import CurrentPrincipal, UserPreferences, UserProfileResponse
from app.schemas.common import BaseSchema

router = APIRouter(prefix="/users/me", tags=["User Profile & Preferences"])


class UpdateProfileRequest(BaseSchema):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    avatar: Optional[str] = Field(None, max_length=512)


@router.get(
    "/profile",
    response_model=UserProfileResponse,
    status_code=status.HTTP_200_OK,
    summary="Get User Profile",
    openapi_extra={"x-implementation-status": "planned", "x-owner": "developer-2"},
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
    openapi_extra={"x-implementation-status": "planned", "x-owner": "developer-2"},
)
async def update_profile(
    payload: UpdateProfileRequest,
    principal: CurrentPrincipal = Depends(get_current_principal),
    user_service: IUserService = Depends(get_user_service),
) -> UserProfileResponse:
    """Updates display name or avatar. Owned by Developer 2."""
    return await user_service.update_profile(
        user_id=principal.user_id, name=payload.name, avatar=payload.avatar
    )


@router.get(
    "/preferences",
    response_model=UserPreferences,
    status_code=status.HTTP_200_OK,
    summary="Get User Preferences",
    openapi_extra={"x-implementation-status": "planned", "x-owner": "developer-2"},
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
    openapi_extra={"x-implementation-status": "planned", "x-owner": "developer-2"},
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


@router.delete(
    "",
    status_code=status.HTTP_200_OK,
    summary="Delete User Account",
    openapi_extra={"x-implementation-status": "planned", "x-owner": "developer-2"},
)
async def delete_account(
    principal: CurrentPrincipal = Depends(get_current_principal),
    user_service: IUserService = Depends(get_user_service),
) -> dict:
    """Deletes current user account. Owned by Developer 2."""
    success = await user_service.delete_account(user_id=principal.user_id)
    return {"deleted": success, "userId": principal.user_id}
