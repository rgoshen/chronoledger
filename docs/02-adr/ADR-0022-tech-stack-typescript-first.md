# ADR-0022: Primary Languages and Application Frameworks (TypeScript-First)

- Status: Accepted
- Date: 2026-01-02
## Context
ChronoLedger needs:
- A web app usable on a work computer
- Mobile apps for iOS and Android
- An API service and a worker service (ECS/Fargate)
- Shared types and utilities (time rules, DTOs) while keeping server authoritative
- Maintainability for a solo developer now, scalable to a team later
- PDF generation via headless Chromium (ADR-0018), which has strong tooling in the Node ecosystem

We want to minimize cognitive/context switching and maximize shared code where appropriate.

## Decision
Adopt a **TypeScript-first** stack across clients and services:

### Web
- **React + TypeScript** (SPA)
- Hosted on S3 + CloudFront (ADR-0014)

### Mobile
- **React Native + TypeScript** (single codebase for iOS + Android)
- Uses platform secure storage for device ID and tokens

### Backend API
- **Node.js + TypeScript** using **NestJS** (or equivalent structured framework)
- REST API conventions per ADR-0015

### Worker
- **Node.js + TypeScript**
- Uses Playwright (headless Chromium) for PDF rendering per ADR-0018
- Consumes SQS jobs per ADR-0011

### Data access
- PostgreSQL on RDS (ADR-0010)
- Use a typed ORM (**Prisma** (approved) for typed data access and migrations) + migrations; server remains source of truth for rules and validation.

## Consequences
- ✅ Single primary language across most of the system (faster development)
- ✅ Strong type sharing (DTOs, enums) between web/mobile and API
- ✅ Excellent ecosystem support for PDF rendering via Chromium
- ✅ Easier hiring/onboarding later (common modern stack)
- ⚠️ React Native adds some mobile-specific build/release complexity
- ⚠️ Prisma/ORM choice must be disciplined to preserve 3NF and clear boundaries
- ⚠️ If future needs demand native-only mobile features, may require modules or native bridging

## Alternatives Considered
- Java (Spring Boot) API + TS clients: rejected to avoid polyglot overhead (still viable later if needed).
- Native iOS/Android: rejected for early-stage velocity and duplicated effort.
- Flutter/Dart: viable, but rejected to keep one language (TypeScript) across web/mobile/backend.

## Notes/Links
- See `chronoledger-tech-stack.md` for a concrete package list and boundary rules.
