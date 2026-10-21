"""Authentication and User Service Interfaces (Developer 2 Boundary).

Defines the typed protocol Developer 2 must implement for user authentication,
sessions, and profile persistence.
"""

from typing import Optional, Protocol, runtime_checkable
from app.schemas.auth import (
    CurrentPrincipal,
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserPreferences,
    UserProfileResponse,
)


@runtime_checkable
class IAuthService(Protocol):
    """Contract for user identity, JWT issuing, password management, and email verification."""

    async def authenticate(self, credentials: LoginRequest) -> TokenResponse:
        """Validates credentials and returns signed JWT access + refresh tokens.
        
        Raises:
            AuthenticationError: If credentials do not match.
        """
        ...

    async def register(self, payload: RegisterRequest) -> UserProfileResponse:
        """Registers a new user account, creates default profile, sends verification code.
        
        Raises:
            ConflictError: If email is already registered.
            ValidationError: If password policy is violated.
        """
        ...

    async def verify_token(self, token: str) -> CurrentPrincipal:
        """Decodes and validates JWT bearer token, returning CurrentPrincipal.
        
        Raises:
            AuthenticationError: If token is expired, invalid, or revoked.
        """
        ...

    async def refresh_tokens(self, refresh_token: str) -> TokenResponse:
        """Exchanges a valid refresh token for a fresh access token."""
        ...

    async def verify_email(self, user_id: str, code: str) -> bool:
        """Validates a 6-digit confirmation code and marks user as verified."""
        ...

    async def forgot_password(self, email: str) -> bool:
        """Generates a secure password reset token and dispatches reset instructions."""
        ...

    async def reset_password(self, token: str, new_password: str) -> bool:
        """Consumes a reset token and updates the user's password hash."""
        ...


@runtime_checkable
class IUserService(Protocol):
    """Contract for user profile and preference retrieval/mutation."""

    async def get_profile(self, user_id: str) -> UserProfileResponse:
        """Retrieves user profile by ID.
        
        Raises:
            NotFoundError: If user does not exist.
        """
        ...

    async def update_profile(
        self, user_id: str, name: Optional[str] = None, avatar: Optional[str] = None
    ) -> UserProfileResponse:
        """Updates user display name or avatar."""
        ...

    async def get_preferences(self, user_id: str) -> UserPreferences:
        """Retrieves user UI/motion preferences."""
        ...

    async def update_preferences(self, user_id: str, preferences: UserPreferences) -> UserPreferences:
        """Persists updated preferences."""
        ...

    async def delete_account(self, user_id: str) -> bool:
        """Performs soft or hard deletion of user account and cascades owned data."""
        ...
