# ChronoLedger — Caching & HTTP Headers

_Last updated: 2026-01-02_

## Web (CloudFront)
- Hashed assets:
  - `Cache-Control: public, max-age=31536000, immutable`
- HTML entry:
  - `Cache-Control: public, max-age=60` (or similar)
- Invalidate CloudFront on deploy (ADR-0021)

## API (ALB → ECS)
### Default
- `Cache-Control: no-store`
- `Pragma: no-cache` (optional legacy)
- `Vary: Origin, Authorization` (as needed)

### Conditional GET (ETags)
- On eligible endpoints, return:
  - `ETag: "<hash>"`
- If client sends `If-None-Match` and unchanged:
  - return `304 Not Modified` with empty body

## Recommended “never cache” endpoints
- Any user-specific list/detail:
  - `/api/v1/time-entries*`
  - `/api/v1/reports*`
  - `/api/v1/exports*`

## Notes
- ETags must be computed from stable fields (e.g., updated_at + entity id), not from non-deterministic fields.
