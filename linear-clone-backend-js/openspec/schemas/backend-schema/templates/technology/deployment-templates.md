# Deployment

> Template — replace with actual project deployment configuration.

## Overview

{One-paragraph description of the deployment target.}

## Architecture

```text
{ASCII diagram of deployment architecture}
```

## Infrastructure

| Component | Service | Notes |
|-----------|---------|-------|
| Cloud | {AWS / GCP / Azure / self-hosted} | Region: {us-east-1} |
| Container | {Docker / none} | Image registry: {GHCR / Docker Hub} |
| Orchestration | {Kubernetes / Docker Compose / none} | Cluster: {EKS / GKE / self} |
| Database | {PostgreSQL} | Managed: {RDS / Cloud SQL / self} |
| Cache | {Redis} | Managed: {ElastiCache / Memorystore / self} |
| Domain | {kanban.app} | DNS: {Cloudflare / Route53} |
| CDN | {Cloudflare / CloudFront / none} | Static assets |

## CI/CD

| Step | Tool | Action |
|------|------|--------|
| CI | {GitHub Actions / GitLab CI} | Lint, test, build, containerize |
| CD | {ArgoCD / GitHub Actions} | Deploy to environment |
| Environments | dev → staging → production | Promotion strategy: {blue-green / rolling / canary} |

### Pipeline

```yaml
name: {deploy-name}
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - {checkout, setup, lint, test, build}
  deploy:
    needs: test
    steps:
      - {containerize, push, deploy}
```

## Backend

- **Container**: {Dockerfile with multi-stage build}
- **Port**: {8080}
- **Health**: `GET /api/health` — liveness + readiness probes
- **Env vars**: `DATABASE_URL`, `JWT_SECRET`, `REDIS_URL`
- **Replicas**: {3} min, {10} max (HPA based on CPU)

## Frontend

- **Build**: {Next.js standalone output}
- **Static files**: served via {CDN / nginx / same origin}
- **Env vars**: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WS_URL`
- **Cache**: {ISR / static generation / SSR}

## Monitoring

| Tool | Purpose |
|------|---------|
| {Prometheus + Grafana} | Metrics, dashboards, alerts |
| {ELK / Loki} | Structured logging |
| {Sentry / DataDog} | Error tracking, APM |
| {PagerDuty / OpsGenie} | Incident alerting |

## Backup & Recovery

- **Database**: Daily snapshot, WAL archiving, PITR
- **Config**: Infrastructure as Code ({Terraform / Pulumi / Helm})
- **Recovery time objective**: {1 hour}
- **Recovery point objective**: {5 minutes}
