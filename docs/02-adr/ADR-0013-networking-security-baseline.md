# ADR-0013: Networking and Security Baseline (VPC, Private DB, Secrets Manager)

- Status: Accepted
- Date: 2026-01-02

## Context

ChronoLedger handles sensitive personal work-time and pay information. We require:

- private database access
- least privilege and strong separation of concerns
- secure secret storage and rotation potential
- safe web exposure for the API

## Decision

Adopt the following baseline:

- A dedicated **VPC** with public and private subnets
- **Public ALB** to route HTTPS traffic to the ECS API service
- ECS tasks in **private subnets**
- RDS PostgreSQL in **private subnets** (not publicly accessible)
- **Security Groups**:
  - ALB → API tasks (only required ports)
  - API/Worker → RDS (5432)
- **AWS Secrets Manager** for DB credentials and other secrets
- TLS termination at the ALB (cert via ACM)

## Consequences

- ✅ Database not exposed to the public internet
- ✅ Clear network boundaries and easier threat modeling
- ✅ Secret sprawl reduced; improved operational hygiene
- ⚠️ Slightly more setup effort than “all-public” prototypes
- ⚠️ Requires VPC-aware deployment configuration
