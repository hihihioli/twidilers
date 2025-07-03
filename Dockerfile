# syntax=docker/dockerfile:latest

# ─── 1) Builder stage: compile psycopg2 & install your package in editable mode ───
FROM python:3.13-slim AS builder

# Install build-time deps for psycopg2
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      build-essential \
      libpq-dev \
      gcc \
      python3-dev \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

# Install your project (with psycopg2) into ~/.local
RUN pip install --upgrade pip \
 && pip install --user -e .



# ─── 2) Runtime stage: slim image + only what we need to run ────────────────
FROM python:3.13-slim

# Pull in only the runtime library for libpq
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      libpq5 \
      curl \
 && rm -rf /var/lib/apt/lists/*

# Make sure our user-local bin is on PATH
ENV PATH=/root/.local/bin:$PATH

WORKDIR /app

# Copy in installed packages and your code
COPY --from=builder /root/.local /root/.local
COPY . /app

# On start: run migrations, then exec gunicorn
ENTRYPOINT ["sh", "-c", "flask --app 'twidilers:create_app()' db upgrade && exec gunicorn --bind 0.0.0.0:8000 'twidilers:create_app()' --workers 4 --graceful-timeout 30"]