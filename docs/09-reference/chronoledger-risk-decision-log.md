# ChronoLedger — Risk & Decision Log

_Last updated: 2026-01-02_

## 1. Decisions (Confirmed)

| ID | Decision | Rationale |
|---|---|---|
| D-001 | Week boundary for rules is **Sunday–Saturday** | Matches your definition for start/end of week |
| D-002 | Typical work days are Mon–Fri; weekend work allowed | Reflects real working patterns |
| D-003 | Store timestamps in DB as **UTC** | Correctness across DST/TZ changes |
| D-004 | Cross-midnight entries auto-split | Prevents confusing negative durations and improves reporting |
| D-005 | Rounding is computed and **not stored** | Preserves raw truth; avoids drift |
| D-006 | Completed entries auto-lock; unlock requires **admin approval every time** | Strong integrity and traceability |
| D-007 | Audit logging is comprehensive and **admin-only** | Allows forensic “why did this change?” answers |
| D-008 | PDF export is required for **all reports** | Official exports requirement |
| D-009 | Pay rates have history; changes occur on **1st of month** | Simple effective-date rule; matches reality |
| D-010 | Admin panel is a distinct area at `/admin` with separate navigation | Clear separation of duties |
| D-011 | Auth includes email/password + social providers (Apple/Google/Facebook) | Required login methods |
| D-012 | Holidays are visibility-only (no auto-hours) | Matches desired behavior |

## 2. Open Decisions / Clarifying Questions

| ID | Question | Why it matters | Proposed default |
|---|---|---|---|
| Q-001 | ATO “5-day” enforcement: restrict ATO to **Mon–Fri only**? per-day cap (8h)? | Impacts validations and UI | Mon–Fri only + 8h/day cap |
| Q-002 | Overlap policy: block vs warn/allow? | Prevents double-counting; affects UX | Warn + allow override (configurable) |
| Q-003 | Time zone display preference (current TZ vs entry TZ vs user-selected) | Avoids “time looks wrong” confusion | Default to entry TZ, allow toggle |
| Q-004 | Audit retention policy | DB growth and compliance posture | Keep indefinitely (personal scale) |
| Q-005 | Social login linking rules (merge accounts, add password later) | Prevents account fragmentation | Allow linking multiple providers |

## 3. Risks & Mitigations

| Risk ID | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R-001 | DST and TZ edge cases create incorrect durations | High | Medium | Store UTC + TZ metadata; unit test DST boundaries; use proven time libs |
| R-002 | PDF generation inconsistency across platforms | Medium | Medium | Prefer server-side PDF generation; snapshot tests for layouts |
| R-003 | Complex reporting queries become slow | Medium | Medium | Choose DB suited for aggregations (Postgres); add indexes; cache heavy reports |
| R-004 | Audit log volume grows and becomes hard to search | Low | Medium | Add filters and pagination; consider archival if needed |
| R-005 | Social login provider setup friction (Apple especially) | Medium | Medium | Implement email/password first; add providers incrementally; document config steps |
| R-006 | Cross-midnight splitting complicates edit flows | Medium | Medium | Link split entries; treat as a group for edits/lock/unlock; audit as a unit |
| R-007 | Admin approval gate adds workflow overhead | Low | Low | Make approval UI fast; default admin notifications |

## 4. Next decisions to make (best order)
1) Finalize ATO day-level constraints (Q-001)
2) Pick database (Postgres vs DynamoDB) and API style (REST vs GraphQL)
3) Confirm time zone display strategy (Q-003)
4) Decide overlap policy strictness (Q-002)

| D-019 | Use **ECS on Fargate** for API + worker services | Predictable runtime + worker pattern |
| D-020 | Use **Amazon RDS PostgreSQL** as primary DB | Managed Postgres operations |
| D-021 | Use **SQS + worker** for background jobs | Decouple heavy tasks |
| D-022 | Host web via **S3 + CloudFront** | Fast and simple static hosting |
| D-023 | Store PDFs in **S3** and serve via **signed URLs** | Secure official exports |
| D-024 | Time entries use **soft deletes** by default | Auditability + recovery |
| D-025 | Use separate hostnames (`app.*` and `api.*`) | Clear boundaries + simpler ops |
| D-026 | Require `X-Device-Id` header for per-user-per-device settings | Device-specific preferences |
| D-025 | Use separate hostnames (`app.*` and `api.*`) | Clear boundaries + simpler ops |

## Pending Decisions
| D-027 | Adopt **row-level multi-tenancy** (`tenant_id` on domain tables) | SaaS-ready without redesign |
| D-028 | Render PDFs via **HTML templates + headless Chromium** (worker) | High-fidelity official exports |
| D-029 | Define data retention + purging policy (soft deletes, S3 lifecycle) | Cost control + auditability |
| D-030 | Observability baseline (JSON logs, correlation IDs, CloudWatch alarms) | Faster debugging |
| D-031 | CI/CD via GitHub Actions → ECR → ECS + migration gate + web deploy | Repeatable releases |
| D-032 | TypeScript-first stack (React web, React Native mobile, NestJS API, Node worker) | Velocity + shared types |
| D-033 | IaC with OpenTofu/Terraform modules + env stacks | Repeatable infra |
| D-034 | Use Prisma for typed DB access + migrations | TS-first velocity + consistency |
| D-035 | API ingress via ALB → ECS Fargate | Simplest ECS-native ingress |
| D-036 | Cache web via CloudFront; API no edge cache; use ETags where safe | Performance + safety |
| D-037 | Security baseline: Auth0 PKCE, WAF, TLS, Secrets Manager, hardening | Industry-standard posture |
| D-038 | Define domain invariants + state machines (time entry, unlock, ATO rules) | Consistency + correctness |
| D-039 | AuthZ model: tenant-scoped RBAC + Auth0 claim mapping + admin MFA | Secure admin boundaries |
| D-040 | API error contract: RFC7807 Problem+JSON with stable error codes | Consistent client handling |
| D-041 | Concurrency strategy: DB constraints + ETags + Idempotency-Key | Prevent races/duplicates |
| D-042 | Local dev strategy: docker compose + real AWS dev env (optional emulation) | Fast dev + low drift |
| D-043 | Testing strategy: unit/integration/contract + PDF golden tests | Regression safety |
