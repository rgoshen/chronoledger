# Traceability Map: REQ / BL → User Stories / Slices

This document links the existing requirements traceability placeholders (`BL-####`) to the concrete backlog items in
this repo (`US-####`, `SL-####`).

> Source table: `docs/traceability_req_adr_backlog.md` (or equivalent location in your repo)

| Placeholder Backlog (BL) | Requirement | Primary ADR(s) | Backlog in this repo |
|---|---|---|---|
| BL-0001 | REQ-0001 Multi-tenant boundary & membership model | ADR-0017, ADR-0006 | US-0001, US-0002; SL-0001 |
| BL-0002 | REQ-0002 Time entry CRUD invariants | ADR-0028 | US-0003, US-0004; SL-0001 |
| BL-0003 | REQ-0003 Prevent overlapping entries (DB enforced) | ADR-0002, ADR-0024 | US-0003; SL-0001 |
| BL-0004 | REQ-0004 Pay period summaries | ADR-0004 | US-0006, US-0007; SL-0002 |
| BL-0005 | REQ-0005 Official PDF exports | ADR-0012, ADR-0018 | US-0009; SL-0003 |
| BL-0006 | REQ-0006 API conventions + error contract | ADR-0015, ADR-0030 | US-0010; SL-0001..SL-0003 |
| BL-0007 | REQ-0007 Concurrency + idempotency | ADR-0031 | US-0010; SL-0001, SL-0003 |
| BL-0008 | REQ-0008 Security baseline | ADR-0013, ADR-0027 | US-0010; SL-0001..SL-0003 |
| BL-0009 | REQ-0009 Observability baseline | ADR-0020 | US-0010; SL-0001..SL-0003 |
| BL-0010 | REQ-0010 Local dev reproducibility | ADR-0032 | US-0010 |
| BL-0011 | REQ-0011 Testing strategy (domain + exports) | ADR-0033 | US-0010; SL-0001..SL-0003 |

## Maintenance

- When you convert BL placeholders to GitHub Issues, replace the “Backlog in this repo” column with issue links (and
  keep the US/SL references as supporting design docs).
- If a story/slice is split, update this table in the same PR.
