# User Story: US-0002 — Account linking + tenant membership (auto-link by verified email)

## Metadata

- ID: US-0002
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

As a **user**, I want my **account to link to the correct tenant/membership automatically**, so that I **see the right
data and can start using the system quickly**.

## Traceability

- PRD: FR-004 (required), FR-005
- Traceability: REQ-0001 (Multi-tenant boundary and membership model)
- ADRs: [ADR-0017](../02-adr/ADR-0017-multitenancy-row-level.md), [ADR-0006](../02-adr/ADR-0006-auto-link-by-verified-email.md)

## Acceptance Criteria (Given/When/Then)

1. **Given** I authenticate with a verified email **When** I sign in for the first time **Then** the system links my
   account to the appropriate tenant membership per policy.
2. **Given** my email is not eligible for auto-linking **When** I sign in **Then** I see an appropriate next step
   (e.g., request access / contact admin).
3. **Given** I belong to multiple tenants (if supported) **When** I enter the app **Then** I can select an active
   tenant context (or the system selects a default) consistently.

## UX / UI Notes

- Keep this flow minimal; avoid blocking legitimate users.
- Provide clear messaging for “no membership found” cases.

## Data & API Notes

- Tenant context must be included in authorization checks.
- Audit membership linking events.

## Test Plan

- Unit: membership selection rules
- Integration: row-level security / tenant scoping on reads
