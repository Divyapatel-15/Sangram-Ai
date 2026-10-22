"""Common Pydantic Schemas and Standards.

Defines the universal ErrorResponse, PaginatedResponse, and Health check contracts.
"""

from datetime import datetime, timezone
from typing import Any, Generic, List, Optional, TypeVar
from pydantic import BaseModel, ConfigDict, Field

from app.core.errors import AppErrorCode

T = TypeVar("T")


class BaseSchema(BaseModel):
    """Base schema configured for ORM compatibility and camelCase/snake_case flexibility."""

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        use_enum_values=True,
    )


class ErrorDetail(BaseSchema):
    """Structured validation error item."""

    loc: List[Any] = Field(..., description="Path to invalid field in request")
    msg: str = Field(..., description="Human-readable validation message")
    type: str = Field(..., description="Validation error type identifier")


class ErrorResponse(BaseSchema):
    """Universal error envelope matching Sangram AI frontend expectations.
    
    Rendered by src/components/ErrorStates.jsx.
    """

    code: AppErrorCode = Field(..., description="Standardized error code")
    message: str = Field(..., description="Safe, client-facing message describing the error")
    retryable: bool = Field(False, description="Controls whether the UI displays a Retry button")
    requestId: str = Field(..., description="X-Request-ID for error reporting and log correlation")
    details: Optional[Any] = Field(None, description="Optional non-sensitive structured details")


class HealthLiveResponse(BaseSchema):
    """Liveness probe response (independent of database availability)."""

    status: str = Field("ok", description="Liveness status indicator")
    version: str = Field(..., description="Current backend version")
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Current server UTC timestamp",
    )


class HealthReadyResponse(BaseSchema):
    """Readiness probe response (verifies database connectivity)."""

    status: str = Field(..., description="'ok' or 'unhealthy'")
    database: str = Field(..., description="'connected' or 'unavailable'")
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Current server UTC timestamp",
    )
    response_time_ms: Optional[float] = Field(
        None, description="Database ping roundtrip time in milliseconds"
    )
    details: Optional[str] = Field(None, description="Optional diagnostic details on failure")


class PaginationParams(BaseSchema):
    """Query parameters for paginated endpoints."""

    page: int = Field(1, ge=1, description="1-indexed page number")
    page_size: int = Field(20, ge=1, le=100, description="Items per page (max 100)")


class PaginatedResponse(BaseSchema, Generic[T]):
    """Standard pagination wrapper for list responses."""

    items: List[T] = Field(..., description="List of items for current page")
    total: int = Field(..., ge=0, description="Total count across all pages")
    page: int = Field(..., ge=1, description="Current page number")
    page_size: int = Field(..., ge=1, description="Page size limit")
    has_more: bool = Field(..., description="True if subsequent pages exist")
