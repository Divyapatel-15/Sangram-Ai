"""Saved Answers and ADR Record Schemas.

Matches frontend mockSavedService and ADR (Architectural Decision Record) models.
"""

from datetime import datetime, timezone
from typing import List, Optional
from pydantic import Field

from app.schemas.common import BaseSchema


class SavedAnswerCreate(BaseSchema):
    """Payload to save an arena debate synthesis to user library."""

    battleId: str = Field(..., description="ID of source debate battle")
    question: str = Field(..., description="Question or dilemma debated")
    finalAnswer: str = Field(..., description="Consolidated synthesis text")
    fighters: List[str] = Field(..., description="List of fighter model IDs")
    notes: Optional[str] = Field(None, max_length=2000, description="User notes or context")


class SavedAnswerResponse(BaseSchema):
    """Persisted saved answer record."""

    id: str = Field(..., description="Unique saved answer ID")
    userId: str = Field(..., description="Owner user ID")
    battleId: str = Field(..., description="Source battle ID")
    question: str = Field(..., description="Question debated")
    finalAnswer: str = Field(..., description="Consolidated synthesis")
    fighters: List[str] = Field(..., description="Fighters involved")
    dateSaved: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    notes: Optional[str] = Field(None)
