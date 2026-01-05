# ChronoLedger — Product Requirements Document (PRD)

_Last updated: 2026-01-02_

## 1. Overview

ChronoLedger is a time-clock-style application that allows users to record work time, calculate pay-period and weekly summaries, generate **official PDF reports**, and track accrued time off (ATO). It runs on **Web** and **Mobile (phone + tablet)** and is hosted on **AWS**, with data synced across devices.

This document captures the full set of requirements (no MVP-only scope).

## 2. Goals

- Fast, reliable time entry (including partial/open entries).
- Accurate rule enforcement for pay periods and weekly limits.
- Clear summaries (daily, weekly, pay period) with visibility into holidays.
- ATO tracking (accrual, usage, projections) with correct pay-rate-at-accrual behavior.
- Official exports for all reports in **PDF** format.
- Administrative controls and robust auditability (DB-backed audit tables).

## 3. Platforms

- **Web application**
- **Mobile application** (phone + tablet)
- **AWS hosted** (specific services selected during implementation)

## 4. Roles & Permissions

### 4.1 Roles

- **User**
  - Create/manage their own time entries (within permitted constraints).
  - View summaries and reports.
  - Request unlocks for locked entries.
- **Admin**
  - All user capabilities.
  - Access a separate admin area: **`/admin`** with stricter permissions and distinct navigation.
  - Manage users, configuration (codes, pay rates, holidays), unlock approvals, and audit logs.

### 4.2 Visibility rules

- Audit logs are **admin-only**.
- Users can view their own time entries and reports, but not the system audit log.

## 5. Key Definitions

- **Pay Period (PP)**  
  - **PP1:** 1st–15th of the month  
  - **PP2:** 16th–end of month (EOM)

- **Work Week**
  - Typical working days: **Monday–Friday**
  - Weekly boundaries for rule checks: **Sunday (start) → Saturday (end)**
  - Weekend work is allowed.

- **Holiday**
  - Holidays are treated as normal days for time entry and rules.
  - The system provides **visibility** (highlighting/labeling) for holidays.

- **Time Code**
  - A category assigned to a time entry (e.g., ATO, HSES, MCADS, CONNEXION, FLEXCELERATE, OTHER, USTC, RECRUITING, UPDLV, TRAINING).
  - Time codes are configurable via Admin.

- **Raw Time / Raw Hours**
  - The stored source-of-truth values (UTC timestamps and raw duration).
  - **Rounding is computed and must not be stored.**

- **Rounded Hours**
  - A computed value derived from raw duration (nearest 15 minutes) for display and rules-based calculations.

## 6. Business Rules

**BR-01 Pay periods**  
Two pay periods per month (PP1 and PP2 as defined above).

**BR-02 ATO accrual**  
Accrue **10 hours per pay period**.

**BR-03 ATO accrual timing**  
ATO accrues **only for past pay periods**, not the current pay period.

**BR-04 ATO carryover limit**  
Cannot carry over more than **120 hours** per year.

**BR-05 Weekly contract cap**  
Cannot take more than **40 hours/week** against contract codes.

**BR-06 Weekly additional cap**  
Cannot take more than **4 additional hours/week** beyond 40 contract hours.  
Additional hours are a combination of codes such as TRAINING, OTHER, RECRUITING, CONNEXION, FLEXCELERATE (exact mapping is configurable).

**BR-07 Prior authorization flag**  
If total hours > **44** in a Sunday–Saturday work week, the system must flag that **prior authorization is required**.

**BR-08 No overtime multipliers**  
Pay calculations do **not** apply overtime multipliers.

**BR-09 ATO pay rate rule**  
ATO pay is based on the **hourly rate at which it was accrued**.

**BR-10 Entry scope**  
Users may create time entries **only for the current pay period** (unless an Admin override/unlock applies).

**BR-11 Holidays are visibility-only**  
Holidays do not automatically add hours or change calculations; they are highlighted/visible.

**BR-12 ATO constraints (confirmed)**

- **ATO is restricted to Monday–Friday only**
- **ATO per-day cap: 8 hours**
- **ATO per-week cap:** 40 hours (within the Sunday–Saturday work week window)

**BR-13 Overlapping entries (confirmed)**

- Overlapping time entries for the same user are **not allowed**.

## 7. Functional Requirements

### 7.1 Authentication & Sessions

**FR-001 Login required**  
Users must authenticate to use the app.

**FR-002 Login methods (required)**

- Email/password
- Social login providers:
  - Apple
  - Google
  - Facebook

**FR-003 Industry-standard auth flows (required)**

- Use OAuth 2.0 / OIDC best practices
- Authorization Code Flow with PKCE (especially for mobile)
- Secure refresh token handling and rotation (where supported)
- Enforce email verification (provider verification counts if available)

**FR-004 Account linking (required)**

- If a user signs in with a social provider and the provider supplies a **verified email**, the system must **auto-merge/link** to an existing account with the same verified email.

**FR-005 Account management**

- Admin can create/disable users and reset credentials.

**FR-006 Session security**

- Secure session handling (logout, session expiration)
- Password reset flow

_(Recommended)_ **FR-007 MFA**

- Support multi-factor authentication (TOTP or passkeys) for Admin and optionally for Users.

### 7.2 Time Entry Management

**FR-010 Create time entry**

- User can create a time entry with:
  - Date (UI input accepts **MM/DD/YYYY**)
  - Start time (HH:MM)
  - End time (HH:MM) (optional for partial entry)
  - 12-hour or 24-hour mode
  - If 12-hour mode: AM/PM selection is required
  - Time Code (required)

**FR-011 Partial/open entry**

- User may save an entry with a start time but no end time.
- The system must clearly show an entry is “open”.

**FR-012 Complete entry**

- When an end time is entered, the system computes:
  - Raw duration (stored)
  - Rounded duration (nearest 15 minutes) **computed at runtime** (not stored)

**FR-013 Validation**

- Stop time cannot occur before start time on the same date unless it is a cross-midnight entry (see FR-018).
- If 12-hour time is selected, AM/PM must be provided.
- Required fields must be enforced.

**FR-014 Current pay period restriction**

- The date for a new entry must fall within the **current pay period**.
- Attempts to create entries outside the current pay period must be blocked (unless Admin override/unlock applies).

**FR-015 Edit and delete (unlocked only)**

- Users may edit or delete entries only when they are **unlocked** (see locking rules).
- All changes must be audited.

**FR-016 Overlap prevention (required)**

- The system must **block** creating/updating any entry that overlaps another entry for the same user (after cross-midnight splitting is applied).
- If a split would cause overlap, the save must fail with a clear error.

### 7.3 Cross-Midnight & Time Zone Handling

**FR-018 Cross-midnight auto-split (required)**

- If a user enters an end time that implies crossing midnight (end < start in local clock terms), the system must **auto-split** into two entries:
  1) Start → end-of-day
  2) start-of-day → End
- Both entries preserve the same time code and are linked for audit/reporting.

**FR-019 Time zone change detection (required)**

- The app must detect device time zone changes and correctly compute durations across them.
- Users should see local times in their current device time zone by default.

**FR-020 UTC storage (required)**

- All stored timestamps must be persisted as **UTC**.
- The system must store the **IANA time zone identifier** used for start/end capture (to support correct reconstruction and auditing).

**FR-021 Display time zone behavior (required)**

- Default display: **current device time zone**
- User can optionally choose a **specific time zone** to display throughout the UI and reports.
- **Preference scope:** per user, per device (each device can store its own display preference for the same user)

### 7.4 Entry Locking & Unlock Requests

**FR-030 Auto-lock completed entries**

- Once an entry has both start and end times, it becomes **locked**.

**FR-031 Unlock request**

- Locked entries show a “Request Unlock” action.
- User can submit an unlock request with a reason.

**FR-032 Admin approval gate (required)**

- Unlock requests require **admin approval every time**.
- Admin can approve/deny unlock requests in the admin panel.

**FR-033 Re-lock after correction**

- After a corrected entry is saved and is complete (start+end), it must re-lock automatically.

**FR-034 Audit trail for locking/unlocking**

- Unlock requests, approvals, and edits while unlocked must be recorded.

### 7.5 Pay Period Summary

**FR-040 Pay period summary view**

- Show a summary for a selected pay period, including:
  - Title + pay period identifier (e.g., “PP1 Jan 2026”)
  - A row for **every day** in the pay period (including weekends)

**FR-041 Visual highlighting**

- Weekend days must be visually highlighted.
- Holidays must be visually distinct and labeled.

**FR-042 Day breakdown**

- For each day:
  - Show day of week, date
  - Show all entries for that date by time code
  - Show daily totals:
    - Raw total (sum of raw durations)
    - Rounded total (computed, nearest 15)

**FR-043 Pay period totals**

- Compute and display:
  - Total weekdays in the pay period
  - Total contract hours available and total additional hours available (based on rule configuration)
  - Total hours accounted for and remaining hours

**FR-044 Code breakdown**

- Show a breakdown of hours by time code for the pay period.

**FR-045 Pay calculations**

- Show pay by time code and total gross compensation for the pay period using applicable hourly rates.
- No overtime multipliers.
- **UPDLV** hours are excluded from gross compensation calculations (configurable flag per code).

### 7.6 Weekly Rules & Warnings

**FR-050 Weekly rollup**

- Provide a weekly rollup view (Sunday–Saturday) showing totals for:
  - Contract code hours
  - Additional code hours
  - ATO hours
  - Total hours

**FR-051 Weekly enforcement**

- Prevent entering time that causes:
  - Contract codes > 40 hours/week
  - Additional codes > 4 hours/week above contract hours
  - ATO outside Mon–Fri and/or ATO > 8 hours/day and/or ATO > 40 hours/week
- If total > 44 hours/week, show a prominent “Prior authorization required” warning (and include it in reports).

### 7.7 Reports & Exports

**FR-060 Report filters**
Reports can be selected by:

- Pay period
- Month
- Year

**FR-061 Visible pay period boundaries**
If a report is selected by month or year, pay periods must be visually differentiated (boundaries clearly shown).

**FR-062 Reports available**
At minimum:

- Time entry detail report
- Weekly rollup report
- Pay period summary report
- ATO ledger and balance report
- Admin audit report (admin-only)

**FR-063 PDF export (required for all reports)**

- Every report listed in FR-062 must support export to **PDF**.
- PDFs must include:
  - Title, date range, and generation timestamp
  - Totals and rule warnings
  - Page numbers
- Export must be available on web and mobile.

_(Recommended)_ **FR-064 CSV export**

- Provide CSV export for interoperability.

### 7.8 ATO Tracking

**FR-070 ATO dashboard**
Show:

- ATO accrued year-to-date (YTD)
- ATO used to date
- ATO remaining balance
- Projected ATO by year-end
- Projected use-or-lose balance (vs 120-hour carryover limit)

**FR-071 Accrual calculation**

- Accrue 10 hours per pay period for past pay periods only.

**FR-072 Accrual ledger (required)**

- Store an accrual ledger with:
  - Pay period
  - Accrued hours
  - Hourly rate at accrual time (to enforce BR-09)
  - Timestamp and audit fields

**FR-073 ATO usage ledger**

- Record ATO usage events (date, hours used, optionally linked to time entries).
- Enforce ATO constraints (Mon–Fri only; <= 8 hours/day; <= 40 hours/week).

**FR-074 Use-or-lose computation**

- Compute use-or-lose as: projected year-end balance − 120 carryover limit (if positive).

### 7.9 Cross-Platform Sync

**FR-080 Sync across devices**

- Data must sync across web and mobile.
- Conflicts must be handled deterministically.

_(Recommended)_ **FR-081 Offline support**

- Mobile should allow offline entry and sync when connectivity returns.

### 7.10 Admin Area (`/admin`)

**FR-090 Admin panel access**

- Admins access a separate admin area: **`/admin`**, with stricter permissions and distinct navigation.

**FR-091 Manage users**

- Create/disable users
- Reset credentials
- Assign roles

**FR-092 Manage time codes**

- Create/edit/disable time codes
- Mark codes as:
  - Contract code
  - Additional code
  - Unpaid/excluded-from-pay (e.g., UPDLV)
  - ATO-related

**FR-093 Manage pay rates**

- Maintain pay rate history with effective-date ranges.
- Pay rates change only on the **1st day of a month**.
- Pay calculations use the rate effective on the entry date (or accrual date for ATO accrual ledger).

**FR-094 Manage holidays**

- Add/edit holidays (date, name).
- Holidays appear in summaries and reports (visibility-only).

**FR-095 Unlock request queue**

- View, approve, and deny unlock requests.
- See request reasons and entry details before actioning.

**FR-096 Audit logs (admin-only, required; DB tables)**

- Audit logs are stored as database tables.
- Domain-specific audit tables are required:
  - `audit_time_entry`
  - `audit_unlock_request`
  - `audit_admin_action`
- Admin can view audit logs for:
  - Entry creation/changes/deletions
  - Unlock requests/approvals
  - User/account changes
  - Configuration changes (codes/rates/holidays)
  - Report exports (optional but recommended)

## 8. Data Requirements

**DR-01 UTC timestamps**
Time entries store:

- start_utc (required)
- end_utc (nullable for open entries)
- start_tz (IANA time zone)
- end_tz (IANA time zone, nullable for open entries)

**DR-02 Raw duration stored**

- Store raw duration in minutes (or decimal hours) once end time is known.

**DR-03 No rounded persistence**

- Rounded durations (nearest 15 minutes) must be computed at runtime and must not be stored.

**DR-04 Lock status**

- Entries store status: open / locked / unlocked
- Unlock requests store status: pending / approved / denied

**DR-05 Audit tables (domain-specific)**

- Audit records are stored as DB tables:
  - `audit_time_entry`
  - `audit_unlock_request`
  - `audit_admin_action`
- Each audit record includes: actor, action, target, before/after, timestamp, correlation id.

**DR-06 Display time zone preference (per user, per device)**

- Persist display time zone preference per user **and** per device.

## 9. Non-Functional Requirements

**NFR-01 Security**

- TLS for all traffic
- Secure credential storage (salted, hashed)
- Role-based access control
- Principle of least privilege in AWS

**NFR-02 Reliability**

- No data loss on save/clock-out flows.
- Durable writes and safe retries.

**NFR-03 Performance**

- “Today” view loads quickly on typical connections.
- Report generation + PDF export completes reliably.

**NFR-04 Backups & Recovery**

- Automated backups
- Documented restore process

**NFR-05 Accessibility**

- Reasonable contrast, scalable text
- Keyboard navigation on web
- Screen-reader friendly labeling for key flows

**NFR-06 Auditability**

- All user and admin actions affecting totals/pay are traceable via DB-backed, domain audit tables.
