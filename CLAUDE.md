# CLAUDE.md

This file is an operational playbook for **AI coding agents** working in this repository (Claude Code, Cursor, Copilot-style agents, etc.).

It is intentionally **tool-agnostic**: follow the same rules regardless of which agent runner you use.

## Project Overview

ChronoLedger is an auditable timekeeping and pay-period reporting platform with role-based administration. This is a Yarn 4 workspace monorepo containing apps, packages, and infrastructure code.

**Critical note**: This project is currently docs-first. Many apps contain placeholder implementations only. Always check for actual implementation before assuming functionality exists.

## Commands

### Root-level commands

```bash
# Install dependencies
yarn install

# Development (runs dev in all workspaces with dev script)
yarn dev

# Build all workspaces
yarn build

# Run all tests
yarn test

# Type checking across all workspaces
yarn typecheck

# Linting
yarn lint
yarn lint:fix
```

### Workspace-specific commands

```bash
# Run command in specific workspace
yarn workspace @chronoledger/api <command>
yarn workspace @chronoledger/web <command>
yarn workspace @chronoledger/mobile <command>
yarn workspace @chronoledger/worker <command>
yarn workspace @chronoledger/shared <command>

# Run command in all workspaces in parallel
yarn workspaces foreach -Apt run <command>

# Run command in all workspaces sequentially
yarn workspaces foreach -At run <command>
```

## Repository Structure

```
docs/               # All documentation (requirements, ADRs, plans, etc.)
  ├── 00-roadmap/      # Current build plan and milestones
  ├── 01-requirements/ # Functional requirements
  ├── 02-adr/          # Architectural Decision Records (source of truth)
  ├── 03-api/          # API contracts and blueprints
  ├── 04-data/         # Data schemas and database design
  ├── 05-ux/           # UX flows and mockups
  ├── 06-reports/      # Report templates and export specs
  ├── 07-infra/        # Infrastructure documentation
  ├── 08-testing/      # Testing documentation
  ├── 09-reference/    # External references
  └── 10-governance/   # Process, templates, backlogs, slices
apps/
  ├── api/         # NestJS API service (placeholder)
  ├── web/         # React web application (placeholder)
  ├── mobile/      # React Native mobile app (placeholder)
  └── worker/      # Background worker service (placeholder)
packages/
  └── shared/      # Shared types, validation, utilities
infra/
  ├── cloud/       # Cloud infrastructure-as-code
  └── local/       # Local development infrastructure
```

## Architecture (Critical Reading)

**You MUST read and follow these ADRs** before making architectural decisions:

### ADR-0034: API Internal Architecture (Vertical Slice + Hexagonal)
- API organized by **feature modules** (e.g., `time-entry`, `reports`, `auth`)
- Each feature has **four layers**:
  - `domain/` — Pure business rules, value objects (NO Nest/Prisma/HTTP imports)
  - `application/` — Use cases that orchestrate domain + ports
  - `adapters/` — Implementations of ports (Prisma, queues, storage)
  - `http/` — Controllers, DTOs, validation (NO business rules)

**Hard constraints**:
- `domain/` MUST NOT import NestJS, Prisma, HTTP libs, queue/storage clients, decorators, or env config
- Business rules MUST live in `domain/` or `application/`
- `http/` MUST NOT contain business rules

### ADR-0035: Frontend Architecture (Feature Modules + MVC-ish + Dumb Views)
- Frontend organized by **feature modules**
- Each feature has **MVC-ish layers**:
  - `ui/` — Dumb presentational components (render + emit events only)
  - `controller/` — Hooks/containers for orchestration
  - `model/` — Types + pure business rules (NO React imports)
  - `api/` — Network layer (NO business rules)

**Hard constraints**:
- `ui/` MUST NOT fetch/mutate data directly
- `ui/` MUST NOT contain business rules (pay period math, validation, ATO calculations)
- Business rules MUST live in `model/`

### ADR-0036: Testing Toolchain + Test Database Strategy

**Testing stack**:
- **Backend**: Vitest for unit/integration, Supertest for API tests, Testcontainers for DB
- **Web**: Vitest + React Testing Library for unit/component, Playwright for E2E
- **Mobile**: Jest + React Native Testing Library for unit/component, Detox for E2E

**Test database policy**:
- Integration/E2E tests MUST use isolated databases via Testcontainers
- NEVER run tests against dev or production databases
- Unit tests MUST NOT require a real database

## Development Workflow

### Branching Model (Trunk-based)
- `main` is the trunk and must remain releasable
- All work happens in **short-lived feature branches**
- Branch naming is **required** and must follow this format:
  ```
  feature/<ticket>-<slug>
  bugfix/<ticket>-<slug>
  refactor/<ticket>-<slug>
  chore/<ticket>-<slug>
  docs/<ticket>-<slug>
  hotfix/<ticket>-<slug>
  ```
- Use `no-ticket` if no ticket ID: `feature/no-ticket-<slug>`
- Examples:
  - `feature/CL-142-timesheet-week-view`
  - `docs/no-ticket-sl-0001-ux-notes`


### Worktrees (Parallel Agent Execution)

Use worktrees to run multiple agents/roles in parallel without stomping on each other’s working directory.

**Recommended layout (worktrees live outside the repo folder):**
```
chronoledger/              # main repo (main branch)
../chronoledger-wt/
  pm/
  ux/
  techlead/
  backend/
  frontend/
  qa/
  devops/
```

**Critical constraint:** a branch can only be checked out in **one** worktree at a time. This is why `main` usually stays checked out only in the primary repo folder.

**Create a worktree (example):**
```bash
mkdir -p ../chronoledger-wt
git worktree add ../chronoledger-wt/ux -b docs/no-ticket-sl-0001-ux origin/main
```

**Sync a worktree branch with `main` (preferred):**
```bash
git fetch origin
git rebase origin/main
```

If you rebase and Git stops with conflicts:
- resolve conflicts in files
- `git add <files>`
- `git rebase --continue`

**Pushing (IMPORTANT):**
- Push **only the current branch**, never all branches.
- Safe default:
  ```bash
  git push -u origin HEAD
  ```
- After a rebase (history rewritten):
  ```bash
  git push --force-with-lease origin HEAD
  ```

**Never** use `git push --all` or force-push to `main`. The `main` branch is protected; changes must go through PRs.

### Backlog Execution (Lean Mode)

This project is backlog-driven. Work should be executed from **vertical slices** and their checklists.

- Slice contract: `docs/10-governance/backlog/slices/SL-####-*.md`
- Stories: `docs/10-governance/backlog/user-stories/US-####-*.md`
- Traceability (requirements → ADRs → slices → stories): `docs/10-governance/backlog/traceability-map.md`

**Lean mode rule:** do not create separate “agent work order” docs by default. Instead:
1. Pick the next slice item(s) to implement
2. Make the minimal repo changes to complete them
3. Check off completed items in the slice checklist
4. Capture only cross-cutting decisions as ADRs

### Test-Driven Development (Strict TDD)
**This is non-negotiable** for all feature work:
1. Write a **failing test** that describes desired behavior (RED)
2. Implement **minimal code** to pass the test (GREEN)
3. **Refactor** while keeping tests green (REFACTOR)

Requirements:
- No feature code may be merged without tests
- Bug fixes must include a test that fails before the fix and passes after

### Code Quality Standards
- Follow **SOLID** principles (single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion)
- Follow **DRY** (Don't Repeat Yourself) - extract shared logic when it appears twice
- Code must be **human-readable** - clear names, small functions, minimal nesting
- Comment the **why**, not the what
- Document business rules, edge cases, non-obvious constraints

### Pull Requests
- Keep PRs **small and single-purpose**
- No drive-by refactors or reformatting unrelated code
- Use the `.github/PULL_REQUEST_TEMPLATE.md`

**PR titles must include the slice and role when applicable**:
- `[PM] Docs (SL-0001): refine acceptance criteria`
- `[UX] Docs (SL-0001): add UI states + a11y notes`
- `[Tech Lead] Docs (SL-0001): mark slice Ready + checklist`
- `SL-0001: <short implementation summary>`

PR descriptions must reference:
- Slice: `SL-####`
- Stories: `US-####` (if applicable)
- Any ADR(s) created/updated

PRs require:
- Passing tests (strict TDD followed) for code changes
- Code follows SOLID/DRY/modularity principles
- Human-readable code
- Documentation updated if needed

**Review expectation:** route discussion through PR comments. If CODEOWNERS/required reviews are configured, do not merge until the required reviewer(s) have reviewed.

## Key Files to Consult

1. **README.md** - Project overview, repo navigation
2. **AGENTS.md** - AI + developer operating rules (hard constraints, stop conditions)
3. **git-workflow.md** - Branching, PR, and Git conventions (source of truth)
4. **CONTRIBUTING.md** - Contribution standards and Definition of Done
5. **docs/02-adr/** - Architectural Decision Records (source of truth for technical decisions)
6. **docs/10-governance/backlog/** - Slices, stories, and planning docs
7. **docs/10-governance/backlog/traceability-map.md** - Requirements ↔ ADRs ↔ slices ↔ stories
8. **docs/10-governance/templates/** - Templates for ADRs, decision logs, retrospectives


## Decision Hierarchy (When Guidance Conflicts)

Follow this order:
1. Product requirements / constraints
2. ADRs (architecture decisions)
3. Project plan / checklists
4. Code comments / local module notes

**If an ADR exists for a topic, do not improvise around it.**

## Important Constraints

### Security & Correctness
- No hard-coded secrets or credentials
- Validate all inputs, sanitize all outputs
- Time-entry rules enforced at data + API level (not just UI)
- All important actions must be auditable (who/what/when/why)

### Documentation Hygiene
- When adding a doc, update `docs/README.md` and relevant index files
- ADRs must include: context, decision, consequences, status
- For completed features, create:
  - Retrospective: `docs/10-governance/retrospectives/YYYY-MM-DD__<feature-slug>.md`
  - Decision log: `docs/10-governance/decision-logs/YYYY-MM-DD__<feature-slug>__decision-log.md`

### AI-Specific Rules
- NO mass rewrites or broad style changes
- NO renaming/restructuring unless explicitly required
- Make minimal diffs that preserve surrounding code structure
- STOP and propose an ADR if:
  - Data contract between client/API is unclear
  - Conflict between docs and implementation
  - Boundary rule forces a tradeoff
  - Offline/sync behavior isn't specified

## Special Notes

### Yarn 4 Workspace
- This project uses Yarn 4 with workspaces
- Package manager is pinned: `yarn@4.12.0`
- All packages are private (not published to npm)
- Workspaces: `apps/*` and `packages/*`

### TypeScript Configuration
- Base config: `tsconfig.base.json`
- Target: ES2022
- Module: ESNext
- Module Resolution: Bundler
- Strict mode enabled

### Linting & Formatting
- ESLint with TypeScript support (flat config)
- Prettier for formatting
- Run `yarn lint` before committing
- Config: `eslint.config.mjs`, `.prettierrc.json`

## What to Read First

When starting work on this project:
1. This file (CLAUDE.md)
2. README.md (project overview and constraints)
3. AGENTS.md (hard rules and stop conditions)
4. CONTRIBUTING.md (standards and workflow)
5. ADR-0034, ADR-0035, ADR-0036 (core architectural decisions)
6. Relevant feature docs in `docs/10-governance/backlog/`

## Common Pitfalls to Avoid

1. **Don't assume apps are implemented** - Check for placeholder code first
2. **Don't put business rules in UI or controllers** - They belong in domain/model layers
3. **Don't skip TDD** - All features require test-first development
4. **Don't ignore ADRs** - They are the source of truth for technical decisions
5. **Don't create large PRs** - Keep changes small and reviewable
6. **Don't test against dev/prod databases** - Always use Testcontainers
7. **Don't use clever code** - Prefer clarity and explicit control flow