# ChronoLedger — Infrastructure Approach (IaC)

_Last updated: 2026-01-02_

## 1) Modules (recommended)
- `networking` (VPC, subnets, route tables, NAT, security groups)
- `ecs` (cluster, services, task defs, autoscaling)
- `rds_postgres` (DB instance, subnet group, parameter group)
- `s3_web` (web bucket, policies)
- `cloudfront_web` (distribution, TLS, SPA routing)
- `s3_exports` (PDF exports bucket, lifecycle policy)
- `iam` (roles for ECS tasks, GitHub OIDC deploy role)
- `observability` (log groups, alarms, dashboards)

## 2) Environment layout
```text
infra/terraform/
  modules/
    networking/
    ecs/
    rds_postgres/
    s3_web/
    cloudfront_web/
    s3_exports/
    iam/
    observability/
  environments/
    dev/
      main.tf
      variables.tf
      backend.tf
    staging/
      ...
    prod/
      ...
```

## 3) Promotion flow
- Merge infra changes to main
- Apply to `dev`
- Promote to `staging`
- Promote to `prod` with manual approval gates

## 4) Drift control
- Run `tofu plan` in CI on PRs for infra changes
- Require approval before `tofu apply` in staging/prod

## 5) Naming conventions
- Prefix resources with `chronoledger-<env>-...`
- Keep tags consistent (env, service, owner, cost-center)
