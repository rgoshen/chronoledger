# Templates

This folder is the **canonical home for human-facing templates** used in the ChronoLedger repo.

## Yes: templates should live here (with one important exception)

- **Human-used templates** (docs, logs, ADRs, checklists): keep the canonical versions here.
- **Tool-enforced templates** (GitHub PR/issue templates) must live under `.github/` to work.

Best practice:

- Canonical template in `docs/10-governance/templates/`
- Mirror/copy into tool-required paths when needed (and note it’s mirrored)

## Template inventory

### Governance + delivery templates (canonical)

- `feature-retrospective-template.md`
  - Output lives in: `docs/10-governance/retrospectives/YYYY-MM-DD__<feature-slug>.md`
- `decision-log-template.md`
  - Output lives in: `docs/10-governance/decision-logs/YYYY-MM-DD__<feature-slug>__decision-log.md`

### ADR template (recommended)

- `adr-template.md` *(canonical)*
- Optional mirror for convenience:
  - `docs/02-adr/ADR_TEMPLATE.md`

### GitHub templates (required special paths)

- Pull request template:
  - `.github/PULL_REQUEST_TEMPLATE.md`
- Issue templates:
  - `.github/ISSUE_TEMPLATE/ISSUE_TEMPLATE.md`

If you keep canonical copies here too, mirror them outward and mark the `.github/` files as mirrored.

## Mirroring rules

If a template exists in two places:

1) Canonical lives in `docs/10-governance/templates/`
2) Tool-required location is a mirror
3) Update canonical first, then re-copy into the mirror
4) Add a short header to mirrored files:

```md
<!-- NOTE: Mirrored from docs/10-governance/templates/<template-name>.md -->
```

## Adding a new template

1) Add `<topic>-template.md` here
2) Update this README
3) If tooling requires a special path, add a mirror copy and follow the mirroring rules

## Related governance docs

- Agent orchestration + decision rights: `docs/10-governance/agent-orchestration.md`
- Retrospectives: `docs/10-governance/retrospectives/`
- Decision logs: `docs/10-governance/decision-logs/`
