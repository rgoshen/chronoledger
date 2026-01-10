# User Story: US-0008 — Auto-lock completed entries and unlock request workflow

## Metadata

- ID: US-0008
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

As a **user**, I want completed entries to **lock automatically** and to
**request an unlock when corrections are needed**, so that changes are controlled and auditable.

## Traceability

- PRD: FR-030–FR-034; FR-095 (unlock request queue); FR-096 (audit logs, required)
- ADRs: [ADR-0028](../02-adr/ADR-0028-domain-invariants-state-machines.md)

## Acceptance Criteria (Given/When/Then)

1. **Given** an entry is completed **When** it is saved **Then** it becomes locked automatically per policy.
2. **Given** an entry is locked **When** I attempt to edit/delete it **Then** I am blocked and prompted to request an unlock.
3. **Given** I submit an unlock request **When** an admin reviews it **Then** the admin can approve/reject and the
   result is recorded in the audit trail.
4. **Given** a correction is made after an unlock **When** saved **Then** the entry is re-locked per policy.

## UX / UI Notes

- Make the locked state obvious.
- Unlock request requires a reason and shows status (pending/approved/rejected).

## Data & API Notes

- All lock/unlock transitions must be audit-trailed.
- Admin approval gate must be enforced server-side.

## Test Plan

- Integration: locked entries reject edits; unlock flow transitions; audit rows created
