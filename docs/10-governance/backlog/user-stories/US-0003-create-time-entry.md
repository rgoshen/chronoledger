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

### Screens / Components

- **TimeEntryScreen**: Main screen containing the form and list
- **TimeEntryForm**: Form component for creating new entries
- **TimeEntryList**: List of entries for the current pay period
- **OverlapErrorDialog**: Modal/alert showing overlap details

### Happy Path Flow

1. User navigates to Time Entry screen
2. Form displays with empty fields (date defaults to today)
3. User selects/enters: Date, Start time, End time, Code
4. Real-time validation shows end > start
5. User submits (Enter or Save button)
6. Loading state shows during save
7. Success: Entry appears in list below, form resets

### States

**Empty State**

- Form: All fields blank except Date (defaults to today)
- List: "No time entries for this pay period yet." (if no entries exist)
- Save button: Disabled (until all required fields are filled)

**Filling State**

- User is actively entering data
- Real-time validation feedback (e.g., end time turns red if before start time)
- Save button: Enabled once all required fields have values and pass client validation

**Validating State**

- Brief client-side validation before submission
- Visual indicator on individual fields if invalid
- Save button remains enabled (server will validate definitively)

**Saving State**

- Save button shows spinner and is disabled
- Form fields are disabled
- Text: "Saving entry..."

**Overlap Error State**

- Modal or inline alert appears
- Message: "This entry overlaps with an existing entry from [HH:MM AM/PM] to [HH:MM AM/PM] on [MM/DD/YYYY]. Please adjust your times."
- "OK" or "Close" button to dismiss
- Form remains filled (user can edit times and retry)
- Focus returns to start time field after dismissal

**Validation Error State**

- Field-level errors shown inline beneath each invalid field
- Examples:
  - End time before start: "End time must be after start time."
  - Missing code: "Time code is required."
  - Outside pay period: "This date is outside the current pay period ([start date] - [end date])."
- Save button remains enabled for retry
- Focus moves to first invalid field

**Success State**

- Brief success message (toast/banner): "Time entry saved."
- Form clears and resets to defaults
- New entry appears at top of TimeEntryList
- Focus returns to date field for next entry

### Validation Behavior

**Client-side (Real-time)**

- Date: Required, must be within current pay period
- Start time: Required
- End time: Required, must be after start time
- Code: Required, must be a valid code from the system

**Client-side (Pre-submit)**

- All required fields present
- End time > Start time
- Date within current pay period range
- Total duration reasonable (e.g., not > 24 hours)

**Server-side (Authoritative)**

- Overlap detection (DB-enforced constraint)
- Authorization check (user can create entries for themselves)
- Code validation (code exists and is active)
- Pay period rules enforcement

**Error Copy**

- Overlap: "This entry overlaps with an existing entry from [HH:MM AM/PM] to [HH:MM AM/PM] on [MM/DD/YYYY]. Please adjust your times."
- End before start: "End time must be after start time."
- Missing date: "Date is required."
- Missing start time: "Start time is required."
- Missing end time: "End time is required."
- Missing code: "Time code is required."
- Outside pay period: "This date is outside the current pay period ([MM/DD/YYYY] - [MM/DD/YYYY])."
- Invalid code: "Please select a valid time code."
- Duration too long: "Entry duration cannot exceed 24 hours."
- Network error: "Unable to save. Please check your connection and try again."

### Accessibility

**Keyboard Navigation**

- Tab order: Date field → Start time → End time → Code dropdown → Save button → Cancel/Reset button
- Enter key submits form from any field (except dropdowns, where Enter selects)
- Arrow keys navigate time picker and code dropdown options

**Focus Management**

- On screen load: focus date field
- On validation error: focus first invalid field
- After save success: focus date field (ready for next entry)
- On overlap error dialog: focus "Close" button; on close, return to start time field

**Labels & ARIA**

- Date field: `<label for="date">Date</label>` + `aria-required="true"` + `aria-describedby="date-error"` (when error present)
- Start time: `<label for="start-time">Start Time</label>` + `aria-required="true"`
- End time: `<label for="end-time">End Time</label>` + `aria-required="true"`
- Code dropdown: `<label for="code">Time Code</label>` + `aria-required="true"`
- Save button: `aria-busy="true"` during save, `aria-disabled="true"` when disabled
- Error messages: `role="alert"` + `aria-live="polite"` for field errors
- OverlapErrorDialog: `role="alertdialog"` + `aria-modal="true"` + `aria-labelledby` pointing to error heading
- TimeEntryList: `<ul role="list">` with clear list item structure

**Screen Reader Announcements**

- On field validation error: "Error: [error message]" announced when error appears
- On overlap error: "Error: This entry overlaps with an existing entry" announced when dialog opens
- On save success: "Time entry saved" announced before focus moves
- List updates: "Entry added to list" when new entry appears (optional, may be implicit)

## Data & API Notes

- Overlap prevention must be enforced server-side at the persistence layer (not client-only).
- Use consistent server-side validation errors per ADR-0030.

## Test Plan

- Unit: validation rules
- Integration: DB overlap constraint enforced
- E2E: create valid entry; reject overlap; reject invalid ranges
