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

## Rollout Plan
- Feature flags:
- Backward compatibility:
- Migration ordering:
- Fallback/rollback:

## Work Orders (agent-executable)
Break into discrete tasks that can be assigned to agents.
- WO-____: …
- WO-____: …
- WO-____: …

## Acceptance Checklist
- [ ] Slice provides an end-to-end “demoable” increment
- [ ] Security considerations captured
- [ ] Perf considerations captured
- [ ] Tests in place for the slice’s critical path
- [ ] Docs updated (as needed)
- [ ] Retrospective written after completion (see docs/10-governance/templates/feature-retrospective-template.md)

## Demo Script
1. …
2. …
3. …
