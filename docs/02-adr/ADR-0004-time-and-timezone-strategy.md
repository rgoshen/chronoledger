# ADR-0004: Time Storage and Time Zone Display Strategy

- Status: Accepted
- Date: 2026-01-02

## Context
ChronoLedger must:
- correctly handle time zones and device changes
- support cross-midnight entries via auto-splitting
- avoid rounding drift by keeping raw times/hours as source of truth
- show times in a way that matches user expectations across devices

## Decision
1) **Store all timestamps in UTC** in the database.  
2) **Capture IANA time zone** information at time entry capture.  
3) **Default UI display** uses the **current device time zone**.  
4) Allow a **display time zone override**, stored **per user, per device**.  
5) **Rounding is computed** (nearest 15 minutes) and **never persisted**.  
6) Cross-midnight entries are **auto-split** into two linked entries before validation and overlap checks.

## Consequences
- ✅ Correctness across DST and time zone changes.
- ✅ Device-native display “just looks right” by default.
- ✅ Override supports consistent viewing when desired (e.g., always show “home TZ”).
- ⚠️ Requires disciplined time-handling libraries and test coverage around DST boundaries.
