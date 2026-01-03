# ADR-0030: API Error Contract (RFC 7807 Problem+JSON)

- Status: Accepted
- Date: 2026-01-02

## Context
ChronoLedger clients (web + mobile) need consistent error handling for:
- validation failures (bad time ranges, ATO rule violations)
- state conflicts (locked entries, overlap conflicts)
- auth failures and permission issues
- rate limiting and server faults

## Decision
Standardize all non-2xx responses on **RFC 7807**-style Problem Details JSON (`application/problem+json`).

### 1) Response shape
Minimum fields:
- `type` (URI-ish identifier for the error category)
- `title` (human-readable summary)
- `status` (HTTP status code)
- `detail` (additional human-readable detail)
- `instance` (request path or unique instance ID)

ChronoLedger extensions:
- `code` (stable, machine-readable code)
- `request_id` (mirrors `X-Request-Id`)
- `errors` (array of field-level validation errors when applicable)

### 2) Status code mapping (key cases)
- `400` invalid request format
- `401` unauthenticated / invalid token
- `403` authenticated but forbidden (missing role/permission)
- `404` not found (tenant-scoped)
- `409` conflict:
  - overlap detected
  - locked resource modification attempted
  - optimistic concurrency mismatch (see ADR-0031)
- `422` semantic validation failure (ATO rules, end < start, etc.) when we want to distinguish from 400
- `429` rate limited (WAF or app)
- `500` unexpected server error

### 3) Examples

#### Overlap conflict (409)
```json
{
  "type": "https://chronoledger.app/problems/overlap",
  "title": "Time entry overlaps an existing entry",
  "status": 409,
  "detail": "The proposed interval overlaps time_entry_id=abc123.",
  "instance": "/api/v1/time-entries/close",
  "code": "TIME_ENTRY_OVERLAP",
  "request_id": "req_01HXYZ...",
  "errors": []
}
```

#### Validation error (422)
```json
{
  "type": "https://chronoledger.app/problems/validation",
  "title": "Validation failed",
  "status": 422,
  "detail": "One or more fields failed validation.",
  "instance": "/api/v1/time-entries",
  "code": "VALIDATION_ERROR",
  "request_id": "req_01HXYZ...",
  "errors": [
    { "field": "endUtc", "message": "endUtc must be after startUtc" },
    { "field": "category", "message": "ATO is only allowed Monday through Friday" }
  ]
}
```

## Consequences
- ✅ One error-handling strategy across all clients
- ✅ Stable `code` values enable reliable UX messaging and analytics
- ✅ Easier debugging with `request_id` correlation (ADR-0020)
- ⚠️ Requires discipline to keep `code` catalog stable
- ⚠️ Must avoid leaking sensitive details in `detail`

## Notes/Links
- Observability/correlation: ADR-0020
