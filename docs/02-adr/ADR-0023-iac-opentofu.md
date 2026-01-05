# ADR-0023: Infrastructure as Code (OpenTofu/Terraform Modules + Environments)

- Status: Accepted
- Date: 2026-01-02

## Context

ChronoLedger is AWS-hosted and includes VPC networking, ECS services, RDS, S3, CloudFront, IAM, and monitoring. We need:

- repeatable deployments across dev/staging/prod
- reviewable, version-controlled infrastructure changes
- safe separation of environments
- minimal long-lived credentials (GitHub OIDC already chosen in ADR-0021)

## Decision

Manage AWS infrastructure using **Infrastructure as Code (IaC)** with **OpenTofu (Terraform-compatible)**.

### Structure

- Use reusable modules under `infra/terraform/modules/`
- Maintain environment stacks under `infra/terraform/environments/<env>/`

### State

- Store state remotely (recommended):
  - S3 backend + DynamoDB lock table (per env)
- Separate state per environment.

### Environment separation

- `dev`: fast iteration, lower-cost sizing
- `staging`: production-like settings for validation
- `prod`: protected, manual approval for deploys (ADR-0021)

### Secrets

- Secrets managed via AWS Secrets Manager (ADR-0013)
- IaC provisions secret containers and access policies, but secret values are injected out-of-band or via secure pipelines.

## Consequences

- ✅ Reproducible infrastructure and safer changes via PR review
- ✅ Environment isolation with clear promotion path
- ✅ Terraform module ecosystem without vendor lock-in
- ⚠️ Requires discipline in module boundaries and naming
- ⚠️ Requires remote state bootstrapping step
- ⚠️ Must avoid putting secret values in state

## Alternatives Considered

- ClickOps (console/manual): rejected for drift and repeatability risks.
- AWS CDK: viable, but rejected to avoid adding a second “app language” for infra and to keep plans/diffs simple.
- Pulumi: viable, but rejected to avoid increasing tool surface area early.

## Notes/Links

- See `chronoledger-infra-approach.md` for module list and environment layout.
