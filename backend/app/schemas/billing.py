"""Billing, Subscriptions, Invoices, and Usage Schemas.

All monetary amounts are strictly represented in integer minor units (e.g. cents).
Distinguishes estimated AI model provider costs from charged customer amounts.
Owned by Developer 5.
"""

from datetime import datetime, timezone
from typing import Any, Dict, List, Literal, Optional
from pydantic import Field

from app.schemas.common import BaseSchema


class PlanPricing(BaseSchema):
    """Tier prices in integer minor units (e.g. USD cents)."""

    monthlyCents: int = Field(..., ge=0, description="Monthly recurring charge in minor units (e.g. 2900 for $29)")
    yearlyCents: int = Field(..., ge=0, description="Yearly recurring charge in minor units (e.g. 29000 for $290)")
    currency: str = Field("USD", description="ISO 4217 three-letter currency code")


class PlanResponse(BaseSchema):
    """Public subscription plan definition."""

    id: str = Field(..., description="Plan ID (e.g. 'free', 'pro', 'power', 'team')")
    name: str = Field(..., description="Plan display title")
    badge: Optional[str] = Field(None, description="Promotional badge label")
    description: str = Field(..., description="Tier summary")
    pricing: PlanPricing
    features: List[str] = Field(..., description="Included feature bullets")
    monthlyBattleQuota: int = Field(..., description="Included battle executions per month")


class SubscriptionResponse(BaseSchema):
    """Customer subscription state."""

    id: str = Field(..., description="Subscription identifier")
    userId: str = Field(..., description="Customer user ID")
    planId: str = Field(..., description="Associated plan ID")
    status: Literal["active", "trialing", "past_due", "canceled", "incomplete"] = Field(..., description="Status")
    interval: Literal["monthly", "yearly"] = Field(..., description="Billing interval")
    currentPeriodStart: datetime
    currentPeriodEnd: datetime
    cancelAtPeriodEnd: bool = Field(False, description="Whether cancellation is scheduled at renewal")


class CheckoutSessionRequest(BaseSchema):
    """Payload to initiate a payment checkout session."""

    planId: str = Field(..., description="Desired plan identifier")
    interval: Literal["monthly", "yearly"] = Field("monthly", description="Billing frequency")
    successUrl: str = Field(..., description="Client redirect URL upon successful checkout")
    cancelUrl: str = Field(..., description="Client redirect URL if user cancels")


class CheckoutSessionResponse(BaseSchema):
    """Payment provider checkout redirect details."""

    sessionId: str = Field(..., description="Payment gateway session ID")
    checkoutUrl: str = Field(..., description="Hosted checkout redirect URL")


class InvoiceResponse(BaseSchema):
    """Customer receipt and invoice statement."""

    id: str = Field(..., description="Invoice unique ID")
    number: str = Field(..., description="Invoice display number (e.g. 'INV-2026-001')")
    amountCents: int = Field(..., ge=0, description="Amount charged in integer cents")
    currency: str = Field("USD", description="Currency code")
    status: Literal["paid", "open", "void", "uncollectible"] = Field(..., description="Payment status")
    date: datetime = Field(..., description="Invoice issue date")
    pdfUrl: Optional[str] = Field(None, description="Downloadable PDF receipt link")


class UsageResponse(BaseSchema):
    """Quota and credit consumption telemetry."""

    userId: str
    billingPeriod: str = Field(..., description="Current billing month/period (e.g. '2026-10')")
    quotaTotal: int = Field(..., ge=0, description="Allocated monthly battle credits")
    quotaUsed: int = Field(..., ge=0, description="Consumed battle credits")
    quotaRemaining: int = Field(..., ge=0, description="Remaining available credits")
    modelBreakdown: Dict[str, int] = Field(
        default_factory=dict, description="Tokens or invocations consumed per model ID"
    )
    lastUpdated: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PaymentWebhookPayload(BaseSchema):
    """Ingress payload from payment processor webhooks (e.g. Stripe)."""

    id: str = Field(..., description="Provider event identifier")
    eventType: str = Field(..., description="Event type string (e.g. 'checkout.session.completed')")
    created: datetime = Field(..., description="Provider creation timestamp")
    data: Dict[str, Any] = Field(..., description="Raw provider event object")
