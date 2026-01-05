# Contributing to ChronoLedger

_Last updated: 2026-01-04_

## Purpose
This document defines contribution standards for ChronoLedger to keep changes predictable, maintainable, and aligned with project decisions.

**Non‑negotiables:** strict TDD, human-readable code, SOLID/DRY, and adherence to ADRs.

---

## Decision hierarchy (source of truth)
When guidance conflicts, follow this order:

1) Product requirements / constraints
2) ADRs (architecture decisions)
3) Project plan / checklists
4) Code comments / local module notes

If an ADR exists for a topic, **do not improvise around it**.

Key ADRs:
- ADR-0034 — API Internal Architecture: Vertical Slice + Hexagonal Boundaries
- ADR-0035 — Frontend Architecture: Feature Modules + MVC-ish Layers + Dumb Views
- ADR-0036 — Testing Toolchain + Test Database Strategy
- ADR-0037 — CI/CD Execution Model: Build Once, Promote by SHA

See also: `AGENTS.md` (AI + developer operating rules).

---

## Non‑negotiable engineering standards

### Strict TDD
All new features and behavior changes MUST follow strict TDD:
1) Write a failing test that describes the desired behavior (RED)
2) Implement the minimal code to pass (GREEN)
3) Refactor while keeping tests green (REFACTOR)

Requirements:
- No feature code may be merged without tests that prove the behavior.
- Bug fixes must include a test that fails before the fix and passes after.

### SOLID + DRY + Modularity
- Apply SOLID principles for responsibilities and boundaries.
- Apply DRY: avoid duplication; extract shared logic when it appears twice.
- Keep modules cohesive and composable to support maintainability.

### Human readability
Code must be human-readable without fail:
- Prefer clear names and explicit control flow over cleverness.
- Keep functions small; limit nesting; use guard clauses.
- Make data flow obvious; avoid hidden side effects.

### Industry-standard commenting
- Comment primarily on **why** and constraints/edge cases.
- Document:
  - business rules and tricky edge cases (time math, rounding, DST assumptions)
  - non-obvious tradeoffs
  - external system assumptions (Auth0 claims, queue semantics)
- Use JSDoc/TSDoc for exported/public APIs when intent is not obvious.

---

## Git workflow and branching
ChronoLedger uses **trunk-based development** with **short-lived branches**.

### Branch model
- `main` is the trunk and should remain releasable.
- All work happens in short-lived branches and merges via PR.
- `main` builds deployable artifacts tagged with the Git SHA (see ADR-0037).
- Promotion to `staging`/`prod` is performed by promoting a known-good SHA, not rebuilding.

### Branch naming (required)
Use one of the following prefixes:

- `feature/<ticket>-<slug>`
- `bugfix/<ticket>-<slug>`
- `refactor/<ticket>-<slug>`
- `chore/<ticket>-<slug>`
- `docs/<ticket>-<slug>`
- `hotfix/<ticket>-<slug>` (reserved for urgent production fixes)

Examples:
- `feature/CL-142-timesheet-week-view`
- `bugfix/CL-155-timer-rounding`
- `chore/CL-001-ci-cache-tuning`

If a ticket ID is not available, use `no-ticket`:
- `feature/no-ticket-<slug>`

### PR merge rules
- No direct pushes to `main`.
- PRs must be single-purpose and reviewable.
- Rebase/merge locally is fine, but PRs merge into `main` through GitHub review + checks.

For the detailed workflow (including promotion and hotfix handling), see:
- `docs/10-governance/git-workflow.md`

---

## Architecture rules

### API rules (ADR-0034)
- Organize by feature modules (vertical slices).
- Within each feature, enforce hexagonal boundaries:
  - `domain/` — pure rules/value objects (no Nest/Prisma/HTTP imports)
  - `application/` — use cases + ports
  - `adapters/` — Prisma/queue/storage implementations
  - `http/` — controllers/DTOs/validation only; no business rules

Hard restrictions:
- `domain/` MUST NOT import NestJS, Prisma, HTTP libs, queue/storage clients, decorators, or env config.
- Business rules MUST live in `domain/` or `application/`.

### Frontend rules (ADR-0035)
- Organize by feature modules.
- MVC-ish layering within each feature:
  - `ui/` = dumb views (render + emit events)
  - `controller/` = orchestration (hooks/containers)
  - `model/` = types + pure rules (no React imports)
  - `api/` = network plumbing (no business rules)

Hard restrictions:
- `ui/` MUST NOT fetch/mutate data directly.
- `ui/` MUST NOT contain business rules (pay period math, validation, ATO calculations).

---

## Testing requirements (ADR-0036)

### Required test coverage

- **Unit tests**: domain/model/use-case behavior (fast, no DB).
- **Integration tests**: DB-backed behavior (migrations, constraints, adapters) using isolated DB.
- **E2E tests**:
  - Web: Playwright
  - Mobile: Detox
  - API boundary: Supertest against booted app + real test DB

### Test database policy

- Integration/E2E tests MUST NOT run against dev/prod DBs.
- Default to ephemeral Postgres per run using Testcontainers.

---

## Pull request guidelines

### Keep PRs small and reviewable

- Prefer single-purpose PRs.
- Avoid drive-by refactors.
- Do not reformat unrelated code.

### PR template expectations

Include:

- What changed and why
- How to test
- Any DB migration notes
- Screenshots for user-facing changes

### Definition of Done (must be true)

- Strict TDD was followed and meaningful tests exist
- SOLID/DRY/modularity upheld
- Code is human-readable
- Non-obvious intent/constraints documented
- Docs/index links updated when new files are introduced

---

## Documentation hygiene

- If you add a doc, update discoverability links:
  - `docs/README.md`
  - `docs/02-adr/README.md` (for ADRs)
- ADRs must include context, decision, consequences, and status.

---

## AI contributions

AI agents must follow `AGENTS.md`.
If using an AI agent, ensure outputs:

- do not perform mass rewrites
- respect architecture boundaries
- include tests (strict TDD)
- make minimal diffs
