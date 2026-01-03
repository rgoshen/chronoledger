# ADR-0025: API Ingress Topology (ALB → ECS Fargate)

- Status: Accepted
- Date: 2026-01-02

## Context
ChronoLedger runs the API as a containerized service on ECS/Fargate with separate hostnames (`api.<domain>`). We need a secure, maintainable ingress that supports:
- TLS termination with managed certificates
- Path-based routing (future admin API separation is still under `/api/v1/admin`)
- Standard HTTP features (timeouts, health checks)
- Integration with WAF and logging
- Straightforward operations and debugging

## Decision
Use an **Application Load Balancer (ALB)** in front of the **ECS/Fargate API service**:

- `api.<domain>` → Route53 alias → ALB (HTTPS :443)
- ALB forwards to an ECS target group (Fargate tasks) on the container port
- ALB health checks hit `/health` (or equivalent) on the API service
- Attach AWS WAF to the ALB (see ADR-0027)

We will **not** place API Gateway in front of ECS in v1.

## Consequences
- ✅ Simplest, most “native” ECS ingress pattern
- ✅ Works cleanly with WAF, TLS (ACM), access logs, and target health
- ✅ Avoids API Gateway + VPC Link complexity and cost
- ✅ Easy to debug with standard ALB tooling/metrics
- ⚠️ Less built-in request shaping than API Gateway (rate limiting handled by WAF/app)
- ⚠️ If we later need edge caching for API, we may add CloudFront in front of ALB (not needed now)

## Alternatives Considered
- API Gateway (HTTP API) + VPC Link to ALB/NLB: rejected due to added complexity and limited benefit for this use case.
- CloudFront in front of the API immediately: deferred; API responses are largely user-specific and should not be cached at the edge by default.
