# User Story: US-0006 — Pay period summary (PP1/PP2) with day and code breakdown

## Metadata
- ID: US-0006
- Status: Draft
- Priority: P0
- Owner (PM): @product-manager
- Tech Lead: @tech-lead-architect
- UX: @ui-ux-accessibility
- Target Release: v0.1 (MVP)
- Epic: EP-0001
- Slice(s): TBD
- Links: Requirements (PRD) | ADR(s) | Traceability

## Narrative
As a **user**, I want a **pay period summary view**, so that I can **confirm totals and see breakdowns by day and code**.

## Traceability
- PRD: FR-040–FR-045; Pay period definitions (PP1/PP2)
- Traceability: REQ-0004 (Pay period summaries)
- ADRs: [ADR-0004](../02-adr/ADR-0004-time-and-timezone-strategy.md), [ADR-0028](../02-adr/ADR-0028-domain-invariants-state-machines.md)

## Acceptance Criteria (Given/When/Then)
1. **Given** I select a pay period **When** the summary loads **Then** I see totals for the pay period and a breakdown by day.
2. **Given** I view a day in the pay period **When** I expand it **Then** I see a breakdown by code and the day total.
3. **Given** pay periods are PP1 (1–15) and PP2 (16–end) **When** I navigate between pay periods **Then** boundaries are clear and correct.

## UX / UI Notes
- Provide clear navigation for previous/next pay period.
- Show empty state when no entries exist.

## Data & API Notes
- Summary calculations must be server-side and traceable to stored entries.
- Totals/pay must be attributable via DB-backed audit where required.

## Test Plan
- Unit: rollup calculation helpers
- Integration: summary endpoint correctness for known fixtures
