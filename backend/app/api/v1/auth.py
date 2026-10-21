"""Authentication Endpoints (Developer 2 Boundary).

Endpoints for registration, login, token refresh, email verification, and password reset.
Delegates to IAuthService (raises 501 until Developer 2 connects auth implementation).
"""

from fastapi import APIRouter, Depends, Header, Response, status

from app.api.deps import get_auth_service, get_current_principal
from app.interfaces.auth import IAuthService
from app.schemas.auth import (
    CurrentPrincipal,
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserProfileResponse,
    VerifyEmailRequest,
)

router = APIRouter(prefix="/auth", tags=["Authentication & Identity"])


@router.post(
    "/register",
    response_model=UserProfileResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register New User Account",
    openapi_extra={"x-implementation-status": "planned", "x-owner": "developer-2"},
)
async def register(
    payload: RegisterRequest,
    auth_service: IAuthService = Depends(get_auth_service),
) -> UserProfileResponse:
    """User registration. Owned by Developer 2."""
    return await auth_service.register(payload)


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="User Login",
    openapi_extra={"x-implementation-status": "planned", "x-owner": "developer-2"},
)
async def login(
    payload: LoginRequest,
    auth_service: IAuthService = Depends(get_auth_service),
) -> TokenResponse:
    """Authenticates user and returns JWT tokens. Owned by Developer 2."""
    return await auth_service.authenticate(payload)


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    summary="User Logout",
    openapi_extra={"x-implementation-status": "planned", "x-owner": "developer-2"},
)
async def logout(
    response: Response,
    principal: CurrentPrincipal = Depends(get_current_principal),
) -> dict:
    """Terminates session and clears cookies. Owned by Developer 2."""
    response.delete_cookie(key="sangram_session")
    return {"success": True, "message": "Successfully logged out."}


@router.get(
    "/me",
    response_model=CurrentPrincipal,
    status_code=status.HTTP_200_OK,
    summary="Get Current Authenticated Principal",
    openapi_extra={"x-implementation-status": "planned", "x-owner": "developer-2"},
)
async def get_me(
    principal: CurrentPrincipal = Depends(get_current_principal),
) -> CurrentPrincipal:
    """Returns caller's authenticated identity and permissions. Owned by Developer 2."""
    return principal


@router.post(
    "/refresh",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Refresh Access Token",
    openapi_extra={"x-implementation-status": "planned", "x-owner": "developer-2"},
)
async def refresh_tokens(
    refresh_token: str = Header(..., alias="X-Refresh-Token"),
    auth_service: IAuthService = Depends(get_auth_service),
) -> TokenResponse:
    """Exchanges refresh token for new access token. Owned by Developer 2."""
    return await auth_service.refresh_tokens(refresh_token)


@router.post(
    "/verify-email",
    status_code=status.HTTP_200_OK,
    summary="Verify Email Address",
    openapi_extra={"x-implementation-status": "planned", "x-owner": "developer-2"},
)
async def verify_email(
    payload: VerifyEmailRequest,
    principal: CurrentPrincipal = Depends(get_current_principal),
    auth_service: IAuthService = Depends(get_auth_service),
) -> dict:
    """Validates email verification code. Owned by Developer 2."""
    verified = await auth_service.verify_email(user_id=principal.user_id, code=payload.code)
    return {"verified": verified}


@router.post(
    "/forgot-password",
    status_code=status.HTTP_200_OK,
    summary="Request Password Reset",
    openapi_extra={"x-implementation-status": "planned", "x-owner": "developer-2"},
)
async def forgot_password(
    payload: ForgotPasswordRequest,
    auth_service: IAuthService = Depends(get_auth_service),
) -> dict:
    """Sends password reset link. Owned by Developer 2."""
    sent = await auth_service.forgot_password(email=str(payload.email))
    return {"success": sent, "message": "If an account exists, a reset link has been dispatched."}


@router.post(
    "/reset-password",
    status_code=status.HTTP_200_OK,
    summary="Confirm Password Reset",
    openapi_extra={"x-implementation-status": "planned", "x-owner": "developer-2"},
)
async def reset_password(
    payload: ResetPasswordRequest,
    auth_service: IAuthService = Depends(get_auth_service),
) -> dict:
    """Sets new password using reset token. Owned by Developer 2."""
    success = await auth_service.reset_password(token=payload.token, new_password=payload.newPassword)
    return {"success": success, "message": "Password has been successfully updated."}
