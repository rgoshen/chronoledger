# ChronoLedger — Prioritized Backlog

_Last updated: 2026-01-02_

## Legend

- **P0**: Must-have core system behavior
- **P1**: High-value enhancements / hardening
- **P2**: Nice-to-have

---

## EPIC 1 (P0): Authentication, Roles, and Admin Area

### US-001: User can log in with email/password

**Acceptance Criteria**

- User can register/sign in/sign out
- Password reset supported
- Session expires safely

### US-002: User can log in with Apple/Google/Facebook

**Acceptance Criteria**

- Each provider works end-to-end
- Uses OAuth/OIDC best practices (Authorization Code + PKCE)
- **Auto-link by verified email** to existing account

### US-003: Role-based access control enforced

**Acceptance Criteria**

- `/admin` requires Admin role
- All admin APIs reject non-admin callers server-side

---

## EPIC 2 (P0): Time Entry Core (UTC + TZ + Cross-Midnight)

### US-010: Create an open time entry

**Acceptance Criteria**

- User can create entry with date/start/code, no end time
- Stored in UTC (start_utc) with start_tz

### US-011: Complete an open entry

**Acceptance Criteria**

- User sets end time
- System computes and stores raw duration
- Rounded duration is shown but not stored

### US-012: Cross-midnight auto-split

**Acceptance Criteria**

- If end implies next day, system splits into two linked entries
- Both stored in UTC with correct durations

### US-013: Time zone change detection + display

**Acceptance Criteria**

- If device TZ changes between start and end, duration remains correct
- Default display in current device TZ
- User can optionally select a display TZ override
- **Preference is per user, per device**

### US-014: Block overlapping entries (required)

**Acceptance Criteria**

- Creating or updating an entry that overlaps another entry for the same user is blocked
- Overlap checks occur after cross-midnight splitting
- Error message clearly identifies the conflicting entry/interval

---

## EPIC 3 (P0): Locking, Unlock Requests, and Admin Approval Gate

### US-020: Auto-lock completed entries

**Acceptance Criteria**

- Any entry with start+end becomes locked
- Locked entries cannot be edited/deleted by User

### US-021: Request unlock for a locked entry

**Acceptance Criteria**

- User can submit unlock request with reason
- Request status tracked (pending/approved/denied)

### US-022: Admin approves/denies unlock requests

**Acceptance Criteria**

- Admin sees queue in `/admin`
- Approve unlocks entry; deny keeps locked
- All actions audited

### US-023: Re-lock after correction

**Acceptance Criteria**

- Once corrected and complete, entry re-locks automatically
- Changes are audited with before/after

---

## EPIC 4 (P0): Audit Tables + Admin Viewer

### US-030: Persist audit events in domain DB tables (required)

**Acceptance Criteria**

- Time entry create/edit/delete recorded in `audit_time_entry`
- Unlock request create/decision recorded in `audit_unlock_request`
- Admin actions recorded in `audit_admin_action`
- Each audit record includes actor, timestamp, target, before/after, correlation id

### US-031: Admin can view/search audit tables

**Acceptance Criteria**

- Filter by date range, actor, action type, entity type/id
- Pagination
- Admin-only visibility

---

## EPIC 5 (P0): Pay Period Summary + Holiday Visibility

### US-040: Display pay period calendar summary

**Acceptance Criteria**

- Shows every day in PP, including weekends
- Weekend highlighting
- Holiday highlighting (visibility-only)

### US-041: Daily totals and code breakdown

**Acceptance Criteria**

- Daily raw total and computed rounded total
- Breakdown by time code
- Pay period totals and remaining hours

---

## EPIC 6 (P0): Weekly Rules Engine + Warnings

### US-050: Compute weekly rollups (Sun–Sat)

**Acceptance Criteria**

- Contract/additional/ATO totals per week
- Total hours per week

### US-051: Enforce contract/additional caps and warn >44

**Acceptance Criteria**

- Block entries that exceed 40 contract or 4 additional
- Show warning if >44 total (prior authorization)

### US-052: Enforce ATO constraints (confirmed)

**Acceptance Criteria**

- ATO is allowed only on Mon–Fri
- ATO per-day cap: 8 hours
- ATO per-week cap: 40 hours
- Violations are blocked with clear messages

---

## EPIC 7 (P0): Pay Rates + Compensation Calculations

### US-060: Maintain pay rate history (effective on 1st)

**Acceptance Criteria**

- Admin can create monthly rates (effective 1st)
- Correct rate applies based on entry date

### US-061: Compute pay per code and totals

**Acceptance Criteria**

- No overtime multipliers
- UPDLV excluded from gross compensation
- Rate selection correct for each entry

---

## EPIC 8 (P0): Reports + Official PDF Export (All Reports)

### US-070: Report filtering (PP/month/year)

**Acceptance Criteria**

- Filters work for all report types
- Month/year views show PP boundaries

### US-071: Generate official PDFs for all reports

**Acceptance Criteria**

- PDFs include title, range, generation timestamp, page numbers
- PDFs include totals and warnings
- Uses selected display TZ (if set on device), otherwise device TZ
- Works on web and mobile

---

## EPIC 9 (P1): ATO Accrual/Usage + Projections

### US-080: ATO accrual ledger

**Acceptance Criteria**

- Accrue 10 hours for past pay periods only
- Ledger stores hours + rate at accrual time

### US-081: ATO usage ledger + linking to entries

**Acceptance Criteria**

- Using ATO reduces balance
- ATO usage reflected in reports/pay calculations

### US-082: ATO dashboard + use-or-lose projection

**Acceptance Criteria**

- YTD earned, used, balance, projected year-end, use-or-lose vs 120

---

## EPIC 10 (P1): Sync Robustness + Offline Support

### US-090: Deterministic conflict handling

**Acceptance Criteria**

- Conflicts resolved consistently and auditable

### US-091: Offline-first mobile entry (optional)

**Acceptance Criteria**

- Entries can be created offline and synced later safely

---

## EPIC 11 (P2): CSV Export + Extra Admin Utilities

### US-100: CSV export for reports

### US-101: Admin bulk management (codes, holidays, rates)
