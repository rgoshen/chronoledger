# ADR-0003: Client Platforms (Web + iOS + Android)

- Status: Accepted
- Date: 2026-01-02

## Context

ChronoLedger must be usable on a work computer and on mobile devices, and must support sync.

## Decision

Support these first-class clients:

- **Web** application
- **Mobile** applications for **iOS and Android**

All clients will use a shared backend API.

## Consequences

- ✅ Works on work laptop/desktop and personal devices.
- ✅ Single source of truth and consistent rules enforcement.
- ⚠️ Requires a consistent UI/UX approach across platforms.
- ⚠️ Requires careful handling of time zone, clock settings, and offline behavior on mobile.
