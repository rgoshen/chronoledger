# Requirements Traceability

**Purpose:** Provide a minimal, auditable mapping from requirements → ADRs → backlog work items.

**Status:** Draft
**Last reviewed:** YYYY-MM-DD

## Conventions

- Requirement IDs use `REQ-####`.
- Backlog work items use `BL-####` until replaced by GitHub Issue links.
- ADRs link to files under `../02-adr/`.

## Traceability table

| Requirement ID | Requirement (summary) | ADRs | Backlog item(s) | Notes |
| --- | --- | --- | --- | --- |
| REQ-0001 | Multi-tenant boundary and membership model | [ADR-0017](../02-adr/ADR-0017-multitenancy-row-level.md), [ADR-0006](../02-adr/ADR-0006-auto-link-by-verified-email.md) | BL-0001 | confirm tenant selection UX |
| REQ-0002 | Time entry CRUD with correctness invariants | [ADR-0004](../02-adr/ADR-0004-time-and-timezone-strategy.md), [ADR-0028](../02-adr/ADR-0028-domain-invariants-state-machines.md) | BL-0002 | overlap + open-entry policies |
| REQ-0003 | Prevent overlapping time entries (DB enforced) | [ADR-0002](../02-adr/ADR-0002-postgresql-3nf.md), [ADR-0024](../02-adr/ADR-0024-prisma-migrations.md) | BL-0003 | exclusion constraint + raw SQL |
| REQ-0004 | Pay period summaries (PP1/PP2) | [ADR-0004](../02-adr/ADR-0004-time-and-timezone-strategy.md) | BL-0004 | PP rules are a core domain invariant |
| REQ-0005 | Official PDF exports | [ADR-0012](../02-adr/ADR-0012-pdf-export-pipeline.md), [ADR-0018](../02-adr/ADR-0018-pdf-rendering-html-chromium.md) | BL-0005 | use reports catalog as contract |
| REQ-0006 | API conventions and error contract | [ADR-0015](../02-adr/ADR-0015-rest-api-conventions.md), [ADR-0030](../02-adr/ADR-0030-api-error-contract-problem-json.md) | BL-0006 | keep OpenAPI aligned |
| REQ-0007 | Concurrency safety + idempotency for writes | [ADR-0031](../02-adr/ADR-0031-concurrency-idempotency.md) | BL-0007 | Idempotency-Key header |
| REQ-0008 | Security baseline for the platform | [ADR-0013](../02-adr/ADR-0013-networking-security-baseline.md), [ADR-0027](../02-adr/ADR-0027-security-baseline.md) | BL-0008 | secrets + least privilege |
| REQ-0009 | Observability baseline (logs/metrics/tracing) | [ADR-0020](../02-adr/ADR-0020-observability-baseline.md) | BL-0009 | start with logs + metrics |
| REQ-0010 | Local development environment is reproducible | [ADR-0032](../02-adr/ADR-0032-local-dev-env-strategy.md) | BL-0010 | dev bootstrap scripts |
| REQ-0011 | Testing strategy supports domain + exports | [ADR-0033](../02-adr/ADR-0033-testing-strategy.md) | BL-0011 | golden PDF fixtures |

## How to maintain

- When a requirement changes, update this table in the same PR.
- Replace `BL-####` placeholders with GitHub Issue links once issues exist.
- If an ADR is superseded, update the link to the latest ADR and note it.

## Recommended next step

Convert backlog placeholders to GitHub issues and update this table to reference those issues.
