# ADR Supporting Documents Map

**Purpose:** Provide a quick, maintainable map from supporting reference documents to the ADRs they support.

**Status:** Draft
**Last reviewed:** YYYY-MM-DD

## Conventions

- Supporting docs live in this folder (`docs/09-reference/`).
- ADRs live in `docs/02-adr/`.
- Keep this file small and practical: it is a navigation aid, not a spec.

## Map

| Supporting doc | Related ADR(s) | Notes |
| --- | --- | --- |
| `chronoledger-architecture.md` | ADR-0016, ADR-0007, ADR-0009, ADR-0010 | system shape and hosting assumptions |
| `chronoledger-tech-stack.md` | ADR-0022, ADR-0003 | primary stack and client platforms |
| `chronoledger-security.md` | ADR-0027, ADR-0013 | security baseline and networking controls |
| `chronoledger-observability.md` | ADR-0020 | logs/metrics/tracing baseline |
| `chronoledger-ci-cd.md` | ADR-0021 | pipeline approach and release hygiene |
| `chronoledger-caching.md` | ADR-0026 | caching policy and invalidation guidance |
| `chronoledger-pdf-rendering.md` | ADR-0018, ADR-0012 | PDF engine/rendering determinism |
| `chronoledger-multitenancy.md` | ADR-0017 | tenancy model details and edge cases |
| `chronoledger-project-plan.md` | ADR-0016, ADR-0032 | sequencing and local dev assumptions |
| `chronoledger-risk-decision-log.md` | ADR-0000 | decision hygiene and risk tracking |
| `chronoledger-backlog.md` | ADR-0016 | milestone shaping and epics |
| `chronoledger-master-checklist.md` | ADR-0000 | definition-of-done and readiness gates |

## Maintenance

- Update this map whenever you add, rename, or retire a supporting doc.
- If an ADR is superseded, update the reference to the latest ADR.
