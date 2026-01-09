# Templates

This folder is the **canonical home for human-facing templates** used in the ChronoLedger repo (docs, checklists, logs, and lightweight process artifacts).

## Canonical vs tool-enforced (the one rule that prevents chaos)

- **Canonical templates live here**: `docs/10-governance/templates/`
- **Tool-enforced templates live where the tool expects them** (example: GitHub PR/issue templates under `.github/`)

Best practice:

- Keep the **source of truth** here.
- If a tool needs the file elsewhere, **mirror** it there and clearly label it as a mirror.

## Template inventory

| Template | Purpose | Primary users | Mirror required? |
|---|---|---|---|
| `adr-template.md` | Standard ADR format (context, decision, consequences) | PM, Tech Lead, Eng | No |
| `decision-log-template.md` | Lightweight decision log entry format | PM, Tech Lead | No |
| `feature-retrospective-template.md` | “What went well / didn’t / outcomes / follow-ups” after a slice/feature | All agents | No |
| `user-story-template.md` | User story format with G/W/T acceptance criteria + DoD | Product Manager, UX, Tech Lead | No |
| `vertical-slice-template.md` | Thin end-to-end delivery slice spec (UI→API→DB→tests) | Tech Lead, Eng | No |
| `backlog-readme-template.md` | Backlog folder README template (workflow + conventions) | PM, Tech Lead | No |

> If you add a new template, update this table in the same PR.

## Mirroring rules (when you *must* place a copy elsewhere)

Use mirroring when a tool requires a specific path (e.g., GitHub templates).

### 1) Add a mirror header

At the very top of the mirrored file, include:

```md
<!-- NOTE: Mirrored from docs/10-governance/templates/<template-name>.md -->
```

### 2) Keep mirrors identical (except the header)

- No “small tweaks” in the mirror copy.
- Update the canonical version **first**, then mirror it.

### 3) Recommended mirror command

Example:

```bash
cp docs/10-governance/templates/<template-name>.md .github/<tool-path>/<file-name>.md
```

## Adding a new template

1) Add a new file here using the naming convention: `<topic>-template.md`  
2) Update **Template inventory** (table above)  
3) If tooling requires a special path, create a **mirrored** copy and follow the mirroring rules  

## Related governance docs

- Agent orchestration + decision rights: `docs/10-governance/agent-orchestration.md`
- Governance home: `docs/10-governance/README.md`
- Decision logs output: `docs/10-governance/decision-logs/`
- Retrospectives output: `docs/10-governance/retrospectives/`
- Backlog (stories + slices): `docs/10-governance/backlog/`
- Roles (agent responsibilities): `docs/10-governance/roles/README.md`
