# ADR-0009: ECS on Fargate for Container Execution

- Status: Accepted
- Date: 2026-01-02

## Context
ChronoLedger is cloud-first and the backend will be hosted as containerized services (API + background worker). We need:
- predictable latency for interactive use (web + mobile)
- a clean path to run background workers (PDF generation, scheduled jobs)
- strong control over networking (private DB) and scaling
- an approach that will scale to more users over time

Two primary AWS options were considered for managed containers:
- App Runner (higher abstraction)
- ECS on Fargate (more control)

## Decision
Use **ECS on Fargate** to run:
- the **API service** (stateless containers behind a load balancer)
- the **Worker service** (stateless containers consuming jobs from a queue)

## Consequences
- ✅ Strong control over networking (VPC, private subnets, security groups)
- ✅ Straightforward worker pattern (separate ECS service)
- ✅ Predictable runtime characteristics (no cold starts)
- ✅ Easier to tune scaling and resource limits
- ⚠️ Slightly more infrastructure complexity than App Runner
- ⚠️ Requires container build/publish workflow (ECR) and service deployments

## Alternatives Considered
- App Runner: rejected for reduced control and flexibility as the app grows (multi-tenant patterns, complex networking, worker topology).
