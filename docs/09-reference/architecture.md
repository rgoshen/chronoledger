# ChronoLedger — Architecture Overview

_Last updated: 2026-01-02_

This document describes the target cloud-first architecture for ChronoLedger, aligned with accepted ADRs.

## 1. High-Level Components

- **Web Client**: SPA hosted on S3 + CloudFront
- **Mobile Client**: iOS + Android app
- **API Service**: ECS/Fargate service behind a public ALB
- **Worker Service**: ECS/Fargate service processing background jobs
- **Queue**: SQS for background jobs (PDF, scheduled work)
- **Database**: RDS PostgreSQL (3NF core schema + domain audit tables)
- **Object Storage**: S3 for PDF exports (and optionally other artifacts)
- **Secrets**: AWS Secrets Manager
- **Observability**: CloudWatch logs/metrics (baseline)

## 2. Network Topology (Conceptual)

```mermaid
flowchart TB
  subgraph Internet
    U[User Browser]
    M[Mobile App]
  end

  CF[CloudFront]
  S3WEB[(S3 - Web Assets)]
  ALB[(Public ALB\nTLS Termination)]
  subgraph VPC
    subgraph Private Subnets
      API[ECS Service: API]
      W[ECS Service: Worker]
      RDS[(RDS PostgreSQL\nPrivate)]
    end
  end

  S3PDF[(S3 - PDF Exports)]
  SQS[(SQS Queue)]
  SM[Secrets Manager]

  U --> CF --> S3WEB
  U --> ALB
  M --> ALB

  ALB --> API
  API --> RDS
  API --> SM

  API --> SQS
  W --> SQS
  W --> RDS
  W --> S3PDF
  W --> SM
```

## 3. Primary Request Flows

### 3.1 Time Entry Create/Complete (simplified)

```mermaid
sequenceDiagram
  participant C as Client (Web/Mobile)
  participant A as API (ECS)
  participant D as Postgres (RDS)

  C->>A: POST /time-entries (start only)
  A->>D: INSERT time_entry (UTC + tz)
  A->>D: INSERT audit_time_entry (create)
  A-->>C: 201 Created (entry open)

  C->>A: PATCH /time-entries/ID (add end time)
  A->>A: Validate overlap (after split)
  A->>D: UPDATE time_entry (end_utc, duration_raw)
  A->>D: INSERT audit_time_entry (update before/after)
  A-->>C: 200 OK (entry locked)
```

### 3.2 Unlock Request + Admin Approval

```mermaid
sequenceDiagram
  participant U as User
  participant A as API
  participant D as Postgres
  participant X as Admin

  U->>A: POST /time-entries/ID/unlock-requests
  A->>D: INSERT unlock_request (pending)
  A->>D: INSERT audit_unlock_request (request)
  A-->>U: 202 Accepted

  X->>A: POST /admin/unlock-requests/REQUEST_ID/approve
  A->>D: UPDATE unlock_request (approved)
  A->>D: UPDATE time_entry (unlocked)
  A->>D: INSERT audit_unlock_request (approved)
  A->>D: INSERT audit_time_entry (status change)
  A-->>X: 200 OK
```

### 3.3 Official PDF Export

```mermaid
sequenceDiagram
  participant C as Client
  participant A as API
  participant Q as SQS
  participant W as Worker
  participant D as Postgres
  participant S as S3 (PDF)

  C->>A: POST /reports/TYPE/exports (filters)
  A->>D: INSERT export_job (queued)
  A->>Q: SendMessage(export_job_id)
  A-->>C: 202 Accepted (job queued)

  W->>Q: ReceiveMessage
  W->>D: SELECT report data + rules + tz display rules
  W->>W: Render PDF (server-side)
  W->>S: PUT pdf (bucket/prefix/export_job_id.pdf)
  W->>D: UPDATE export_job (succeeded, s3_key)

  C->>A: GET /exports/export_job_id
  A->>D: SELECT export_job
  A-->>C: 200 OK (status + signed URL when ready)
  C->>S: GET signed URL (download)
```

## 4. Data Model Notes (3NF + Audit)

- Core entities are normalized (3NF) for correctness.
- Reporting objects (views/materialized views) may be introduced later, but authoritative data remains normalized tables.
- Audit tables are domain-specific:
  - `audit_time_entry`
  - `audit_unlock_request`
  - `audit_admin_action`

## 5. Deployment Notes (baseline)

- Images built and pushed to **ECR**
- ECS services deploy new task revisions
- Web assets uploaded to S3 and CloudFront invalidated
- DB migrations run as a controlled step in the deploy pipeline

## 6. Future Growth Considerations

- Multi-tenant: introduce `tenant` + tenant-scoped configuration tables and enforce tenant boundaries in API.
- Scaling: add ECS autoscaling policies, RDS Multi-AZ, and read replicas if needed.
- Caching: introduce Redis (ElastiCache) only if proven necessary (reports, sessions, etc.).
