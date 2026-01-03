# Architecture Decision Records (ADRs)

This folder contains ADRs for ChronoLedger—key decisions, rationale, alternatives, and consequences.

## How to use

- ADRs are the **decision record**. Supporting details and evolving notes belong in `../09-reference/`.
- When an ADR needs deeper context, link to a supporting doc and keep the ADR itself decision-focused.

## Supporting docs

Some ADRs reference deeper supporting material (design notes, checklists, implementation guidance).
Those docs live in:

- `../09-reference/`

When adding a supporting doc:

- Link it from the relevant ADR(s)
- Add “Related ADRs” at the top of the supporting doc
- Prefer linking rather than duplicating ADR content

## Conventions

- Each ADR captures **one** decision.
- Status values: Proposed | Accepted | Deprecated | Superseded
- Naming: `ADR-XXXX-<kebab-case-title>.md`

## Index

- [ADR-0000: ADR Process and Template](ADR-0000-adr-process-and-template.md)
- [ADR-0001: Cloud-First Deployment](ADR-0001-cloud-first-deployment.md)
- [ADR-0002: PostgreSQL as Primary Datastore (3NF)](ADR-0002-postgresql-3nf.md)
- [ADR-0003: Client Platforms (Web + iOS + Android)](ADR-0003-client-platforms.md)
- [ADR-0004: Time Storage and Time Zone Display Strategy](ADR-0004-time-and-timezone-strategy.md)
- [ADR-0005: Domain-Specific Audit Tables](ADR-0005-domain-audit-tables.md)
- [ADR-0006: Auto-Link Accounts by Verified Email](ADR-0006-auto-link-by-verified-email.md)
- [ADR-0007: Containerized Hosting on AWS](ADR-0007-containerized-hosting-on-aws.md)
- [ADR-0008: Auth0 as Auth Provider](ADR-0008-auth0-as-auth-provider.md)
- [ADR-0009: ECS on Fargate for Container Execution](ADR-0009-ecs-fargate.md)
- [ADR-0010: Amazon RDS PostgreSQL as the Primary Database](ADR-0010-rds-postgresql.md)
- [ADR-0011: Background Job Processing via SQS + Worker Service](ADR-0011-sqs-worker-jobs.md)
- [ADR-0012: Official PDF Export Pipeline (Worker → S3 → Signed Download)](ADR-0012-pdf-export-pipeline.md)
- [ADR-0013: Networking and Security Baseline (VPC, Private DB, Secrets Manager)](ADR-0013-networking-security-baseline.md)
- [ADR-0014: Web Frontend Hosting via S3 + CloudFront](ADR-0014-web-hosting-s3-cloudfront.md)
- [ADR-0015: REST API Conventions and Endpoint Structure](ADR-0015-rest-api-conventions.md)
- [ADR-0016: Monorepo Layout with Shared Packages](ADR-0016-monorepo-layout.md)
- [ADR-0017: Multi-Tenant and Config Model (Row-Level Tenancy)](ADR-0017-multitenancy-row-level.md)
- [ADR-0018: PDF Rendering Technology (HTML Templates → Headless Chromium)](ADR-0018-pdf-rendering-html-chromium.md)
- [ADR-0019: Data Retention, Archiving, and Purging Policy](ADR-0019-data-retention-policy.md)
- [ADR-0020: Observability Baseline (Structured Logs, Correlation IDs, CloudWatch)](ADR-0020-observability-baseline.md)
- [ADR-0021: Deployment Pipeline (GitHub Actions → ECR → ECS, Migrations, Web Deploy)](ADR-0021-deployment-pipeline.md)
- [ADR-0022: Primary Languages and Application Frameworks (TypeScript-First)](ADR-0022-tech-stack-typescript-first.md)
- [ADR-0023: Infrastructure as Code (OpenTofu/Terraform Modules + Environments)](ADR-0023-iac-opentofu.md)
- [ADR-0024: Database Access and Migrations (Prisma + PostgreSQL)](ADR-0024-prisma-migrations.md)
- [ADR-0025: API Ingress Topology (ALB → ECS Fargate)](ADR-0025-api-ingress-alb.md)
- [ADR-0026: Caching Strategy (Web: CloudFront; API: No Edge Cache + ETags)](ADR-0026-caching-strategy.md)
- [ADR-0027: Security Posture Baseline (Auth0, WAF, TLS, Secrets, Hardening)](ADR-0027-security-baseline.md)
- [ADR-0028: Domain Invariants and State Machines (Time Entries, Unlocks, ATO)](ADR-0028-domain-invariants-state-machines.md)
- [ADR-0029: Authorization Model and Auth0 Claim Mapping](ADR-0029-authorization-claim-mapping.md)
- [ADR-0030: API Error Contract (RFC 7807 Problem+JSON)](ADR-0030-api-error-contract-problem-json.md)
- [ADR-0031: Concurrency Control and Idempotency (DB Constraints + Idempotency Keys)](ADR-0031-concurrency-idempotency.md)
- [ADR-0032: Local Development and Environment Strategy (Docker Compose + AWS Dev Env)](ADR-0032-local-dev-env-strategy.md)
- [ADR-0033: Testing Strategy (Unit + Integration + Contract + PDF Golden Tests)](ADR-0033-testing-strategy.md)
