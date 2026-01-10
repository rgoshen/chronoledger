# ADR-0019: Data Retention, Archiving, and Purging Policy

- Status: Accepted
- Date: 2026-01-02

## Context

ChronoLedger stores time entries, pay-related configuration, and admin-visible audit history. The system also produces
“official” PDF exports stored in S3.

Key drivers:

- Auditability: ability to explain what changed, when, and by whom
- Safety: recoverability from mistakes (soft deletes)
- Cost control: prevent unbounded growth of exports and logs
- Future SaaS readiness: consistent defaults that can be made tenant-configurable later

## Decision

Adopt a retention model with **soft deletes by default**, and **scheduled purging/archiving** governed by explicit
retention periods.

### 1) Source-of-truth data

- **Time entries**: soft delete (`deleted_at`) only.
- **Unlock requests**: never hard-deleted by default (audit relevance).
- **Admin audit tables**: append-only (no updates/deletes outside of exceptional admin repair).

### 2) Default retention periods (v1)

These are the initial defaults. They may become tenant-configurable later via `tenant_setting`.

- **Time entries (including soft-deleted rows)**: retain **7 years**
- **Audit tables** (`audit_time_entry`, `audit_unlock_request`, `audit_admin_action`): retain **7 years**
- **Export jobs metadata** (`export_job` rows): retain **7 years**
- **PDF files in S3** (rendered exports): retain **2 years**
- **Application logs (CloudWatch)**: retain **90 days**
- **Metrics/alarms**: retained per CloudWatch defaults; dashboards are configuration

### 3) Purge mechanics

- A scheduled worker job performs:
  - **Hard purge** of soft-deleted time entries older than the time-entry retention window
  - Cleanup of **stale export jobs** older than retention (after verifying S3 lifecycle)
- S3 uses **Lifecycle Policies** to transition/delete PDF objects based on age.

### 4) Holds and exceptions

- If a record is under a compliance hold (future feature), purge must skip it.
- Admin-only emergency tools may purge specific data, but those actions must be recorded in `audit_admin_action`.

## Consequences

- ✅ Predictable storage growth and cost controls
- ✅ Strong audit posture without indefinite retention everywhere
- ✅ Supports “official export” requirement while avoiding permanent S3 bloat
- ⚠️ Retention defaults may need adjustment for real-world needs
- ⚠️ Purge jobs must be carefully implemented to avoid accidental deletion

## Alternatives Considered

- Retain everything forever: rejected due to cost growth and lack of a clear lifecycle story.
- Hard delete everywhere: rejected due to audit requirements and safety.
- Immediate RLS-based immutable ledger: deferred; we can add stronger database-level controls later if needed.
