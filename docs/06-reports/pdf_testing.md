# PDF Testing and Deterministic Rendering

**Purpose:** Define how ChronoLedger produces deterministic, reproducible PDFs and how we validate them using golden fixtures.

**Status:** Draft
**Last reviewed:** YYYY-MM-DD

**Related ADRs:**
- ADR-0012-pdf-export-pipeline.md
- ADR-0018-pdf-rendering-html-chromium.md
- ADR-0033-testing-strategy.md
- ADR-0004-time-and-timezone-strategy.md

## Goals

- “Official” PDFs are reproducible across machines and CI.
- Rendering is versioned (template + engine + fonts + settings).
- Golden tests detect unintended output changes.

## Determinism requirements

To treat PDF output as a contract, the following must be pinned and recorded:

- **Template version** (layout + content rules)
- **Rendering engine version** (Chromium version)
- **Font bundle version** (fonts included + checksums)
- **Rendering settings version** (page size, margins, DPI, header/footer rules)
- **Locale + timezone behavior** (per ADR-0004)

Recommended minimum metadata recorded with every artifact:

- `export_id`
- `template_version`
- `rendering_version`
- `generated_at` (UTC)
- `input_parameters` snapshot (sanitized)
- `checksum` (SHA-256)

## Rendering pipeline (conceptual)

```mermaid
flowchart LR
  A[Data snapshot
(DB query results)] --> B[View model
(normalized values)]
  B --> C[HTML template
(versioned)]
  C --> D[Chromium render
(version pinned)]
  D --> E[PDF artifact
(checksummed)]
```

## Rules to avoid non-determinism

### Fonts

- Always use a pinned font bundle and embed fonts in the PDF.
- Do not rely on system fonts.
- Prefer a single default font family for the whole template.

### Time and timezone

- Store timestamps in UTC.
- Convert for display using explicit IANA timezone.
- Do not rely on host timezone.
- Include tests around DST boundaries.

### Locale

- Set a fixed locale for rendering.
- Standardize date formats (e.g., `YYYY-MM-DD` or a documented user-facing format).
- Standardize decimal formatting and rounding behavior.

### HTML/CSS stability

- Avoid external resources (remote images, web fonts).
- Prefer inline or bundled assets with stable paths.
- Avoid CSS features that vary by engine version unless pinned.

## Golden fixture layout

Golden fixtures live under `docs/04-data/fixtures/exports/`.

Recommended layout:

- `docs/04-data/fixtures/exports/<export-id>/<fixture-id>/input.json`
- `docs/04-data/fixtures/exports/<export-id>/<fixture-id>/expected.pdf`
- `docs/04-data/fixtures/exports/<export-id>/<fixture-id>/README.md`

Fixture README must include:
- Scenario purpose
- Tenant/user/pay period assumptions
- Timezone used for display
- Template + rendering versions

## PDF comparison strategy

### Preferred: strict checksum comparison

Use when determinism is strong:
- Render the PDF
- Compute SHA-256
- Compare to expected checksum / expected PDF bytes

Pros:
- Fast
- Simple
- Sensitive to any change

Cons:
- Requires excellent determinism discipline

### Fallback: render-to-image comparison

Use only if checksum determinism is not feasible early on:
- Render expected and actual PDFs to PNG images per page
- Compare images with a defined threshold

Pros:
- Tolerates benign metadata differences

Cons:
- Slower
- More moving parts
- Must pin image renderer versions too

## Golden update workflow

Golden PDFs should only change intentionally.

Recommended workflow:

```mermaid
sequenceDiagram
  participant Dev as Developer
  participant CI as CI
  participant Rev as Reviewer

  Dev->>CI: PR changes export/template
  CI->>CI: Run golden PDF tests
  alt Golden mismatch
    CI-->>Dev: Fail with diff artifacts attached
    Dev->>Dev: Review diff + confirm intended
    Dev->>CI: Run/update golden via explicit command
    CI->>Rev: Re-run tests; show updated expected PDFs
    Rev->>Rev: Validate output changes are acceptable
    Rev-->>CI: Approve PR
  else Golden match
    CI-->>Rev: All tests pass
    Rev-->>CI: Approve PR
  end
```

Rules:
- Updating goldens requires a dedicated command and explicit commit.
- Prefer reviewer approval from someone familiar with export requirements.

## CI expectations

Minimum:
- Golden PDF tests run on every PR that touches:
  - templates
  - rendering code
  - export worker
  - timezone/formatting utilities

Artifacts:
- On failure, CI should upload:
  - actual PDF
  - expected PDF
  - optional rendered page images (if using fallback mode)

## Open items to finalize

- Final date/time display formats
- Rounding rules and presentation (hh:mm vs decimal)
- Whether open time entries are allowed in non-official exports
- Tooling choice for PDF render and (if needed) PDF-to-image conversion

