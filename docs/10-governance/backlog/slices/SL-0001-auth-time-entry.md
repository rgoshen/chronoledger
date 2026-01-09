## Customer Journey
1. Sign in
2. Navigate to “Time Entry”
3. Create a complete entry (happy path)
4. Start an open entry → stop it → confirm persisted
5. Attempt an overlap → see clear rejection

## Work Breakdown (execution checklist)
Prefer updating this checklist over creating separate WO docs.

### Backend / API
- [ ] Confirm endpoints + contracts (align with ADRs)
- [ ] Implement validation + authorization rules
- [ ] Implement invariants (DB-enforced where required)
- [ ] Add integration tests for the critical path

### Data / Migrations
- [ ] Schema changes + migrations
- [ ] Seed/fixtures for local and tests
- [ ] Backfill/retention impacts (if any)

### Web UI
- [ ] Screens/components
- [ ] Empty/loading/error/success states
- [ ] Accessibility pass (keyboard/focus/labels)

### Mobile UI (if in-scope)
- [ ] Screens/components
- [ ] Empty/loading/error/success states

### Worker / Jobs (if in-scope)
- [ ] Job definitions + idempotency/retry posture
- [ ] Storage/artifact handling

### QA
- [ ] E2E coverage for the slice’s happy path
- [ ] Negative cases (top 2–3 failure modes)
- [ ] Regression notes

### Observability
- [ ] Structured logs for key actions
- [ ] Basic metrics (requests, failures, timings)
- [ ] Trace hooks (if enabled)

## Implementation Plan (by layer)
### UX/UI
- Web: minimal “Time Entry” screen with create form + list of entries for current pay period
- Mobile: minimal equivalent (can be follow-on if sequencing is needed)
- States: empty, saving, validation error, overlap error, success

### Web/API
- Endpoints (example):
  - POST `/time-entries` (create complete)
  - POST `/time-entries/open` (start open)
  - POST `/time-entries/<built-in function id>/stop` (stop open)
  - GET `/time-entries?payPeriod=...` (minimal list for verification)
- AuthZ: role-based per PRD
- Errors: Problem+JSON

### Data
- Tables/Models: time_entries (+ tenant/user scoping)
- Migrations: include overlap enforcement mechanism (constraint/index)
- Seed: minimal codes for local dev

### Observability
- Logs: structured events for create/start/stop and overlap rejections
- Metrics: count create attempts/success/failure (basic)

## Rollout Plan
- Feature flag optional (recommended for UI exposure)
- Backward compatibility: N/A for MVP

## Change Log
- 2026-01-09: Added Work Breakdown checklist (lean mode)

## Acceptance Checklist
- [ ] End-to-end demo works locally (web at minimum)
- [ ] Overlap is DB-enforced (not UI-only)
- [ ] Error contract is consistent
- [ ] Tests: unit + integration for overlap + idempotency behavior
- [ ] Docs updated (story/slice status)

## Demo Script
1. Sign in
2. Create a valid entry
3. Start and stop an open entry
4. Try to create an overlap and show the error
