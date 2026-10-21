"""Tests for Dynamic and Checked-In OpenAPI Contracts.

Verifies:
1. FastAPI automatically generates valid OpenAPI 3 schema at /openapi.json.
2. Checked-in docs/openapi.yaml is structurally valid YAML conforming to OpenAPI 3.1.
3. Planned routes are properly annotated with x-implementation-status and x-owner.
"""

from pathlib import Path
import pytest
import yaml
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_dynamic_openapi_schema(async_client: AsyncClient):
    """FastAPI dynamic /openapi.json endpoint returns valid schema."""
    response = await async_client.get("/openapi.json")
    assert response.status_code == 200
    schema = response.json()
    assert "openapi" in schema
    assert "info" in schema
    assert schema["info"]["title"] == "Sangram AI Backend"
    
    paths = schema.get("paths", {})
    assert "/health/live" in paths
    assert "/health/ready" in paths
    assert "/api/models" in paths
    assert "/api/battles" in paths
    assert "/api/battles/{battle_id}/events" in paths
    assert "/api/shares" in paths
    assert "/api/s/{token}" in paths


def test_checked_in_openapi_yaml_validity():
    """Static docs/openapi.yaml file is structurally valid OpenAPI 3.1."""
    yaml_path = Path(__file__).resolve().parent.parent / "docs" / "openapi.yaml"
    assert yaml_path.exists(), f"OpenAPI contract missing at {yaml_path}"

    with open(yaml_path, "r", encoding="utf-8") as f:
        doc = yaml.safe_load(f)

    assert doc.get("openapi") == "3.1.0"
    assert "info" in doc
    assert "paths" in doc
    assert "components" in doc

    # Verify key paths exist in contract
    paths = doc["paths"]
    assert "/api/battles" in paths
    assert "/api/battles/{id}/events" in paths
    assert "/api/shares" in paths
    assert "/api/s/{token}" in paths
    assert "/api/billing/checkout" in paths

    # Verify planned routes carry implementation metadata
    battle_post = paths["/api/battles"]["post"]
    assert battle_post.get("x-implementation-status") == "planned"
    assert battle_post.get("x-owner") == "developer-4"

    checkout_post = paths["/api/billing/checkout"]["post"]
    assert checkout_post.get("x-implementation-status") == "planned"
    assert checkout_post.get("x-owner") == "developer-5"
