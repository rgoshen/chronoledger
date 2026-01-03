# ChronoLedger

ChronoLedger is an auditable timekeeping and pay-period reporting platform with role-based administration and “official” export outputs. This repository contains the complete project: applications, services, infrastructure, and supporting documentation.

## What ChronoLedger does

- **Time entry tracking** with rules that prevent common data integrity issues (for example, overlaps and ambiguous open intervals)
- **Pay-period reporting** (PP1: 1–15, PP2: 16–end of month) for totals, category breakdowns, and rollups
- **Administrative workflows** such as lock/unlock, approvals, and an auditable record of changes
- **Official exports** (PDF-first) designed to be consistent, traceable, and reproducible

## Design goals

- **Correctness first**: enforce rules in the data layer and API, not only in the UI.
- **Auditability by default**: important actions are traceable with who/what/when.
- **Stable outputs**: exports are versioned and testable (fixtures + deterministic rendering).
- **Pragmatic scalability**: keep the system simple until real usage requires more.

## High-level architecture

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

## Repository layout

The repository is organized so product code, infrastructure, and documentation can evolve together.

```
docs/               # requirements, ADRs, API notes, UX flows, report catalog, plans
apps/               # web, mobile, api, worker (added/expanded as implementation grows)
packages/           # shared libraries (types, validation, config, utilities)
infra/              # infrastructure-as-code (environments, modules, deploy tooling)
.github/            # workflows and repo automation
```

Key documentation:
- Roadmap and session notes: `docs/00-roadmap/`
- Requirements: `docs/01-requirements/`
- Architecture decisions (ADRs): `docs/02-adr/`

## Getting started

This section will be updated as the runtime components land (local dev, environment variables, seeding, and common workflows).

## Contributing

- Use ADRs for meaningful architectural decisions.
- Keep changes small, reviewable, and documented.
- Add tests and fixtures for logic that affects correctness, audits, or exports.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
