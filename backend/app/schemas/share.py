"""Share Link Schemas.

Enables secure server-side sharing of completed debate battles without
exposing private user details or relying on brittle URL fragment encoding.
"""

from datetime import datetime, timezone
from typing import Optional
from pydantic import Field

from app.schemas.battle import Battle
from app.schemas.common import BaseSchema


class ShareCreateRequest(BaseSchema):
    """Request payload to create a shareable debate link."""

    battleId: str = Field(..., description="ID of completed battle to share")


class ShareCreateResponse(BaseSchema):
    """Response containing stable share token and public URL."""

    shareToken: str = Field(..., description="Opaque share identifier token")
    url: str = Field(..., description="Public share link (e.g. /api/s/{token} or frontend route)")
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expiresAt: Optional[datetime] = Field(None, description="Optional link expiration")


class ShareSnapshotResponse(BaseSchema):
    """Read-only public debate snapshot with privacy protections."""

    shareToken: str
    battle: Battle
    sharedAt: datetime
