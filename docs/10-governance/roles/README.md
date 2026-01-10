# ChronoLedger Roles Index

_Last updated: 2026-01-09_

This folder contains **role charters** used to coordinate human contributors and AI agents. Each role document includes:

- an AI-ready “Agent persona” statement
- mission and scope
- responsibilities and non-responsibilities
- key deliverables and handoffs
- quality bar (industry standards + best practices)
- checklists and decision rights
- references to applicable ADRs

## Roles

- [Product Manager](ROLE-product-manager.md)
- [Tech Lead / Architect](ROLE-tech-lead-architect.md)
- [Backend Engineer](ROLE-backend-engineer.md)
- [Frontend Engineer](ROLE-frontend-engineer.md)
- [Mobile Engineer](ROLE-mobile-engineer.md)
- [DevOps / Platform](ROLE-devops-platform.md)
- [QA / Test Engineer](ROLE-qa-test-engineer.md)
- [Security](ROLE-security.md)
- [UI/UX/Accessibility](ROLE-ui-ux-accessibility.md)

## How to use these roles

- Assign an initiative (usually a **Vertical Slice**, SL-####) to a **primary role owner**.
- The primary owner is responsible for producing the role’s **listed deliverables** before implementation begins (when applicable).
- Execution is driven from the slice file’s **Work Breakdown checklist**:
  - PM: user stories (US-####) + acceptance criteria
  - UX: UI states + accessibility notes (in the story)
  - Tech Lead: slice readiness, constraints, and task breakdown (in the slice)
  - Engineering roles: implement tasks + tests
- When a role identifies a cross-cutting decision, capture it as an **ADR** (or decision log entry) rather than
  implementing implicitly.

## Related

- Backlog workflow: `docs/10-governance/backlog/README.md`
- Governance: `docs/10-governance/README.md`
