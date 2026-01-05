# ChronoLedger — Database Access & Migrations (Prisma)

_Last updated: 2026-01-02_

## 1) Repo layout

Recommended placement:

```text
services/api/
  prisma/
    schema.prisma
    migrations/
services/worker/
  prisma/
    schema.prisma   (optional; prefer sharing via package if practical)
packages/
  db/
    prisma/         (optional shared package if you want one schema definition)
```

Practical default: keep Prisma schema in **API** and have the worker import a generated client package (so there is one schema source of truth).

## 2) Environment workflow

- Dev:
  - `prisma migrate dev`
- CI:
  - `prisma migrate deploy` against an ephemeral DB (or a dedicated CI DB) to ensure migrations apply
- Staging/Prod:
  - `prisma migrate deploy` as the migration gate step (ADR-0021)

## 3) Backward-compatible migrations (rolling deploy safety)

Prefer “expand/contract” style:

1) Add new nullable columns/tables
2) Deploy app code that writes both (if needed)
3) Backfill with a job
4) Switch reads
5) Remove old columns later

## 4) Tenancy + soft delete conventions

- Every tenant-owned table includes `tenant_id`.
- Soft-deleted tables include `deleted_at`.
- Indexes should commonly include:
  - `(tenant_id, user_id, start_utc)` for time entries, with `WHERE deleted_at IS NULL`

## 5) Raw SQL guidelines

- Use parameterized queries only.
- Centralize raw SQL in a `db/queries` module.
- Prefer database views for stable report shapes.

## 6) Migration safety checks

- Lint: prevent destructive changes in prod without explicit approval
- Ensure every migration is reversible conceptually (even if rollback is forward-only, have a remediation plan)
