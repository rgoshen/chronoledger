# Vertical Slice: SL-____ — <short title>

## Metadata
- ID: SL-____
- Status: Draft | Ready | In Progress | Blocked | Done
- Priority: P0 | P1 | P2 | P3
- Owner (PM): @____
- Tech Lead: @____
- UX: @____
- Target Release: v0.___ / Sprint __ / Date ____
- Related User Stories: US-____, US-____
- ADRs required/impacted: ADR-____, ADR-____ (or “None”)
- Environments: Local | Dev | Staging | Prod (target)

## Goal (Thin, End-to-End)
Describe the smallest end-to-end increment that delivers real value:
- UI → API → DB → background jobs → export, etc. (only what’s necessary)

## Slice Scope
### Included
- …

### Excluded
- …

## Customer Journey
1. Entry point:
2. Happy path:
3. Failure path(s):
4. Exit/confirmation:

## Work Breakdown (execution checklist)
Keep this checklist **small and parallelizable**. Prefer updating this section over creating separate WO docs.

### Backend / API
- [ ] Define/confirm endpoints + contracts (align with ADRs)
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
- [ ] Offline/latency behavior (if relevant)

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
- Components/pages:
- Wireframe/Figma:
- Accessibility notes:
- Error/empty/loading states:

### Web/API
- Routes/endpoints:
- AuthZ/AuthN:
- Request/response contracts:
- Validation:

### Data
- Schema changes:
- Migrations:
- Seed data:
- Backfill/retention impacts:

### Worker/Jobs (if applicable)
- Queue/topic:
- Idempotency keys:
- Retry policy:

### Observability
- Logs:
- Metrics:
- Traces:
- Dashboards/alerts:

## Change Log
- 2026-01-09: Created

## Acceptance Checklist
- [ ] Slice provides an end-to-end “demoable” increment
- [ ] Security considerations captured
- [ ] Perf considerations captured
- [ ] Tests in place for the slice’s critical path
- [ ] Docs updated (as needed)
- [ ] Retrospective written after completion (see `docs/10-governance/templates/feature-retrospective-template.md`)

## Demo Script
1. …
2. …
3. …
