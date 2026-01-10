# ADR-0007: Containerized Hosting on AWS

- Status: Accepted
- Date: 2026-01-02

## Context

ChronoLedger is cloud-first and must support:

- Web + mobile clients with reliable sync
- Server-side workloads such as report generation and official PDF exports
- A future path to multi-user, configurable deployments

We want predictable request latency, straightforward PostgreSQL connectivity, and an easy path for background workers.

## Decision

Host the backend as **containerized services on AWS** (not serverless functions).

- Primary runtime: containerized API service
- Support a worker model (separate container) for background jobs such as PDF generation and scheduled processing
- Use AWS-managed container execution (implementation details to be captured in a follow-on ADR):
  - Candidate services: **App Runner** (simplicity) or **ECS on Fargate** (control/flexibility)

## Consequences

- ✅ Predictable performance (no cold-start behavior typical of serverless)
- ✅ Straightforward PostgreSQL connection pooling
- ✅ Natural fit for background jobs (worker containers)
- ✅ Easier to evolve toward multi-tenant/SaaS patterns
- ⚠️ Higher baseline cost than pure serverless at very low usage
- ⚠️ More operational surface area (build/deploy, scaling policies, networking)

## Alternatives Considered

- API Gateway + Lambda: rejected due to operational complexity around relational DB connectivity and heavier workloads
  like PDF generation.
