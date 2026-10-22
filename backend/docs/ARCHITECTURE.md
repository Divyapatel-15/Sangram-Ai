# SANGRAM AI — Backend Architecture & Integration Guide

## 1. System Philosophy & Monolith Topology

Sangram AI employs a **Modular Monolith** architecture designed for developer velocity, clear ownership seams, operational simplicity, and low cognitive overhead.

```
sangram-ai/
├── frontend/                     # React 18 + Vite SPA (Port 3000)
└── backend/                      # FastAPI Modular Monolith (Port 8000)
    ├── alembic/                  # Database migration scaffolding (Dev 2)
    ├── app/
    │   ├── api/                  # HTTP Routers & Dependency Injection
    │   │   ├── deps.py           # Universal dependencies & fail-closed auth
    │   │   └── v1/               # Domain endpoints (health, battles, auth, etc.)
    │   ├── core/                 # Config, errors, structured logging, middleware
    │   ├── db/                   # SQLAlchemy 2 async engine & sessionmaker
    │   ├── interfaces/           # Typed Python Protocols / Developer seams
    │   ├── proposals/            # Proposed entity models for Dev 2 & 5 review
    │   └── schemas/              # Pydantic v2 schemas & common error envelopes
    ├── docs/                     # API contracts, conventions, and handoff guides
    └── tests/                    # Pytest foundation & contract test suite
```

### Clean Architectural Layers

1. **Routers (`app/api/v1/`)**: Pure transport layer. Validates HTTP payloads using Pydantic, inspects request headers/cookies, injects dependencies, and translates service outcomes into HTTP responses or errors.
2. **Interfaces (`app/interfaces/`)**: Strict typing boundary. Defined as Python `typing.Protocol` classes with complete type hints and docstrings. Routers never couple to concrete service implementations directly.
3. **Services (`Developer implementations`)**: Business logic, debate orchestration, AI streaming, token reservations, and payment flows.
4. **Repositories / Persistence (`app/db/` & `alembic/`)**: SQLAlchemy 2 async engine with PostgreSQL `asyncpg` driver.

---

## 2. Developer Ownership Matrix

| Developer | Domain | Key Responsibilities | Seam / Interface |
| :--- | :--- | :--- | :--- |
| **Developer 1** (You) | **Architecture & Foundation** | Project setup, settings, structured JSON logs, X-Request-ID, CORS, health probes, common error standards, OpenAPI specs, deployment docs. | `app/core/`, `app/main.py`, `app/schemas/common.py` |
| **Developer 2** | **Auth, Users & Database** | User registration, login, JWT issuance, HttpOnly cookies, Alembic migrations, PostgreSQL domain tables, password hashing. | `IAuthService`, `IUserService` |
| **Developer 3** | **AI Model Gateway** | Multi-provider streaming (OpenAI, Anthropic, Google, Meta, Mistral, xAI), provider health checks, token usage estimation. | `IModelGatewayService` |
| **Developer 4** | **Battles, Debate & SSE** | 4-round dialectic state machine, turn orchestration, Server-Sent Events (SSE) streaming, consensus scoring, ADR saved answers. | `IBattleService`, `IBattleStreamService`, `ISavedAnswerService`, `IShareService` |
| **Developer 5** | **Billing & Entitlements** | Stripe checkout sessions, customer portal, quota reservation/settlement, payment webhooks, subscription lifecycle. | `IBillingService`, `IUsageService` |
| **Developer 6** | **Security & Production** | Penetration testing, strict rate limiting, security headers, CI/CD pipelines, Prometheus/Grafana monitoring, alerting. | Middleware, CI/CD, Observability |

---

## 3. Request Lifecycle & Middleware Stack

Every incoming HTTP request executes through a strictly ordered pipeline:

```text
[Incoming HTTP Request]
         │
         ▼
[RequestIDMiddleware]
  • Extracts incoming 'X-Request-ID' (sanitizes: [a-zA-Z0-9_-]{1,64})
  • Or generates UUID4 'req_<hex16>'
  • Binds request ID to contextvars (request_id_ctx_var)
  • Attaches 'X-Request-ID' to outgoing response
         │
         ▼
[AccessLoggingMiddleware]
  • Starts high-resolution timer
  • Dispatches request downstream
  • Calculates duration in milliseconds
  • Emits structured JSON access log: { method, path, status, duration_ms, requestId }
  • Sanitizes passwords, tokens, cookies, auth headers, and secrets
         │
         ▼
[CORSMiddleware]
  • Validates Origin against ALLOWED_ORIGINS (e.g. http://localhost:3000)
  • Handles preflight OPTIONS requests
  • Exposes 'X-Request-ID' header to browser
         │
         ▼
[Router & Dependency Injection]
  • get_db_session: Injects active async database session
  • get_current_principal: Fails closed (401 AUTH_FAILED) if unauthenticated
  • Service dependencies: Return 501 MODULE_NOT_IMPLEMENTED until connected
         │
         ▼
[Route Execution / Business Logic]
         │
         ▼
[Central Exception Handlers]
  • AppException -> { code, message, retryable, requestId, details }
  • RequestValidationError -> 422 VALIDATION_ERROR with field pointers
  • HTTPException -> Standard status mapping with requestId
  • Unhandled Exception -> Logs traceback internally; returns safe 500 error
```

---

## 4. Fail-Closed Authentication Standard

Security requires that **authentication must fail closed**:
- The `get_current_principal` dependency inspects both `Authorization: Bearer <token>` and `Cookie: sangram_session`.
- In Developer 1's foundation, before Developer 2 has connected real cryptographic JWT verification or database session stores, **every caller is rejected with HTTP 401 `AUTH_FAILED`**.
- **No bypasses, demo user fallbacks, or accept-any-token dependencies are permitted.**
- Unit tests supply authenticated callers by overriding the dependency cleanly via `app.dependency_overrides[get_current_principal]`.
