# ADR-0029: Authorization Model and Auth0 Claim Mapping

- Status: Accepted
- Date: 2026-01-02

## Context

ChronoLedger uses Auth0 for authentication and needs:

- strict separation of admin capabilities (separate UI at `/admin`, stricter permissions)
- tenant-scoped authorization (row-level tenancy)
- safe account linking/merging when users authenticate via social providers
- auditable admin actions

## Decision

Adopt a server-enforced RBAC model with explicit claim mapping from Auth0, plus hardened admin policies.

### 1) Roles

Roles are scoped per tenant membership:

- `USER`
- `ADMIN`

### 2) Claim mapping (Auth0 → API)

- API validates JWTs (issuer, audience, signature) and reads:
  - `sub` (Auth0 subject) as the stable identity key
  - `email` and `email_verified` when present
- Use Auth0 RBAC to include either:
  - a custom namespaced claim for roles, e.g. `https://chronoledger.app/roles`, and/or
  - Auth0 `permissions` claim if you choose permission-based enforcement later
- API **does not** trust client-provided role flags.

### 3) Admin hardening

- Require Auth0 tenant policy: **MFA for admins** (recommended and accepted).
- Admin routes:
  - UI: `/admin` (separate navigation and permissions)
  - API: `/api/v1/admin/*`
- Admin operations must write to `audit_admin_action`.

### 4) Tenant resolution

- Default: each user is in a single tenant (initial phase).
- Future: if a user belongs to multiple tenants:
  - client may send `X-Tenant-Id`
  - server verifies membership in `tenant_user` before honoring it

### 5) Account linking behavior

- When a user signs in with a social provider that has a **verified email**:
  - the system auto-links to an existing account with the same verified email
  - linking actions are audited (admin-only visibility)

## Consequences

- ✅ Consistent security posture across web and mobile
- ✅ Clear admin boundaries and stronger admin authentication
- ✅ Future SaaS readiness with tenant-aware access checks
- ⚠️ MFA enforcement requires setup and user education for admin accounts
- ⚠️ Custom claim names must be consistent across environments

## Notes/Links

- Security posture baseline: ADR-0027
- Multi-tenancy model: ADR-0017
