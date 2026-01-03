# ChronoLedger — Session Summary & Pre‑Coding Roadmap

_Last updated: 2026-01-02_

This document summarizes what we accomplished so far (requirements + architecture decisions) and provides a **complete roadmap of what remains to do before writing feature code**, so you can resume later without context loss.

---

## 1) What we accomplished

### 1.1 Product scope and requirements (high level)
We defined ChronoLedger as a personal (initially) time-clock style system that later scales to additional users with tenant configurability. Core behaviors and constraints:

- Track work time like a time clock (start/stop entries).
- Store **raw timestamps and raw hours only**; rounding is computed, not stored.
- **UTC in DB** for all timestamps; display is computed (device TZ by default, with override).
- **Timezone override persistence:** per-user **per-device**.
- **Cross-midnight entries:** auto-split into daily segments; store UTC; retain capture timezone.
- **Overlap blocking:** prevent any overlapping entries; only one open entry at a time.
- **Lock/unlock workflow:** once complete, entries are locked; unlock requires **admin approval** every time.
- **Auditability:** audit tables in DB (separate domain tables) for time entry changes, unlock requests, and admin actions (admin-visible only).
- **PDF export required:** official exports only (consistent, server-generated).
- **Pay rates:** rate history supported; changes effective only on the **1st of the month**.
- **ATO rules:**
  - restricted to **Mon–Fri only**
  - **8 hours/day cap**
  - **≤ 40 hours per 5‑day work week**
  - holidays are normal days but flagged for visibility
- **Admin panel:** separate area `/admin` with stricter permissions and navigation.
- **Login:** Auth0 (industry standard flows); account auto-link by verified email.

### 1.2 “Cloud-first” and platform decisions
You decided to keep it cloud-first for multi-device sync, with a web app + mobile apps:
- Web usable on your work computer
- Mobile iOS + Android support

---

## 2) Key architecture decisions we locked (ADRs)

All ADRs listed below are **Accepted**.

### 2.1 Foundational platform and hosting
- Cloud-first AWS architecture
- Containerized services on **ECS/Fargate**
- API ingress via **ALB → ECS**
- Static web hosted via **S3 + CloudFront**
- Async jobs via **SQS** + Worker service
- Official exports stored in **S3** (with lifecycle)

### 2.2 Tech stack and tooling
- **TypeScript-first** system
  - Web: React + TypeScript
  - Mobile: React Native + TypeScript
  - API: Node + TypeScript (NestJS recommended)
  - Worker: Node + TypeScript (Playwright/Chromium for PDFs)
- Database: **PostgreSQL** (3NF) on RDS
- Migrations + typed access: **Prisma**

### 2.3 Security, auth, and admin controls
- Auth: **Auth0** (OIDC/OAuth2), PKCE flows
- Admin: separate UI `/admin` and API routes under `/api/v1/admin`
- Admin MFA recommended and accepted
- Attach **AWS WAF** to API ALB
- Secrets in **AWS Secrets Manager**
- TLS everywhere (CloudFront + ALB with ACM)

### 2.4 Multi-device and preference handling
- Separate hostnames: `app.<domain>` and `api.<domain>`
- Require `X-Device-Id` on authenticated requests
- Account linking behavior: social login with verified email auto-links to existing account with same verified email
- Store all times in UTC; display is per device tz or user/device override

### 2.5 Data integrity, locking, and audit
- **Soft deletes** for time entries (default)
- Domain audit tables (separate tables per domain):
  - `audit_time_entry`
  - `audit_unlock_request`
  - `audit_admin_action`
- Domain invariants + state machines defined:
  - time entry lifecycle (open → complete → lock → unlock request → unlock/deny → relock)
- Concurrency + idempotency strategy:
  - DB constraints for overlap + one open entry
  - ETags / If-Match for optimistic concurrency
  - `Idempotency-Key` for side-effecting POSTs
  - Transaction boundaries include domain change + audit row

### 2.6 API conventions and operability
- REST conventions and monorepo layout ADRs
- Standard error contract: **RFC 7807 Problem+JSON**
- Observability baseline:
  - structured JSON logs
  - correlation IDs (`X-Request-Id`)
  - CloudWatch alarms/retention
- Data retention & purging policy (soft delete retention + S3 lifecycle)
- CI/CD: GitHub Actions → ECR → ECS with migration gate; web deploy to S3 + CloudFront invalidation
- IaC: OpenTofu/Terraform-compatible modules + per-environment stacks

---

## 3) Documents produced (where to find them)

### 3.1 ADR source of truth
- **ADR directory (authoritative):** `sandbox:/mnt/data/adr/`
- **ADR Index:** `sandbox:/mnt/data/adr/README.md`

### 3.2 Supporting project docs (non-ADR)
These live at the top level (downloads previously provided), including:
- API design notes
- Multitenancy notes
- PDF rendering notes
- Observability notes
- CI/CD notes
- DB migrations notes
- Risk/decision log

---

## 4) Roadmap: what remains **before** starting feature coding

This is the “pre-coding checklist” that gets us to a clean, low-risk starting line. Once completed, we begin repo scaffolding and then features.

### 4.1 Requirements consolidation (single source of truth)
**Goal:** ensure the requirements doc + backlog + ADRs are aligned with no contradictions.

- Merge any outstanding requirement updates into one canonical requirements doc.
- Ensure each requirement is traceable to:
  - a backlog item (implementation work)
  - and/or an ADR decision
- Confirm report list (PDF exports) and “official output” definitions are explicit and testable.

**Deliverables**
- Updated `chronoledger-requirements.md` (finalized)
- Backlog cross-reference section (“Req → Backlog → ADR”)

### 4.2 Define the report/export catalog (PDFs)
**Goal:** define every “official export” and its required layout/content.

- List each export type:
  - Pay period summary
  - Weekly summary
  - ATO usage visibility
  - Audit report (admin)
  - Unlock request history (admin)
- For each report:
  - exact data fields
  - grouping and sorting rules
  - required headers/footers
  - timezone display rules
  - template versioning strategy
- Decide “golden test fixtures” for each.

**Deliverables**
- `reports-catalog.md` (or equivalent)
- Sample data fixtures for PDF golden tests (documented)

### 4.3 Data model blueprint (tables + constraints + indexes)
**Goal:** convert our rules into a concrete schema plan before we touch Prisma.

- Define tables and relationships:
  - tenants, users, memberships
  - time_entry (+ soft delete)
  - time_code, pay_rate (effective dating)
  - unlock_request
  - export_job
  - audit tables (3 separate domain audit tables)
  - per-user-per-device preferences (timezone override)
  - idempotency table
- Specify constraints:
  - overlap prevention (exclusion constraint)
  - unique “one open entry” partial index
  - FK constraints + unique constraints for tenant scoping
- Specify indexes for known query paths:
  - time entry listing by pay period/day
  - admin audit listings
  - exports listing

**Deliverables**
- `db-schema-blueprint.md` (or ERD + notes)
- “Constraint list” section that maps to ADR-0031

### 4.4 API surface definition (OpenAPI-first outline)
**Goal:** define endpoints and DTOs up-front (even if code generates the final OpenAPI later).

- Define resources + routes:
  - time entries: start/stop, list, details, lock, unlock request, delete (soft)
  - admin: approve/deny unlock, audit queries, user management basics
  - exports: create job, job status, download link
  - preferences: per-device timezone override
- Define auth rules per route:
  - USER vs ADMIN access
- Define error codes (`code` values) for Problem+JSON:
  - overlap, locked, validation, concurrency, not found, forbidden, etc.
- Define idempotency requirements per endpoint.

**Deliverables**
- `openapi-outline.md` (or initial OpenAPI YAML stub)
- Error code catalog doc

### 4.5 UX flows and wireframes (minimum viable clarity)
**Goal:** avoid building UI blind; we only need enough to prevent rework.

- Web (user):
  - “time clock” start/stop
  - daily/weekly views
  - lock button
  - timezone selector (device default + override)
- Web (admin):
  - unlock request queue
  - audit views
- Mobile:
  - same core time clock flow + quick status view
  - secure storage + device ID handling notes

**Deliverables**
- `ux-flows.md` + simple wireframes (even rough)

### 4.6 Local dev workflow definition (ready-to-run plan)
**Goal:** define the exact local setup so the repo scaffolding is straightforward.

- Docker Compose services:
  - postgres
  - api
  - worker
- Seed strategy:
  - seed tenant + admin membership mapping
  - baseline time codes and pay rate history
- Auth0 dev setup:
  - dev application settings
  - callback URLs
  - local dev domain/origin plan

**Deliverables**
- `local-dev-plan.md` (commands + env vars + seed plan)

### 4.7 CI/CD + IaC “first apply” plan
**Goal:** we shouldn’t write code until we know how it will ship.

- Define initial AWS dev environment resources and minimal sizing:
  - VPC, ECS cluster, ALB, RDS, S3 buckets, SQS, Secrets, CloudWatch
- Define IaC module boundaries and naming conventions
- Define GitHub environment protections (dev/staging/prod) and which branches deploy where
- Define migration gate command and how it runs (one-off ECS task)

**Deliverables**
- `infra-first-apply-plan.md` (step-by-step)
- `ci-cd-first-pipeline-plan.md` (workflow steps)

### 4.8 Testing harness plan (tooling + fixtures)
**Goal:** decide the testing stack now so code is shaped correctly.

- Unit tests: time rules, split logic, rate selection
- Integration tests: DB constraints + audit + lock/unlock flows
- Contract tests: OpenAPI validation
- PDF golden tests: deterministic templates, pinned Chromium/fonts
- Decide test tooling (Jest/Vitest, Testcontainers, Playwright, etc.)

**Deliverables**
- `testing-plan-implementation.md` (tool choices + fixtures)

---

## 5) “Ready to code” gate (checklist)

When the items below are checked, we start repo scaffolding (then feature work).

- [ ] Requirements doc finalized and cross-referenced to backlog
- [ ] PDF report catalog defined (fields + layout rules)
- [ ] DB schema blueprint complete (tables + constraints + indexes)
- [ ] API surface outline complete (routes + DTOs + error codes + idempotency)
- [ ] UX flows/wireframes captured (web + mobile + admin)
- [ ] Local dev plan documented (compose + seeds + Auth0 dev config)
- [ ] Infra first-apply plan documented (dev env)
- [ ] CI/CD first pipeline plan documented (including migration gate)
- [ ] Testing harness/tooling chosen and fixtures planned

---
## 5.1 Roadmap after coding starts: P1 and P2 ADRs (so we don’t forget)

These are not required to begin repo scaffolding, but we should decide them soon after the initial build is underway.

### P1 ADRs (soon after initial build starts)
1) **Offline + sync policy for mobile**
   - Decide online-only vs offline-first
   - Define conflict resolution (last-write-wins, merge-by-field, etc.)
   - Define background sync cadence and triggers

2) **Reporting/query strategy**
   - Decide: views vs materialized views vs raw SQL modules
   - Define performance posture for reports (indexes, pagination, caching rules)

3) **Export formats beyond PDF**
   - Decide whether to add CSV exports (scope and permissions)
   - Define “official vs non-official” rules if multiple formats exist
   - Update retention impact (CSV storage/lifecycle)

### P2 ADRs (later, when it matters)
4) **Mobile release strategy**
   - Store pipelines (iOS/Android), signing, versioning approach
   - Decide on OTA updates (if desired)

5) **Advanced tracing**
   - Decide OpenTelemetry adoption timing
   - Define sampling and privacy rules

---

## 6) When you resume later (suggested next command)
“Open the latest ChronoLedger session summary and then start with Section 4.1 Requirements consolidation; propose the concrete documents and stubs we need to create, in order, without starting repo scaffolding yet.”

