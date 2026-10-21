"""Tests for Error Formatting and Stack Trace Redaction.

Verifies:
1. Pydantic validation errors map to {code: "VALIDATION_ERROR", ...}.
2. Unhandled server exceptions return generic 500 without leaking stack traces or messages.
"""

from unittest.mock import AsyncMock
import pytest
from httpx import ASGITransport, AsyncClient

from app.api.deps import get_battle_service, get_current_principal
from app.main import create_app
from app.schemas.auth import CurrentPrincipal


@pytest.mark.asyncio
async def test_validation_error_formatting():
    """Payloads failing validation return standard ErrorResponse with 422."""
    app = create_app()
    # Provide valid principal and mock battle service so route reaches payload validation
    app.dependency_overrides[get_current_principal] = lambda: CurrentPrincipal(
        user_id="usr_test", email="test@sangram.ai"
    )
    mock_service = AsyncMock()
    app.dependency_overrides[get_battle_service] = lambda: mock_service

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        # Sending invalid empty body to battle creation endpoint
        response = await client.post("/api/battles", json={})
        assert response.status_code == 422
        data = response.json()
        assert data["code"] == "VALIDATION_ERROR"
        assert data["retryable"] is False
        assert data["requestId"] is not None
        assert isinstance(data["details"], list)
        assert len(data["details"]) > 0


@pytest.mark.asyncio
async def test_unhandled_exception_stack_trace_redacted():
    """Unhandled server errors must NEVER expose internal exception text or tracebacks to clients."""
    app = create_app()

    # Register an intentionally crashing route to test 500 handler
    @app.get("/test/crash")
    async def crash_endpoint():
        raise RuntimeError("Database connection string: postgres://admin:leaked_super_secret_pw@db:5432")

    # raise_app_exceptions=False ensures HTTPX receives the 500 response rather than re-raising in test
    transport = ASGITransport(app=app, raise_app_exceptions=False)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.get("/test/crash")
        assert response.status_code == 500
        data = response.json()
        assert data["code"] == "INTERNAL_SERVER_ERROR"
        assert data["retryable"] is True
        assert data["requestId"] is not None
        # Verify secret text and internal error details are NOT leaked to client
        assert "leaked_super_secret_pw" not in response.text
        assert "RuntimeError" not in response.text
        assert "Traceback" not in response.text
