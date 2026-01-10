# User Story: US-0005 — Cross-midnight and time zone correctness (UTC storage + display rules)

## Metadata

- ID: US-0005
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

As a **user**, I want time entries to **remain correct across midnight and time zone changes**, so that pay period
totals and exports are trustworthy.

## Traceability

- PRD: FR-018 (required), FR-019 (required), FR-020 (required), FR-021 (required)
- Traceability: REQ-0004 (Pay period summaries) (depends on correct time handling)
- ADRs: [ADR-0004](../02-adr/ADR-0004-time-and-timezone-strategy.md)

## Acceptance Criteria (Given/When/Then)

1. **Given** I enter time that crosses midnight **When** I save **Then** the system splits it into two entries
   (one per day) automatically.
2. **Given** my device time zone changes **When** I create or edit entries **Then** the system detects and handles the
   change according to policy (no silent drift).
3. **Given** entries are stored in UTC **When** I view them **Then** they display in the appropriate local/context
   time zone per FR-021.

## UX / UI Notes

- Be explicit when a split happens (show both entries and note why).
- If timezone change is detected, show a non-alarming but clear warning.

## Data & API Notes

- Store canonical timestamps in UTC.
- Ensure split entries preserve the original intent and remain auditable.

## Test Plan

- Unit: split logic
- Integration: UTC storage + correct display conversion
