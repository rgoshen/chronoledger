# ADR-0018: PDF Rendering Technology (HTML Templates → Headless Chromium)

- Status: Accepted
- Date: 2026-01-02

## Context

ChronoLedger requires “official” PDF exports that are:

- consistent across platforms (web + mobile)
- generated server-side (worker)
- reproducible and auditable
- capable of professional layouts (tables, headers/footers, pagination)

The worker runs in ECS/Fargate and needs a reliable PDF generation approach.

## Decision

Generate PDFs by rendering **HTML templates** to PDF using **headless Chromium** in the worker.

Recommended implementation:

- Use a Chromium automation library (e.g., Playwright) within the worker container.
- Maintain versioned HTML templates for each report type.
- Embed fonts/assets for stable rendering.
- Store rendered PDFs in S3; deliver via signed URLs (per ADR-0012).

## Consequences

- ✅ High-fidelity, controllable layout with familiar HTML/CSS
- ✅ Stable “official output” across clients (server-generated)
- ✅ Template versioning supports reproducibility
- ✅ Easier to iterate on PDF appearance than programmatic drawing APIs
- ⚠️ Larger container image and runtime dependencies
- ⚠️ Must harden template rendering (no untrusted HTML, strict inputs)
- ⚠️ Need careful pagination testing (tables, page breaks)

## Alternatives Considered

- Programmatic PDFs (PDF libraries): rejected for slower iteration and more complex layout logic.
- wkhtmltopdf: rejected due to older rendering engine and CSS support limitations.
- Client-side PDFs: rejected due to inconsistent output and “official export” requirement.

## Notes/Links

- See: `chronoledger-pdf-rendering.md` for template versioning and rendering workflow.
