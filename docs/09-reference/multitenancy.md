# ChronoLedger — Multi-Tenancy and Configuration Model

_Last updated: 2026-01-02_

This document expands ADR-0017 with a concrete data model sketch and API scoping rules.

## 1) Core tables (sketch)

```sql
-- Tenants
tenant(
  tenant_id uuid pk,
  name text not null,
  created_at timestamptz not null
);

-- Users (auth identity)
app_user(
  user_id uuid pk,
  auth0_sub text unique not null,
  email text null,
  created_at timestamptz not null,
  last_login_at timestamptz null
);

-- Membership + role
tenant_user(
  tenant_id uuid not null references tenant(tenant_id),
  user_id uuid not null references app_user(user_id),
  role text not null check (role in ('USER','ADMIN')),
  created_at timestamptz not null,
  primary key (tenant_id, user_id)
);

-- Example tenant-owned domain table
time_entry(
  time_entry_id uuid pk,
  tenant_id uuid not null references tenant(tenant_id),
  user_id uuid not null references app_user(user_id),
  start_utc timestamptz not null,
  end_utc timestamptz null,
  capture_time_zone text not null,
  is_locked boolean not null,
  deleted_at timestamptz null,
  created_at timestamptz not null,
  updated_at timestamptz not null
);

create index idx_time_entry_tenant_user_start
  on time_entry(tenant_id, user_id, start_utc)
  where deleted_at is null;
```

## 2) Request scoping rules

### 2.1 Resolve identity

- Validate Auth0 JWT.
- Use `sub` claim to look up `app_user`.
- Find membership in `tenant_user`.

### 2.2 Determine tenant

- Default behavior: a user belongs to one tenant initially.
- Future-friendly behavior: if a user belongs to multiple tenants, client may pass `X-Tenant-Id` and server verifies membership.

### 2.3 Enforce scope

- All CRUD queries include `tenant_id = :tenantId`.
- Admin routes enforce both:
  - `role=ADMIN`
  - membership in tenant

## 3) Config strategy

### 3.1 Small settings

Use `tenant_setting` for low-risk values:

```sql
tenant_setting(
  tenant_id uuid not null references tenant(tenant_id),
  key text not null,
  value_json jsonb not null,
  updated_at timestamptz not null,
  primary key (tenant_id, key)
);
```

Examples:

- default display TZ
- rounding policy version (calculation only)
- PDF footer text
- feature flags

### 3.2 Domain configuration

Use dedicated tables for high-value domains:

- `time_code` (tenant-owned)
- `pay_rate` (tenant-owned, effective 1st of month)
- `holiday` (visibility for dates; not special “pay logic”)

## 4) Audit tables and tenancy

Each audit table includes `tenant_id` and references the domain entity ID. Example:

- `audit_time_entry(tenant_id, time_entry_id, ...)`

## 5) Migration strategy

- Add `tenant_id` early to avoid expensive backfills later.
- Seed one tenant for personal use.
- When expanding to other users, tenant creation becomes an admin workflow.
