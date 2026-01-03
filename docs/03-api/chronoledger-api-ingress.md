# ChronoLedger — API Ingress (ALB)

_Last updated: 2026-01-02_

## Topology
```mermaid
flowchart LR
  U[User Devices] -->|HTTPS| DNS[Route53 api.<domain>]
  DNS --> ALB[ALB - TLS termination]
  ALB --> ECS[ECS Service: API (Fargate tasks)]
  ECS --> RDS[(RDS PostgreSQL)]
  ECS --> SM[Secrets Manager]
```

## Key settings (recommended)
- ALB listener: 443 (HTTPS) with ACM cert
- Redirect HTTP → HTTPS (optional; typically yes)
- Health check endpoint: `GET /health`
- Access logs: enabled (S3 bucket)
- Timeouts:
  - idle timeout tuned for API (e.g., 60s) — async work goes to worker via SQS
- Security groups:
  - ALB SG: allow 443 from internet
  - API SG: allow inbound only from ALB SG

## Notes
- Keep API stateless; rely on Auth0 tokens for auth.
- Do not place the API in public subnets; tasks run in private subnets behind the ALB.
