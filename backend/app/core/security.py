"""Cryptographic helpers for authentication (Developer 2).

- Passwords: argon2id.
- Access tokens: short-lived signed JWTs carrying a session id (`sid`) so that
  revoking the session invalidates the token on the next request.
- Refresh tokens, email codes, reset tokens: random secrets stored only as
  HMAC-SHA256 digests keyed with SECRET_KEY.
"""

import hashlib
import hmac
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Dict

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerifyMismatchError

from app.core.config import get_settings

_hasher = PasswordHasher()
# Pre-computed hash used to equalise timing when the email does not exist.
_DUMMY_HASH = _hasher.hash("not-a-real-password")


def hash_password(password: str) -> str:
    return _hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return _hasher.verify(password_hash, password)
    except (VerifyMismatchError, InvalidHashError):
        return False


def burn_password_check(password: str) -> None:
    """Spend the same time as a real verification (unknown-email logins)."""
    verify_password(password, _DUMMY_HASH)


def needs_rehash(password_hash: str) -> bool:
    return _hasher.check_needs_rehash(password_hash)


def digest(value: str, purpose: str) -> str:
    """Keyed digest of a secret; `purpose` separates token families."""
    key = get_settings().SECRET_KEY.encode()
    return hmac.new(key, f"{purpose}:{value}".encode(), hashlib.sha256).hexdigest()


def new_opaque_token() -> str:
    return secrets.token_urlsafe(48)


def new_numeric_code(length: int = 6) -> str:
    return "".join(str(secrets.randbelow(10)) for _ in range(length))


def create_access_token(user_id: str, session_id: str) -> str:
    s = get_settings()
    now = datetime.now(timezone.utc)
    payload: Dict[str, Any] = {
        "sub": user_id,
        "sid": session_id,
        "typ": "access",
        "iat": now,
        "exp": now + timedelta(minutes=s.ACCESS_TOKEN_EXPIRE_MINUTES),
        "jti": uuid.uuid4().hex,
    }
    return jwt.encode(payload, s.SECRET_KEY, algorithm=s.JWT_ALGORITHM)


def decode_access_token(token: str) -> Dict[str, Any]:
    """Raises jwt.PyJWTError on any problem (signature, expiry, missing claims, wrong type)."""
    s = get_settings()
    claims = jwt.decode(
        token,
        s.SECRET_KEY,
        algorithms=[s.JWT_ALGORITHM],
        options={"require": ["exp", "iat", "sub", "sid", "typ"]},
    )
    if claims.get("typ") != "access":
        raise jwt.InvalidTokenError("wrong token type")
    return claims
