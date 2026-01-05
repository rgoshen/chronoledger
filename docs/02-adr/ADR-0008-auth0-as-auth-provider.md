# ADR-0008: Auth0 as Authentication Provider

- Status: Accepted
- Date: 2026-01-02

## Context

ChronoLedger requires:

- Email/password login
- Social login: Apple, Google, Facebook
- Industry-standard OAuth/OIDC flows (PKCE for mobile)
- Auto-link/merge accounts when a provider supplies a verified email
- A future path to support additional users and more configurable auth needs

We want a mature CIAM platform that reduces custom implementation and supports future expansion.

## Decision

Use **Auth0** as the authentication provider.

- Implement OIDC/OAuth flows for web and mobile using Auth0 recommended patterns
- Configure social identity providers (Apple/Google/Facebook) in Auth0
- Enforce the product requirement to **auto-link/merge accounts by verified email** (implementation details may use Auth0 account-linking capabilities and/or application-side safeguards)

## Consequences

- ✅ Faster time-to-implement for a robust auth system
- ✅ Strong support for social providers and standards-based federation
- ✅ Better runway for “multi-user / configurable” future needs
- ⚠️ Ongoing vendor cost that can increase with MAUs/features
- ⚠️ Adds an external dependency outside AWS
- ⚠️ Account linking behavior must be validated carefully to avoid accidental merges

## Alternatives Considered

- Amazon Cognito: rejected due to preference for Auth0’s feature depth and developer experience.
