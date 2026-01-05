# ChronoLedger — Project Plan (Spare-Time Friendly)

_Last updated: 2026-01-02_

## 1. Working Style (assumptions)

- You’ll work on this iteratively in spare time, so we optimize for:
  - Small, independent slices of work
  - High confidence via automated tests
  - Minimal rework by locking decisions early (with your approval)

## 2. Recommended Delivery Approach

### 2.1 Build in vertical slices

Each slice should include:

- UI + API + data model changes (if needed)
- Validation rules (server-side authoritative)
- Automated tests
- Updated documentation

### 2.2 Suggested sequencing (not milestones)

1) **Foundation**
   - Repo setup, CI, linting/formatting, environments
   - Auth + role enforcement + `/admin` separation
   - Base domain model + migrations
   - DB-backed audit tables (domain tables)

2) **Time Entry Core (Correctness First)**
   - Create/open/complete entries
   - UTC storage + TZ capture
   - Cross-midnight auto-split
   - Overlap blocking (authoritative server-side)
   - Display times in current device TZ + optional per-user-per-device override

3) **Locking + Unlock Approval**
   - Auto-lock on completion
   - Unlock request UI
   - Admin approval UI in `/admin`
   - Audit coverage for all relevant actions (time entry + unlock + admin actions)

4) **Rules Engine + Summaries**
   - Weekly rollups (Sun–Sat)
   - Contract/additional caps + warnings
   - ATO constraints (Mon–Fri only; 8h/day; 40h/week)
   - Pay period summary with holiday highlighting

5) **Reports + Official PDF Export (All Reports)**
   - Report filters (PP/month/year)
   - Pay-period boundaries in month/year reports
   - PDF export for all reports with consistent layout + page numbers + timestamps

6) **Pay Rates + ATO**
   - Pay rate history (effective 1st of month)
   - ATO accrual ledger + usage ledger (rate-at-accrual)
   - ATO dashboard + projections + use-or-lose

7) **Hardening**
   - Offline support (optional)
   - Conflict handling (sync)
   - Backups, monitoring, admin utilities

## 3. Technical Architecture (proposal + decision points)

### 3.1 Frontend

- Web: React + TypeScript (recommended)
- Mobile: React Native + TypeScript (recommended)

### 3.2 Backend

- API: REST (recommended for simplicity) or GraphQL
- Hosting: AWS (per requirement)

### 3.3 Auth (industry standard)

- OAuth 2.0 / OIDC
- Authorization Code Flow with PKCE
- Social provider auto-link by verified email
- Consider AWS Cognito (fits email/password + Apple/Google/Facebook well)

### 3.4 Data store (decision needed)

Two good options:

- **PostgreSQL (Aurora Serverless)**: easiest for reporting/aggregations and domain audit tables
- **DynamoDB**: lower ops, but reporting queries require careful modeling

## 4. Quality & Engineering Standards

### 4.1 Test strategy

- Unit tests: rules engine, time zone and split logic, overlap detection
- Integration tests: API + DB (including audit tables)
- UI tests: critical flows (entry create/complete, unlock request, PDF export)
- Regression tests: DST boundaries and time zone changes

### 4.2 Observability

- Structured application logs with correlation IDs (separate from audit tables)
- Metrics for report generation and PDF export failures
- Admin-only audit table viewer in `/admin`

### 4.3 Security

- RBAC enforced server-side (not just UI)
- Admin routes protected and audited
- Secure secrets management

## 5. “Definition of Done” (per work item)

- Validations implemented server-side
- Tests added/updated
- Docs updated (PRD/backlog/decision log)
- Audit entries recorded for relevant actions
- No sensitive info stored in app logs

## Locked architecture decisions

- Containerized hosting on AWS
- Auth0 authentication
