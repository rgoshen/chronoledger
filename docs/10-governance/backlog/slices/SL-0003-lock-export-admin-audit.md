## Customer Journey
1. Complete a time entry → it locks
2. Attempt edit → blocked → submit unlock request
3. Admin approves request
4. User edits entry and re-saves → entry re-locks
5. User exports pay period PDF → receives artifact with warnings and metadata

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
- Locked state UI + “Request unlock” flow
- Admin: unlock request queue (minimal table list + details)
- Export: progress UI and download/open affordance

### Web/API
- POST `/unlock-requests`
- GET `/admin/unlock-requests`
- POST `/admin/unlock-requests/<built-in function id>/approve` (and reject)
- POST `/reports/pay-period/<built-in function id>/export/pdf` (or equivalent)
- Ensure authorization: admin-only actions protected

### Data
- Tables: unlock_requests, audit_trail, export_jobs/artifacts (names align to data model)
- Ensure audit rows written for each transition and export

### Worker/Jobs
- Export pipeline job that renders HTML→PDF using agreed renderer and stores artifact
- Idempotency for export jobs to avoid duplicates on retries

### Observability
- Logs: lock/unlock transitions, approval actions, export job lifecycle
- Metrics: export duration, failures, queue depth (basic)

## Change Log
- 2026-01-09: Added Work Breakdown checklist (lean mode)

## Acceptance Checklist
- [ ] Locked entries reject edits without approved unlock
- [ ] Admin approval is required and audit-trailed
- [ ] PDF includes title/range/timestamp/page numbers/warnings
- [ ] Export tests exist (golden fixtures / deterministic snapshots)
- [ ] Security and observability baselines are applied

## Demo Script
1. Show locked entry and blocked edit
2. Submit unlock request
3. Admin approves
4. Edit entry and re-lock
5. Export pay period PDF and open it
