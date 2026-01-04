# ADR-0036 — Testing Toolchain + Test Database Strategy

## Status
Accepted (2026-01-04)

## Context
ChronoLedger requires confidence in correctness across:
- core domain rules (time entry validation, pay periods, ATO ledger behavior)
- database constraints and auditability (append-only history, lock/unlock flows)
- report/export outputs (PDF determinism)
- critical user flows across Web and Mobile

To keep velocity high and avoid regressions, we need a consistent testing stack across the monorepo and a clear policy for test environments—especially database isolation.

## Decision
We will standardize the testing toolchain and test environments as follows.

### 1) Backend/API (NestJS + Prisma + Postgres)

#### Unit tests
- **Runner:** Vitest
- **Focus:** domain rules + use cases (pure functions, value objects, application services)
- **Policy:** unit tests must not require a real DB; use fakes/mocks of repository ports.

#### Integration tests (DB + constraints)
- **Runner:** Vitest
- **HTTP harness:** Supertest (for endpoint-level integration)
- **Database:** real Postgres via **Testcontainers**
- **Scope:** Prisma mappings, migrations, constraints, audit triggers/records, lock/unlock workflows.

#### API “E2E” tests (service boundary)
- **Runner:** Vitest
- **Harness:** Supertest against a fully bootstrapped Nest application
- **Database:** Testcontainers Postgres + migrations applied
- **Goal:** verify request/response behavior and cross-module wiring without a browser.

### 2) Web (React)

#### Unit/component tests
- **Runner:** Vitest
- **Library:** React Testing Library
- **Focus:** component behavior, view/controller wiring, validation messaging, model-rule usage.

#### Browser E2E tests
- **Runner:** Playwright
- **Scope:** critical flows (login stub/dev auth path, create/edit entries, pay period review, request export, download export).

### 3) Mobile (React Native)

#### Unit/component tests
- **Runner:** Jest (RN ecosystem default)
- **Library:** React Native Testing Library
- **Focus:** controllers/hooks behavior, offline queue logic, navigation flows at the component level (as feasible).

#### Device E2E tests
- **Runner/Framework:** Detox
- **Scope:** critical end-to-end flows on simulator/emulator.

### 4) Worker / Exports
- **Unit tests:** Vitest for orchestration, template/model generation, storage adapters.
- **Integration tests (selected):** run against Testcontainers Postgres where DB interaction is required.
- **PDF golden tests:** Playwright-based rendering checks with deterministic fixtures (pinned fonts/Chromium settings where applicable).

---

## Test database strategy

### Decision: we will use a separate, isolated database for all non-unit tests
- Integration/E2E tests must **never** run against dev or production databases.
- The default strategy is **ephemeral Postgres per test run** using Testcontainers.

### Implementation policy
- Test harness is responsible for:
  1) starting Postgres (Testcontainers)
  2) applying migrations (Prisma)
  3) (optional) seeding baseline fixtures
  4) running tests
  5) tearing down containers

### Cleanup policy (initial)
- Start with a simple, reliable approach:
  - Apply migrations once per suite/run
  - Reset data between tests using either:
    - transaction rollbacks (preferred when practical), or
    - truncation/reset helpers (simple fallback)

We can optimize for speed later once the harness is stable.

---

## Consequences

### Positive
- Clear separation between unit tests and DB-backed tests.
- High confidence that DB constraints/audit behavior are correct.
- Consistent tooling (Vitest) across API + web where it fits best.
- Strong, reliable E2E stack (Playwright for web, Detox for mobile).

### Negative / Tradeoffs
- Testcontainers adds some setup complexity (especially in CI).
- Mobile E2E (Detox) can be slower and may be staged into CI later if needed.

---

## Alternatives considered
- **Jest everywhere:** simpler uniformity, but slower feedback loop and less ideal for web bundler alignment.
- **Cypress for web E2E:** solid option, but Playwright is preferred for cross-browser coverage and test ergonomics.
- **Dedicated long-lived “test DB” instance:** simpler but higher risk of state leakage and parallel test conflicts.

---

## Practical enforcement
- CI must run:
  - unit tests (API + web + mobile)
  - API integration tests (with Testcontainers)
  - web Playwright E2E (against a known-good test environment)
- Add a review checklist item: “Does this test require the DB? If yes, it must use the test harness + isolated DB.”

---

## Repo placement
Save this file at:
- `docs/02-adr/ADR-0036-testing-toolchain-and-test-database-strategy.md`

Then update any applicable index files (e.g., `docs/README.md`, `docs/02-adr/README.md`) to include a link.

