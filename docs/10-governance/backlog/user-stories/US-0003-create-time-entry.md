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

As a **user**, I want to **create a complete time entry with robust validation and overlap prevention**, so that my **pay period totals are accurate and time conflicts are impossible**.

## Traceability

- PRD: FR-010, FR-012, FR-013, FR-014, FR-016 (required)
- Traceability: REQ-0002 (Time entry CRUD invariants), REQ-0003 (Prevent overlapping entries)
- ADRs: [ADR-0028](../02-adr/ADR-0028-domain-invariants-state-machines.md),
  [ADR-0002](../02-adr/ADR-0002-postgresql-3nf.md), [ADR-0024](../02-adr/ADR-0024-prisma-migrations.md)

## Shared Technical Contracts

These technical standards apply across all acceptance criteria and implementation:
- **Error responses**: All API errors use Problem+JSON format per ADR-0030
- **Overlap prevention**: Enforced server-side at persistence layer per ADR-0028
- **Data isolation**: Tenant and user scoping per ADR-0017
- **HTTP status codes**: 201 (created), 400 (validation), 409 (conflict)

## Acceptance Criteria (Given/When/Then)

1. **Given** I provide all required fields (date, start time, end time, and a valid time entry code) **When** I save **Then** the entry is created with a 201 response, assigned a unique ID, and immediately visible in my current pay period list.
2. **Given** my entry would overlap an existing entry (same user, overlapping date-time range) **When** I attempt to save **Then** the save is rejected with a 409 response, a Problem+JSON error, and a clear message including the conflicting entry's time range (e.g., "Overlaps with entry from 09:00-11:00").
3. **Given** I enter invalid time ranges (end time before or equal to start time) or missing required fields **When** I save **Then** I receive a 400 response with field-level validation errors in Problem+JSON format specifying each invalid field.
4. **Given** I attempt to create an entry outside the allowed pay period window (per FR-014, e.g., cannot enter time for locked past periods or far-future dates) **When** I save **Then** the system rejects it with a 400 response and a clear message (e.g., "Cannot create entries for locked pay periods").
5. **Given** I am authenticated with a tenant and user context **When** I create a time entry **Then** the entry is scoped to my user and tenant only, and I cannot create entries for other users or tenants.

## In Scope

- Complete time entry creation (date, start time, end time, code)
- Overlap prevention enforced server-side at persistence layer
- Time range validation (end > start, required fields, valid code)
- Pay period boundary enforcement per FR-014 (locked periods, future date limits)
- Field-level validation errors in Problem+JSON format
- Tenant and user scoping enforcement per ADR-0017

## Out of Scope

- Bulk import or batch time entry creation (deferred)
- Entry templates or "copy from previous" functionality (deferred)
- Multi-day time entries (spans midnight) (deferred or handled as separate entries)
- Time entry editing or deletion (separate stories)
- Time entry approval workflows (future release)

## Dependencies

- ADR-0028 (Domain invariants) for overlap and validation logic
- ADR-0002 (PostgreSQL 3NF) for schema design
- ADR-0024 (Prisma migrations) for DB constraint implementation
- US-0002 (Account Linking) for tenant context in requests

## Risks

- **Race condition on overlap check**: Ensure overlap prevention is enforced at the persistence layer with proper concurrency controls per ADR-0028; test concurrent creation attempts.
- **Timezone handling errors**: Establish consistent timezone handling strategy (e.g., store in UTC); test cross-timezone scenarios and DST transitions.
- **Pay period calculation bugs**: Thoroughly test boundary conditions (period start/end, DST transitions, locked periods).

## UX / UI Notes

- Inline validation for required fields and time ordering.
- Clear overlap error wording (include conflicting range).

## Data & API Notes

- Overlap prevention must be enforced server-side at the persistence layer (not client-only).
- Use consistent server-side validation errors per ADR-0030.

## Test Plan

- Unit: validation rules
- Integration: DB overlap constraint enforced
- E2E: create valid entry; reject overlap; reject invalid ranges
