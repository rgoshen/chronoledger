# ChronoLedger

ChronoLedger is an auditable timekeeping and pay-period reporting platform with role-based administration and “official” export outputs. This repository houses the complete system—applications, services, infrastructure, and documentation.

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

```
docs/               # requirements, ADRs, API notes, UX flows, report catalog, plans
apps/               # web, mobile, api, worker
packages/           # shared libraries (types, validation, config, utilities)
infra/              # infrastructure-as-code (environments, modules, deploy tooling)
.github/            # workflows and repo automation
```

## Getting started

> This project may begin docs-first while architecture and contracts are finalized. As runtime components land, this section will be updated with a fully runnable local setup.

### Prerequisites

- Git
- Docker Desktop (recommended for local infrastructure)
- Node.js and a package manager (when apps are added)
- A Postgres client (optional)

### Quickstart (local)

When implemented, local startup will follow the pattern below:

```bash
# 1) clone
# 2) configure env (copy example files)
# 3) start dependencies
# 4) run migrations + seed
# 5) start services
```

If you don’t see runnable services yet, start here:

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

- Feature branches from `main`
- Keep changes small and reviewable
- Use ADRs for meaningful architecture decisions

### Code standards

- Prefer explicit domain rules and invariants
- Avoid “rules only in the UI”
- Keep shared code in `packages/` rather than copy/paste

## Testing

ChronoLedger is designed to be testable at multiple levels:

- **Unit tests:** domain rules (time calculations, pay-period rollups)
- **Integration tests:** database constraints, audit events, lock/unlock flows
- **Contract tests:** API request/response compatibility
- **Export tests:** PDF fixtures (“golden” outputs) with deterministic rendering

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

## Documentation and ADRs

Documentation lives under `docs/`.

Recommended reading order:

1. `docs/00-roadmap/` — current plan and milestones
2. `docs/01-requirements/` — functional requirements
3. `docs/02-adr/` — decisions and rationale
4. `docs/03-api/` and `docs/04-data/` — API and schema blueprints

## Contributing

- See [`CONTRIBUTING.md`](CONTRIBUTING.md) for contribution standards
- See [`AGENTS.md`](AGENTS.md) for AI + developer operating rules
- Open an issue or discussion for significant changes
- Add/update tests for logic affecting correctness, audits, or exports
- Use ADRs for decisions that change architecture, data constraints, security, or export semantics

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
