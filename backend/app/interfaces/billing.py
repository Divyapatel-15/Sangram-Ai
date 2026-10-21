"""Billing, Subscriptions, Usage, and Entitlements Interfaces (Developer 5 Boundary).

Defines the protocols Developer 5 must implement for payment processor integration
(e.g. Stripe), token quota tracking, and subscription entitlements.
"""

from typing import List, Optional, Protocol, runtime_checkable
from app.schemas.billing import (
    CheckoutSessionRequest,
    CheckoutSessionResponse,
    InvoiceResponse,
    PlanResponse,
    SubscriptionResponse,
    UsageResponse,
)


@runtime_checkable
class IBillingService(Protocol):
    """Payment gateway and subscription management contract."""

    async def get_plans(self) -> List[PlanResponse]:
        """Returns active subscription plans with pricing in minor units."""
        ...

    async def get_subscription(self, user_id: str) -> Optional[SubscriptionResponse]:
        """Returns the customer's current active subscription, or None if free tier."""
        ...

    async def create_checkout_session(
        self, user_id: str, payload: CheckoutSessionRequest
    ) -> CheckoutSessionResponse:
        """Creates a hosted checkout session with the payment provider."""
        ...

    async def cancel_subscription(self, user_id: str) -> bool:
        """Schedules current subscription to cancel at the end of the current billing period."""
        ...

    async def list_invoices(self, user_id: str) -> List[InvoiceResponse]:
        """Lists historical payment receipts and invoice statements."""
        ...

    async def process_webhook(self, payload_bytes: bytes, signature_header: str) -> bool:
        """Verifies webhook cryptographic signature and processes payment events."""
        ...


@runtime_checkable
class IUsageService(Protocol):
    """Enforces token quotas, battle limits, and credit reservations."""

    async def get_user_usage(self, user_id: str) -> UsageResponse:
        """Returns monthly quota consumption and breakdown per model."""
        ...

    async def check_entitlement(self, user_id: str, action: str = "run_battle") -> bool:
        """Checks if the user has remaining credits or tier privileges for the action."""
        ...

    async def reserve_quota(self, user_id: str, credits: int = 1) -> str:
        """Holds a temporary reservation against user quota before starting a battle run.
        
        Returns:
            reservation_id string.
        
        Raises:
            RateLimitError: If user has depleted their monthly quota.
        """
        ...

    async def settle_quota(
        self, user_id: str, reservation_id: str, tokens_consumed: int, success: bool = True
    ) -> None:
        """Finalizes quota reservation upon battle completion or releases it upon failure."""
        ...
