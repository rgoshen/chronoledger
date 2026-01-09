# WO-0002 — UI/UX: P0 flows + UI states + accessibility notes (US-0001..US-0009)

## Owner
- Primary: UI/UX + Accessibility agent
- Reviewer: Product Manager + Tech Lead

## Goal
Provide enough UX definition so engineers can implement SL-0001 and SL-0002 without guessing:
- key screens,
- navigation flow,
- empty/loading/error states,
- accessibility notes.

## Inputs
- P0 user stories:
  - `docs/10-governance/backlog/user-stories/US-0001..US-0009`
- P0 slices:
  - `docs/10-governance/backlog/slices/SL-0001..SL-0002`
- PRD: `chronoledger-requirements.md` (roles, validation rules, pay period behavior)

## Required Outputs (repo artifacts)
1) Create a flow doc for MVP spine:
   - `docs/05-ux/flows/UX-0001-mvp-spine-flow.md`
2) For each story US-0001..US-0009, update **only** the “UX / UI Notes” section in-place with:
   - impacted screens/components,
   - states (empty/loading/error/success),
   - validation + error copy suggestions,
   - accessibility notes (keyboard, focus, labels, screen reader).

## Agent Prompt (copy/paste)
You are the **UI/UX + Accessibility** agent for ChronoLedger. Follow `AGENTS.md`: no mass rewrites; update only UX-relevant sections.

1) Read:
   - `chronoledger-requirements.md`
   - `docs/10-governance/backlog/user-stories/US-0001..US-0009`
   - `docs/10-governance/backlog/slices/SL-0001..SL-0002`

2) Create `docs/05-ux/flows/UX-0001-mvp-spine-flow.md` including:
   - Mermaid flow diagram for: Sign-in → Time Entry → Pay Period Summary → Export
   - For each step, list: primary UI state + top 2 failure states
   - Role-based access notes (user vs admin unlock queue)

3) Update in-place (minimal changes) the “UX / UI Notes” section of US-0001..US-0009:
   - Screens/components impacted
   - Empty/loading/error/success states
   - Validation behavior guidance (what errors appear where)
   - Accessibility: keyboard nav, focus order, labels, ARIA notes, color/contrast reminders
   - Keep it implementable without a Figma file; if you assume future Figma, write “Figma: TBD”

Output only the created/updated markdown files, with exact repo paths as headings.
