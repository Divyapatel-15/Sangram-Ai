# SANGRAM AI — Shared Module Interfaces & Integration Guide

This guide details the typed Python Protocols defined in `app/interfaces/`. These protocols establish the explicit contracts required by Developers 2, 3, 4, and 5 to integrate their modules without circular dependencies.

---

## 1. How Developers Connect Their Implementations

All module dependencies are injected via FastAPI dependencies in `app/api/deps.py`.

When implementing your concrete service class:
1. Implement the corresponding `Protocol` from `app.interfaces.*`.
2. Update the provider function in `app/api/deps.py` (or register your implementation in your application lifespan/factory).

### Example Integration (Developer 2 - Authentication):

```python
# app/services/auth_service.py (Created by Developer 2)
from app.interfaces.auth import IAuthService
from app.schemas.auth import LoginRequest, TokenResponse, RegisterRequest, UserProfileResponse

class AuthService(IAuthService):
    def __init__(self, db_session: AsyncSession):
        self.session = db_session

    async def authenticate(self, credentials: LoginRequest) -> TokenResponse:
        # Developer 2's implementation
        ...
```

```python
# app/api/deps.py (Connecting Developer 2's implementation)
from app.services.auth_service import AuthService

def get_auth_service(session: AsyncSession = Depends(get_db_session)) -> IAuthService:
    return AuthService(session)
```

---

## 2. Developer 2 Interface: Authentication & User Management

File: `app/interfaces/auth.py`

### `IAuthService`
```python
class IAuthService(Protocol):
    async def authenticate(self, credentials: LoginRequest) -> TokenResponse: ...
    async def register(self, payload: RegisterRequest) -> UserProfileResponse: ...
    async def verify_token(self, token: str) -> CurrentPrincipal: ...
    async def refresh_tokens(self, refresh_token: str) -> TokenResponse: ...
    async def verify_email(self, user_id: str, code: str) -> bool: ...
    async def forgot_password(self, email: str) -> bool: ...
    async def reset_password(self, token: str, new_password: str) -> bool: ...
```

### `IUserService`
```python
class IUserService(Protocol):
    async def get_profile(self, user_id: str) -> UserProfileResponse: ...
    async def update_profile(self, user_id: str, name: Optional[str] = None, avatar: Optional[str] = None) -> UserProfileResponse: ...
    async def get_preferences(self, user_id: str) -> UserPreferences: ...
    async def update_preferences(self, user_id: str, preferences: UserPreferences) -> UserPreferences: ...
    async def delete_account(self, user_id: str) -> bool: ...
```

---

## 3. Developer 3 Interface: AI Model Gateway

File: `app/interfaces/model_gateway.py`

### `IModelGatewayService`
```python
class IModelGatewayService(Protocol):
    async def stream_argument(
        self,
        model_id: str,
        system_prompt: str,
        user_message: str,
        conversation_history: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 2048,
    ) -> AsyncGenerator[str, None]:
        """Streams raw chunk deltas from external model provider APIs."""
        ...

    async def check_provider_health(self, provider: str) -> bool:
        """Pings provider to check credentials and quota."""
        ...

    async def estimate_token_cost(
        self, model_id: str, input_tokens: int, estimated_output_tokens: int
    ) -> int:
        """Returns estimated cost in integer minor units (USD cents)."""
        ...

    async def get_active_models(self) -> List[ModelProfile]:
        """Returns models currently available for selection."""
        ...
```

---

## 4. Developer 4 Interface: Dialectic Battles & Streaming

File: `app/interfaces/battles.py`

### `IBattleService`
```python
class IBattleService(Protocol):
    async def create_battle(self, user_id: str, payload: BattleCreateRequest) -> BattleCreateResponse: ...
    async def get_battle(self, battle_id: str, user_id: Optional[str] = None) -> Battle: ...
    async def list_user_battles(self, user_id: str, page: int = 1, page_size: int = 20) -> Tuple[List[BattleSummaryCard], int]: ...
    async def delete_battle(self, battle_id: str, user_id: str) -> bool: ...
    async def cancel_battle(self, battle_id: str, user_id: str) -> bool: ...
    async def retry_battle(self, battle_id: str, user_id: str) -> BattleCreateResponse: ...
```

### `IBattleStreamService`
```python
class IBattleStreamService(Protocol):
    async def stream_events(
        self, battle_id: str, last_event_id: Optional[str] = None
    ) -> AsyncGenerator[Tuple[str, str], None]:
        """Yields (event_name, json_data) matching the SSE contract."""
        ...
```

### `IShareService`
```python
class IShareService(Protocol):
    async def create_share_link(self, battle_id: str, user_id: str) -> ShareCreateResponse: ...
    async def get_share_snapshot(self, share_token: str) -> Battle: ...
```

### `ISavedAnswerService`
```python
class ISavedAnswerService(Protocol):
    async def save_answer(self, user_id: str, payload: SavedAnswerCreate) -> SavedAnswerResponse: ...
    async def list_saved_answers(self, user_id: str, page: int = 1, page_size: int = 20) -> Tuple[List[SavedAnswerResponse], int]: ...
    async def delete_saved_answer(self, answer_id: str, user_id: str) -> bool: ...
```

---

## 5. Developer 5 Interface: Billing, Usage & Entitlements

File: `app/interfaces/billing.py`

### `IBillingService`
```python
class IBillingService(Protocol):
    async def get_plans(self) -> List[PlanResponse]: ...
    async def get_subscription(self, user_id: str) -> Optional[SubscriptionResponse]: ...
    async def create_checkout_session(self, user_id: str, payload: CheckoutSessionRequest) -> CheckoutSessionResponse: ...
    async def cancel_subscription(self, user_id: str) -> bool: ...
    async def list_invoices(self, user_id: str) -> List[InvoiceResponse]: ...
    async def process_webhook(self, payload_bytes: bytes, signature_header: str) -> bool: ...
```

### `IUsageService`
```python
class IUsageService(Protocol):
    async def get_user_usage(self, user_id: str) -> UsageResponse: ...
    async def check_entitlement(self, user_id: str, action: str = "run_battle") -> bool: ...
    async def reserve_quota(self, user_id: str, credits: int = 1) -> str: ...
    async def settle_quota(self, user_id: str, reservation_id: str, tokens_consumed: int, success: bool = True) -> None: ...
```
