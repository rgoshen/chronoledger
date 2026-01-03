# ADR-0031: Concurrency Control and Idempotency (DB Constraints + Idempotency Keys)

- Status: Accepted
- Date: 2026-01-02

## Context
ChronoLedger supports multiple devices per user and asynchronous operations (exports). We must prevent:
- double-submissions (especially on flaky mobile networks)
- race conditions creating overlaps
- lost updates (two clients editing the same unlocked entry)
- inconsistent audit logging

## Decision
Adopt a layered strategy:
1) **DB-enforced constraints** for overlaps and “one open entry”
2) **Optimistic concurrency** for updates (ETag/If-Match)
3) **Idempotency keys** for create/trigger endpoints
4) **Transactional writes** including audit rows

### 1) Overlap enforcement (DB)
Use PostgreSQL constraints to prevent overlaps for **closed intervals**:
- store closed intervals as `tstzrange(start_utc, end_utc, '[)')`
- apply an exclusion constraint by `(tenant_id, user_id, range)` where `deleted_at is null`

Also enforce:
- only one open entry per `(tenant_id, user_id)` where `end_utc is null` and `deleted_at is null` (unique partial index)

### 2) Optimistic concurrency for updates
For mutable resources (unlocked entries, settings):
- API returns `ETag` derived from a stable version token (e.g., `updated_at` or explicit `version`)
- Clients must send `If-Match` on `PATCH/PUT`
- If mismatch: `409` with code `CONCURRENCY_CONFLICT`

### 3) Idempotency keys
For POSTs that create/trigger side effects:
- Clients send `Idempotency-Key` (UUID) header
- Server stores idempotency records keyed by:
  - `tenant_id`, `user_id`, `route`, `idempotency_key`
- On retries with same key, server returns the original response

Applies to:
- create time entry (start)
- close time entry (if implemented as POST action)
- create unlock request
- create export job

### 4) Transaction boundaries and audit
All state-changing operations run in a single DB transaction:
- mutate domain row(s)
- insert corresponding audit row
- commit together

## Consequences
- ✅ Strong integrity against overlaps and races (DB is the backstop)
- ✅ Safer multi-device edits with clear conflict behavior
- ✅ Reduced duplicate records from retries
- ✅ Audit logs remain consistent with domain changes
- ⚠️ Requires careful ETag/version token implementation
- ⚠️ Exclusion constraints require thoughtful indexing and may affect write performance (acceptable for this domain)

## Notes/Links
- Domain invariants: ADR-0028
- Error contract: ADR-0030
