# Testing Plan

**Purpose:** Define ChronoLedger’s testing strategy and quality gates to ensure correctness, auditability, and reproducible “official” exports.

**Status:** Draft
**Last reviewed:** YYYY-MM-DD

**Related ADRs:**
- ADR-0033-testing-strategy.md
- ADR-0030-api-error-contract-problem-json.md
- ADR-0004-time-and-timezone-strategy.md
- ADR-0012-pdf-export-pipeline.md
- ADR-0018-pdf-rendering-html-chromium.md
- ADR-0031-concurrency-idempotency.md

## Principles

- **Correctness first:** domain invariants are tested and enforced at multiple layers.
- **Deterministic:** tests must be reproducible locally and in CI.
- **Shift-left:** validate rules and contracts before end-to-end testing.
- **Fast feedback:** prefer small, focused tests; keep slow suites isolated.
- **Production-grade:** treat export golden fixtures and migration tests as first-class.

## Test levels

```mermaid
flowchart TB
  U[Unit tests
(domain rules)] --> I[Integration tests
(DB constraints + migrations)]
  I --> C[Contract tests
(OpenAPI + Problem Details)]
  C --> E[End-to-end tests
(happy paths + critical flows)]
  C --> G[Golden export tests
(PDF determinism)]
```

### 1) Unit tests (domain rules)

Focus:
- Time arithmetic and rounding rules
- Pay period selection (PP1/PP2) and edge cases
- Time entry validation (start/end, open-entry policy)
- Totals and rollups by code/day/pay period
- Idempotency key logic (if implemented at application layer)

Required characteristics:
- No database
- No network
- No system clock (use fixed timestamps)

### 2) Integration tests (database)

Focus:
- Migrations apply cleanly from empty database
- Constraints enforce invariants (e.g., no overlaps, one open entry)
- Multi-tenancy isolation rules (tenant_id boundaries; RLS if enabled)
- Audit tables are append-only (no updates/deletes where prohibited)

Required characteristics:
- Run against a disposable Postgres instance (Docker)
- Use deterministic fixtures

### 3) Contract tests (API)

Focus:
- OpenAPI matches implementation (requests/responses)
- Problem Details (`application/problem+json`) shape and stable `code`
- Pagination/filter conventions
- Auth boundaries and authorization error behavior

Contract test sources:
- `docs/03-api/openapi.yaml` as the source of truth

### 4) End-to-end tests (critical flows)

Focus:
- User flows: create/edit/list time entries, pay period summary views
- Admin flows: lock/unlock requests, approvals, audit visibility
- Export flows: create export job, poll status, download artifact

Required characteristics:
- Keep minimal: cover critical paths and high-risk regressions
- Avoid duplicating unit/integration coverage

### 5) Golden export tests (PDF determinism)

Focus:
- “Official” exports produce identical outputs given identical inputs
- Template version + rendering version are recorded and asserted
- Fonts are embedded and consistent
- Locale/timezone formatting is consistent

Golden fixture approach:
- Inputs + expected PDF stored under `docs/04-data/fixtures/exports/...`
- Test produces a PDF and compares against expected output

Comparison options:
- Preferred: checksum comparison of the full PDF when determinism is guaranteed
- Fallback: render pages to images and compare (more complex; use only if necessary)

## Fixtures

- Fixture conventions are documented in `docs/04-data/fixtures/README.md`.
- All fixtures must use fixed UUIDs and fixed timestamps.
- Avoid `now()` or environment-derived locale/timezone.

## Time and timezone testing rules

- Store timestamps in UTC.
- Tests should explicitly set the display timezone when verifying “local” output behavior.
- Include boundary tests:
  - midnight transitions
  - DST transitions (spring forward/fall back)
  - cross-day entries

## CI quality gates

Minimum gates (P0):
- Lint + formatting checks
- Unit tests
- Integration tests (DB)
- Contract validation (OpenAPI + Problem Details)

Add as exports land:
- Golden PDF export tests (official exports)

Recommended gates (P1):
- Dependency scanning
- SAST (static analysis)
- Container image scanning

## Test data safety

- No real personal data in fixtures.
- No secrets in tests or fixture files.
- If sample emails are needed, use non-deliverable domains (e.g., `example.com`).

## Test organization (recommended)

- `apps/<service>/src/...`
- `apps/<service>/test/unit/...`
- `apps/<service>/test/integration/...`
- `apps/<service>/test/contract/...`
- `apps/<service>/test/e2e/...` (only where necessary)

## Maintenance rules

- If an invariant changes, update:
  - unit tests
  - DB constraint tests
  - fixtures (if applicable)
  - golden exports (if impacted)
- Golden PDF changes must be intentional and reviewed.

