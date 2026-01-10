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

As a **user**, I want to **start a time entry without specifying an end time and stop it later**, so that I can **track active work in real-time without predicting how long tasks will take**.

## Traceability

- PRD: FR-011, FR-012, FR-013, FR-016
- Traceability: REQ-0002, REQ-0007 (idempotency for writes) (as applicable)
- ADRs: [ADR-0028](../02-adr/ADR-0028-domain-invariants-state-machines.md), [ADR-0031](../02-adr/ADR-0031-concurrency-idempotency.md)

## Acceptance Criteria (Given/When/Then)

1. **Given** I provide a valid time entry code and start time (defaults to now) **When** I start an open entry **Then** the entry is created with a 201 response, no end time, and a status of "running" or "open", and is visible in my current entries list with a clear indicator (e.g., "In Progress").
2. **Given** I have a running open entry **When** I submit a stop request with an end time (defaults to now) **Then** the entry is updated with the end time, transitions to "completed" status, is subject to pay period locking rules, and returns a 200 response with the final entry.
3. **Given** I submit duplicate stop requests (e.g., retry due to network failure) with the same idempotency key **When** the server receives them **Then** the operation is idempotent, only the first request processes, subsequent requests return the same result (200 with final entry), and no duplicate or conflicting entries are created.
4. **Given** starting or stopping an open entry would create an overlap with existing entries **When** I attempt the operation **Then** it is rejected with a 409 response, a Problem+JSON error, and a clear message including the conflicting time range.
5. **Given** I attempt to stop an open entry from a different device at a slightly different time (concurrent stop) **When** both requests arrive **Then** the server handles the race condition safely (e.g., first write wins, second returns conflict or accepts first result) and the final entry state is consistent.

## In Scope

- Open time entry start operation (no end time, "running" status)
- Open time entry stop operation (adds end time, transitions to "completed")
- Idempotency for start and stop operations (via idempotency key header per ADR-0031)
- Overlap validation for both start and stop operations
- Concurrent write safety (race condition handling when stopping from multiple devices)
- "Running" state indicator in UI

## Out of Scope

- Pause/resume functionality (deferred)
- Multiple concurrent open entries for the same user (only one open entry at a time)
- Background timer synchronization across devices (deferred)
- Detailed timer UI (elapsed time display with precision) (MVP shows "In Progress" only)

## Dependencies

- ADR-0028 (State machines) for entry state transitions (open → completed)
- ADR-0031 (Idempotency) for duplicate request handling
- US-0003 (Create Time Entry) for overlap detection logic
- US-0002 (Account Linking) for tenant and user context

## Risks

- **Lost stop request (network failure)**: Mitigate via idempotency keys and client retry logic; ensure UI shows retry options.
- **Race condition on concurrent stops**: Mitigate via optimistic locking (version field) or database-level constraints; test with concurrent requests.
- **Timer drift on long-running entries**: Document limitations; consider server-side time validation to reject implausible durations (e.g., >24 hours without stop).

## UX / UI Notes

- Show a clear "currently running" indicator and the active timer duration.
- Provide safe retry messaging for network interruptions.

## Data & API Notes

- Idempotency keys for start/stop operations.
- Concurrency safety when multiple devices attempt updates.

## Test Plan

- Integration: concurrent stop requests resolve safely
- E2E: start → stop → verify totals updated
