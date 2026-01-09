# Backlog Workflow (User Stories + Vertical Slices)

This folder is the *single source of truth* for product delivery planning in ChronoLedger.

- **User Stories** capture *what* we’re building and *why*.
- **Vertical Slices** capture *how* we deliver value end-to-end in thin increments.

## Folder Layout
- `user-stories/` — individual user stories (US-####)
- `slices/` — vertical slices that group one or more stories (SL-####)
- `epics/` — optional, higher-level themes (EP-####)
- `work-orders/` — optional agent work orders (WO-####), linked from slices

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
2. **UX** adds interaction notes, accessibility considerations, and links to Figma if applicable.
3. **Tech Lead** validates feasibility, identifies ADR impacts, dependencies, and shapes slices.
4. Convert stories into **Vertical Slices** that are:
   - end-to-end
   - thin (smallest valuable increment)
   - demoable

## When to Use Slices vs Stories
- Use a **User Story** when you want a crisp description of user value and acceptance.
- Use a **Vertical Slice** when you want to plan and execute an end-to-end increment across layers.

A slice should rarely exceed 1–2 weeks of work. If it does, split it.

## Agent Work Orders (recommended)
Once a slice is **Ready**, create work orders (WO-####) that are:
- small
- testable
- scoped to a single agent role when possible

Link work orders from the slice under “Work Orders”.

## Quality Bar
Minimum requirements before moving a story/slice to **Ready**:
- clear acceptance criteria
- explicit scope (in/out)
- dependencies called out
- security + privacy notes (even if “none”)
- observability considerations (even if “basic”)

## Templates
- User Story template: `docs/10-governance/templates/user-story-template.md`
- Vertical Slice template: `docs/10-governance/templates/vertical-slice-template.md`

## How to Start (recommended first steps)
1. Create `EP-0001` for the first major milestone (optional).
2. Write 5–10 initial user stories (P0/P1).
3. Group them into 2–4 slices.
4. For the first slice, create agent work orders and assign.

## Maintenance Rules
- Keep this backlog updated with each PR/merge.
- Each completed slice should have a short feature retrospective created.
- Don’t bury decisions—capture them in ADRs / decision logs as appropriate.
