"""FastAPI Dependency Injection Providers.

Provides dependencies for:
1. Async database session (get_db_session)
2. Fail-closed authentication (get_current_principal)
3. Module service interfaces (IAuthService, IBattleService, etc.)
"""

from typing import AsyncGenerator, Optional
from fastapi import Cookie, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import AuthenticationError, ModuleNotImplementedError
from app.db.session import get_db
from app.interfaces.auth import IAuthService, IUserService
from app.interfaces.battles import (
    IBattleService,
    IBattleStreamService,
    ISavedAnswerService,
    IShareService,
)
from app.interfaces.billing import IBillingService, IUsageService
from app.interfaces.model_gateway import IModelGatewayService
from app.schemas.auth import CurrentPrincipal


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """Provides an active async database session for the request scope."""
    async for session in get_db():
        yield session


async def get_current_principal(
    authorization: Optional[str] = Header(None, alias="Authorization"),
    session_cookie: Optional[str] = Cookie(None, alias="sangram_session"),
) -> CurrentPrincipal:
    """Authenticates caller identity.
    
    SECURITY GUARANTEE:
    This dependency strictly FAILS CLOSED until Developer 2 connects the live
    JWT/Session authentication engine. It NEVER falls back to demo identity,
    never accepts dummy tokens, and never bypasses authentication.
    
    Tests inject mock principals cleanly via app.dependency_overrides.
    """
    token = None
    if authorization:
        parts = authorization.strip().split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            token = parts[1]
    elif session_cookie:
        token = session_cookie

    if not token:
        raise AuthenticationError(
            message="Authentication credentials were not provided. Please log in.",
            details={"required_schemes": ["Bearer <jwt>", "Cookie: sangram_session"]},
        )

    # In Developer 1's foundation, real token validation is pending Developer 2's implementation.
    # Therefore, any token provided fails closed as invalid/unverified until Developer 2 implements IAuthService.
    raise AuthenticationError(
        message="Authentication token could not be verified: Real auth service is not yet connected by Developer 2.",
        details={"implementation_status": "pending_developer_2"},
    )


async def get_optional_principal(
    authorization: Optional[str] = Header(None, alias="Authorization"),
    session_cookie: Optional[str] = Cookie(None, alias="sangram_session"),
) -> Optional[CurrentPrincipal]:
    """Returns authenticated principal if valid, or None for public endpoints."""
    try:
        return await get_current_principal(authorization, session_cookie)
    except AuthenticationError:
        return None


# ------------------------------------------------------------------------------
# Module Service Dependencies (Overridden when modules are implemented)
# ------------------------------------------------------------------------------

def get_auth_service() -> IAuthService:
    """Returns IAuthService implementation or raises 501."""
    raise ModuleNotImplementedError(module_name="Authentication & Sessions", owner="Developer 2")


def get_user_service() -> IUserService:
    """Returns IUserService implementation or raises 501."""
    raise ModuleNotImplementedError(module_name="User Profile & Preferences", owner="Developer 2")


def get_model_gateway_service() -> IModelGatewayService:
    """Returns IModelGatewayService implementation or raises 501."""
    raise ModuleNotImplementedError(module_name="AI Provider Gateway", owner="Developer 3")


def get_battle_service() -> IBattleService:
    """Returns IBattleService implementation or raises 501."""
    raise ModuleNotImplementedError(module_name="Dialectic Battles Orchestrator", owner="Developer 4")


def get_battle_stream_service() -> IBattleStreamService:
    """Returns IBattleStreamService implementation or raises 501."""
    raise ModuleNotImplementedError(module_name="Battle Event Streaming (SSE)", owner="Developer 4")


def get_share_service() -> IShareService:
    """Returns IShareService implementation or raises 501."""
    raise ModuleNotImplementedError(module_name="Share Links", owner="Developer 4")


def get_saved_answer_service() -> ISavedAnswerService:
    """Returns ISavedAnswerService implementation or raises 501."""
    raise ModuleNotImplementedError(module_name="Saved Answers & ADRs", owner="Developer 4")


def get_billing_service() -> IBillingService:
    """Returns IBillingService implementation or raises 501."""
    raise ModuleNotImplementedError(module_name="Billing & Payments Gateway", owner="Developer 5")


def get_usage_service() -> IUsageService:
    """Returns IUsageService implementation or raises 501."""
    raise ModuleNotImplementedError(module_name="Usage & Quota Entitlements", owner="Developer 5")
