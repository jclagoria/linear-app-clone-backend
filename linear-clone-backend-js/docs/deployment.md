# Deployment — Linear App Clone Backend

## Overview

The backend is deployed using Docker Compose for local development and single-node production. Services run in containers with persistent volumes for data.

## Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                    Docker Compose                        │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Backend   │  │  PostgreSQL │  │    Redis    │    │
│  │  (Fastify)  │  │             │  │             │    │
│  │   :3000     │  │   :5432     │  │   :6379     │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Infrastructure

| Component | Service | Notes |
|-----------|---------|-------|
| Runtime | Docker Compose | Single-node deployment |
| Database | PostgreSQL 16 | Persistent volume |
| Cache | Redis 7 | Persistent volume |
| Backend | Node.js 24 | Multi-stage Docker build |

## Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/linear
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=linear
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - '5432:5432'

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - '6379:6379'

volumes:
  postgres_data:
  redis_data:
```

## Backend

- **Container**: Multi-stage Dockerfile (build + production)
- **Port**: 3000
- **Health**: `GET /api/health` — liveness + readiness probes
- **Env vars**: `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `NODE_ENV`
- **Replicas**: 1 (single node), scalable with Docker Swarm or K8s

### Dockerfile

```dockerfile
# Build stage
FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Production stage
FROM node:24-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

## CI/CD

| Step | Tool | Action |
|------|------|--------|
| CI | GitHub Actions | Lint, test, build, containerize |
| CD | Docker Compose | Deploy to environment |
| Environments | dev → production | Promotion strategy: manual |

### Pipeline

```yaml
name: deploy
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - checkout
      - setup-node
      - pnpm install
      - pnpm lint
      - pnpm test
      - pnpm build
  deploy:
    needs: test
    steps:
      - docker build
      - docker push
      - docker compose up -d
```

## Monitoring

| Tool | Purpose |
|------|---------|
| Fastify logging | Request/response logs |
| PostgreSQL logs | Database queries, errors |
| Redis CLI | Cache inspection |
| Docker stats | Container metrics |

## Backup & Recovery

- **Database**: Daily pg_dump, WAL archiving
- **Redis**: RDB snapshots + AOF
- **Config**: docker-compose.yml versioned in git
- **Recovery time objective**: 30 minutes
- **Recovery point objective**: 5 minutes

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/linear` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | Secret key for JWT signing | (required) |
| `JWT_ACCESS_EXPIRY` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token expiry | `7d` |
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `RATE_LIMIT_LOGIN` | Login rate limit | `5` |
| `RATE_LIMIT_REGISTER` | Register rate limit | `3` |
| `SESSION_LIMIT` | Max sessions per user | `10` |
