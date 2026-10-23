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


# ---------------------------------------------------------------------------
# Real-auth fixtures (Developer 2): in-memory SQLite, real services, captured email
# ---------------------------------------------------------------------------
import re

from sqlalchemy import event
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

import app.db.auth_models  # noqa: F401
import app.proposals.entities  # noqa: F401
from app.api.deps import get_db_session, get_email_sender
from app.db.base import Base


class Outbox:
    """Captures emails instead of sending them."""

    def __init__(self):
        self.messages = []

    async def send(self, to, subject, body):
        self.messages.append({"to": to, "subject": subject, "body": body})

    def last_code(self) -> str:
        return re.search(r"code is (\d{6})", self.messages[-1]["body"]).group(1)

    def last_reset_token(self) -> str:
        return re.search(r"token=([\w\-]+)", self.messages[-1]["body"]).group(1)


@pytest_asyncio.fixture
async def db_engine():
    engine = create_async_engine(
        "sqlite+aiosqlite://", poolclass=StaticPool, connect_args={"check_same_thread": False}
    )

    @event.listens_for(engine.sync_engine, "connect")
    def _fk_on(dbapi_conn, _):  # enforce ON DELETE CASCADE like PostgreSQL
        dbapi_conn.execute("PRAGMA foreign_keys=ON")

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest.fixture
def outbox() -> Outbox:
    return Outbox()


@pytest_asyncio.fixture
async def db_factory(db_engine):
    return async_sessionmaker(db_engine, class_=AsyncSession, expire_on_commit=False, autoflush=False)


@pytest_asyncio.fixture
async def real_app(db_factory, outbox):
    app = create_app()

    async def _db():
        async with db_factory() as session:
            yield session

    app.dependency_overrides[get_db_session] = _db
    app.dependency_overrides[get_email_sender] = lambda: outbox
    yield app
    app.dependency_overrides.clear()


async def _make_client(app):
    return AsyncClient(transport=ASGITransport(app=app), base_url="http://testserver")


@pytest_asyncio.fixture
async def client(real_app):
    async with await _make_client(real_app) as c:
        yield c


@pytest_asyncio.fixture
async def client_b(real_app):
    """A second, independent browser (own cookie jar)."""
    async with await _make_client(real_app) as c:
        yield c
