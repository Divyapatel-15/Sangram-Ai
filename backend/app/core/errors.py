"""Centralized Error Standards and Custom Exceptions for Sangram AI.

Defines the standard error taxonomy matching both the frontend expectations
and backend foundation requirements.
"""

from enum import Enum
from typing import Any, Optional


class AppErrorCode(str, Enum):
    """Unified error codes recognized across Sangram AI frontend and backend.
    
    Preserves all existing frontend codes (rendered in src/components/ErrorStates.jsx)
    and adds foundation standards for robust HTTP API semantics.
    """
    # Existing frontend error codes
    MISSING_CONFIG = "MISSING_CONFIG"
    API_FAILURE = "API_FAILURE"
    TIMEOUT = "TIMEOUT"
    RATE_LIMIT = "RATE_LIMIT"
    AUTH_FAILED = "AUTH_FAILED"
    NETWORK_OFFLINE = "NETWORK_OFFLINE"
    EMPTY_RESPONSE = "EMPTY_RESPONSE"
    SYNTHESIS_FAILED = "SYNTHESIS_FAILED"

    # Foundation backend error codes
    VALIDATION_ERROR = "VALIDATION_ERROR"
    NOT_FOUND = "NOT_FOUND"
    FORBIDDEN = "FORBIDDEN"
    CONFLICT = "CONFLICT"
    MODULE_NOT_IMPLEMENTED = "MODULE_NOT_IMPLEMENTED"
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"


class AppException(Exception):
    """Base application exception for all controlled domain and foundation errors.
    
    Attributes:
        code: AppErrorCode string matching frontend error dictionary.
        message: Safe, client-facing message describing what went wrong.
        status_code: HTTP response status code.
        retryable: Whether client retry makes sense.
        details: Optional structured details for validation or debugging (non-sensitive).
    """

    def __init__(
        self,
        code: AppErrorCode,
        message: str,
        status_code: int = 400,
        retryable: bool = False,
        details: Optional[Any] = None,
    ) -> None:
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code
        self.retryable = retryable
        self.details = details


class AuthenticationError(AppException):
    """Raised when authentication is missing, invalid, or expired."""

    def __init__(
        self,
        message: str = "Authentication required. Please log in.",
        details: Optional[Any] = None,
    ) -> None:
        super().__init__(
            code=AppErrorCode.AUTH_FAILED,
            message=message,
            status_code=401,
            retryable=False,
            details=details,
        )


class ForbiddenError(AppException):
    """Raised when the principal lacks permission for this resource."""

    def __init__(
        self,
        message: str = "You do not have permission to access this resource.",
        details: Optional[Any] = None,
    ) -> None:
        super().__init__(
            code=AppErrorCode.FORBIDDEN,
            message=message,
            status_code=403,
            retryable=False,
            details=details,
        )


class NotFoundError(AppException):
    """Raised when a requested resource is not found."""

    def __init__(
        self,
        message: str = "The requested resource was not found.",
        details: Optional[Any] = None,
    ) -> None:
        super().__init__(
            code=AppErrorCode.NOT_FOUND,
            message=message,
            status_code=404,
            retryable=False,
            details=details,
        )


class ConflictError(AppException):
    """Raised when resource creation conflicts with existing state."""

    def __init__(
        self,
        message: str = "A conflicting resource already exists.",
        details: Optional[Any] = None,
    ) -> None:
        super().__init__(
            code=AppErrorCode.CONFLICT,
            message=message,
            status_code=409,
            retryable=False,
            details=details,
        )


class ValidationError(AppException):
    """Raised when incoming request payload fails business validation."""

    def __init__(
        self,
        message: str = "Invalid request payload.",
        details: Optional[Any] = None,
    ) -> None:
        super().__init__(
            code=AppErrorCode.VALIDATION_ERROR,
            message=message,
            status_code=422,
            retryable=False,
            details=details,
        )


class RateLimitError(AppException):
    """Raised when a client exceeds allocated request or battle rate limits."""

    def __init__(
        self,
        message: str = "Rate limit exceeded. Please wait before submitting another request.",
        details: Optional[Any] = None,
    ) -> None:
        super().__init__(
            code=AppErrorCode.RATE_LIMIT,
            message=message,
            status_code=429,
            retryable=True,
            details=details,
        )


class ModuleNotImplementedError(AppException):
    """Raised when an unassigned or upcoming developer module endpoint is invoked.
    
    Guarantees no fake success responses are returned.
    """

    def __init__(
        self,
        module_name: str,
        owner: str = "Developer",
        details: Optional[Any] = None,
    ) -> None:
        message = (
            f"The '{module_name}' endpoint is planned and owned by {owner}, "
            "but has not yet been integrated into the backend runtime."
        )
        super().__init__(
            code=AppErrorCode.MODULE_NOT_IMPLEMENTED,
            message=message,
            status_code=501,
            retryable=False,
            details=details,
        )


class ServiceUnavailableError(AppException):
    """Raised when an essential downstream dependency (e.g. Database) is unavailable."""

    def __init__(
        self,
        message: str = "Service temporarily unavailable. Please try again shortly.",
        details: Optional[Any] = None,
    ) -> None:
        super().__init__(
            code=AppErrorCode.SERVICE_UNAVAILABLE,
            message=message,
            status_code=503,
            retryable=True,
            details=details,
        )
