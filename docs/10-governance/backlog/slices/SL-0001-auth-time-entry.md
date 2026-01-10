<!-- markdownlint-disable MD024 MD041 -->

# SL-0001: Auth + Time Entry (MVP Slice)

**Status**: Ready
**Target Release**: v0.1 (MVP)
**Epic**: EP-0001
**Stories**: US-0001, US-0002, US-0003, US-0004

## Constraints and Posture

### AuthN/AuthZ
- **Provider**: Auth0 (OIDC/OAuth2) per ADR-0027, ADR-0008
- **Flow**: Authorization Code + PKCE for web SPA
- **Callback**: GET `/auth/callback` receives authorization code from Auth0; token exchange handled by Auth0 SDK
- **Roles**: USER, ADMIN (server-enforced per ADR-0029)
- **Tenant Linking**: Auto-link by verified email per ADR-0006
- **Session**: Short-lived access tokens; refresh tokens via Auth0 best practices

### Overlap Enforcement
- **DB-Level**: PostgreSQL exclusion constraint on `tstzrange(start_utc, end_utc, '[)')` by `(tenant_id, user_id)` per ADR-0031
- **Open Entry**: Unique partial index: one open entry (`end_utc IS NULL`) per `(tenant_id, user_id)` where `deleted_at IS NULL`
- **Cross-Category**: Overlaps checked across all categories (work/contract/ATO)

### Idempotency
- **Header**: `Idempotency-Key` (UUID) for POST operations per ADR-0031
- **Scope**: Keyed by `(tenant_id, user_id, route, idempotency_key)`
- **DB Constraint**: Unique index on `(tenant_id, user_id, route, idempotency_key)` to prevent duplicate processing
- **Retry Behavior**: Return original response for duplicate keys
- **Retention**: 24-hour TTL on idempotency records; cleanup via scheduled job or DB-level expiration (e.g., `created_at + interval '24 hours' < now()`)

### Error Contract
- **Format**: RFC 7807 Problem+JSON per ADR-0030
- **Key Codes**: `TIME_ENTRY_OVERLAP` (409), `VALIDATION_ERROR` (422), `CONCURRENCY_CONFLICT` (409)
- **Include**: `type`, `title`, `status`, `detail`, `instance`, `code`, `request_id`, `errors[]`

### Data Invariants (per ADR-0028)
- **Time Storage**: All UTC with `capture_time_zone` (IANA)
- **Locking**: Not in MVP (entries remain unlocked)
- **Cross-Midnight**: Defer to post-MVP
- **Tenant Scoping**: All queries/writes scoped by `tenant_id` per ADR-0017

## Customer Journey

1. Sign in
2. Navigate to “Time Entry”
3. Create a complete entry (happy path)
4. Start an open entry → stop it → confirm persisted
5. Attempt an overlap → see clear rejection

## Work Breakdown (execution checklist)

Prefer updating this checklist over creating separate WO docs.

### Backend / API

- [ ] Implement Auth0 integration with OIDC/PKCE flow
- [ ] Create middleware for JWT validation and tenant resolution
- [ ] Implement auto-linking logic by verified email (per ADR-0006)
- [ ] GET `/auth/callback` - handle Auth0 callback with authorization code; establish session via Auth0 SDK token exchange
- [ ] POST `/time-entries` - create complete time entry with overlap validation
- [ ] POST `/time-entries/start` - start open entry (start_utc, no end_utc)
- [ ] POST `/time-entries/:id/stop` - stop open entry (set end_utc)
- [ ] GET `/time-entries` - list entries with pay period filter, tenant-scoped
- [ ] Implement idempotency key middleware (store/check/return cached responses)
- [ ] Implement Problem+JSON error responses for all error cases
- [ ] Add request_id correlation to responses (per ADR-0020)
- [ ] Add RBAC authorization checks (USER/ADMIN roles)
- [ ] Unit tests for validation logic (time ordering, required fields)
- [ ] Integration tests for overlap constraint enforcement
- [ ] Integration tests for idempotency (duplicate key handling)
- [ ] Integration tests for tenant scoping (no cross-tenant access)

### Data / Migrations

- [ ] Create `tenant` table with initial seed for Rick's personal tenant
- [ ] Create `tenant_user` membership table (user_id, tenant_id, role)
- [ ] Create `time_code` table with tenant_id scope
- [ ] Create `time_entry` table with tenant_id, user_id, start_utc, end_utc, capture_time_zone, code_id
- [ ] Add `deleted_at` column for soft deletes
- [ ] Add exclusion constraint: `tstzrange(start_utc, end_utc, '[)')` by `(tenant_id, user_id)` where `deleted_at IS NULL`
- [ ] Add unique partial index: one open entry per `(tenant_id, user_id)` where `end_utc IS NULL AND deleted_at IS NULL`
- [ ] Create composite indexes: `(tenant_id, user_id, start_utc)`, `(tenant_id, user_id, deleted_at)`
- [ ] Create `idempotency_record` table (tenant_id, user_id, route, idempotency_key, response_json, created_at)
- [ ] Add unique index on `idempotency_record` (tenant_id, user_id, route, idempotency_key) to enforce single processing
- [ ] Implement 24-hour retention/cleanup for `idempotency_record` (scheduled job or WHERE clause filter)
- [ ] Seed: minimal time codes (WORK, ATO, SICK, etc.) for Rick's tenant
- [ ] Seed: Rick's user membership in personal tenant
- [ ] Create time_entry_audit table (per ADR-0005)

### Web UI

- [ ] Implement Auth0 login flow (redirect to Auth0, handle callback)
- [ ] Create auth context/provider for token management and refresh
- [ ] Create protected route wrapper (redirect to login if unauthenticated)
- [ ] Build sign-in screen with Auth0 integration
- [ ] Build "no membership found" error screen
- [ ] Create Time Entry form component (date, start time, end time, code selector)
- [ ] Implement start/stop timer UI for open entries (running indicator, duration display)
- [ ] Create time entry list view (current pay period, show all entries)
- [ ] Handle empty state (no entries yet)
- [ ] Handle loading states (spinner during API calls)
- [ ] Handle validation errors (display field-level errors from Problem+JSON)
- [ ] Handle overlap errors (clear message showing conflicting entry)
- [ ] Handle network errors (retry with same idempotency key)
- [ ] Implement idempotency key generation (UUID) for create/start/stop operations
- [ ] Accessibility: keyboard navigation for form, ARIA labels, focus management
- [ ] Accessibility: error announcements via screen reader

### QA

- [ ] E2E: Sign in with Auth0 → redirected to time entry screen
- [ ] E2E: Create valid time entry → appears in list
- [ ] E2E: Start open entry → stop it → verify completed and persisted
- [ ] E2E: Attempt overlapping entry → see clear overlap error
- [ ] E2E: Submit invalid time range (end before start) → see validation error
- [ ] E2E: Network interruption on create → retry succeeds idempotently
- [ ] E2E: Session expiration → redirected to sign in
- [ ] E2E: Unauthorized action → see 403 error
- [ ] Negative: Attempt cross-tenant access → 404 not found
- [ ] Negative: Invalid idempotency key format → validation error
- [ ] Regression: Verify tenant isolation across all endpoints

### Observability

- [ ] Add structured logs: auth.sign_in, auth.callback, auth.session_expired
- [ ] Add structured logs: time_entry.created, time_entry.started, time_entry.stopped
- [ ] Add structured logs: time_entry.overlap_rejected, time_entry.validation_failed
- [ ] Add structured logs: idempotency.duplicate_key, idempotency.cache_hit
- [ ] Add metrics: `api.time_entries.create.attempts`, `api.time_entries.create.success`, `api.time_entries.create.failure`
- [ ] Add metrics: `api.time_entries.overlap.rejected`, `api.auth.sign_in.success`
- [ ] Ensure all logs include `request_id` for correlation
- [ ] Add trace spans for Auth0 callbacks and DB operations (if tracing enabled)

## Implementation Plan (by layer)

### UX/UI

- Web: minimal “Time Entry” screen with create form + list of entries for current pay period
- Mobile: minimal equivalent (can be follow-on if sequencing is needed)
- States: empty, saving, validation error, overlap error, success

### Web/API

- Endpoints (example):
  - POST `/time-entries` (create complete)
  - POST `/time-entries/open` (start open)
  - POST `/time-entries/<built-in function id>/stop` (stop open)
  - GET `/time-entries?payPeriod=...` (minimal list for verification)
- AuthZ: role-based per PRD
- Errors: Problem+JSON

### Data

- Tables/Models: time_entries (+ tenant/user scoping)
- Migrations: include overlap enforcement mechanism (constraint/index)
- Seed: minimal codes for local dev

### Observability

- Logs: structured events for create/start/stop and overlap rejections
- Metrics: count create attempts/success/failure (basic)

## Rollout Plan

- Feature flag optional (recommended for UI exposure)
- Backward compatibility: N/A for MVP

## Change Log

- 2026-01-09: Address code review - clarified Auth0 callback uses GET (not POST); added idempotency DB constraint (unique index), 24-hour TTL retention strategy, and cleanup mechanism tasks; updated task count to 65 (Backend/API: 16, Data: 14, Web UI: 16, QA: 11, Observability: 8)
- 2026-01-09: Set Status to Ready; added Constraints and Posture section (AuthN/AuthZ, overlap enforcement, idempotency, error contract, data invariants); expanded Work Breakdown with concrete tasks per layer (Backend/API: 16 tasks, Data: 12 tasks, Web UI: 16 tasks, QA: 11 tasks, Observability: 8 tasks); total 63 actionable checklist items
- 2026-01-09: Added Work Breakdown checklist (lean mode)

## Acceptance Checklist

- [ ] End-to-end demo works locally (web at minimum)
- [ ] Overlap is DB-enforced (not UI-only)
- [ ] Error contract is consistent
- [ ] Tests: unit + integration for overlap + idempotency behavior
- [ ] Docs updated (story/slice status)

## Demo Script

1. Sign in
2. Create a valid entry
3. Start and stop an open entry
4. Try to create an overlap and show the error

<!-- markdownlint-enable MD024 MD041 -->
