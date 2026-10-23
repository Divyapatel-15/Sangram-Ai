"""Provisional Entity Relationship Models (FOR DEVELOPER 2 & 5 REVIEW).

IMPORTANT:
These models represent the recommended schema proposals for PostgreSQL persistence.
They are NOT finalized migrations — actual migrations are owned by Developer 2 (Alembic)
and Developer 5 (Billing).
"""

import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
)
from sqlalchemy import JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    """Core user account entity (Proposed for Dev 2 review)."""

    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)  # always stored lowercase
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(32), default="user", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    profile: Mapped[Optional["Profile"]] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan", passive_deletes=True)
    battles: Mapped[List["Battle"]] = relationship(back_populates="user", cascade="all, delete-orphan", passive_deletes=True)
    saved_answers: Mapped[List["SavedAnswer"]] = relationship(back_populates="user", cascade="all, delete-orphan", passive_deletes=True)
    subscription: Mapped[Optional["Subscription"]] = relationship(back_populates="user", uselist=False, passive_deletes=True)
    invoices: Mapped[List["Invoice"]] = relationship(back_populates="user", passive_deletes=True)
    usage_ledger: Mapped[List["UsageLedger"]] = relationship(back_populates="user", passive_deletes=True)


class Profile(Base, TimestampMixin):
    """User profile and personalization (Proposed for Dev 2 review)."""

    __tablename__ = "profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    theme: Mapped[str] = mapped_column(String(32), default="obsidian", nullable=False)
    motion: Mapped[str] = mapped_column(String(32), default="full", nullable=False)
    occupation: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    onboarding_completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    default_models: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    default_archetype: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)

    user: Mapped["User"] = relationship(back_populates="profile")


class Battle(Base, TimestampMixin):
    """Dialectic arena battle session (Proposed for Dev 4 review)."""

    __tablename__ = "battles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    client_battle_id: Mapped[Optional[str]] = mapped_column(String(64), index=True, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="pending", nullable=False)
    
    question: Mapped[str] = mapped_column(String(1000), nullable=False)
    context: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    model_a: Mapped[str] = mapped_column(String(64), nullable=False)
    model_b: Mapped[str] = mapped_column(String(64), nullable=False)
    archetype_a: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    archetype_b: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    
    final_answer: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    agreement_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    agreement_note: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    agreement_method: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    agreement_computed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    user: Mapped["User"] = relationship(back_populates="battles")
    messages: Mapped[List["BattleMessage"]] = relationship(back_populates="battle", cascade="all, delete-orphan", order_by="BattleMessage.id")
    round_summaries: Mapped[List["BattleRoundSummary"]] = relationship(back_populates="battle", cascade="all, delete-orphan")
    share_links: Mapped[List["ShareLink"]] = relationship(back_populates="battle", cascade="all, delete-orphan")


class BattleMessage(Base):
    """Individual argument turn in the shared debate timeline (Proposed for Dev 4 review)."""

    __tablename__ = "battle_messages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    battle_id: Mapped[str] = mapped_column(String(36), ForeignKey("battles.id", ondelete="CASCADE"), index=True, nullable=False)
    round: Mapped[int] = mapped_column(Integer, nullable=False)
    stage_key: Mapped[str] = mapped_column(String(32), nullable=False)
    stage_label: Mapped[str] = mapped_column(String(64), nullable=False)
    speaker: Mapped[str] = mapped_column(String(1), nullable=False)  # 'A' or 'B'
    model_id: Mapped[str] = mapped_column(String(64), nullable=False)
    model_name: Mapped[str] = mapped_column(String(64), nullable=False)
    provider: Mapped[str] = mapped_column(String(64), nullable=False)
    model_label: Mapped[str] = mapped_column(String(64), nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    challenges: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    contention: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    converging: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    battle: Mapped["Battle"] = relationship(back_populates="messages")


class BattleRoundSummary(Base):
    """Round synthesis summary (Proposed for Dev 4 review)."""

    __tablename__ = "battle_round_summaries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    battle_id: Mapped[str] = mapped_column(String(36), ForeignKey("battles.id", ondelete="CASCADE"), index=True, nullable=False)
    round: Mapped[int] = mapped_column(Integer, nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    battle: Mapped["Battle"] = relationship(back_populates="round_summaries")


class ShareLink(Base, TimestampMixin):
    """Public read-only share token (Proposed for Dev 4 review)."""

    __tablename__ = "share_links"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    battle_id: Mapped[str] = mapped_column(String(36), ForeignKey("battles.id", ondelete="CASCADE"), index=True, nullable=False)
    share_token: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    views_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    battle: Mapped["Battle"] = relationship(back_populates="share_links")


class SavedAnswer(Base, TimestampMixin):
    """User-saved architectural decision record (Proposed for Dev 4 review)."""

    __tablename__ = "saved_answers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    battle_id: Mapped[str] = mapped_column(String(36), index=True, nullable=False)
    question: Mapped[str] = mapped_column(String(1000), nullable=False)
    final_answer: Mapped[str] = mapped_column(Text, nullable=False)
    fighters: Mapped[str] = mapped_column(String(255), nullable=False)  # e.g. "chatgpt,claude"
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    user: Mapped["User"] = relationship(back_populates="saved_answers")


class Subscription(Base, TimestampMixin):
    """Customer subscription state (Proposed for Dev 5 review)."""

    __tablename__ = "subscriptions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    plan_id: Mapped[str] = mapped_column(String(32), nullable=False)  # free, pro, power, team
    status: Mapped[str] = mapped_column(String(32), default="active", nullable=False)
    interval: Mapped[str] = mapped_column(String(16), default="monthly", nullable=False)
    stripe_customer_id: Mapped[Optional[str]] = mapped_column(String(128), index=True, nullable=True)
    stripe_subscription_id: Mapped[Optional[str]] = mapped_column(String(128), unique=True, nullable=True)
    current_period_start: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    current_period_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    cancel_at_period_end: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    user: Mapped["User"] = relationship(back_populates="subscription")


class Invoice(Base, TimestampMixin):
    """Customer billing invoice record (Proposed for Dev 5 review)."""

    __tablename__ = "invoices"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    number: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    amount_cents: Mapped[int] = mapped_column(Integer, nullable=False)  # integer cents
    currency: Mapped[str] = mapped_column(String(3), default="USD", nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False)  # paid, open, void
    invoice_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    pdf_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    stripe_invoice_id: Mapped[Optional[str]] = mapped_column(String(128), index=True, nullable=True)

    user: Mapped["User"] = relationship(back_populates="invoices")


class UsageLedger(Base, TimestampMixin):
    """Monthly credit quota consumption ledger (Proposed for Dev 5 review)."""

    __tablename__ = "usage_ledgers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    billing_period: Mapped[str] = mapped_column(String(7), nullable=False)  # YYYY-MM
    quota_allocated: Mapped[int] = mapped_column(Integer, nullable=False)
    quota_consumed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    model_breakdown: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON-encoded string for cross-db compatibility

    user: Mapped["User"] = relationship(back_populates="usage_ledger")

    __table_args__ = (
        Index("ix_usage_user_period", "user_id", "billing_period", unique=True),
    )
