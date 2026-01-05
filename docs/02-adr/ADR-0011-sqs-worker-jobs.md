# ADR-0011: Background Job Processing via SQS + Worker Service

- Status: Accepted
- Date: 2026-01-02

## Context

ChronoLedger needs reliable background processing for:

- official PDF export generation
- potential scheduled jobs (ATO accrual processing, nightly rollups if we ever precompute)
- long-running tasks that should not block interactive requests

## Decision

Use **Amazon SQS** for background job queuing and an **ECS Worker service** to process jobs.

- API enqueues a job to SQS
- Worker consumes, performs work, writes results to Postgres/S3
- Job status persisted for user visibility (queued/running/succeeded/failed)

## Consequences

- ✅ Decouples heavy work from user-facing request latency
- ✅ Retries and dead-letter queue patterns available
- ✅ Easy to scale workers independently of API
- ⚠️ Requires idempotency in worker handlers
- ⚠️ Requires a job model and status tracking

## Alternatives Considered

- In-request processing: rejected due to PDF generation and long-running task risks.
- EventBridge-only: useful for schedules but not a full replacement for a reliable work queue.
