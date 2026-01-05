# ADR-0015: REST API Conventions and Endpoint Structure

- Status: Accepted
- Date: 2026-01-02

## Context

ChronoLedger requires:

- Web + mobile (iOS/Android) clients consuming a single backend
- Auth0-based authentication (OIDC/OAuth) with role-based authorization
- Strong server-side validation (overlap blocking, locking/unlocking, weekly rules)
- Long-running tasks (PDF exports) that must not block interactive requests
- Future growth to more users and higher configurability (SaaS-friendly)

We need a stable API shape that:

- is easy to consume from multiple clients
- is secure by default
- supports evolution (versioning)
- keeps admin operations clearly separated

## Decision

Adopt a **RESTful JSON API** with the following conventions:

### 1) Base paths and versioning

- Separate hostnames are used for clarity and security boundaries:
  - Web: `app.<domain>`
  - API: `api.<domain>`

- Public API base: `/api/v1`
- Admin API base: `/api/v1/admin`
- Versioning via URL segment (`v1`). Breaking changes require a new version.

### 2) Authentication and authorization

- Authentication via **Auth0** access tokens (JWT).
- API validates JWT signature and claims; uses RBAC:
  - `role=user`
  - `role=admin`
- Admin routes require admin role server-side (not just client UI).

### 3) Resource modeling (high level)

- `time_entries` are **soft deleted** (default). Purge, if ever needed, is admin-only.

- `time_entries`: user time records (open/complete, split entries)
- `unlock_requests`: approvals gate for edits to locked entries
- `reports` and `exports`: report generation and PDF export artifacts
- `admin` resources: users, time codes, pay rates, holidays, audit tables

### 4) Time and time zone representation

- All timestamps in responses are ISO 8601 in UTC (`...Z`).
- Inputs accept either:
  - UTC timestamp(s), or
  - local clock values + IANA TZ (preferred for clients)
- Server stores UTC + capture TZ metadata (per ADR-0004).

### 5) Device identity and per-user-per-device preferences

- Clients send a stable device identifier header (required):
- `X-Device-Id: <uuid>`
- Per-user-per-device settings (e.g., display time zone) are stored and retrieved via API.

### 6) Idempotency

- Support `Idempotency-Key` header on POST endpoints that may be retried safely:
  - creating time entries
  - creating unlock requests
  - creating export jobs

### 7) Errors and validation

- Use **RFC 7807 Problem Details** JSON for errors:
  - `type`, `title`, `status`, `detail`, `instance`
  - include a `errors` map for field-level validation

### 8) Pagination and filtering

- List endpoints support:
  - `limit`
  - `cursor` (preferred) or `page`
  - filter query parameters (date ranges, code, status)

### 9) Long-running work

- PDF generation is asynchronous:
  - client requests export -> API creates an export job -> worker produces PDF -> client polls job status -> client downloads via signed URL.

## Consequences

- ✅ Consistent API across web and mobile
- ✅ Clear separation of admin capabilities
- ✅ Easier evolution via versioned routes
- ✅ Safer retries via idempotency keys
- ⚠️ Requires careful documentation and client SDK discipline
- ⚠️ Cursor pagination adds some implementation work but pays off as datasets grow

## Alternatives Considered

- GraphQL: rejected initially to reduce complexity and because REST maps cleanly to the domain and audit requirements.
- Versioning via headers only: rejected for clarity and operational simplicity.

## Notes/Links

- See: `chronoledger-api-design.md` for endpoint outline and request/response shapes.
- Related ADRs: ADR-0008 (Auth0), ADR-0004 (time zones), ADR-0011 (SQS jobs), ADR-0012 (PDF pipeline)
