# User Story: US-0001 — Sign in and establish a secure session (tenant context)

## Metadata

- ID: US-0001
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

As a **user**, I want to **authenticate once and have my session persist across navigation**, so that I can **access protected time-entry features without repeated sign-ins while maintaining security boundaries**.

## Traceability

- PRD: FR-001, FR-002, FR-003, FR-005, FR-006; Roles & permissions (Section 4)
- NFR: NFR-01 (Security)
- Traceability: REQ-0008 (Security baseline), REQ-0006 (API conventions) (as applicable)
- ADRs: [ADR-0027](../02-adr/ADR-0027-security-baseline.md), [ADR-0015](../02-adr/ADR-0015-rest-api-conventions.md), [ADR-0030](../02-adr/ADR-0030-api-error-contract-problem-json.md)

## Shared Technical Contracts

These technical standards apply across all acceptance criteria and implementation:
- **Error responses**: All API errors use Problem+JSON format per ADR-0030
- **Session tokens**: Secure token implementation per ADR-0027
- **HTTP status codes**: Follow REST conventions per ADR-0015

## Acceptance Criteria (Given/When/Then)

1. **Given** I am not authenticated **When** I open the app or navigate to any protected route **Then** I am redirected to the sign-in screen with a clear prompt and no protected data is rendered.
2. **Given** I provide valid credentials **When** I submit the sign-in form **Then** my session is established, I receive a secure token, and I am redirected to the intended destination (or home).
3. **Given** I have a valid session **When** I navigate to any protected app section (e.g., Time Entry, Pay Period Summary) **Then** my session remains active and all authenticated API requests include my tenant and role context.
4. **Given** my session expires (timeout) or is revoked **When** I attempt any authenticated request **Then** I receive a 401 response, the client clears local session state, and I am redirected to sign-in with an informative message (e.g., "Session expired").
5. **Given** I lack permission for a specific action (e.g., role-restricted feature) **When** I attempt to access or invoke it **Then** I receive a 403 response with a Problem+JSON error specifying "Forbidden" and no ambiguous or generic failure message.
6. **Given** I provide invalid credentials **When** I submit the sign-in form **Then** I see an inline error (e.g., "Invalid email or password") and am not authenticated.

## In Scope

- Session establishment via secure token per ADR-0027
- Client-side session persistence mechanism
- Redirect to sign-in for unauthenticated requests
- Clear error messages for authentication (401) and authorization (403) failures per ADR-0030
- Role-aware authorization checks per PRD roles
- Session expiration/timeout handling

## Out of Scope

- Multi-factor authentication (deferred to future release)
- OAuth/SSO integration (deferred)
- "Remember me" or extended session options (deferred)
- Password reset or account recovery flows (handled separately)
- Session management UI (e.g., view/revoke active sessions) (deferred)

## Dependencies

- ADR-0027 (Security baseline) implementation for token signing/verification
- Problem+JSON error contract (ADR-0030) must be implemented API-wide
- Tenant context resolution (depends on US-0002 account linking)

## Risks

- **Session fixation or hijacking**: Implement secure session handling per ADR-0027; test session security controls.
- **Inconsistent error messages**: Ensure all API endpoints use error contract per ADR-0030.
- **Client state desync**: Client must reliably clear session state on 401/403 responses.

## UX / UI Notes

- Include clear "signed out" state and re-auth path.
- Error states: invalid credentials, expired session, forbidden action.

## Data & API Notes

- Use standardized error responses per ADR-0030.
- Authorization should be role-aware per PRD roles.

## Test Plan

- Unit: token/session handling utilities
- Integration: protected endpoint requires auth
- E2E: sign in → navigate → sign out/expire → re-auth flow
