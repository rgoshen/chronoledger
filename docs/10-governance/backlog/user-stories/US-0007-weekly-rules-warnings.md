# User Story: US-0007 — Weekly rules enforcement and warnings

## Metadata
- ID: US-0007
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
As a **user**, I want the system to **enforce weekly hour rules and warn me when prior authorization is required**, so that I stay compliant.

## Traceability
- PRD: FR-050, FR-051; Weekly rules and warnings
- ADRs: [ADR-0028](../02-adr/ADR-0028-domain-invariants-state-machines.md)

## Acceptance Criteria (Given/When/Then)
1. **Given** my weekly contract hours would exceed 40 **When** I attempt to save an entry **Then** the system prevents it and explains why.
2. **Given** my weekly totals exceed 44 **When** I view the week or pay period summary **Then** I see a prominent “Prior authorization required” warning.
3. **Given** I attempt to log ATO outside allowable rules **When** I save **Then** the system prevents it (or flags it) per FR-051.

## UX / UI Notes
- Warnings should be visible in the summary and included in exports.
- Error messages should specify which rule was violated.

## Data & API Notes
- Weekly enforcement must consider split entries and timezone rules.
- Warnings should be computed deterministically for exports.

## Test Plan
- Unit: weekly rule calculations
- Integration: rule enforcement on create/update
