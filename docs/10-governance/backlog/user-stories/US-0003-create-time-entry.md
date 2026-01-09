# User Story: US-0003 — Create a time entry with validation and overlap prevention

## Metadata
- ID: US-0003
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
As a **user**, I want to **create a time entry with correct validation**, so that my **hours and pay period totals remain accurate**.

## Traceability
- PRD: FR-010, FR-012, FR-013, FR-014, FR-016 (required)
- Traceability: REQ-0002 (Time entry CRUD invariants), REQ-0003 (Prevent overlapping entries)
- ADRs: [ADR-0028](../02-adr/ADR-0028-domain-invariants-state-machines.md), [ADR-0002](../02-adr/ADR-0002-postgresql-3nf.md), [ADR-0024](../02-adr/ADR-0024-prisma-migrations.md)

## Acceptance Criteria (Given/When/Then)
1. **Given** I provide date, start time, end time, and a valid code **When** I save **Then** the entry is created and visible in the current pay period view.
2. **Given** my entry would overlap an existing entry **When** I attempt to save **Then** the save is rejected and I see a clear overlap error.
3. **Given** I enter invalid time ranges (end before start) or missing required fields **When** I save **Then** I see field-level validation errors.
4. **Given** I attempt to create an entry outside the allowed current pay period rules **When** I save **Then** the system prevents it per FR-014.

## UX / UI Notes
- Inline validation for required fields and time ordering.
- Clear overlap error wording (include conflicting range).

## Data & API Notes
- Overlap prevention must be enforced at the database layer (not UI-only).
- Use consistent server-side validation errors (Problem+JSON).

## Test Plan
- Unit: validation rules
- Integration: DB overlap constraint enforced
- E2E: create valid entry; reject overlap; reject invalid ranges
