"""Tests for Request-ID Generation, Propagation, and Sanitization.

Verifies:
1. X-Request-ID is automatically generated when omitted.
2. Valid incoming X-Request-ID is propagated through to response headers.
3. Malicious/invalid X-Request-ID is replaced with a safe generated ID.
"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_request_id_generated_automatically(async_client: AsyncClient):
    """Requests without X-Request-ID receive a generated req_ UUID header."""
    response = await async_client.get("/health/live")
    assert response.status_code == 200
    req_id = response.headers.get("x-request-id")
    assert req_id is not None
    assert req_id.startswith("req_")


@pytest.mark.asyncio
async def test_valid_request_id_propagated(async_client: AsyncClient):
    """Valid custom X-Request-ID from client is preserved and returned."""
    custom_id = "trace-client-session-12345"
    response = await async_client.get("/health/live", headers={"x-request-id": custom_id})
    assert response.status_code == 200
    assert response.headers.get("x-request-id") == custom_id


@pytest.mark.asyncio
async def test_invalid_request_id_sanitized(async_client: AsyncClient):
    """Malicious or non-alphanumeric X-Request-ID is replaced with a clean generated ID."""
    malicious_id = "<script>alert('xss')</script>"
    response = await async_client.get("/health/live", headers={"x-request-id": malicious_id})
    assert response.status_code == 200
    req_id = response.headers.get("x-request-id")
    assert req_id is not None
    assert "<script>" not in req_id
    assert req_id.startswith("req_")
