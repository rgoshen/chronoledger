# User Story: US-0004 — Start/stop an open time entry and complete it

## Metadata
- ID: US-0004
- Status: Draft
- Priority: P0
- Owner (PM): @product-manager
- Tech Lead: @tech-lead-architect
- UX: @ui-ux-accessibility
- Target Release: v0.1 (MVP)
- Epic: EP-0001
- Slice(s): TBD
- Links: Requirements (PRD) | ADR(s) | Traceability

## Narrative
As a **user**, I want to **start an entry and stop it later**, so that I can **track time without knowing the end time up front**.

## Traceability
- PRD: FR-011, FR-012, FR-013, FR-016
- Traceability: REQ-0002, REQ-0007 (idempotency for writes) (as applicable)
- ADRs: [ADR-0028](../02-adr/ADR-0028-domain-invariants-state-machines.md), [ADR-0031](../02-adr/ADR-0031-concurrency-idempotency.md)

## Acceptance Criteria (Given/When/Then)
1. **Given** I start an open entry with a code and start time **When** I save **Then** the entry is created with no end time and is clearly marked as “running/open”.
2. **Given** I stop the open entry **When** I submit an end time **Then** the entry becomes complete and is subject to locking rules.
3. **Given** I submit duplicate stop requests (retry) **When** the server receives them **Then** the write is idempotent and results in a single consistent completed entry.
4. **Given** an open entry would cause overlap **When** I start or stop it **Then** the operation is rejected with a clear overlap error.

## UX / UI Notes
- Show a clear “currently running” indicator and the active timer duration.
- Provide safe retry messaging for network interruptions.

## Data & API Notes
- Idempotency keys for start/stop operations.
- Concurrency safety when multiple devices attempt updates.

## Test Plan
- Integration: concurrent stop requests resolve safely
- E2E: start → stop → verify totals updated
