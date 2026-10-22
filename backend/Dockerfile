# ==============================================================================
# SANGRAM AI BACKEND — DOCKERFILE
# Multi-stage production build with non-root security context
# ==============================================================================

FROM python:3.12-slim AS builder

WORKDIR /build

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Final Runtime Image
FROM python:3.12-slim AS runtime

WORKDIR /app

# Install runtime libpq for PostgreSQL
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Create non-root application user
RUN groupadd -g 1001 sangram && \
    useradd -u 1001 -g sangram -s /bin/bash -m sangram

# Copy application source code
COPY --chown=sangram:sangram app/ ./app/
COPY --chown=sangram:sangram alembic/ ./alembic/
COPY --chown=sangram:sangram alembic.ini ./alembic.ini
COPY --chown=sangram:sangram docs/ ./docs/

USER sangram

EXPOSE 8000

# Health check using standard library urllib
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health/live', timeout=2)" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
