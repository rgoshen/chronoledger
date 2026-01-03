# ADR-0006: Auto-Link Accounts by Verified Email

- Status: Accepted
- Date: 2026-01-02

## Context
ChronoLedger supports email/password and social login (Apple/Google/Facebook). Users should not end up with multiple accounts just because they used a different provider on a different device.

## Decision
When a social login provider supplies a **verified email**, the system will **auto-link/merge** to an existing account with the same verified email.

## Consequences
- ✅ Reduces duplicate accounts and “where did my data go?” problems.
- ✅ Matches common industry practice for multi-provider auth.
- ⚠️ Requires careful handling when providers do not supply verified email (fallback behavior needed).
- ⚠️ Must ensure linking rules are enforced server-side and audited.
