# WO-0003 — Tech Lead: Mark SL-0001 “Ready” + decompose into implementation WOs

## Owner
- Primary: Tech Lead / Architect agent
- Reviewer: PM + QA (as needed)

## Goal
Make SL-0001 executable by the engineering agents by:
- confirming scope and constraints,
- ensuring ADR alignment,
- breaking into small implementation work orders (WO-010x) that can run in parallel without conflicts.

## Inputs
- `AGENTS.md` (boundaries, DoD, feature completion rules)
- Slice: `docs/10-governance/backlog/slices/SL-0001-auth-time-entry.md`
- Stories: `docs/10-governance/backlog/user-stories/US-0001..US-0004`
- ADRs referenced in SL-0001
- Traceability map: `docs/10-governance/backlog/traceability-map.md`

## Required Outputs (repo artifacts)
1) Update SL-0001 in place:
   - Set Status to **Ready**
   - Add a “Work Orders” list with links to new WOs below
2) Create implementation WOs under:
   - `docs/10-governance/backlog/work-orders/WO-0101-...md` etc.

### Recommended implementation WOs (create these)
- WO-0101 — Backend: data model + migration plan for time entries (incl. overlap enforcement)
- WO-0102 — Backend: time entry API endpoints + Problem+JSON errors
- WO-0103 — Backend: idempotency keys for open entry start/stop
- WO-0104 — Web: minimal Time Entry UI (create + list + errors)
- WO-0105 — QA: integration tests for overlap + idempotency + auth
- WO-0106 — DevOps/Platform: local dev wiring needed for SL-0001 (if missing)

## Agent Prompt (copy/paste)
You are the **Tech Lead / Architect** agent. Follow `AGENTS.md`: do not improvise around ADRs; no mass rewrites; produce small, parallelizable work.

1) Read SL-0001 + referenced ADRs + US-0001..US-0004.
2) Update `docs/10-governance/backlog/slices/SL-0001-auth-time-entry.md`:
   - Set Status: Ready
   - Add a “Work Orders (WO)” section listing WO-0101..WO-0106
   - Add any missing constraints (security, tenancy scoping, overlap DB enforcement) as bullet points

3) Create WO-0101..WO-0106 files under `docs/10-governance/backlog/work-orders/` using this format:
   - Goal
   - Inputs
   - Required outputs (repo paths, code areas, tests)
   - “No-go” rules (what not to change)
   - Acceptance checklist
   - Notes for coordination (what might conflict with other WOs)

Each WO must be small enough to complete without stepping on other WOs.

Output only the created/updated markdown files, with exact repo paths as headings.
