# User Story: US-0009 — Official PDF export for core reports

## Metadata
- ID: US-0009
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
As a **user**, I want to **export an official PDF** of my report, so that I can submit or archive a compliant record.

## Traceability
- PRD: FR-060–FR-063 (PDF required); FR-061 (boundaries visible); include warnings in reports
- Traceability: REQ-0005 (Official PDF exports), REQ-0011 (Testing strategy for exports)
- ADRs: [ADR-0012](../02-adr/ADR-0012-pdf-export-pipeline.md), [ADR-0018](../02-adr/ADR-0018-pdf-rendering-html-chromium.md), [ADR-0033](../02-adr/ADR-0033-testing-strategy.md)

## Acceptance Criteria (Given/When/Then)
1. **Given** I am viewing a report (pay period) **When** I choose Export PDF **Then** I receive a generated PDF.
2. **Given** a PDF is generated **When** I open it **Then** it includes title, date range, generation timestamp, page numbers, and any rule warnings.
3. **Given** the report spans pay periods **When** exported **Then** pay period boundaries are visually clear.

## UX / UI Notes
- Export action should show progress and completion.
- Provide friendly messaging on export failures with retry.

## Data & API Notes
- Export must be auditable (who/when/what filters).
- PDFs must be deterministic enough to test with fixtures.

## Test Plan
- Export tests: “golden” PDF fixtures or deterministic render snapshots
- Integration: export job pipeline produces stored artifact and audit entry
