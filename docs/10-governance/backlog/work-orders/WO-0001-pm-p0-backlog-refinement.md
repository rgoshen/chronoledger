# WO-0001 — Product Manager: P0 backlog refinement (US-0001..US-0010)

## Owner

- Primary: Product Manager agent
- Reviewer: Tech Lead + UX (as needed)

## Goal

Turn the seeded P0 user stories into **build-ready** stories by tightening acceptance criteria, clarifying scope,
and sequencing work into the first MVP slices.

## Inputs

- PRD: `chronoledger-requirements.md` (focus: Section 7 Functional Requirements; Section 6 Business Rules; Section 9 NFRs)
- Traceability table: `traceability_req_adr_backlog.md` (REQ → ADR → BL placeholders)
- Existing backlog seed:
  - `docs/10-governance/backlog/epics/EP-0001-mvp-spine.md`
  - `docs/10-governance/backlog/user-stories/US-0001..US-0010`
  - `docs/10-governance/backlog/slices/SL-0001..SL-0003`

## Required Outputs (repo artifacts)

1) Update (edit in place) the 10 stories:
   - `docs/10-governance/backlog/user-stories/US-0001-...md` through `US-0010-...md`
2) Update (edit in place) the epic:
   - `docs/10-governance/backlog/epics/EP-0001-mvp-spine.md`
3) Create a short sequencing note:
   - `docs/10-governance/backlog/epics/EP-0001-sequencing-notes.md`

## Definition of Ready (DoR) for each story

A story can be marked **Ready** only if:

- Acceptance criteria are explicit and testable (Given/When/Then)
- Scope is tight (In/Out of scope listed)
- Dependencies are called out (other stories, ADRs, platform baselines)
- UX/UI Notes list key screens + states (even if “TBD by UX”)
- It clearly maps to at least one slice (SL-0001..SL-0003)

## Agent Prompt (copy/paste)

You are the **Product Manager** agent for ChronoLedger. Follow `AGENTS.md` rules: **no mass rewrites**, change only
what is necessary, and keep outputs **repo-ready**.

1) Read:
   - `chronoledger-requirements.md` (PRD)
   - `traceability_req_adr_backlog.md`
   - `docs/10-governance/backlog/epics/EP-0001-mvp-spine.md`
   - `docs/10-governance/backlog/user-stories/US-0001..US-0010`
   - `docs/10-governance/backlog/slices/SL-0001..SL-0003`

2) For each story US-0001..US-0010:
   - Tighten the **Narrative** to be outcome-focused.
   - Rewrite acceptance criteria as **testable Given/When/Then**, adding edge cases where needed.
   - Add/clarify **Out of Scope** to keep the story small.
   - Add “Dependencies” and “Risks” where applicable.
   - Keep priority P0 unless you strongly justify a change.

3) Update EP-0001:
   - Ensure it reflects the final P0 scope and the slice breakdown.
   - Add a “Release sequence” subsection that points to SL-0001 → SL-0002 → SL-0003.

4) Create `docs/10-governance/backlog/epics/EP-0001-sequencing-notes.md` containing:
   - The recommended MVP order (slices + key stories per slice)
   - Explicit “Not MVP” items with reasons (to prevent scope creep)

Output only the updated markdown files, with exact repo paths as headings.
