# User Story: US-0002 — Account linking + tenant membership (auto-link by verified email)

## Metadata

- ID: US-0002
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

As a **user**, I want my **account to automatically resolve to the correct tenant membership based on my verified email**, so that I **see only my organization's data and can immediately access time-entry features without manual setup**.

## Traceability

- PRD: FR-004 (required), FR-005
- Traceability: REQ-0001 (Multi-tenant boundary and membership model)
- ADRs: [ADR-0017](../02-adr/ADR-0017-multitenancy-row-level.md), [ADR-0006](../02-adr/ADR-0006-auto-link-by-verified-email.md)

## Acceptance Criteria (Given/When/Then)

1. **Given** I authenticate with a verified email that matches a tenant's auto-link policy (e.g., email domain) **When** I sign in for the first time **Then** the system creates or resolves my membership to that tenant, includes tenant context in my session token, and grants me the appropriate default role.
2. **Given** my email is not eligible for auto-linking (no matching policy) **When** I sign in **Then** I see a clear "No membership found" message with actionable next steps (e.g., "Contact your administrator to request access") and I am not granted access to any tenant data.
3. **Given** I belong to multiple tenants (if supported) **When** I sign in **Then** the system either selects a default tenant (first by creation date or last used) or prompts me to choose, and my selection is persisted consistently across sessions.
4. **Given** I have an active session with a tenant context **When** I make any API request **Then** the server enforces row-level security to ensure I can only access data scoped to my current tenant (no cross-tenant data leakage).

## In Scope

- Email-based auto-linking per ADR-0006 policy (domain matching or explicit rules)
- Membership lookup and creation/resolution on first sign-in
- Tenant context inclusion in session token (claims)
- Default tenant selection for multi-tenant users (or selection prompt)
- Row-level security enforcement for all tenant-scoped data access

## Out of Scope

- Manual invite flows (admin-initiated invitations) (deferred)
- Cross-tenant data access or aggregation (not allowed)
- Tenant switching UI (in-app tenant switcher) (deferred)
- Admin membership management (add/remove users, change roles) (separate story)

## Dependencies

- ADR-0017 (Multitenancy row-level) implementation for data isolation
- ADR-0006 (Auto-link by verified email) policy rules must be defined and seeded
- US-0001 (Session) for tenant context in session token

## Risks

- **Wrong tenant assignment**: Mitigate via explicit auto-link policy testing and domain validation.
- **Missing row-level security**: Ensure all queries include tenant filters (use Prisma middleware or DB RLS).
- **Cross-tenant data leakage**: Audit all API endpoints for proper tenant scoping; add integration tests for isolation.

## UX / UI Notes

- Keep this flow minimal; avoid blocking legitimate users.
- Provide clear messaging for "no membership found" cases.

## Data & API Notes

- Tenant context must be included in authorization checks.
- Audit membership linking events.

## Test Plan

- Unit: membership selection rules
- Integration: row-level security / tenant scoping on reads
