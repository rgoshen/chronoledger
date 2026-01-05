# ADR-0032: Local Development and Environment Strategy (Docker Compose + AWS Dev Env)

- Status: Accepted
- Date: 2026-01-02

## Context

ChronoLedger is AWS-first but must be practical to develop locally. We need:

- a reliable local loop for API + worker + DB
- minimal drift from AWS behavior (SQS/S3)
- simple environment separation (dev/staging/prod) for deployments

## Decision

Use a **Docker Compose** local stack and a **real AWS dev environment** by default, with an optional local emulation mode.

### 1) Local stack (default)

- Local services via Docker Compose:
  - PostgreSQL
  - API service
  - Worker service
- Use a `.env` (or per-service env files) for local configuration.
- Seed scripts create:
  - a dev tenant
  - an admin user mapping (by Auth0 sub/email)
  - baseline time codes and pay rate history

### 2) AWS integration in dev (default)

- Use real AWS for:
  - SQS (job queue)
  - S3 (exports)
  - Secrets Manager (optional; local `.env` acceptable for dev)
This reduces behavioral drift versus production.

### 3) Optional local emulation (opt-in)

- Support LocalStack/MinIO for:
  - SQS/S3
This is optional when offline or when avoiding AWS costs during development.

### 4) Environment configuration

- `dev`, `staging`, `prod` are defined as distinct env stacks in IaC (ADR-0023) and protected in CI/CD (ADR-0021).
- Clients select environment via build-time config (mobile) or runtime config (web).

## Consequences

- ✅ Fast local loop without needing full AWS for everything
- ✅ Production-like behavior for queues/exports in dev by default
- ✅ Clean separation of environments for deployments
- ⚠️ Requires managing a small dev AWS footprint (minor cost)
- ⚠️ Dual-mode (AWS vs emulated) adds documentation/testing overhead

## Notes/Links

- CI/CD: ADR-0021
- IaC: ADR-0023
