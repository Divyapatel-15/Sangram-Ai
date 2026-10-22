"""Share Link Endpoints (Developer 4 Boundary).

Implements POST /api/shares to generate server-side share tokens,
and GET /api/s/{token} to fetch the public read-only Battle snapshot.
"""

from fastapi import APIRouter, Depends, status

from app.api.deps import get_current_principal, get_share_service
from app.interfaces.battles import IShareService
from app.schemas.auth import CurrentPrincipal
from app.schemas.battle import Battle
from app.schemas.share import ShareCreateRequest, ShareCreateResponse

router = APIRouter(tags=["Debate Shares"])


@router.post(
    "/shares",
    response_model=ShareCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Share Link",
    description="Generates an opaque, stable share token for a completed battle.",
    openapi_extra={"x-implementation-status": "planned", "x-owner": "developer-4"},
)
async def create_share_link(
    payload: ShareCreateRequest,
    principal: CurrentPrincipal = Depends(get_current_principal),
    share_service: IShareService = Depends(get_share_service),
) -> ShareCreateResponse:
    """Creates a public share token. Owned by Developer 4."""
    return await share_service.create_share_link(battle_id=payload.battleId, user_id=principal.user_id)


@router.get(
    "/s/{token}",
    response_model=Battle,
    status_code=status.HTTP_200_OK,
    summary="Get Shared Battle Snapshot",
    description="Public read-only endpoint returning the sanitized debate snapshot.",
    openapi_extra={"x-implementation-status": "planned", "x-owner": "developer-4"},
)
async def get_shared_snapshot(
    token: str,
    share_service: IShareService = Depends(get_share_service),
) -> Battle:
    """Fetches a publicly shared battle. Public access, owned by Developer 4."""
    return await share_service.get_share_snapshot(share_token=token)
