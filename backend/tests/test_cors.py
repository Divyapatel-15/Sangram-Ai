"""Tests for CORS Policy Behavior.

Verifies:
1. Permitted development origins receive appropriate Access-Control-Allow-Origin headers.
2. Preflight OPTIONS requests succeed with allowed methods and headers.
3. Untrusted/unauthorized origins are rejected.
"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_cors_preflight_for_allowed_origin(async_client: AsyncClient):
    """OPTIONS preflight from http://localhost:3000 receives CORS approval."""
    response = await async_client.options(
        "/api/models",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Authorization,Content-Type",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"
    assert "GET" in response.headers.get("access-control-allow-methods", "")

    # Actual request exposes X-Request-ID
    actual_res = await async_client.get(
        "/api/models",
        headers={"Origin": "http://localhost:3000"},
    )
    assert actual_res.status_code == 200
    assert actual_res.headers.get("access-control-allow-origin") == "http://localhost:3000"
    assert "x-request-id" in actual_res.headers.get("access-control-expose-headers", "").lower()



@pytest.mark.asyncio
async def test_cors_rejects_unauthorized_origin(async_client: AsyncClient):
    """Requests from unauthorized origins do not receive allow-origin header matching the origin."""
    response = await async_client.get(
        "/health/live",
        headers={"Origin": "https://malicious-attacker-website.com"},
    )
    assert response.headers.get("access-control-allow-origin") != "https://malicious-attacker-website.com"
