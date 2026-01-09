## Customer Journey
1. Choose a pay period
2. See daily totals and code breakdown
3. See weekly rollup and warnings
4. Attempt a change that violates weekly rules → see prevent/deny with explanation

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
- Summary screen: totals + day list + expandable day details
- Boundary highlighting for PP1/PP2
- States: empty, loading, error, warning banner

### Web/API
- GET `/pay-periods/<built-in function id>/summary`
- Include: totals, per-day breakdown, per-code breakdown, weekly rollup, warnings array

### Data
- Ensure summary is computed deterministically from stored entries (and split entries)
- Timezone logic consistent with ADR-0004

### Observability
- Logs: summary requested + warning counts
- Metrics: summary requests, rule violation attempts

## Change Log
- 2026-01-09: Added Work Breakdown checklist (lean mode)

## Acceptance Checklist
- [ ] PP boundaries correct (PP1 1–15; PP2 16–end)
- [ ] Weekly rollup and enforcement per FR-050/FR-051
- [ ] Warning for >44 hours displayed and included in report data
- [ ] Tests cover representative fixtures (including cross-midnight splits)

## Demo Script
1. Load pay period summary with seeded entries
2. Show weekly rollup and warning banner for >44 hours
3. Attempt to add entry that violates weekly rule and show rejection
