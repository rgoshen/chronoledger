# Backlog Workflow (User Stories + Vertical Slices)

This folder is the *single source of truth* for product delivery planning in ChronoLedger.

> If you only read one thing before writing tickets: read this.

- **User Stories** capture *what* we’re building and *why*.
- **Vertical Slices** are the primary *execution unit* (thin, end-to-end increments).

> Default rule: implement from the **slice file**. Use separate Work Order (WO) docs only when absolutely necessary.

## Folder Layout
- `user-stories/` — individual user stories (US-####)
- `slices/` — vertical slices (SL-####)
- `epics/` — optional, higher-level themes (EP-####)
- `work-orders/` — optional, exceptional-only WOs (WO-####)
- `traceability-map.md` — maps PRD traceability placeholders (BL-#### / REQ-####) to concrete backlog items (US-#### / SL-####)

## Naming Conventions
- User Stories: `US-0001-<kebab-title>.md`
- Slices: `SL-0001-<kebab-title>.md`
- Epics: `EP-0001-<kebab-title>.md` (optional)
- Work Orders: `WO-0001-<kebab-title>.md` (optional)

Keep IDs stable forever (don’t reuse). If something is abandoned, mark it “Rejected/Archived” instead of deleting.

## Status Definitions
- **Draft**: being shaped; not ready to build
- **Ready**: acceptance criteria + scope are clear; can be assigned
- **In Progress**: actively being implemented
- **Blocked**: cannot proceed; reason documented
- **Done**: shipped/merged + meets DoD

## Workflow: From Requirements → Stories → Slices
1. **PM** drafts User Stories from requirements (focus: user value + acceptance criteria).
2. **UX** adds interaction notes, accessibility considerations, and states (empty/loading/error).
3. **Tech Lead** validates feasibility, identifies ADR impacts, dependencies, and shapes slices.
4. Convert stories into **Vertical Slices** that are:
   - end-to-end
   - thin (smallest valuable increment)
   - demoable
5. Execute from the slice’s **Work Breakdown** checklist.

## When to Use Slices vs Stories
- Use a **User Story** when you want a crisp description of user value and acceptance.
- Use a **Vertical Slice** when you want to build and demo an end-to-end increment across layers.

A slice should rarely exceed 1–2 weeks of work. If it does, split it.

## When to Use Work Order (WO) docs (rare)
Create a separate WO doc only when:
- multiple slices must change together (cross-cutting platform change),
- a risky/complex migration or export pipeline needs deeper coordination,
- you need to isolate a high-conflict area to prevent merge collisions.

Otherwise: keep the plan inside the slice file.

## Quality Bar
Minimum requirements before moving a slice to **Ready**:
- clear acceptance criteria via linked stories
- explicit scope (in/out)
- dependencies called out
- security + privacy notes (even if “none”)
- observability considerations (even if “basic”)
- Work Breakdown checklist is populated

## Templates
- User Story template: `docs/10-governance/templates/user-story-template.md`
- Vertical Slice template: `docs/10-governance/templates/vertical-slice-template.md`

## Traceability

ChronoLedger maintains a requirements → decision → backlog chain for clarity and auditability.

- `traceability-map.md` links PRD traceability placeholders (e.g., **BL-#### / REQ-####**) to the concrete backlog items in this folder (**US-#### / SL-####**).
- Source reference: `traceability_req_adr_backlog.md` (REQ → ADR → BL placeholders)

Maintenance rule:
- When stories/slices split or merge, update `traceability-map.md` in the same PR.

## How to Start (recommended first steps)
1. Create `EP-0001` for the first major milestone (optional).
2. Write 5–10 initial user stories (P0/P1).
3. Group them into 2–4 slices.
4. Populate each slice’s Work Breakdown checklist and start building.

## Maintenance Rules
- Keep this backlog updated with each PR/merge.
- Each completed slice should have a short feature retrospective created.
- Don’t bury decisions—capture them in ADRs / decision logs as appropriate.
