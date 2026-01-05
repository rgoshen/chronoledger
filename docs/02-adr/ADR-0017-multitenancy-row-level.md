# ADR-0017: Multi-Tenant and Config Model (Row-Level Tenancy)

- Status: Accepted
- Date: 2026-01-02

## Context

ChronoLedger is currently “single user” (Rick), but is expected to evolve into a product for other users. We need:

- A clean path to support multiple organizations/tenants without a rewrite
- Tenant-scoped configuration (time codes, pay policies, PDF branding/formatting, holiday calendars)
- Strong data isolation boundaries
- Operational simplicity (avoid schema explosion and complex migrations)

We already have:

- Auth0 for authentication
- Role-based access control (user/admin)
- A normalized PostgreSQL schema (3NF) with domain audit tables

## Decision

Adopt a **row-level multi-tenant model** from day one:

1) **Tenants**

- Create a `tenant` table (one row for Rick’s “personal” tenant initially).
- All user and domain data is scoped to a `tenant_id`.

1) **User membership**

- Create `tenant_user` (membership) that maps Auth0 user to `tenant_id`, with roles:
  - `USER`
  - `ADMIN`

1) **Data scoping**

- Add `tenant_id` to all tenant-owned domain tables (examples):
  - `time_entry`
  - `unlock_request`
  - `pay_rate`
  - `time_code`
  - `holiday`
  - `export_job`
- Add composite indexes to keep queries fast: `(tenant_id, <common filter>)`

1) **Enforcement**

- API enforces tenant boundaries on every request:
  - Resolve tenant membership from Auth0 subject (`sub`) -> `tenant_user`
  - Apply tenant filter to all reads/writes
- Optionally enable PostgreSQL Row-Level Security (RLS) later if needed, but not required initially.

1) **Tenant configuration**

- Use tables for configuration (not files), with effective dates where relevant.
- Prefer “tenant overrides” over global mutable settings.
- Example: `tenant_setting` key/value for small settings; dedicated tables for core domains (pay rates, time codes).

## Consequences

- ✅ Future SaaS support without a schema redesign
- ✅ Simple operational model (single schema, single migration stream)
- ✅ Tenant-scoped configuration is natural and queryable
- ✅ Easier to do per-tenant exports and audit review
- ⚠️ Slightly more complexity now (every query includes tenant scope)
- ⚠️ Requires discipline to prevent accidental cross-tenant access
- ⚠️ Some admin operations become “per tenant” instead of truly global

## Alternatives Considered

- Single-tenant only now, retrofit later: rejected due to high rewrite risk.
- Schema-per-tenant: rejected due to operational overhead and migrations complexity.
- Database-per-tenant: rejected for cost/ops overhead at expected scale.
- RLS immediately: deferred (can be added after baseline correctness is proven).

## Notes/Links

- See: `chronoledger-multitenancy.md` for suggested tables and request scoping approach.
