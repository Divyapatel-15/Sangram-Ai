"""Tests for Fail-Closed Authentication.

Verifies:
1. Protected endpoints strictly reject unauthenticated callers (401 AUTH_FAILED).
2. Protected endpoints reject dummy or unverified tokens (fail-closed).
3. Public endpoints remain accessible without credentials.
4. Dependency injection overrides work cleanly for testing.
"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_protected_route_without_credentials_fails_closed(async_client: AsyncClient):
    """Calling /api/auth/me without credentials returns 401 AUTH_FAILED."""
    response = await async_client.get("/api/auth/me")
    assert response.status_code == 401
    data = response.json()
    assert data["code"] == "AUTH_FAILED"
    assert data["retryable"] is False
    assert data["requestId"] is not None


@pytest.mark.asyncio
async def test_protected_route_with_dummy_token_fails_closed(async_client: AsyncClient):
    """Calling /api/auth/me with dummy token fails closed until Developer 2 connects auth."""
    response = await async_client.get(
        "/api/auth/me",
        headers={"Authorization": "Bearer demo-token-never-accepted"},
    )
    assert response.status_code == 401
    data = response.json()
    assert data["code"] == "AUTH_FAILED"


@pytest.mark.asyncio
async def test_public_models_catalog_accessible_without_credentials(async_client: AsyncClient):
    """Catalog endpoints do not require authentication."""
    response = await async_client.get("/api/models")
    assert response.status_code == 200
    models = response.json()
    assert isinstance(models, list)
    assert len(models) == 6
    assert any(m["id"] == "chatgpt" for m in models)


@pytest.mark.asyncio
async def test_protected_route_succeeds_with_injected_principal(auth_client: AsyncClient):
    """Using test principal dependency override allows authenticated execution."""
    response = await auth_client.get("/api/auth/me")
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == "usr_test_1234567890"
    assert data["email"] == "developer@sangram.ai"
    assert data["tier"] == "pro"
