# ChronoLedger — AI + Developer Operating Rules (AGENTS.md)

_Last updated: 2026-01-04_

## Purpose
This document defines **non-negotiable rules** for humans and AI agents contributing to ChronoLedger. The goal is predictable, maintainable changes that respect architectural decisions and keep the codebase understandable.

**These rules apply to every change unless an ADR explicitly overrides them.**

---

## Decision hierarchy (source of truth)
When guidance conflicts, follow this order:

1) Product requirements / constraints
2) ADRs (architecture decisions)
3) Project plan / checklists
4) Code comments / local module notes

If an ADR exists for a topic, **do not improvise around it**.

Relevant ADRs:
- ADR-0034 — API Internal Architecture: Vertical Slice + Hexagonal Boundaries
- ADR-0035 — Frontend Architecture: Feature Modules + MVC-ish Layers + Dumb Views
- ADR-0036 — Testing Toolchain + Test Database Strategy

---

## Non‑negotiables (hard rules)

### Strict TDD
- **New features and behavior changes MUST be implemented using strict TDD**:
  1) Write a failing test that describes the desired behavior (RED)
  2) Implement the minimal code to pass (GREEN)
  3) Refactor while keeping tests green (REFACTOR)

- No feature code may be merged without tests that prove the behavior.
- Bug fixes must include a test that fails before the fix and passes after.

### SOLID + DRY + Modularity
- Apply **SOLID** principles when designing modules and boundaries.
- Apply **DRY**: do not duplicate logic. If logic appears twice, extract.
- Keep modules small and composable. Prefer cohesive units with clear responsibilities.

### Human readability (always)
- Code must be **human readable without fail**:
  - Use clear, descriptive names (no clever abbreviations)
  - Prefer small functions; keep cyclomatic complexity low
  - Avoid deep nesting; use guard clauses
  - Make data flow obvious; minimize hidden side effects
  - Prefer explicitness over “magic”

### Industry-standard commenting
- Comment to explain **why** something exists or is done a certain way, not what the code obviously does.
- Document:
  - business rules and edge cases
  - non-obvious constraints (time math, rounding, DST assumptions)
  - external system assumptions (Auth0 claims, queue semantics)
- Add JSDoc/TSDoc for public APIs and exported functions where intent is not obvious.

---

## Architecture boundary rules

### API boundary rules (ADR-0034)
- **Feature-first modules** (vertical slices).
- Inside each feature:
  - `domain/` is pure (no Nest/Prisma/HTTP/queue imports)
  - `application/` orchestrates domain + ports
  - `adapters/` implements ports (Prisma, queues, storage)
  - `http/` maps transport (controllers/DTOs/validation) and contains no business rules

Hard restrictions:
- `domain/` MUST NOT import NestJS, Prisma, HTTP, queue, storage clients, decorators, or environment config.
- Business rules MUST live in `domain/` or `application/`.

### Frontend boundary rules (ADR-0035)
- **Feature-first modules**.
- MVC-ish layering:
  - `ui/` = dumb views (render + emit events)
  - `controller/` = orchestration (hooks/containers)
  - `model/` = types + pure rules (no React imports)
  - `api/` = network plumbing (no business rules)

Hard restrictions:
- `ui/` MUST NOT fetch/mutate data directly.
- `ui/` MUST NOT contain business rules (pay period math, validation rules, ATO calculations).

---

## Change workflow (required)

### 1) Read-first
Before coding, read:
- `README.md` (project constraints)
- relevant ADRs (0034/0035/0036 at minimum)
- the target module’s docs (if present)

### 2) Plan the smallest change
- Prefer the smallest PR that delivers a vertical slice or discrete improvement.
- Do not reformat unrelated code.
- Do not rename/restructure files unless required for the change.

### 3) Implement with strict TDD
- Start with tests and let them drive code.
- Keep red-green-refactor cadence tight.

### 4) Update docs and indices
- If you add a doc, update `docs/README.md` and any relevant local index (`docs/02-adr/README.md`, etc.).

---

## Testing rules (ADR-0036)

### Test types
- **Unit tests**: pure domain/model/use-case behavior; no DB; fast.
- **Integration tests**: real DB (ephemeral Postgres via Testcontainers); verifies migrations/constraints/adapters.
- **E2E tests**:
  - Web: Playwright
  - Mobile: Detox
  - API boundary: Supertest against a booted app + real test DB

### Test DB isolation
- Never run integration/E2E tests against dev or prod databases.
- Default to ephemeral Postgres per run using Testcontainers.

---

## Code quality standards

### General
- Keep functions small and cohesive.
- Prefer composition over inheritance.
- Avoid premature abstraction; abstract only when duplication or clear reuse exists.

### Error handling
- Fail loudly and predictably.
- Provide actionable errors.
- Don’t swallow exceptions.

### Logging
- Log at module boundaries and for critical workflows (locks/unlocks, exports).
- Avoid logging sensitive data.

---

## AI-specific rules (extra guardrails)

### No mass rewrites
- AI agents MUST NOT:
  - rewrite entire files to “clean up style”
  - reorder imports/sections unless necessary
  - change naming conventions broadly
  - move code across folders without explicit instruction

### Minimal diffs
- Make the smallest set of edits required.
- Preserve formatting and structure of surrounding code.

### Stop conditions (do not guess)
If any of the following occurs, stop and propose an ADR or ask for a decision (do not assume):
- unclear data contract between client and API
- conflict between docs and implementation intent
- a boundary rule forces a tradeoff (e.g., domain needs data it shouldn’t access)
- offline/sync behavior isn’t specified for a flow that depends on it

---

## Definition of Done (per feature)
A change is not “done” unless:
- strict TDD was followed (tests exist and meaningfully assert behavior)
- SOLID/DRY/modularity upheld
- code is human-readable
- comments explain non-obvious intent and constraints
- docs/index links updated when new files are introduced

---

## Repo placement
Save this file at the repo root:
- `AGENTS.md`

Add a link in `README.md` and/or `docs/README.md` so it is discoverable.

