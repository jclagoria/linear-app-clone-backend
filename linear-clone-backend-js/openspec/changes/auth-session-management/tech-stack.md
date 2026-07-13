# Tech Selection — Auth Session Management (Backend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Backend Runtime | Node.js 24 LTS | Already in use, ESM-native | None — existing |
| Backend Framework | Fastify 5 | Already in use, schema validation | None — existing |
| Database | PostgreSQL 16 | Already in use, relational sessions table | None — existing |
| ORM | Drizzle ORM | Already in use, type-safe queries | None — existing |
| Cache / Session Store | Redis 7 | Already in use, TTL support, fast reads | None — existing |
| Auth | JWT (jose) + bcrypt | Already in use, refresh token hashing | None — existing |
| Event Emission | In-process event bus | Lightweight audit events, no new infra | Not distributed — events lost on crash |

## Generated Files

The following files already exist and require no changes for this feature:

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-backend.md` | — | No changes needed |
| `docs/architecture-backend.md` | — | No changes needed |
| `docs/deployment.md` | — | No changes needed |

> **Note**: This change uses the existing stack with no new technology selections. All decisions are inherited from prior setup.

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| 1 | Session Store | Redis 7 | PostgreSQL only | Approved — Redis for fast session lookups, PostgreSQL for durable sessions table |

## Rationale

Session management fits naturally into the existing stack:

- **Redis**: Handles fast session lookups for `last_activity_at` updates during token refresh and supports TTL-based expiry. Ideal for the session cache layer.
- **PostgreSQL**: The `sessions` table provides durable storage with relational integrity (FK to users). Supports listing, filtering, and querying sessions.
- **No new dependencies**: This feature adds domain logic and API endpoints using existing libraries (Fastify, Drizzle, ioredis, jose, bcrypt).

## ADR References

None — no new architectural decisions for this change. Existing architecture decisions in `docs/architecture-backend.md` apply.

## Next Steps

1. Proceed to design phase with existing tech stack confirmed
2. No new technology research needed
