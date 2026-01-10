# Fixtures

This folder contains deterministic fixtures used for:

- Database integration tests
- Export/report “golden” output tests (PDF-first)
- Reproducible local development scenarios (when appropriate)

## Principles

- **Deterministic:** fixtures must produce the same results across machines and runs.
- **Minimal but complete:** include only what the scenario requires.
- **Stable identifiers:** use stable UUIDs and stable timestamps where possible.
- **Documented intent:** each fixture describes the scenario it represents.
- **No secrets:** fixtures must not contain credentials or real personal data.

## Fixture types

### 1) Data fixtures

Structured data inserted into Postgres to represent specific scenarios.

Recommended format:

- `fixtures/sql/` — raw SQL inserts (good for DB constraint testing)
- `fixtures/json/` — structured JSON if you prefer generating inserts

If using SQL fixtures, keep them idempotent and ordered:

- `0001-base.sql`
- `0002-time-codes.sql`
- `0010-pp-scenarios.sql`

### 2) Export fixtures

Inputs and expected outputs for export generation tests.

Recommended format:

- `fixtures/exports/<export-id>/<fixture-id>/input.json`
- `fixtures/exports/<export-id>/<fixture-id>/expected.pdf`
- `fixtures/exports/<export-id>/<fixture-id>/README.md`

## Fixture metadata convention

Each fixture should include a small metadata file or README describing:

- Fixture ID
- Purpose / scenario
- Preconditions (tenant, user, pay period)
- Expected invariants (e.g., overlap rejection, locked period)
- Related ADRs
- How it is used (which tests reference it)

Example `README.md` inside a fixture:

```markdown
# Fixture: pp-summary-basic

**Purpose:** Simple PP1 export with multiple entries across 3 days.

## Preconditions

- Tenant: `11111111-1111-1111-1111-111111111111`
- User: `22222222-2222-2222-2222-222222222222`
- Pay period: 2026-01 PP1

## Notes

- All timestamps are stored as UTC and rendered according to the timezone strategy.
- Uses stable UUIDs and stable `created_at` values.

## Related ADRs

- ADR-0004-time-and-timezone-strategy.md
- ADR-0012-pdf-export-pipeline.md
- ADR-0018-pdf-rendering-html-chromium.md

```

## Time and timezone rules

- Store timestamps as UTC (per the timezone strategy ADR).
- If fixtures require “local time” semantics, document the timezone and derive the UTC timestamps accordingly.
- Avoid `now()` in fixtures; use fixed timestamps.

## PDF determinism rules

To keep golden PDFs stable across machines:

- Pin the rendering engine version (Chromium) and document it.
- Embed and pin fonts used in templates.
- Normalize locale settings.
- Avoid environment-dependent formatting (e.g., system locale defaults).

## Adding a new fixture

1. Choose a descriptive fixture ID.
2. Add inputs and a short README explaining the scenario.
3. Reference the fixture in the test that uses it.
4. If the fixture relates to a decision, link the relevant ADR(s).

## Maintenance

- If a fixture changes, treat it like a breaking change for tests.
- For golden PDFs, require intentional updates (e.g., explicit approval or a dedicated update command).
