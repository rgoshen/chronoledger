# ChronoLedger

ChronoLedger is an auditable timekeeping and pay-period reporting system designed for correctness, traceability, and reproducible “official” exports.

This repository contains the full system—applications, services, infrastructure, and documentation.

## Table of contents

- [ChronoLedger](#chronoledger)
  - [Table of contents](#table-of-contents)
  - [Overview](#overview)
  - [Key features](#key-features)
  - [Architecture](#architecture)
  - [Repository structure](#repository-structure)
  - [Getting started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Quickstart (local)](#quickstart-local)
  - [Configuration](#configuration)
  - [Development workflow](#development-workflow)
    - [Branching](#branching)
    - [Code standards](#code-standards)
  - [Testing](#testing)
  - [Deployments](#deployments)
  - [Security](#security)
  - [Documentation and ADRs](#documentation-and-adrs)
  - [Contributing](#contributing)
  - [License](#license)

## Overview

ChronoLedger focuses on correctness, traceability, and reproducible outputs:

- **Correctness:** time-entry rules are enforced beyond the UI (data + API).
- **Auditability:** important actions are attributable (who/what/when/why).
- **Official exports:** PDF-first outputs are versioned and testable.

## Key features

- Time entry capture with integrity rules (e.g., overlap prevention, clear open-interval behavior)
- Pay-period summaries (PP1: 1–15, PP2: 16–end of month) with totals and category breakdowns
- Admin workflows (lock/unlock, approvals, audit views)
- Export pipeline for “official” PDFs (additional formats may be added later)

## Architecture

The system is designed around a single source-of-truth database and a small set of clients and services.

```mermaid
flowchart LR
  Web[Web App] --> API[API Service]
  Mobile[Mobile App] --> API
  API --> DB[(Postgres)]
  API --> Q[(Jobs/Queue)]
  Worker[Worker Service] --> DB
  Worker --> S[(Object Storage)]
  API --> S
```

Notes:

- The exact technology choices and constraints are recorded in ADRs under `docs/02-adr/`.
- Some database rules (e.g., exclusion constraints) may require raw migrations even when using an ORM.

## Repository structure

```bash
docs/                   # project documentation (start at docs/README.md)
apps/
  api/                  # API service
  worker/               # export worker (PDF rendering, async jobs)
  web/                  # web client (when added)
  mobile/               # mobile client (when added)
packages/
  shared/               # shared types and utilities
infra/
  local/                # local dev infrastructure (docker compose, bootstrap)
  cloud/                # cloud infrastructure (later)
scripts/                # repo scripts (bootstrap, lint, CI helpers)
.github/
  workflows/            # CI workflows
```

## Getting started

> ChronoLedger is being built docs-first: contracts (ADRs, OpenAPI, schema, export specs) and local-dev standards are established before feature coding.
> The canonical local development workflow lives in `docs/07-infra/local-dev-plan.md`.

### Prerequisites

- Git
- Docker Desktop (recommended for local infrastructure)
- Node.js (LTS) + a package manager (pnpm recommended)
- A Postgres client (optional)

### Quickstart (local)

Use the local dev plan as the source of truth:

- `docs/07-infra/local-dev-plan.md`

If you don’t see runnable services yet, start here:

- `docs/README.md` (documentation index)
- `docs/00-roadmap/` for the current build plan
- `docs/01-requirements/` for functional requirements
- `docs/02-adr/` for architecture decisions

## Configuration

Environment variables and configuration files will live alongside each app/service.

Typical categories:

- Database connection
- Authentication provider settings
- Object storage + job/queue settings
- Export rendering settings (fonts/templates)

Expected conventions (to be enforced):

- Example files: `.env.example` (never commit real secrets)
- Local overrides: `.env.local` (gitignored)
- Secrets: provided via the target deployment platform

## Development workflow

### Branching

- Prefer short-lived feature branches
- Use PRs for review
- Capture architectural changes with ADRs

### Code standards

- Prefer small, composable modules
- Prefer explicit domain rules and invariants
- Avoid “rules only in the UI”
- Keep shared code in `packages/` rather than copy/paste

## Testing

ChronoLedger is designed to be testable at multiple levels:

- **Unit tests:** domain rules (time calculations, pay-period rollups)
- **Integration tests:** database constraints, audit events, lock/unlock flows
- **Contract tests:** API request/response compatibility
- **Export tests:** PDF fixtures (“golden” outputs) with deterministic rendering

See:
- `docs/08-testing/testing-plan.md`
- `docs/06-reports/pdf-testing.md`

As components are added, this section will link to exact commands.

## Deployments

Deployment strategy and environment setup are tracked under `infra/` and `docs/07-infra/`.

Typical environments:

- `dev` (fast iteration)
- `staging` (pre-release verification)
- `prod` (controlled releases)

## Security

Baseline expectations:

- Least-privilege access (services, users, and admins)
- Audit logs for privileged actions
- Secure secret management (no secrets in git)
- Dependency scanning and CI checks

Security decisions and threat considerations should be captured via ADRs.

See: `docs/02-adr/ADR-0027-security-baseline.md`

## Documentation and ADRs

Documentation lives under `docs/`. Start here:

- `docs/README.md` (documentation index)

Recommended reading order:

1. `docs/00-roadmap/` — current plan and milestones
2. `docs/01-requirements/` — functional requirements
3. `docs/02-adr/` — decisions and rationale (see `docs/02-adr/ADR-INDEX.md`)
4. `docs/03-api/` and `docs/04-data/` — API and schema blueprints
5. `docs/06-reports/` — reports/exports contracts and determinism testing
6. `docs/07-infra/` and `docs/08-testing/` — local dev and testing plans

Key contracts (direct links):

- API contract: `docs/03-api/openapi.yaml`
- Schema blueprint: `docs/04-data/schema-blueprint.md`
- Requirements traceability: `docs/01-requirements/traceability-req-adr-backlog.md`
- Reports catalog: `docs/06-reports/reports-catalog.md`

## Contributing

- Open an issue or discussion for significant changes
- Add/update tests for logic affecting correctness, audits, or exports
- Use ADRs for decisions that change architecture, data constraints, security, or export semantics

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

