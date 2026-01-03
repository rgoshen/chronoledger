# Data

Database and data-layer documentation.

## Contents

- [`chronoledger-db-migrations.md`](chronoledger-db-migrations.md)
- [`chronoledger-data-retention.md`](chronoledger-data-retention.md)
- [`fixtures/`](fixtures/)

## Recommended additions (pre-coding blockers)

- `schema-blueprint.md` (entities, relationships, constraints, indexes)
- `fixtures/README.md` (what fixtures exist and what uses them)

## Notes

Some Postgres invariants (e.g., exclusion constraints) may require raw SQL migrations even when using an ORM.
