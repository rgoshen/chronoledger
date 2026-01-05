# ChronoLedger — Tech Stack Summary

_Last updated: 2026-01-02_

## 1) Languages

- Primary: **TypeScript**
- Runtime: **Node.js** (API + Worker)
- Database: **PostgreSQL**
- IaC: see ADR-0023

## 2) Frameworks

- Web: React + TypeScript
- Mobile: React Native + TypeScript
- API: NestJS + TypeScript
- Worker: Node + TypeScript (Playwright for PDF)

## 3) Libraries (recommended starting set)

- API:
  - NestJS modules: config, validation, JWT verification (Auth0)
  - Validation: zod (or class-validator if staying idiomatic Nest)
  - Logging: pino (JSON logs)
  - DB: Prisma
- Worker:
  - AWS SDK (SQS/S3)
  - Playwright (Chromium)
  - Same logging conventions as API

## 4) Guardrails

- The API is authoritative for:
  - overlap detection
  - lock/unlock workflow enforcement
  - weekly rules (ATO Mon–Fri only; 8h/day cap; 40h max per 5-day week)
- Shared packages may include:
  - enums/types
  - pure time utilities (UTC conversion helpers)
  - non-security-critical validation for UX only

## 5) Build outputs

- Web: static assets → S3
- API/Worker: Docker images → ECR → ECS
- Mobile: app store builds (later), but architecture supports device sync now
