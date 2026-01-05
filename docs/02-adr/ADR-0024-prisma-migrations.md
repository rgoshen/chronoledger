# ADR-0024: Database Access and Migrations (Prisma + PostgreSQL)

- Status: Accepted
- Date: 2026-01-02

## Context

ChronoLedger uses PostgreSQL (RDS) with a 3NF core schema, tenant scoping (`tenant_id`), soft deletes, and domain audit tables. We need:

- repeatable schema evolution across dev/staging/prod
- reliable migration ordering in CI/CD with a migration gate
- strongly typed access for productivity while preserving relational discipline

## Decision

Use **Prisma** for:

- typed database access in API and worker
- schema migrations as the source of truth (Prisma Migrate)

### 1) Migration flow

- Migrations are generated and checked into git (`prisma/migrations/*`).
- CI validates migrations apply cleanly.
- Deploy pipeline runs migrations as a gated step before ECS service updates (ADR-0021).

### 2) Relational discipline (3NF + clarity)

- Prisma models must reflect the normalized schema (avoid denormalizing “for convenience”).
- Use explicit join tables for many-to-many relationships.
- Use database constraints (FKs, unique constraints, checks) to enforce invariants.

### 3) Performance and SQL escape hatches

- For complex reporting queries, it is acceptable to use:
  - Prisma `queryRaw` with parameterization, or
  - database views (and later materialized views if needed)
- Keep the normalized tables authoritative; reporting helpers must not become the source of truth.

### 4) Audit tables

- Audit writes are explicit application actions in a transaction with the domain change.
- Audit tables are append-only (no updates/deletes outside exceptional admin repair).

## Consequences

- ✅ One migration tool across environments with strong typing
- ✅ Good developer velocity without abandoning relational correctness
- ✅ Fits the TypeScript-first stack and CI/CD gate pattern
- ⚠️ Requires discipline around raw SQL usage and schema design
- ⚠️ Prisma upgrades must be managed (pin versions; test migrations)

## Alternatives Considered

- Flyway: viable, but less integrated with TS typing and schema modeling.
- Liquibase: powerful, but adds overhead and is less natural in a TS-first stack.
- Hand-rolled SQL migrations only: rejected due to higher foot-gun risk and slower iteration.

## Notes/Links

- See `chronoledger-db-migrations.md` for repository layout and operational guidance.
