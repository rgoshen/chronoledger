# ChronoLedger Git Workflow

_Last updated: 2026-01-04_

## Purpose

Define a predictable Git workflow for ChronoLedger that supports:

- high-signal PR review
- strict TDD and minimal diffs
- reproducible deployments (build once, promote by SHA)
- safe staging/prod promotion and rollback

This document is referenced by `CONTRIBUTING.md` and is intended for both human developers and AI agents.

## Workflow summary

ChronoLedger uses **trunk-based development**:

- `main` is the trunk
- work happens in short-lived branches
- merge to `main` via PR after checks pass
- deployments are driven by Git SHA (see ADR-0037)

## Branching model

### Main branch

- `main` must remain **releasable**.
- No direct pushes to `main`.

### Short-lived branches

Create a branch for each unit of work:

- one branch = one purpose
- one PR = one cohesive change

Avoid long-lived integration branches. If multiple tracks are needed, use independent feature branches and merge separately.

## Branch naming (required)

Use these prefixes:

- `feature/<ticket>-<slug>`
- `bugfix/<ticket>-<slug>`
- `refactor/<ticket>-<slug>`
- `chore/<ticket>-<slug>`
- `docs/<ticket>-<slug>`
- `hotfix/<ticket>-<slug>` (urgent production fix only)

Rules:

- `<ticket>` should be a project identifier (e.g., `CL-123`).
- `<slug>` should be short, lowercase, and hyphenated.
- If no ticket exists: use `no-ticket` (temporary, replace when possible).

Examples:

- `feature/CL-142-timesheet-week-view`
- `bugfix/CL-155-timer-rounding`
- `docs/CL-210-adr-0037`

## Commit guidelines

- Write clear, present-tense commit messages.
- Keep commits focused.
- Avoid mixing unrelated refactors with feature work.
- Do not commit generated build artifacts.

## Pull request rules

- PRs must be single-purpose and reviewable.
- PR description must include:
  - what changed and why
  - how to test
  - migration notes (if applicable)
- Required checks must pass before merge (see `CONTRIBUTING.md`).

### Merge strategy

- Merging into `main` happens via GitHub PR merge (not local direct pushes).
- Local workflow can use merge or rebase; keep history clean and changes understandable.

## Release and promotion model (ADR-0037)

ChronoLedger follows **build once, promote by SHA**:

- A merge to `main` produces artifacts tagged by the Git SHA.
- `dev` deploys automatically from `main`.
- `staging` and `prod` deploy by selecting a known-good SHA and promoting it through gated workflows.

This ensures staging/prod runs the exact same build that was tested.

## Hotfixes

Hotfix branches are for urgent production fixes only.

Recommended process:

1) Branch from `main`: `hotfix/<ticket>-<slug>`
2) Implement fix with strict TDD (required)
3) PR → merge to `main`
4) Promote the fix SHA to `prod` via the normal promotion workflow
5) Add follow-up work as needed (tests, refactors) in separate branches

## Working in parallel

If you need multiple concurrent tracks:

- create multiple short-lived branches
- open separate PRs
- merge independently

If you want true parallel working directories, prefer `git worktree` over switching branches in a single folder.

## What not to do

- Do not keep feature branches open for weeks.
- Do not bypass PR checks.
- Do not merge unrelated refactors “while you’re in there.”
- Do not change architecture boundaries without an ADR.

## Related

- `CONTRIBUTING.md`
- `AGENTS.md`
- ADR-0037: CI/CD Execution Model (Build Once, Promote by SHA)
