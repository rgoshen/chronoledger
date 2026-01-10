# ADR-0027: Security Posture Baseline (Auth0, WAF, TLS, Secrets, Hardening)

- Status: Accepted
- Date: 2026-01-02

## Context

ChronoLedger handles:

- time and pay-related data
- audit trails visible to admins
- “official” PDF exports

The system is cloud-hosted with a web SPA, mobile apps, an API, and a worker. We need industry-standard security
controls without over-complicating v1.

## Decision

Adopt the following baseline security posture.

### 1) Authentication and session model

- Auth via **Auth0** using OIDC/OAuth2.
- Web SPA uses **Authorization Code + PKCE**.
- Mobile uses Auth0’s recommended mobile flows (PKCE where applicable).
- Access tokens are short-lived; refresh tokens stored only in secure storage (mobile) or via Auth0 best practices for SPAs.

### 2) Authorization

- Server-enforced RBAC:
  - `USER`
  - `ADMIN`
- Admin area is separate UI (`/admin`) and API routes are under `/api/v1/admin`.
- No client-side checks are trusted for authorization decisions.

### 3) Network and transport security

- TLS everywhere:
  - `app.<domain>` via CloudFront + ACM
  - `api.<domain>` via ALB + ACM
- RDS is private (no public access).
- ECS tasks run in private subnets; inbound to API tasks allowed only from ALB SG.

### 4) WAF and rate limiting

- Attach **AWS WAF** to the API ALB.
- Enable managed rule groups (baseline OWASP-style protections).
- Add rate-based rules for abuse protection (tuned after observing real traffic).
- Allowlist rules where needed for internal admin IPs (optional).

### 5) Secrets management

- Use **AWS Secrets Manager** for:
  - DB credentials
  - Auth0 config secrets (if any)
  - signing keys if introduced later
- No secrets committed to git, no secrets in container images.
- ECS task roles fetch secrets at runtime with least privilege.

### 6) Data protection

- Encryption at rest:
  - RDS encryption enabled
  - S3 exports bucket uses SSE (SSE-S3 or SSE-KMS; prefer SSE-KMS for tighter control)
- Backups enabled for RDS; access restricted.
- Store all timestamps in UTC; avoid leaking sensitive details in logs.

### 7) Application hardening

- Input validation on API boundaries (DTO validation).
- Strict CORS allowlist:
  - allow only `https://app.<domain>` (and known dev origins)
- Security headers:
  - Web via CloudFront response headers policy (CSP, HSTS, X-Content-Type-Options, etc.)
  - API uses appropriate headers (`X-Content-Type-Options`, HSTS via ALB/CloudFront depending)
- Dependency scanning in CI (SCA) + container vulnerability scanning (ECR scan or CI tool).

### 8) Audit and admin actions

- Use domain audit tables (already decided) for:
  - time entry changes
  - unlock requests
  - admin actions
- Audit tables are append-only by default (ADR-0024).

## Consequences

- ✅ Strong baseline aligned with common industry patterns
- ✅ Clear separation of responsibilities (Auth0 for auth, AWS for infra security)
- ✅ Scales to SaaS needs without major redesign
- ⚠️ WAF/rate rules must be tuned to avoid blocking legitimate usage
- ⚠️ CSP requires care when integrating third-party scripts in the web app

## Alternatives Considered

- Custom auth: rejected (Auth0 is safer and faster).
- No WAF: rejected (unnecessary risk).
- Putting secrets in env files: rejected (drift and leakage risk).
