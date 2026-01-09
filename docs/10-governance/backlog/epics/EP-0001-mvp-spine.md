# Epic: EP-0001 — MVP Spine (Auth → Time Entry → Pay Period Summary → Official Export)

## Metadata
- ID: EP-0001
- Status: Draft
- Priority: P0
- Owner (PM): @product-manager
- Tech Lead: @tech-lead-architect
- UX: @ui-ux-accessibility
- Target Release: v0.1 (MVP)

## Objective
Deliver a thin, end-to-end MVP that supports:
1) secure sign-in and membership/tenant context,
2) correct time entry creation with core invariants (including overlap prevention),
3) pay period (PP1/PP2) summaries with weekly rule enforcement and warnings,
4) **official** PDF export with deterministic rendering and auditability.

## In Scope
- Authentication + sessions (FR-001–FR-006), account linking (FR-004), basic account management (FR-005)
- Time entry management (FR-010–FR-016) including overlap prevention (FR-016)
- Cross-midnight/timezone handling (FR-018–FR-021)
- Pay period summaries (FR-040–FR-045), weekly rollups + enforcement (FR-050–FR-051)
- Reports + official PDF export (FR-060–FR-063)
- Entry locking + unlock requests (FR-030–FR-034)
- Admin unlock approval queue + audit logs (FR-095–FR-096)
- Baseline platform requirements: security, observability, local dev reproducibility, testing strategy (NFR-01..NFR-06; REQ-0008..REQ-0011)

## Out of Scope (for EP-0001)
- Advanced offline-first sync (FR-081) beyond “works across devices when online” (FR-080)
- ATO tracking and ledgering (FR-070–FR-074)
- Full admin management surfaces (FR-091–FR-094) beyond what is required for unlock approvals/audit visibility
- CSV export (FR-064) unless needed for MVP acceptance

## Primary Deliverables
### User Stories
- US-0001 — Sign in and establish a secure session (incl. tenant context)
- US-0002 — Account linking + membership model (auto-link by verified email)
- US-0003 — Create time entry with validation and overlap prevention
- US-0004 — Start/stop an open time entry and complete it
- US-0005 — Cross-midnight and timezone correctness (UTC storage + display rules)
- US-0006 — Pay period summary (PP1/PP2) with day + code breakdown
- US-0007 — Weekly rules enforcement + warnings (incl. >44 hours warning)
- US-0008 — Auto-lock completed entries + unlock request + admin approval gate
- US-0009 — Official PDF export for core reports
- US-0010 — Platform baselines (API error contract, idempotency, observability, local dev, test strategy)

### Vertical Slices
- SL-0001 — Auth + Create/Complete Time Entry (happy path + invariants)
- SL-0002 — Pay Period Summary + Weekly Rules + Highlighting
- SL-0003 — Lock/Unlock + Official PDF Export + Admin Queue + Auditability

## Definition of Done
- End-to-end demo for each slice (UI → API → DB → export where applicable)
- Domain invariants enforced (including DB-level overlap protection)
- Test coverage per slice (unit + integration; export tests with deterministic fixtures)
- Observability baseline in place (structured logs + basic metrics)
- Audit tables capture required actions and export provenance
- Docs updated: backlog items, ADR links, and any relevant governance docs
