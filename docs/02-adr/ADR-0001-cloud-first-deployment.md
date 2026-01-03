# ADR-0001: Cloud-First Deployment

- Status: Accepted
- Date: 2026-01-02

## Context
ChronoLedger must be usable from:
- a work computer (web)
- iOS and Android devices (mobile)

It also requires device synchronization and support for social login providers.

## Decision
ChronoLedger will be **cloud-first**:
- The system of record is a cloud-hosted backend + database.
- Web and mobile clients communicate with the backend over HTTPS.
- Local/offline behavior may be added later, but cloud remains the source of truth.

## Consequences
- ✅ Device sync is straightforward and reliable.
- ✅ Social login and centralized authorization are easier to implement correctly.
- ⚠️ Ongoing hosting cost.
- ⚠️ Requires basic cloud security hygiene (least privilege, secrets handling, backups).

## Alternatives Considered
- Local-only: rejected due to sync + multi-device requirements.
- Self-hosted at home: workable, but increases operational risk and complicates “use anywhere” access.
