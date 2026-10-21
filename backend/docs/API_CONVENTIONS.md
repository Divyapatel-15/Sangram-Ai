# SANGRAM AI — API Conventions & Streaming Contract

This document establishes the universal API conventions, error envelope standards, frontend service migration mappings, and Server-Sent Events (SSE) streaming specifications for Sangram AI.

---

## 1. Request and Response Standards

### Universal Response Rules
1. **UTC Timestamps**: All timestamps are formatted according to ISO 8601 UTC (`YYYY-MM-DDTHH:MM:SSZ` or offset).
2. **Stable Identifiers**: Identifiers are stable strings (e.g. UUIDv4 or prefixed IDs like `usr_...`, `btl_...`, `msg_...`).
3. **Monetary Values**: All financial amounts are represented in **integer minor units** (e.g. cents in USD: `2900` for `$29.00`). Estimated AI token costs are clearly separated from customer billing amounts.
4. **Pagination**:
   - Query: `page: int = 1`, `page_size: int = 20` (max 100).
   - Envelope:
     ```json
     {
       "items": [...],
       "total": 142,
       "page": 1,
       "page_size": 20,
       "has_more": true
     }
     ```
5. **No Double-Wrapping on Battles**: The frontend expects a normalized `Battle` object directly from `GET /api/battles/{id}` and `GET /api/s/{token}` without an extraneous `{ data: ... }` envelope.

---

## 2. Universal Error Standard

Every error returned by the backend matches this schema (rendered directly by `frontend/src/components/ErrorStates.jsx`):

```json
{
  "code": "RATE_LIMIT",
  "message": "You have reached your monthly debate quota limit.",
  "retryable": true,
  "requestId": "req_8f1d2c49e0b345a1",
  "details": {
    "quotaRemaining": 0,
    "resetsAt": "2026-11-01T00:00:00Z"
  }
}
```

### Error Taxonomy

| Error Code | HTTP Status | Retryable | Frontend Handling / UI Context |
| :--- | :---: | :---: | :--- |
| `MISSING_CONFIG` | 400 | False | Rendered when required fighters or settings are omitted. |
| `API_FAILURE` | 400 / 502 | True | Upstream model provider or debate engine failure. |
| `TIMEOUT` | 504 | True | Provider response timed out. UI shows Retry button. |
| `RATE_LIMIT` | 429 | True | Credit quota exceeded or IP burst limit hit. |
| `AUTH_FAILED` | 401 | False | Missing or invalid token/cookie. Redirects to `/auth/login`. |
| `NETWORK_OFFLINE` | — | True | **Client transport condition** (browser has no internet). |
| `EMPTY_RESPONSE` | 502 | True | Upstream model emitted zero tokens. |
| `SYNTHESIS_FAILED`| 500 | True | Consolidation verdict generation failed. |
| `VALIDATION_ERROR`| 422 | False | Payload failed structural Pydantic validation. Details included. |
| `NOT_FOUND` | 404 | False | Requested resource (battle, model, invoice) does not exist. |
| `FORBIDDEN` | 403 | False | Caller does not own the requested private resource. |
| `CONFLICT` | 409 | False | Duplicate resource or state conflict. |
| `MODULE_NOT_IMPLEMENTED` | 501 | False | Scaffold endpoint owned by upcoming developer. |
| `INTERNAL_SERVER_ERROR` | 500 | True | Unhandled server error. Stack traces are redacted. |
| `SERVICE_UNAVAILABLE` | 503 | True | Database connectivity or critical infrastructure is down. |

---

## 3. Frontend Service to Backend Route Mapping

| Frontend Mock Service | Current Simulated Method | Live Backend Endpoint | Owner |
| :--- | :--- | :--- | :--- |
| `mockBattleService.js` | `createBattle()` | `POST /api/battles` | Developer 4 |
| `mockBattleService.js` | `getBattleById(id)` | `GET /api/battles/{id}` | Developer 4 |
| `mockBattleService.js` | `getRecentBattles()` | `GET /api/battles` | Developer 4 |
| `mockBattleService.js` | `deleteBattle(id)` | `DELETE /api/battles/{id}` | Developer 4 |
| `streamRunner.js` | `createBattleRunner()` | `GET /api/battles/{id}/events` (SSE) | Developer 4 |
| `shareLink.js` | `encodeDemoState()` | `POST /api/shares` & `GET /api/s/{token}` | Developer 4 |
| `mockAuthService.js` | `login()` | `POST /api/auth/login` | Developer 2 |
| `mockAuthService.js` | `signup()` | `POST /api/auth/register` | Developer 2 |
| `mockAuthService.js` | `logout()` | `POST /api/auth/logout` | Developer 2 |
| `mockAuthService.js` | `getCurrentUser()` | `GET /api/auth/me` | Developer 2 |
| `mockAuthService.js` | `verifyEmail()` | `POST /api/auth/verify-email` | Developer 2 |
| `mockAuthService.js` | `forgotPassword()` | `POST /api/auth/forgot-password` | Developer 2 |
| `mockAuthService.js` | `resetPassword()` | `POST /api/auth/reset-password` | Developer 2 |
| `mockUserService.js` | `getUserProfile()` | `GET /api/users/me/profile` | Developer 2 |
| `mockUserService.js` | `updateUserProfile()` | `PUT /api/users/me/profile` | Developer 2 |
| `mockUserService.js` | `getPreferences()` | `GET /api/users/me/preferences` | Developer 2 |
| `mockUserService.js` | `updatePreferences()` | `PUT /api/users/me/preferences` | Developer 2 |
| `mockModelsService.js` | `getAllModels()` | `GET /api/models` | Dev 1 (Live) |
| `mockModelsService.js` | `getAllArchetypes()` | `GET /api/archetypes` | Dev 1 (Live) |
| `mockSavedService.js` | `getSavedAnswers()` | `GET /api/saved` | Developer 4 |
| `mockSavedService.js` | `saveAnswer()` | `POST /api/saved` | Developer 4 |
| `mockSavedService.js` | `removeAnswer()` | `DELETE /api/saved/{id}` | Developer 4 |
| `mockBillingService.js`| `getPlans()` | `GET /api/billing/plans` | Dev 1 (Live) |
| `mockBillingService.js`| `createCheckoutSession()`| `POST /api/billing/checkout` | Developer 5 |
| `mockBillingService.js`| `updateSubscription()` | `POST /api/billing/subscription/upgrade` | Developer 5 |
| `mockBillingService.js`| `cancelSubscription()` | `POST /api/billing/subscription/cancel` | Developer 5 |
| `mockBillingService.js`| `getInvoices()` | `GET /api/billing/invoices` | Developer 5 |

---

## 4. Server-Sent Events (SSE) Streaming Specification

### The Browser Authentication Challenge for SSE
The W3C native browser `EventSource` API **cannot send custom HTTP headers** (such as `Authorization: Bearer <token>`).

To resolve this securely without leaking credentials:
1. **Option A: HttpOnly Session Cookie (Recommended for Browsers)**:
   - When the user logs in, the backend sets an `HttpOnly; Secure; SameSite=Lax` cookie named `sangram_session`.
   - The browser initiates SSE with credentials enabled:
     ```js
     const eventSource = new EventSource(`/api/battles/${battleId}/events`, { withCredentials: true });
     ```
   - The cookie is automatically forwarded by the browser and validated by `get_current_principal`.
2. **Option B: Authenticated Fetch Stream (Recommended for Single-Page Apps)**:
   - Modern browsers support streaming responses via `fetch()` and `ReadableStream`:
     ```js
     const response = await fetch(`/api/battles/${battleId}/events`, {
       headers: { Authorization: `Bearer ${token}` }
     });
     const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
     ```
3. **Strict Security Ban**:
   > [!CAUTION]
   > **NEVER attach durable JWT bearer tokens to query parameters** (e.g. `/events?token=eyJ...`). Query parameters are logged in server access logs, reverse proxy logs, browser history, and leaked in `Referer` headers.

### SSE Event Vocabulary & Sequence

The debate stream progresses through strict chronological stages:

```text
[POST /api/battles] -> 201 Created { battleId, streamUrl }
         │
         ▼
[GET /api/battles/:id/events]
         │
         ├── event: battle.stage
         │   data: { "round": 1, "stageKey": "opening" }
         │
         ├── event: battle.message.start
         │   data: { "messageId": "m1", "speaker": "A", "modelId": "chatgpt", "stageLabel": "Opening Arguments" }
         │
         ├── event: battle.message.chunk (multiple)
         │   data: { "messageId": "m1", "delta": "Python's syntax " }
         │
         ├── event: battle.message.done
         │   data: { "messageId": "m1", "challenges": null, "contention": "Language syntax" }
         │
         ├── [Repeated for Speaker B, then Rounds 2, 3, 4]
         │
         ├── event: battle.round.summary (at end of each round)
         │   data: { "round": 1, "summary": "Opening arguments contrasted readability against immediate visual output." }
         │
         ├── event: battle.synthesis.start
         │   data: { "status": "synthesizing" }
         │
         ├── event: battle.final
         │   data: {
         │     "finalAnswer": "Consolidated decision verdict...",
         │     "insights": { "a": "...", "b": "..." },
         │     "agreement": { "score": 88, "note": "Computed convergence", "method": "claim-graph-v1", "demo": false }
         │   }
         │
         └── event: battle.done
             data: { "battleId": "btl_123", "completedAt": "2026-10-21T18:00:00Z" }
```

### Disconnects & Event ID Resume
- Each event should include an `id: <monotonic_counter_or_event_id>` header.
- On network disconnect, the browser's `EventSource` automatically attempts reconnection and sends `Last-Event-ID: <id>`.
- Developer 4's implementation should support resuming from `Last-Event-ID` if events are cached in memory/database.
