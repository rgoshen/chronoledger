# Local Development Plan

**Purpose:** Provide a repeatable, production-grade local development workflow for ChronoLedger.

**Status:** Draft
**Last reviewed:** YYYY-MM-DD

**Related ADRs:**

- ADR-0032-local-dev-env-strategy.md
- ADR-0023-iac-opentofu.md
- ADR-0024-prisma-migrations.md
- ADR-0012-pdf-export-pipeline.md
- ADR-0018-pdf-rendering-html-chromium.md

## Goals

- One-command bootstrap for dependencies (Postgres, queue, local object storage)
- Fast inner-loop for API and worker services
- Deterministic fixtures for tests and exports
- Clear separation between local dev, CI, and cloud environments

## Prerequisites

- Git
- Node.js (LTS)
- pnpm (recommended) or npm
- Docker + Docker Compose

Optional (recommended):

- `direnv` for local env var loading

## Repo structure assumptions

> Update these paths once the monorepo folders exist.

- `apps/api` — API service
- `apps/worker` — export worker
- `packages/shared` — shared types/utilities
- `infra/local` — local docker compose and scripts

## Environment variables

Create `.env` files using `.env.example` templates (do not commit `.env`).

Minimum variables (example names):

- `DATABASE_URL=postgresql://chronoledger:chronoledger@localhost:5432/chronoledger?schema=public`
- `AUTH_PROVIDER=auth0`
- `AUTH0_DOMAIN=...`
- `AUTH0_AUDIENCE=...`
- `SQS_QUEUE_URL=...` (localstack)
- `OBJECT_STORE_ENDPOINT=...` (localstack or minio)

## Local dependencies

Preferred local stack:

- Postgres (Docker)
- Local AWS emulator (LocalStack) for SQS + S3

Alternative:

- Postgres + MinIO (S3-compatible) + a lightweight queue (if desired)

## Startup flow

```mermaid
flowchart TB
  A[Clone repo] --> B[Install deps]
  B --> C[Start local services via Docker]
  C --> D[Run migrations]
  D --> E[Seed fixtures]
  E --> F[Run API]
  E --> G[Run Worker]
  F --> H[Hit /health]
```

## Commands (recommended)

### 1) Install dependencies

From repo root:

- `pnpm install`

### 2) Start local services

From repo root (or `infra/local` if you prefer):

- `docker compose up -d`

Services should include:

- `postgres`
- `localstack` (SQS/S3)

### 3) Run migrations

From `apps/api` (or a shared migration package):

- `pnpm db:migrate`

Migration rules:

- CI must validate fresh migrations from empty DB.
- Raw SQL migrations are allowed for Postgres constraints not supported by Prisma.

### 4) Seed fixtures

- `pnpm db:seed`

Fixture source of truth:

- `docs/04-data/fixtures/README.md`

### 5) Run the API

- `pnpm dev:api`

Expected endpoints:

- `GET /health`

### 6) Run the worker

- `pnpm dev:worker`

Worker should:

- Poll SQS
- Render PDFs
- Store artifacts
- Update job status in DB

## Local URLs

- API: `http://localhost:3000`
- Postgres: `localhost:5432`
- LocalStack: `http://localhost:4566`

## Observability (local)

Minimum:

- Structured logs to stdout
- Request IDs propagated from API to worker jobs

## Troubleshooting

### Postgres won’t start

- Check port 5432 is free
- `docker compose ps` and `docker compose logs postgres`

### Migrations fail

- Verify `DATABASE_URL`
- Ensure the DB is reachable
- Reset local DB:
  - `docker compose down -v`
  - `docker compose up -d`

### LocalStack issues

- Verify `localstack` is running
- Confirm SQS queue exists (create on startup via script)

## Definition of Done (local dev)

- Fresh clone can run:
  - `pnpm install`
  - `docker compose up -d`
  - `pnpm db:migrate`
  - `pnpm db:seed`
  - `pnpm dev:api`
- `GET /health` returns 200
- A basic export job can be created and completes locally
