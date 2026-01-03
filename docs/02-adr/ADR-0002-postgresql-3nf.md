# ADR-0002: PostgreSQL as Primary Datastore (3NF)

- Status: Accepted
- Date: 2026-01-02

## Context
ChronoLedger needs:
- strong consistency for time entry and locking/unlocking
- robust reporting and PDF exports
- auditability and change tracking
- future expansion to more users and configurability

## Decision
Use **PostgreSQL** as the primary datastore with a **3NF core schema**:
- Normalize core OLTP tables to Third Normal Form for correctness and maintainability.
- Use derived objects (views/materialized views) for reporting performance if needed, but treat them as non-authoritative.

## Consequences
- ✅ Excellent fit for reporting + audit queries.
- ✅ Strong transactional integrity for lock/unlock workflows.
- ✅ Clear data ownership and normalization reduces duplication bugs.
- ⚠️ Requires migration discipline (versioned schema changes).
- ⚠️ Some reporting queries may need indexes/materialization as data grows.

## Alternatives Considered
- DynamoDB: rejected for primary store due to reporting complexity and relational integrity needs.
- SQLite: rejected for multi-user cloud-first requirements.
