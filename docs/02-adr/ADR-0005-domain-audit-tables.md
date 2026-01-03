# ADR-0005: Domain-Specific Audit Tables

- Status: Accepted
- Date: 2026-01-02

## Context
ChronoLedger requires:
- admin approval gate for unlock requests
- forensic traceability for all critical actions
- admin-only visibility for audit data

We want audit data stored in the database (not only in application logs).

## Decision
Use **separate domain audit tables** in PostgreSQL:
- `audit_time_entry` (create/update/delete; before/after snapshots as needed)
- `audit_unlock_request` (request/approve/deny; reasons; linkage to entry)
- `audit_admin_action` (user/config changes, role changes, etc.)

These tables are viewable only via admin permissions in `/admin`.

## Consequences
- ✅ Clear audit boundaries and simpler admin queries.
- ✅ Avoids a “god audit table” that becomes hard to reason about.
- ✅ Aligns with the app’s admin/security model.
- ⚠️ Requires consistent auditing hooks in the backend for every critical workflow.
- ⚠️ Schema changes may require evolving audit record shapes carefully.
