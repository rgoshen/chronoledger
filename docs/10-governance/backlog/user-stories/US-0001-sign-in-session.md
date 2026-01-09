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
As a **user**, I want to **sign in and stay signed in securely**, so that I can **enter time and view pay period summaries**.

## Traceability
- PRD: FR-001, FR-002, FR-003, FR-005, FR-006; Roles & permissions (Section 4)
- NFR: NFR-01 (Security)
- Traceability: REQ-0008 (Security baseline), REQ-0006 (API conventions) (as applicable)
- ADRs: [ADR-0027](../02-adr/ADR-0027-security-baseline.md), [ADR-0015](../02-adr/ADR-0015-rest-api-conventions.md), [ADR-0030](../02-adr/ADR-0030-api-error-contract-problem-json.md)

## Acceptance Criteria (Given/When/Then)
1. **Given** I am not authenticated **When** I open the app **Then** I am prompted to sign in.
2. **Given** I sign in successfully **When** I navigate across app sections **Then** my session remains valid and authenticated requests succeed.
3. **Given** my session expires or is invalid **When** I make an authenticated request **Then** I am redirected to sign in and no protected data is shown.
4. **Given** I do not have permission for an action **When** I attempt it **Then** I receive a clear authorization error (no ambiguous failures).

## UX / UI Notes
- Include clear “signed out” state and re-auth path.
- Error states: invalid credentials, expired session, forbidden action.

## Data & API Notes
- Use standardized error responses (Problem+JSON) for auth failures.
- Authorization should be role-aware per PRD roles.

## Test Plan
- Unit: token/session handling utilities
- Integration: protected endpoint requires auth
- E2E: sign in → navigate → sign out/expire → re-auth flow
