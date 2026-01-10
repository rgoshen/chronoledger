# ADR-0037: CI/CD Execution Model (Build Once, Promote by SHA)

- Status: Proposed
- Date: 2026-01-04

## Context

ChronoLedger already has an accepted high-level deployment direction:

- GitHub Actions → ECR → ECS/Fargate (API + Worker), with DB migrations as an ECS one-off task (ADR-0021)
- Web SPA deploy to S3 + CloudFront invalidation (ADR-0021)
- IaC with OpenTofu, modularized and separated by environment (ADR-0023)
- Local development via Docker Compose with an AWS-first posture (ADR-0032)
- Testing toolchain and an isolated test database strategy (ADR-0036)

What is still needed is an explicit **execution model** that removes ambiguity for developers and AI agents:

- when and where each test layer runs (PR vs main vs manual)
- how builds are produced and promoted across dev/staging/prod
- how migrations and rollbacks are handled safely
- how infra changes are planned/applied with appropriate gates

## Decision

Adopt a **build-once, promote-by-SHA** CI/CD model:

1) **Build once** per merged commit (Git SHA) and publish immutable artifacts:
   - API/Worker container images in ECR tagged with the Git SHA
   - Web build artifacts stored under a deterministic release location (e.g., `releases/<sha>/`) in S3

2) **Promote the same SHA** to staging/prod using manual approvals via GitHub Environments:
   - dev: automatic deploy on merge to main
   - staging: manual promote (optional approval gate)
   - prod: manual promote (required approval + additional checks)

3) **Migrations are a hard gate** for service deployment:
   - run migrations as an ECS one-off task before updating services
   - fail the deployment if migrations fail
   - enforce forward-compatible migration rules (expand/contract) to support safe rollbacks

4) **CI quality gates** are explicit and required before merge:
   - lint + typecheck + unit tests on all PRs
   - integration tests on PRs that touch backend/persistence-relevant paths
   - E2E smoke tests run on main (or on-demand) to keep PR feedback fast but reliable

This ADR refines *how* we execute the already-chosen pipeline in ADR-0021, without changing the target architecture.

## Pipeline model

```mermaid
flowchart TB
  PR[Pull Request] --> CI[CI: lint + typecheck + unit tests]
  CI -->|paths trigger| IT[Integration tests (DB-backed)]
  CI -->|merge| MAIN[main]

  MAIN --> BUILD[Build & publish artifacts (tag = SHA)]
  BUILD --> ECR[(ECR images: api/worker:SHA)]
  BUILD --> WEBREL[(S3: web releases/SHA)]

  MAIN --> DEVDEPLOY[Auto deploy dev (Environment: dev)]
  DEVDEPLOY --> MIGRATEDEV[DB migrations (ECS one-off)]
  MIGRATEDEV --> ECSDEV[Deploy ECS services (api/worker)]
  WEBREL --> WEBDEV[Deploy web assets to S3 web bucket]
  WEBDEV --> CFDEV[CloudFront invalidation]

  PROMOTE[Manual promote (workflow_dispatch)] --> STAGEPROD[staging/prod deploy]
  STAGEPROD --> MIGRATEENV[DB migrations (ECS one-off)]
  MIGRATEENV --> ECSENV[Deploy ECS services (by SHA)]
  WEBREL --> WEBENV[Deploy web assets (by SHA)]
  WEBENV --> CFENV[CloudFront invalidation]
```

## CI workflows (GitHub Actions)

This ADR standardizes the intent and triggers. Exact workflow file names may vary.

### 1) Pull Request CI (required)

**Trigger:** `pull_request` (all PRs)

**Runs:**

- lint
- typecheck
- unit tests

**Notes:**

- Use path filters to run only relevant packages when possible (web/api/mobile).
- Unit tests must be fast and deterministic.

### 2) Integration tests (required when applicable)

**Trigger:** `pull_request` with path filters (backend/persistence changes), and `push` to main

**Runs:**

- API integration test suite using an isolated Postgres instance (per ADR-0036)
- DB constraint and persistence behavior tests

**Path filters (example intent):**

- `apps/api/**`, `packages/api/**`, `prisma/**`, `db/**`, `migrations/**`

### 3) E2E smoke (gated, not necessarily per PR)

**Trigger options (choose one default):**

- on `push` to main (recommended for early project stage), or
- scheduled nightly, plus manual `workflow_dispatch`

**Runs:**

- Web E2E smoke (Playwright) for critical flows (per ADR-0036)
- Mobile E2E smoke (Detox) when mobile pipeline is active (per ADR-0036)

## CD workflows (GitHub Actions)

### 1) Deploy dev (automatic)

**Trigger:** `push` to `main`

**Steps:**

1) Build API + Worker images tagged with SHA; push to ECR
2) Build web assets; publish to S3 release location `releases/<sha>/`
3) Run DB migrations as ECS one-off task (hard gate)
4) Deploy ECS services using the SHA-tagged images
5) Deploy web assets to the dev web bucket origin path (sync from `releases/<sha>/`)
6) CloudFront invalidation

### 2) Promote to staging/prod (manual)

**Trigger:** `workflow_dispatch` with inputs:

- `environment` (staging|prod)
- `sha` (commit SHA)

**Steps:**

1) Verify artifacts exist for `sha` (ECR images + S3 release assets)
2) Run DB migrations as ECS one-off task (hard gate)
3) Deploy ECS services using the SHA-tagged images
4) Deploy web assets from `releases/<sha>/`
5) CloudFront invalidation

## Migration safety rules

To keep rollback viable and reduce incidents, migrations must follow forward-compatible patterns:

- Prefer **expand/contract**:
  - add new columns/tables first (expand)
  - deploy code that writes to both old and new shapes
  - backfill if needed
  - remove old columns only after a subsequent release (contract)
- Avoid breaking changes in a single release:
  - dropping columns used by the currently deployed code
  - changing semantics without a compatible transition window
- If a migration is unavoidably non-backward-compatible, it requires:
  - an explicit forward-only remediation plan (documented in the PR)
  - a coordinated deployment window (staging/prod)

## Rollback strategy

### ECS rollback

- Roll back by redeploying a previous task definition / SHA-tagged image.
- If a deployment fails after services update, re-run the promote workflow with a previous known-good SHA.

### Web rollback

- Web assets are retained per SHA under `releases/<sha>/`.
- Roll back by re-running the promote workflow with a previous known-good SHA, re-syncing those assets and
  invalidating CloudFront.

## Infrastructure workflow (OpenTofu)

This ADR aligns infra execution to the same promotion model as application deploys.

### Plan (required)

**Trigger:** `pull_request` with path filter `infra/terraform/**`

**Runs:**

- `tofu fmt` / lint (as adopted)
- `tofu init`
- `tofu plan` for the affected environment stack(s)
- Publish plan output to PR (artifact or comment), with no secrets

### Apply (gated)

**Trigger:** `push` to main for dev; `workflow_dispatch` for staging/prod

**Gates:**

- dev: apply allowed automatically (cost-conscious defaults)
- staging/prod: manual approval via GitHub Environments

## Security and credentials

- Use GitHub Actions OIDC to assume AWS roles (no long-lived AWS keys) (ADR-0021).
- Secrets storage and injection must follow the project’s secret management ADR(s) referenced by ADR-0023.

## Consequences

### Positive

- Staging/prod deployments are reproducible: same SHA, same artifacts.
- Rollbacks are faster and lower risk.
- Clear, agent-friendly gates reduce “process invention.”
- Migrations are explicitly treated as a release gate.

### Trade-offs

- Requires retaining web artifacts per SHA (storage cost, manageable).
- More workflow plumbing up front (but less ambiguity long-term).
- Expand/contract discipline can slow some schema changes (but improves reliability).

## Alternatives considered

1) Rebuild per environment (no promotion by SHA)
   - Rejected: increases drift risk and complicates debugging/rollback.
2) Run E2E on every PR
   - Deferred: can slow iteration; keep as an option once the pipeline is stable.
3) Blue/green deployments (ECS)
   - Deferred: may be introduced later if rollout risk warrants added complexity.

## Related

- ADR-0021: Deployment Pipeline (GitHub Actions → ECR → ECS, Migrations, Web Deploy)
- ADR-0023: Infrastructure as Code (OpenTofu/Terraform Modules + Environments)
- ADR-0032: Local Development and Environment Strategy (Docker Compose + AWS Dev Env)
- ADR-0036: Testing Strategy (Unit + Integration + E2E)
- `chronoledger-ci-cd.md` (implementation notes)
