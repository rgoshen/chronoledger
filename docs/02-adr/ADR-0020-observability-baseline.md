# ADR-0020: Observability Baseline (Structured Logs, Correlation IDs, CloudWatch)

- Status: Accepted
- Date: 2026-01-02

## Context
ChronoLedger runs on ECS/Fargate (API + worker), uses RDS PostgreSQL, processes async jobs via SQS, and must support admin audit visibility. Operational needs include:
- Diagnosing issues quickly (PDF jobs failing, overlap validation problems, auth/permission errors)
- Correlating client requests to server actions (including background work)
- Monitoring cost and performance trends as usage grows

## Decision
Implement a pragmatic observability baseline:

### 1) Structured JSON logs
All services emit JSON logs including:
- `timestamp`, `level`, `service`, `env`
- `request_id` (API) / `job_id` (worker)
- `trace_id` (reserved for future tracing)
- `tenant_id`, `user_id` (when known), `device_id` (from `X-Device-Id`)
- `route`, `status_code`, `duration_ms` (API)
- `job_type`, `attempt`, `result` (worker)

### 2) Correlation IDs
- API generates `X-Request-Id` (UUID) if not provided.
- API returns `X-Request-Id` in every response.
- When enqueuing SQS jobs, API includes `request_id` in the job payload and persists it in `export_job`.
- Worker logs include both `job_id` and originating `request_id` when available.

### 3) CloudWatch integration
- ECS logs shipped to **CloudWatch Logs**.
- Set log retention to **90 days** (per ADR-0019).
- Create baseline alarms:
  - API 5xx rate
  - Worker job failure rate
  - Queue depth age/lag
  - RDS CPU/storage thresholds

### 4) Metrics
- Use built-in metrics where possible (ALB/ECS/SQS/RDS).
- Add small set of custom metrics:
  - `exports.jobs_succeeded`
  - `exports.jobs_failed`
  - `time_entries.overlap_rejections`
  - `unlock_requests.created`

### 5) Tracing (deferred)
Adopt OpenTelemetry and distributed traces later if/when the baseline is insufficient.

## Consequences
- ✅ Fast debugging with low implementation overhead
- ✅ Clear linkage from UI request → API action → worker job
- ✅ Monitoring and alerting support for reliability
- ⚠️ Without tracing, deep latency profiling is limited (acceptable for v1)
- ⚠️ Logs must be scrubbed to avoid leaking sensitive values

## Alternatives Considered
- Full distributed tracing from day one: deferred to reduce complexity.
- Third-party APM immediately: deferred; can be added later without breaking the architecture.
