# ADR-0012: Official PDF Export Pipeline (Worker → S3 → Signed Download)

- Status: Accepted
- Date: 2026-01-02

## Context

All reports must have official PDF exports. PDFs should be:

- consistent across platforms
- reproducible and auditable
- downloadable from web and mobile

We need a storage strategy that supports secure delivery.

## Decision

Use a server-side PDF pipeline:

1) Client requests export.
2) API enqueues a PDF job to SQS.
3) Worker generates PDF, stores it in **S3** under a controlled prefix.
4) API provides download access via **short-lived signed URLs** (or CloudFront signed URLs if we front S3 later).

## Consequences

- ✅ Consistent “official” output (server-generated)
- ✅ Keeps heavy work off the request path
- ✅ Secure distribution with expiring URLs
- ✅ Storage durability and versioning options in S3
- ⚠️ Requires lifecycle policy for old exports (storage management)
- ⚠️ Must ensure PDFs contain correct display time zone context

## Alternatives Considered

- Client-side PDF generation: rejected due to inconsistent rendering and “official export” requirements.
