"""Pytest Configuration and Shared Test Fixtures.

Configures test transport, ASGI client, and mock principal providers.
Test doubles remain strictly confined to the tests package.
"""

import sys
from pathlib import Path
from typing import AsyncGenerator
import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

# Ensure backend root is on sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.api.deps import get_current_principal
from app.main import create_app
from app.schemas.auth import CurrentPrincipal


@pytest.fixture
def test_app():
    """Builds a fresh FastAPI app instance for testing."""
    return create_app()


@pytest_asyncio.fixture
async def async_client(test_app) -> AsyncGenerator[AsyncClient, None]:
    """Provides an HTTPX AsyncClient bound to the FastAPI application via ASGITransport."""
    transport = ASGITransport(app=test_app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client


@pytest.fixture
def mock_principal() -> CurrentPrincipal:
    """Provides a valid test principal for testing authorized routes."""
    return CurrentPrincipal(
        user_id="usr_test_1234567890",
        email="developer@sangram.ai",
        role="user",
        tier="pro",
        permissions=["run_battles", "export_adr"],
        is_authenticated=True,
    )


@pytest.fixture
def authenticated_app(test_app, mock_principal):
    """FastAPI app with get_current_principal overridden with a test principal."""
    test_app.dependency_overrides[get_current_principal] = lambda: mock_principal
    yield test_app
    test_app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def auth_client(authenticated_app) -> AsyncGenerator[AsyncClient, None]:
    """AsyncClient authenticated as mock_principal."""
    transport = ASGITransport(app=authenticated_app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client
