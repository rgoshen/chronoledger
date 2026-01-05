# ChronoLedger — Security Baseline (Implementation Notes)

_Last updated: 2026-01-02_

## 1) High-level security diagram

```mermaid
flowchart TB
  subgraph Edge
    CF[CloudFront: app.<domain>]
    WAF[WAF: api ALB]
  end

  CF --> S3W[(S3 Web Bucket)]
  U[Users] --> CF
  U -->|HTTPS| ALB[ALB: api.<domain>]
  WAF --> ALB
  ALB --> API[ECS API Tasks (private subnets)]
  API --> RDS[(RDS Postgres - private)]
  API --> SM[Secrets Manager]
  API --> CW[CloudWatch Logs]

  API --> SQS[SQS]
  SQS --> WK[ECS Worker Tasks]
  WK --> S3E[(S3 Exports)]
  WK --> SM
  WK --> CW
```

## 2) CORS (recommended)

- Allow origins:
  - `https://app.<domain>`
  - dev origins only when `env=dev`
- Allow methods: GET, POST, PUT, PATCH, DELETE
- Allow headers: Authorization, Content-Type, X-Device-Id, X-Request-Id, Idempotency-Key

## 3) Web security headers (CloudFront response headers policy)

Recommended:

- HSTS (includeSubDomains; preload after stable)
- CSP (start strict, add exceptions as needed)
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: minimal

## 4) Token handling

- Never log tokens.
- Prefer in-memory token storage for web; rely on Auth0 recommended patterns for SPAs.
- Mobile uses Keychain/Keystore for refresh tokens and device IDs.

## 5) Dependency + image scanning

- CI: dependency audit (npm audit or dedicated tool)
- ECR image scanning enabled (or CI scanning) for API/worker images

## 6) Admin safety

- Consider optional IP allowlisting for `/api/v1/admin` later.
- Require strong Auth0 policies (MFA for admins recommended).
