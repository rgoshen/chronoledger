# ADR-0010: Amazon RDS PostgreSQL as the Primary Database

- Status: Accepted
- Date: 2026-01-02

## Context
ChronoLedger uses PostgreSQL and a 3NF core schema. Requirements include:
- transactions for time entry, locking/unlocking, and audit persistence
- reporting and aggregation for weekly/pay-period summaries and exports
- future configurability for multiple users/tenants

We need a managed Postgres offering with backups and reliable operations.

## Decision
Use **Amazon RDS for PostgreSQL** as the primary datastore.

- Single primary instance to start (right-sized)
- Automated backups enabled
- Multi-AZ and read replicas can be added later as needed

## Consequences
- ✅ Managed backups and maintenance windows
- ✅ Strong transactional semantics and reporting capability
- ✅ Works cleanly with ECS services in a VPC (private access)
- ⚠️ Ongoing cost even at idle
- ⚠️ Requires schema migration discipline

## Alternatives Considered
- Aurora PostgreSQL: deferred; can be revisited later if scaling/availability requirements justify it.
- DynamoDB: rejected for reporting and relational integrity requirements.
