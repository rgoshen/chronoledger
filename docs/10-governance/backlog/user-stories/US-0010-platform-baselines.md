# User Story: US-0010 — Platform baselines (API contracts, idempotency, observability, local dev, tests)

## Metadata
- ID: US-0010
- Status: Draft
- Priority: P0
- Owner (PM): @product-manager
- Tech Lead: @tech-lead-architect
- UX: @ui-ux-accessibility
- Target Release: v0.1 (MVP)
- Epic: EP-0001
- Slice(s): TBD
- Links: Requirements (PRD) | ADR(s) | Traceability

## Narrative
As a **team**, we want consistent **platform baselines** (API error contract, idempotency, observability, reproducible local dev, and testing), so that delivery is reliable and defects are caught early.

## Traceability
- NFR: NFR-01..NFR-06 (Security, Privacy, Performance, Accessibility, Reliability, Auditability)
- Traceability: REQ-0006, REQ-0007, REQ-0008, REQ-0009, REQ-0010, REQ-0011
- ADRs:
  - [ADR-0015](../02-adr/ADR-0015-rest-api-conventions.md)
  - [ADR-0030](../02-adr/ADR-0030-api-error-contract-problem-json.md)
  - [ADR-0031](../02-adr/ADR-0031-concurrency-idempotency.md)
  - [ADR-0020](../02-adr/ADR-0020-observability-baseline.md)
  - [ADR-0032](../02-adr/ADR-0032-local-dev-env-strategy.md)
  - [ADR-0033](../02-adr/ADR-0033-testing-strategy.md)
  - [ADR-0027](../02-adr/ADR-0027-security-baseline.md)

## Acceptance Criteria (Given/When/Then)
1. **Given** an API validation error occurs **When** returned to clients **Then** it conforms to the documented Problem+JSON contract.
2. **Given** a client retries a write with an idempotency key **When** the server receives it **Then** the result is consistent and safe.
3. **Given** services run locally **When** started **Then** the dev experience is reproducible and documented.
4. **Given** core domain logic and exports exist **When** CI runs **Then** tests include domain invariants and export fixtures.

## Notes
This is an “engineering story” that supports the P0 product slices; it should be implemented incrementally as part of SL-0001..SL-0003.
