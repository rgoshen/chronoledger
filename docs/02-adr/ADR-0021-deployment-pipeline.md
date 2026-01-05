# ADR-0021: Deployment Pipeline (GitHub Actions → ECR → ECS, Migrations, Web Deploy)

- Status: Accepted
- Date: 2026-01-02

## Context

ChronoLedger includes:

- Web SPA hosted on S3 + CloudFront
- API + worker services on ECS/Fargate
- RDS PostgreSQL migrations
- Environment separation (dev/staging/prod)

We need a repeatable, safe, low-ops deployment pipeline suitable for a solo developer now and a team later.

## Decision

Use **GitHub Actions** as the CI/CD runner and deploy with the following flow per environment:

1) **CI on PR**

- Lint + unit tests for changed projects
- Build (optional) to catch compile errors

1) **On merge to main (or env branch)**

- Build and push Docker images to **ECR**:
  - `api:<git_sha>`
  - `worker:<git_sha>`
- Run DB migrations as a **gated step** (one of):
  - ECS one-off task running migration command (preferred)
  - or a dedicated migration job container
- Update ECS services to new task definitions (rolling deployment)
- Deploy web:
  - build web assets
  - upload to S3
  - invalidate CloudFront cache

1) **Authentication to AWS**

- Use GitHub OIDC to assume an AWS role (no long-lived AWS keys in GitHub).

## Consequences

- ✅ Repeatable releases with minimal manual steps
- ✅ Safer DB changes via controlled migrations gate
- ✅ Immutable image tags by SHA improve traceability
- ✅ Clean separation between app deploy and static web deploy
- ⚠️ Requires careful migration design to support rolling deploys
- ⚠️ Adds initial setup work for OIDC roles and environment protections

## Alternatives Considered

- Manual deploys: rejected due to error risk and repeatability.
- “Latest” image tags only: rejected for traceability and rollback safety.
- Single monolithic deploy step: rejected; we want explicit gates.
