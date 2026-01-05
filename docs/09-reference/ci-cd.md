# ChronoLedger — CI/CD Pipeline (Implementation Notes)

_Last updated: 2026-01-02_

## 1) Pipeline overview

```mermaid
flowchart TB
  PR[Pull Request] --> CI[CI: lint + unit tests]
  CI -->|merge| MAIN[Main/Env branch]

  MAIN --> BUILD[Build images]
  BUILD --> ECR[(ECR)]
  ECR --> MIGRATE[Run DB migrations (ECS one-off task)]
  MIGRATE --> ECSDEPLOY[Deploy ECS services (API + Worker)]
  MAIN --> WEBBUILD[Build web assets]
  WEBBUILD --> S3[(S3 web bucket)]
  S3 --> CF[CloudFront Invalidation]
```

## 2) Migration gate (recommended)

- Package migrations with the API (or separate `migrate` image).
- Run as a one-off ECS task before updating services.
- Fail the deploy if migrations fail.

## 3) Rollback approach

- Roll back ECS services by redeploying a previous task definition (previous SHA).
- If a migration is non-backward-compatible, require a forward-only remediation plan.

## 4) Environment protections

- Use GitHub Environments:
  - `dev`: automatic deploy
  - `staging`: optional manual approval
  - `prod`: manual approval + additional checks

## 5) Artifact traceability

- Include Git SHA in:
  - image tags
  - API response header: `X-Build-Sha`
  - worker logs (startup line)
