# ADR-0026: Caching Strategy (Web: CloudFront; API: No Edge Cache + ETags)

- Status: Accepted
- Date: 2026-01-02

## Context
ChronoLedger serves:
- A static web SPA (`app.<domain>`) via S3 + CloudFront
- A user-specific API (`api.<domain>`) behind ALB → ECS

We must avoid caching sensitive, user-specific API responses at shared edges. At the same time, we want good performance for:
- static assets
- some stable reference data (time codes, holidays)
- repeated list reads (time entries) within a session

## Decision
### 1) Web caching (static)
- Use **CloudFront** for `app.<domain>`.
- Set aggressive caching for immutable assets (hashed filenames).
- Use shorter caching for HTML entry points (SPA) with cache-busting on deploy.

### 2) API caching (dynamic)
- **Do not** put CloudFront in front of the API in v1.
- Default API responses use `Cache-Control: no-store` for user-specific data.
- Use conditional requests for GETs:
  - Support **ETags** (or `Last-Modified`) for list/detail endpoints where safe.
  - Client may send `If-None-Match`; API can return `304 Not Modified`.

### 3) Safe cacheable API endpoints (optional, explicit)
- Only explicitly “public-ish” or tenant-wide reference endpoints may use caching headers:
  - Example: `GET /api/v1/admin/time-codes` (admin-only; still may be cacheable per device)
  - Example: `GET /api/v1/time-codes` (if introduced and safe)
- Any endpoint returning user time entries, reports, or exports remains `no-store`.

## Consequences
- ✅ Prevents accidental data leaks via shared caches
- ✅ Great performance where it matters most (web assets)
- ✅ ETags provide a low-risk, high-value optimization for read-heavy flows
- ⚠️ Some performance tuning may be needed as datasets grow (DB indexes, query optimization)
- ⚠️ If we later add CloudFront for API, we must be extremely strict about cache keys and authorization

## Alternatives Considered
- Edge caching for the API immediately: rejected due to risk and complexity.
- API Gateway caching: rejected (not using API Gateway for v1 ingress).
