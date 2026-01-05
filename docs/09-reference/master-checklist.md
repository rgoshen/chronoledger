# ChronoLedger — Master Checklist (with Progress)

_Last updated: 2026-01-02_

This is the end-to-end checklist for the project lifecycle so far, with items already completed **checked**.

---

## 1) Product definition & requirements

- [x] Capture initial product vision and scope (time-clock style tracking)
- [x] Confirm work-week assumptions (Mon–Fri typical; weekends allowed for work hours)
- [x] Decide raw data policy (store raw times/hours only; rounding is computed)
- [x] Require PDF export (official exports)
- [x] Define time entry locking + unlock workflow (admin approval gate every time)
- [x] Require login + admin panel (separate admin area)
- [x] Define ATO constraints
  - [x] ATO restricted to Mon–Fri
  - [x] ATO per-day cap 8 hours
  - [x] ATO weekly cap ≤ 40 hours per 5-day work week
  - [x] Holidays are normal days but flagged for visibility
- [x] Define overlap blocking (no overlapping entries; one open entry per user)
- [x] Define cross-midnight behavior (auto-split; store UTC)
- [x] Define timezone handling
  - [x] Store all times in UTC
  - [x] Default display in current device timezone
  - [x] User can specify an override timezone
  - [x] Timezone override persistence: per user **per device**
- [x] Define audit logging requirements (DB tables; admin-visible only)
  - [x] Separate domain audit tables: audit_time_entry, audit_unlock_request, audit_admin_action
- [x] Define pay rate history rules (effective 1st of month)
- [x] Decide account linking behavior (auto-link by verified email across social providers)
- [x] Produce requirements as downloadable markdown (canonical requirements doc exists)

---

## 2) Architecture Decision Records (ADRs)

### 2.1 Governance
- [x] Establish ADR process and index (`adr/README.md`)
- [x] Decide REST API conventions (ADR-0015)
- [x] Decide monorepo layout (ADR-0016)

### 2.2 Platform, hosting, and infrastructure
- [x] Cloud-first direction (multi-device sync; future SaaS readiness)
- [x] Containerized hosting shape (ECS/Fargate)
- [x] Auth provider: Auth0
- [x] API ingress: ALB → ECS (ADR-0025)
- [x] Web hosting: S3 + CloudFront (covered in earlier stack decisions)
- [x] Async jobs: SQS + Worker (covered in earlier design docs)
- [x] PDF rendering: HTML templates → headless Chromium (ADR-0018)
- [x] Data retention + purging + S3 lifecycle (ADR-0019)
- [x] Observability baseline (structured logs + correlation IDs + CloudWatch) (ADR-0020)
- [x] CI/CD pipeline (GitHub Actions → ECR → ECS + migration gate; web deploy) (ADR-0021)
- [x] IaC tool + env stacks (OpenTofu/Terraform) (ADR-0023)

### 2.3 Tech stack and data
- [x] TypeScript-first stack (ADR-0022)
  - [x] Web: React + TS
  - [x] Mobile: React Native + TS
  - [x] API: Node + TS (NestJS recommended)
  - [x] Worker: Node + TS
- [x] Database: PostgreSQL (3NF)
- [x] Migrations + typed access: Prisma (ADR-0024)

### 2.4 Security, caching, and operability
- [x] Security baseline (Auth0 PKCE, WAF, TLS, Secrets Manager, hardening) (ADR-0027)
- [x] Caching strategy (CloudFront for web; no edge cache for API; ETags where safe) (ADR-0026)

### 2.5 Domain correctness (P0 ADRs)
- [x] Domain invariants + state machines (ADR-0028)
- [x] Authorization model + Auth0 claim mapping + admin MFA (ADR-0029)
- [x] API error contract (RFC 7807 Problem+JSON) (ADR-0030)
- [x] Concurrency + idempotency (DB constraints + ETags + Idempotency-Key) (ADR-0031)
- [x] Local dev + environment strategy (docker compose + AWS dev env; optional emulation) (ADR-0032)
- [x] Testing strategy (unit/integration/contract + PDF golden tests) (ADR-0033)

### 2.6 P1 ADRs (soon after initial build starts)
- [ ] Offline + sync policy for mobile
  - [ ] Decide online-only vs offline-first
  - [ ] Define conflict resolution strategy
  - [ ] Define background sync cadence and triggers
- [ ] Reporting/query strategy
  - [ ] Decide: views vs materialized views vs raw SQL modules
  - [ ] Define performance posture for reports (indexes, pagination, caching rules)
- [ ] Export formats beyond PDF
  - [ ] Decide whether to add CSV exports (and scope)
  - [ ] Define “official vs non-official” output rules if multiple formats exist
  - [ ] Update retention implications (CSV storage/lifecycle)

### 2.7 P2 ADRs (later, when it matters)
- [ ] Mobile release strategy
  - [ ] Define store pipelines (iOS/Android)
  - [ ] Define versioning approach
  - [ ] Decide on OTA updates (if desired)
- [ ] Advanced tracing
  - [ ] Decide OpenTelemetry adoption timing
  - [ ] Define sampling and privacy rules

---

## 3) Supporting design docs (non-ADR)

- [x] Multi-tenancy notes (row-level tenancy) doc created
- [x] PDF rendering notes doc created
- [x] Observability notes doc created
- [x] CI/CD notes doc created
- [x] DB migrations notes doc created
- [x] Risk/decision log maintained and updated
- [x] Session summary + pre-coding roadmap doc created

---

## 4) Pre-coding checklist (must complete before repo scaffolding / feature coding)

### 4.1 Requirements consolidation (single source of truth)
- [ ] Consolidate/verify one canonical requirements doc (no contradictions)
- [ ] Create traceability mapping: Requirement → Backlog item → ADR references
- [ ] Explicitly define “official export” vs “non-official” outputs (if any)

### 4.2 PDF report/export catalog
- [ ] Enumerate every report type and required fields
- [ ] Define sorting/grouping/pagination rules per report
- [ ] Define footer/header rules (timezone, generated-at, template version)
- [ ] Define fixtures for PDF golden tests per template version

### 4.3 Database schema blueprint (before Prisma schema)
- [ ] Finalize table list and relationships
  - [ ] tenant, app_user, tenant_user
  - [ ] time_entry (soft delete)
  - [ ] unlock_request
  - [ ] export_job
  - [ ] time_code, pay_rate (effective dating)
  - [ ] holiday (visibility)
  - [ ] preferences (per user per device; timezone override)
  - [ ] idempotency table
  - [ ] audit_* tables (3 domain audit tables)
- [ ] Specify constraints and indexes (including exclusion constraint for overlaps)
- [ ] Decide whether to use views for reporting (or raw SQL modules), and where they live

### 4.4 API surface outline (OpenAPI-first)
- [ ] Define endpoints + DTOs (user + admin)
- [ ] Define authZ rules per route (USER vs ADMIN)
- [ ] Define stable Problem+JSON `code` catalog
- [ ] Define idempotency requirements per endpoint
- [ ] Define ETag/If-Match coverage (which resources require optimistic concurrency)

### 4.5 UX flows and wireframes (minimum clarity)
- [ ] Web user flows (time clock, daily/weekly, lock)
- [ ] Timezone selector UX (device default vs override)
- [ ] Admin flows (unlock queue, approve/deny, audit views)
- [ ] Mobile flows (time clock + quick status + secure storage behaviors)

### 4.6 Local dev plan (ready-to-run)
- [ ] Draft docker-compose architecture (api/worker/postgres)
- [ ] Define seed data strategy (tenant, admin, baseline time codes, pay rate history)
- [ ] Define Auth0 dev configuration (apps, callbacks, allowed origins)
- [ ] Decide AWS dev usage vs local emulation for each dependency (S3/SQS/secrets)

### 4.7 Infra first-apply plan (dev environment)
- [ ] Define module list and env variables for IaC
- [ ] Define minimal dev sizing defaults (RDS class, ECS task sizes, etc.)
- [ ] Define remote state bootstrap steps (S3 backend + Dynamo lock)
- [ ] Define log groups, alarms, WAF rules baseline (initial values)

### 4.8 CI/CD first pipeline plan
- [ ] Define GitHub environment strategy and branch mapping
- [ ] Define build/test steps per package
- [ ] Define migration gate mechanism (one-off ECS task command)
- [ ] Define web deployment and CloudFront invalidation approach
- [ ] Define rollback steps (ECS task def rollback + forward-only migration remediation)

### 4.9 Testing harness/tooling plan
- [ ] Decide test runners and frameworks (unit + integration + e2e)
- [ ] Decide integration test DB strategy (dockerized DB/Testcontainers)
- [ ] Define contract test approach (OpenAPI validation)
- [ ] Define PDF golden test harness (pinned Chromium + fonts)

---

## 5) Repo scaffolding (start here AFTER section 4 is complete)

- [ ] Create monorepo folder structure (apps/services/packages/infra)
- [ ] Bootstrap API service (NestJS skeleton)
- [ ] Bootstrap worker service (SQS consumer + PDF render placeholder)
- [ ] Bootstrap Prisma schema and migrations scaffold
- [ ] Add docker-compose for local run
- [ ] Add basic auth middleware + tenant resolution
- [ ] Add logging + request id middleware
- [ ] Add CI skeleton (lint/test/build)
- [ ] Add infra skeleton (OpenTofu modules + dev env)

---

## 6) Feature implementation (high-level order, after scaffolding)

- [ ] Time entry CRUD + start/stop flow (idempotency + overlap constraints)
- [ ] Cross-midnight split implementation
- [ ] Locking + unlock request workflow + admin approval
- [ ] Audit tables wiring (transactional)
- [ ] Preferences (per-user-per-device timezone override; X-Device-Id)
- [ ] ATO rules enforcement + weekly calculations (computed)
- [ ] Pay rate history + effective dating
- [ ] Reporting endpoints (computed results)
- [ ] Export jobs + worker PDF generation + S3 delivery
- [ ] Admin dashboards (unlock queue, audit views)
- [ ] Mobile app UI + syncing
- [ ] Hardening + performance tuning + alarms tuning

---

## 7) Launch readiness (later)

- [ ] Staging environment validation
- [ ] Backup/restore test for RDS
- [ ] Incident runbook and operational docs
- [ ] Pen-test style review (OWASP checks)
- [ ] Store release process (mobile)
