# ADR-0014: Web Frontend Hosting via S3 + CloudFront

- Status: Accepted
- Date: 2026-01-02

## Context
ChronoLedger includes a web application that must run on a work computer and should load quickly and reliably. We want a standard, cost-effective static hosting approach.

## Decision
Host the web frontend (SPA) as static assets in **S3**, fronted by **CloudFront**.

- S3 stores versioned build artifacts
- CloudFront provides caching, TLS, and global edge delivery
- Deployments invalidate/roll forward CloudFront as needed

## Consequences
- ✅ Low operational overhead and good performance
- ✅ Cost-effective for static content
- ✅ Clean separation from API runtime concerns
- ⚠️ Requires correct SPA routing configuration (fallback to index.html)
- ⚠️ Deployment must manage cache invalidations appropriately

## Alternatives Considered
- Hosting web within the API container: rejected to keep concerns separated and deployments independent.
