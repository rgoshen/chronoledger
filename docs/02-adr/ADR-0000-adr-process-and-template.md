# ADR-0000: ADR Process and Template

- Status: Accepted
- Date: 2026-01-02

## Context
We need a lightweight, industry-standard way to capture architecture and key technical decisions over time, including rationale and consequences.

## Decision
We will use **Architecture Decision Records (ADRs)** with the following structure:

- Title (ADR-XXXX)
- Status
- Date
- Context
- Decision
- Consequences
- Alternatives Considered (optional)
- Notes/Links (optional)

Each ADR should cover **one** decision. If multiple decisions are tightly coupled, create separate ADRs and reference them.

## Consequences
- Decisions are discoverable and auditable.
- Reversals are explicit (via “Superseded” ADRs).
- Architectural drift is reduced because rationale is preserved.

## Template

```markdown
# ADR-XXXX: <Title>

- Status: Proposed | Accepted | Deprecated | Superseded
- Date: YYYY-MM-DD

## Context
<What problem are we solving? What constraints matter?>

## Decision
<What we decided, precisely>

## Consequences
<Positive and negative consequences>

## Alternatives Considered (optional)
- <Alternative A> — <why not>
- <Alternative B> — <why not>

## Notes/Links (optional)
- <related ADRs, docs>
```
