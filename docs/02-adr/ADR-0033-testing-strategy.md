# ADR-0033: Testing Strategy (Unit + Integration + Contract + PDF Golden Tests)

- Status: Accepted
- Date: 2026-01-02

## Context
ChronoLedger includes complex time rules (timezone boundaries, overlaps, ATO caps), admin workflows, and “official” PDFs. We need confidence without heavyweight process.

## Decision
Adopt a layered testing pyramid with special coverage for time rules and PDFs.

### 1) Unit tests (fast)
- Domain services:
  - overlap detection logic (API-side)
  - ATO rules (Mon–Fri only, 8h/day cap, weekly cap)
  - cross-midnight split logic
  - pay rate effective dating selection
- Utility functions:
  - UTC conversions
  - timezone display helpers (pure functions only)

### 2) Integration tests (DB + API)
- Run API against a real PostgreSQL instance (Testcontainers or dockerized CI DB).
- Validate:
  - constraints (no overlaps, one open entry)
  - locking/unlocking behavior
  - audit table writes per mutation
  - tenant scoping enforcement

### 3) Contract tests
- Generate and maintain an OpenAPI spec (from code or written-first).
- Validate request/response shapes and Problem+JSON error contract (ADR-0030).

### 4) End-to-end (targeted)
- Web E2E with Playwright for:
  - start/stop time entry
  - lock + unlock request flow
  - admin approval
- Mobile E2E is deferred initially; focus on unit/integration + manual smoke until stable.

### 5) PDF “golden” tests (official exports)
- For each PDF template version:
  - render with deterministic fixture data
  - compare checksum/metadata and (optionally) pixel-diff snapshots
- Run these tests in CI for template changes.

## Consequences
- ✅ High confidence in the rules that matter most
- ✅ Prevents regressions in “official” exports
- ✅ Keeps feedback loops fast while covering integration risks
- ⚠️ PDF testing can be sensitive to Chromium/font versions (pin versions in worker image)
- ⚠️ Timezone tests require carefully curated fixtures and fixed “now” injection

## Notes/Links
- PDF rendering: ADR-0018
- Concurrency/integrity: ADR-0031
