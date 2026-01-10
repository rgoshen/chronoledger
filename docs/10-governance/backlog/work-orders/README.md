# Work Orders (WO) — Optional / Exceptional Use

_Last updated: 2026-01-09_

This folder exists for **exceptional** cases only. The default execution unit is the **slice**
(`docs/10-governance/backlog/slices/SL-####...`) which contains an in-file **Work Breakdown** checklist.

## Use WOs only when

- A change is **cross-cutting** across multiple slices (platform refactor, shared contract change)
- A task is **high-risk / high-coordination** (e.g., export pipeline, major migration)
- You need to isolate a high-conflict area to avoid merge collisions

## Don’t use WOs for

- Routine per-slice implementation tasks (keep those in the slice checklist)
- Small doc tweaks
- One-off clarifications

## If you do create a WO

A WO must be:

- tightly scoped
- produces concrete repo artifacts (code, tests, docs)
- includes a clear acceptance checklist
- references the slice(s) it supports

## Suggested naming

- `WO-0101-<kebab-title>.md`

## Related

- Backlog workflow: `docs/10-governance/backlog/README.md`
- Slice template: `docs/10-governance/templates/vertical-slice-template.md`
