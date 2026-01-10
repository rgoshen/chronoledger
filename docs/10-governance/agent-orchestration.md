<!-- markdownlint-disable MD013 -->
# ChronoLedger — Agent Orchestration, Decision Rights, and Feature Retrospectives

## How the role files are orchestrated

The role files (e.g., `ROLE-frontend-engineer.md`, `ROLE-security.md`) aren’t “running” on their own.
They’re **instruction sets** that the active agent(s) use to stay in their lane and produce consistent outputs.

A practical orchestration model for these role charters is:

1) **PM frames the work**
   - Creates/updates the feature brief (goal, constraints, acceptance criteria).
   - Defines what “done” means.

2) **Tech Lead / Architect turns the brief into an implementable plan**
   - Confirms architecture boundaries and ADR alignment.
   - Splits into vertical slices and defines contracts (API, events, data model constraints).
   - Flags risks and where decisions must be made.

3) **Specialists implement in parallel within their domains**
   - Backend / Frontend / Mobile build to the contracts.
   - DevOps ensures pipelines/environments support the feature.
   - UI/UX defines flows and accessibility expectations.

4) **QA validates the feature against acceptance criteria**
   - Executes test plan, adds/updates automated tests.
   - Confirms the “definition of done” is met.

5) **Security reviews risk and controls**
   - Threat modeling (lightweight), authz/authn review, input validation, secrets/logging.

6) **Tech Lead final integration review**
   - Ensures boundaries, maintainability, and ADR compliance.
   - Confirms cross-cutting concerns (errors, logging, observability, performance)

The above is the “default choreography.” You can still run one agent at a time, but you keep the same sequence:
PM → Tech Lead → implementers → QA/Security → Tech Lead.

---

## Where conflicts happen (and who has final say)

Conflicts are inevitable. The solution is to explicitly assign **decision rights**.

### Decision rights matrix (final say)

| Decision type | Final decision owner | Notes / constraints |
| --- | --- | --- |
| Product scope, prioritization, timelines, acceptance criteria | **Product Manager** | PM cannot override security/compliance requirements; may choose to defer scope. |
| Architecture, boundaries, ADRs, cross-cutting design | **Tech Lead / Architect** | Must align with ADR hierarchy in `AGENTS.md`. |
| Security controls, risk acceptance recommendations, authz/authn constraints | **Security** (with PM sign-off for risk acceptance) | Security can block release if critical issues exist; PM decides whether to ship only if Security provides an explicit risk acceptance path and it’s allowed by policy. |
| UI flows, accessibility requirements, usability heuristics | **UI/UX + Accessibility** | Must meet baseline accessibility; Tech Lead arbitrates implementation feasibility tradeoffs. |
| CI/CD, environments, IaC, deployment standards | **DevOps / Platform** | Tech Lead can request changes; DevOps owns operability and release mechanisms. |
| Test strategy execution, release readiness, quality gates | **QA / Test Engineer** | QA can block if acceptance criteria/tests are not met. |
| Implementation details within a boundary | **Owning engineer role** | E.g., Frontend owns React component architecture inside ADR constraints. |

### Tie-breakers and escalation

When two roles disagree:

1) **Check the “Decision hierarchy (source of truth)” in `AGENTS.md`**
   - Product requirements/constraints → ADRs → project plan/checklists → local notes

2) **If it’s a product tradeoff (scope vs time), PM decides**
   - Example: “Ship v1 with manual step vs automate now.”

3) **If it’s an architecture/boundary question, Tech Lead decides**
   - Example: “Does this belong in domain vs application vs adapter?”

4) **If it’s a security/compliance issue, Security can block**
   - Security provides: severity, exploit scenario, recommended remediation, and acceptable mitigations.
   - PM decides: fix now vs defer only when allowed.

5) **If it’s release readiness, QA can block**
   - “Works on my machine” is not a release criterion.

### Operational rule: disagree, document, commit

- Disagreement is fine.
- The **owner decides**, we **document the rationale** (ADR or decision log), then everyone commits to execution.

---

## Feature retrospective markdown after each feature

After completion of each feature, create a consistent markdown write-up:

- what went well
- what didn’t
- what was accomplished
- issues encountered and how they were fixed

### Recommended approach

- A **single retrospective file per feature**
- Each role contributes bullets in their section
- Tech Lead (or PM) ensures it exists and is completed before closing the feature

### Location and naming

- Folder: `docs/retrospectives/`
- Naming: `YYYY-MM-DD__<feature-slug>.md` (recommended for natural sorting)

---

## Minimal edits to your existing docs

### Update `AGENTS.md`

Add a new section near the end (after workflow / PR rules) to make this non-optional:

```md
## Feature completion (required)
When a feature is complete (acceptance criteria met and PR merged), create:
1) a feature retrospective markdown file, and
2) a decision log entry (mini-ADR) for any meaningful tradeoffs.

Retrospective:
- Location: `docs/retrospectives/`
- Naming: `YYYY-MM-DD__<feature-slug>.md`
- Template: `docs/retrospectives/_template.md`
- Each active role contributes bullets in their section.
- Tech Lead (or PM) is responsible for ensuring it’s completed before closing the feature.

Decision log:
- Location: `docs/decision-logs/`
- Naming: `YYYY-MM-DD__<feature-slug>__decision-log.md`
- Template: `docs/decision-logs/_template.md`
- Record decisions, options considered, rationale, and consequences.
```

### Update each `ROLE-*.md`

Add one bullet in **Key deliverables** (or similar section):

```md
- Contribute to the feature retrospective in `docs/retrospectives/YYYY-MM-DD__<feature-slug>.md` (your role section)
- Contribute to the decision log in `docs/decision-logs/YYYY-MM-DD__<feature-slug>__decision-log.md` when you influence a decision
```

---

## Practical guardrails to avoid chaos

- **One decision owner per decision.** No “committee merges.”
- **One integration owner** per feature (default: Tech Lead) to prevent cross-role deadlocks.
- **Written contracts early** (API DTOs, data shape, component interfaces) to reduce rework.
- **QA + Security have explicit stop-ship authority** for quality/security gates.

<!-- markdownlint-enable MD013 -->
