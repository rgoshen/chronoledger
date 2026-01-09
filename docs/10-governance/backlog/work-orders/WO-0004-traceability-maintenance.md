# WO-0004 — Traceability maintenance: BL placeholders → US/SL references (non-destructive)

## Owner
- Primary: PM or Tech Lead
- Reviewer: whoever owns traceability in governance

## Goal
Keep the traceability chain auditable by mapping BL placeholders in `traceability_req_adr_backlog.md` to concrete backlog items in this repo.

## Inputs
- `traceability_req_adr_backlog.md`
- `docs/10-governance/backlog/traceability-map.md`

## Required Outputs
1) Update `docs/10-governance/backlog/traceability-map.md` if needed (only minimal edits).
2) Optionally (recommended): add a short note to `traceability_req_adr_backlog.md` pointing readers to `docs/10-governance/backlog/traceability-map.md` for the US/SL mappings. Do not rewrite the table.

## Agent Prompt (copy/paste)
Maintain traceability without rewriting existing docs.

1) Confirm `docs/10-governance/backlog/traceability-map.md` correctly maps BL-0001..BL-0011 to US/SL items.
2) If anything is missing, update the map (minimal change).
3) Add a one-line pointer near the “Recommended next step” section in `traceability_req_adr_backlog.md`:
   - “See `docs/10-governance/backlog/traceability-map.md` for BL → US/SL mappings.”

Output only the updated markdown files, with exact repo paths as headings.
