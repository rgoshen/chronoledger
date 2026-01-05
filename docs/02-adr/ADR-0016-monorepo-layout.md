# ADR-0016: Monorepo Layout with Shared Packages (Web + Mobile + API + Worker)

- Status: Accepted
- Date: 2026-01-02

## Context

ChronoLedger includes:

- Web client (SPA)
- Mobile client (iOS + Android)
- Backend API service
- Background worker service
- Shared domain logic needs (time parsing/validation utilities, DTOs/types)
- Infrastructure as Code and documentation (ADRs)

We want to keep development efficient for a small team (initially you) while keeping a clean path to scale.

## Decision

Use a **monorepo** with clear boundaries:

- `apps/web` for the web client
- `apps/mobile` for the mobile client
- `services/api` for the API
- `services/worker` for background jobs
- `packages/*` for shared libraries (types, time utilities, validation rules shared where safe)
- `infra/` for IaC (Terraform/OpenTofu) and deployment assets
- `docs/` for documentation (including ADRs)

Shared code is allowed, but the API remains the source of truth for validations and rule enforcement.

## Consequences

- ✅ One repo, consistent tooling, easier refactors
- ✅ Shared types/utilities reduce duplication across clients and services
- ✅ Clear place for infrastructure and ADR documentation
- ⚠️ Requires disciplined boundaries to avoid “everything depends on everything”
- ⚠️ CI can get more complex (need path-based builds/tests)

## Alternatives Considered

- Multi-repo: rejected for early-stage overhead and coordination complexity.
- Web-only: rejected because iOS/Android are required.

## Notes/Links

- See: `chronoledger-repo-layout.md` for a concrete directory tree and CI suggestions.
