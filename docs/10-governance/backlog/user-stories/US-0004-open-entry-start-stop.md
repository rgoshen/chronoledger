# User Story: US-0004 — Start/stop an open time entry and complete it

## Metadata

- ID: US-0004
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

As a **user**, I want to **start a time entry without specifying an end time and stop it later**, so that I can **track active work in real-time without predicting how long tasks will take**.

## Traceability

- PRD: FR-011, FR-012, FR-013, FR-016
- Traceability: REQ-0002, REQ-0007 (idempotency for writes) (as applicable)
- ADRs: [ADR-0028](../02-adr/ADR-0028-domain-invariants-state-machines.md), [ADR-0031](../02-adr/ADR-0031-concurrency-idempotency.md)

## Shared Technical Contracts

These technical standards apply across all acceptance criteria and implementation:

- **Error responses**: All API errors use Problem+JSON format per ADR-0030
- **Idempotency**: Start/stop operations support idempotency keys per ADR-0031
- **State transitions**: Entry state machine (open → completed) per ADR-0028
- **Overlap prevention**: Reuses validation from US-0003
- **HTTP status codes**: 201 (created), 200 (updated), 409 (conflict)

## Acceptance Criteria (Given/When/Then)

1. **Given** I provide a valid time entry code and start time (defaults to now) **When** I start an open entry **Then** the entry is created with a 201 response, no end time, and a status of "running" or "open", and is visible in my current entries list with a clear indicator (e.g., "In Progress").
2. **Given** I have a running open entry **When** I submit a stop request with an end time (defaults to now) **Then** the entry is updated with the end time, transitions to "completed" status, is subject to pay period locking rules, and returns a 200 response with the final entry.
3. **Given** I submit duplicate stop requests (e.g., retry due to network failure) with the same idempotency key **When** the server receives them **Then** the operation is idempotent, only the first request processes, subsequent requests return the same result (200 with final entry), and no duplicate or conflicting entries are created.
4. **Given** starting or stopping an open entry would create an overlap with existing entries **When** I attempt the operation **Then** it is rejected with a 409 response, a Problem+JSON error, and a clear message including the conflicting time range.
5. **Given** I attempt to stop an open entry from a different device at a slightly different time (concurrent stop) **When** both requests arrive **Then** the server handles the race condition safely (e.g., first write wins, second returns conflict or accepts first result) and the final entry state is consistent.

## In Scope

- Open time entry start operation (no end time, "running" status)
- Open time entry stop operation (adds end time, transitions to "completed")
- Idempotency for start and stop operations (via idempotency key header per ADR-0031)
- Overlap validation for both start and stop operations
- Concurrent write safety (race condition handling when stopping from multiple devices)
- "Running" state indicator in UI

## Out of Scope

- Pause/resume functionality (deferred)
- Multiple concurrent open entries for the same user (only one open entry at a time)
- Background timer synchronization across devices (deferred)
- Detailed timer UI (elapsed time display with precision) (MVP shows "In Progress" only)

## Dependencies

- ADR-0028 (State machines) for entry state transitions (open → completed)
- ADR-0031 (Idempotency) for duplicate request handling
- US-0003 (Create Time Entry) for overlap detection logic
- US-0002 (Account Linking) for tenant and user context

## Risks

- **Lost stop request (network failure)**: Mitigate via idempotency mechanisms per ADR-0031 and client retry logic; ensure UI shows retry options.
- **Race condition on concurrent stops**: Ensure server-side concurrency controls guarantee a consistent final state; test with concurrent requests from multiple clients.
- **Timer drift on long-running entries**: Document limitations; consider server-side validation to reject implausible durations (e.g., >24 hours without stop).

## UX / UI Notes

- Show a clear "currently running" indicator (e.g., "In Progress" badge or status label).
- Provide safe retry messaging for network interruptions.

### Screens / Components

- **TimeEntryScreen**: Main screen (reused from US-0003)
- **OpenEntryTimer**: Component showing running timer with elapsed time
- **StartEntryButton**: Button to begin an open entry
- **StopEntryButton**: Button to complete the open entry
- **TimeEntryList**: List showing entries with visual indicator for open/running entries

### Happy Path Flow

1. User navigates to Time Entry screen (no open entry exists)
2. User clicks "Start Timer" (or similar button)
3. Start modal appears: User selects Date (defaults today) and Code
4. User clicks "Start"
5. Timer begins running, showing elapsed time
6. User performs their work (timer continues running)
7. User clicks "Stop" button
8. Entry is completed and appears in list with final duration

### States

**No Open Entry State**

- Start button: Enabled and prominent
- Timer display: Hidden or shows "00:00:00" with message "No timer running"
- TimeEntryList: Shows completed entries only

**Starting State**

- Start button: Loading spinner, disabled
- Text: "Starting timer..."
- Form fields (date, code) in modal: Disabled during submission

**Running/Open State**

- Timer display: Visible and prominent, showing elapsed time (HH:MM:SS format)
- Update frequency: Every second for display (but not announced every second)
- Start button: Hidden or disabled with message "Timer already running"
- Stop button: Enabled and prominent, different color (e.g., red/warning)
- Entry indicator: Visual badge or highlight in list showing which entry is open
- Timer accessibility: `aria-live="off"` (updated visually but not announced continuously)

**Stopping State**

- Stop button: Loading spinner, disabled
- Timer: Continues displaying but with "Saving..." indicator
- Text: "Stopping timer..."

**Stopped/Complete State**

- Timer: Clears to "00:00:00" or hides
- Success message: "Timer stopped. Entry saved with duration [HH:MM]."
- Entry: Appears in list as completed with final duration
- Start button: Returns to enabled state

**Network Retry State**

- During the stop operation, if a network failure occurs:
- Message: "Unable to save. Retrying..."
- Timer: Continues running (shows last known time)
- Retry indicator: Small spinner or icon
- Idempotency: Multiple retry attempts result in single completed entry
- User option: "Cancel Retry" button to return to running state

**Overlap Error State**

- Can occur on start or stop operation
- Modal/alert: "This entry would overlap with an existing entry from [HH:MM AM/PM] to [HH:MM AM/PM] on [MM/DD/YYYY]. Please adjust your times or delete the conflicting entry."
- If on start: Entry is not created, user returns to no-open-entry state
- If on stop: Entry remains open, user can choose different end time or cancel the entry
- Focus: "OK" button on dialog

**Multiple Device State** (edge case)

- Server is the single source of truth for entry state
- If user starts entry on Device A and opens app on Device B:
  - Device B fetches current state from server and shows running timer with sync indicator
  - User can stop the timer from any device (Device A or B)
- If sync fails on Device B:
  - Warning message: "Timer running on another device. Refreshing..."
  - Device B attempts to re-sync with server
  - User should not interact with timer until sync completes
- If Device B has stale state but backend allows stop:
  - Backend accepts the stop request (server state is authoritative)
  - Device B receives updated state and shows completed entry

### Validation Behavior

**On Start**

- Date: Required, must be within current pay period
- Code: Required, must be valid
- Start time: Defaults to now, user can adjust if needed
- Constraint: Only one open entry allowed at a time (enforced client- and server-side)

**On Stop**

- End time: Defaults to now, user can adjust if needed
- End time must be after start time
- Cannot create overlap with existing entries

**Error Copy**

- Already running: "You already have a timer running. Stop it before starting a new one."
- Overlap on start: "Starting this entry would overlap with an existing entry from [HH:MM AM/PM] to [HH:MM AM/PM]. Please adjust your start time or delete the conflicting entry."
- Overlap on stop: "Stopping now would overlap with an existing entry from [HH:MM AM/PM] to [HH:MM AM/PM]. Please choose a different stop time."
- Missing code: "Time code is required."
- Invalid date: "Date is required and must be within the current pay period."
- End before start: "End time must be after start time."
- Network error (retry): "Unable to save. Retrying automatically..."
- Network error (failed): "Unable to save after multiple attempts. Your timer is still running. Please check your connection."

### Accessibility

**Keyboard Navigation**

- Start button: Focusable, activated with Space or Enter
- Stop button: Focusable, activated with Space or Enter
- Start modal: Tab order: Date field → Code dropdown → Start button → Cancel button
- Timer display: Not focusable (status display only)

**Focus Management**

- After clicking Start: Focus moves to timer/stop button area
- After stopping: Focus returns to start button
- On overlap error dialog: Focus "OK" button; on close, return to stop button (if still open) or start button

**Labels & ARIA**

- Start button: Clear label "Start Timer" + `aria-disabled` when disabled
- Stop button: Clear label "Stop Timer" + `aria-disabled` when disabled
- Timer display: `<div role="timer" aria-label="Elapsed time">HH:MM:SS</div>` + `aria-live="off"` (not announced continuously)
- Running status: Separate element with `aria-live="polite"` that announces only state changes: "Timer started" / "Timer stopped"
- Open entry in list: Visual indicator + text "(Running)" + `aria-label="Time entry in progress"`
- Start modal fields: Same ARIA patterns as US-0003 form fields

**Screen Reader Announcements**

- On timer start: "Timer started for [code name]" announced once
- On timer stop: "Timer stopped. Entry saved with duration [H hours M minutes]" announced once
- During retry: "Saving, please wait" announced once, then "Retrying" if needed
- Timer elapsed time: NOT announced every second (would be overwhelming)
- Optional: Announce milestone updates (e.g., every 15 or 30 minutes) if needed for long entries
- On overlap error: "Error: This entry would overlap with an existing entry" announced when dialog opens

**Visual Indicators**

- Running timer: Use distinct color (e.g., green or blue) and possibly animated pulse/glow
- Stop button: Use warning color (e.g., red/orange) to indicate it will complete the entry
- Entry in list: Badge or icon showing "Running" or "In Progress"

## Data & API Notes

- Idempotency keys for start/stop operations.
- Concurrency safety when multiple devices attempt updates.

## Test Plan

- Integration: concurrent stop requests resolve safely
- E2E: start → stop → verify totals updated
