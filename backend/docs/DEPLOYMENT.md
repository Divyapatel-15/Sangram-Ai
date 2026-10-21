# SANGRAM AI — Backend Deployment & Operations Guide

This guide details the containerization, environment configuration, health probes, and production deployment standards for Sangram AI.

---

## 1. Containerization & Docker Architecture

The backend includes a production-grade multi-stage `Dockerfile` and local `docker-compose.yml`.

### Building the Docker Image
```bash
docker build -t sangram-ai-backend:latest -f Dockerfile .
```

### Running with Docker Compose (App + PostgreSQL)
```bash
docker compose up -d
```
This automatically boots:
- `sangram-db`: PostgreSQL 16 on port 5432 with health check.
- `sangram-api`: FastAPI backend on port 8000, waiting for database readiness before startup.

---

## 2. Environment Variables Checklist

| Variable | Required | Development Default | Production Standard |
| :--- | :---: | :--- | :--- |
| `ENVIRONMENT` | Yes | `development` | `production` (Triggers strict security validators) |
| `DEBUG` | Yes | `false` | Must be `false`. `true` will abort startup. |
| `SECRET_KEY` | Yes | `dev-insecure-secret...` | High-entropy string (min 32 chars) generated via `openssl rand -hex 32`. |
| `ALLOWED_ORIGINS`| Yes | `http://localhost:3000` | Explicit production domain(s) (e.g. `["https://app.sangram.ai"]`). No `*`. |
| `DATABASE_URL` | Yes | `localhost:5432` | Managed PostgreSQL (AWS RDS, Supabase, Neon) with SSL (`sslmode=require`). |
| `DB_POOL_SIZE` | No | `10` | 20 to 50 based on container memory and max connections. |
| `DB_MAX_OVERFLOW`| No | `20` | 10 to 20. |
| `LOG_LEVEL` | No | `INFO` | `INFO` or `WARN`. |
| `LOG_JSON` | No | `true` | `true` for CloudWatch / Datadog / Loki ingestion. |

---

## 3. Kubernetes & Cloud Health Probes

Sangram AI provides distinct liveness and readiness endpoints:

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 8000
  initialDelaySeconds: 5
  periodSeconds: 10
  timeoutSeconds: 2
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /health/ready
    port: 8000
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 2
```

- **`/health/live`**: Checks if the Python ASGI process is responsive. Does NOT touch the database. If this fails, the container is deadlocked and must be restarted.
- **`/health/ready`**: Executes a bounded `SELECT 1` ping against PostgreSQL. If the database is unreachable or pool is exhausted, returns `503 SERVICE_UNAVAILABLE`. Traffic will be redirected away until the database recovers.

---

## 4. HTTPS & Reverse Proxy Assumptions

The application expects to run behind a reverse proxy (Nginx, Traefik, Cloudflare, or AWS ALB):
1. **TLS Termination**: HTTPS is terminated at the proxy.
2. **Forwarded Headers**: The proxy MUST forward:
   - `X-Forwarded-For`: Original client IP for rate limiting and logging.
   - `X-Forwarded-Proto`: Set to `https` so redirect URLs use HTTPS.
   - `X-Request-ID`: Propagates tracing IDs from the ingress gateway.
3. **Cookie Security**:
   - In production, all auth cookies must be marked `Secure; HttpOnly; SameSite=Lax`.

---

## 5. Secret Management Standards

- **Never mount `.env` files into production containers.**
- Inject secrets at container runtime via cloud secret managers:
  - AWS Secrets Manager / Parameter Store (via ECS task definitions).
  - Kubernetes Secrets (via CSI Secret Store Driver).
  - Doppler or HashiCorp Vault.

---

## 6. Production Blockers & Teammate Handoff Notice

> [!WARNING]
> **DEPLOYING THIS FOUNDATION DOES NOT MAKE THE PLATFORM PRODUCTION-READY.**
> Developer 1 has established the architecture, contracts, validation, database infrastructure, and test harness.
> The platform cannot debate or accept payments until:
> 1. **Developer 2** connects real user authentication and database migrations.
> 2. **Developer 3** connects live AI provider API keys.
> 3. **Developer 4** implements the 4-round debate engine and SSE streaming.
> 4. **Developer 5** connects live Stripe credentials and webhook processing.
> 5. **Developer 6** executes load testing and security audits.
