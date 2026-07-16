# Tech Selection — Notification Module (Backend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Backend Runtime | Node.js 24 LTS | Existing project stack, team expertise | None for this module |
| Backend Framework | Fastify 5 | Existing project stack, DI pattern | None for this module |
| Database | PostgreSQL 16 | Existing project stack, store-and-forward requires relational storage | None for this module |
| ORM | Drizzle ORM | Existing project stack, type-safe queries | None for this module |
| Real-time Delivery | Gateway Module (existing) | Notification module delegates WebSocket delivery to Gateway — no new real-time infra needed | Tight coupling to Gateway module |
| Notification Expiry | Database cleanup job (cron/SET scheduler) | Simple TTL-based cleanup, no event bus needed | Manual cleanup job must be maintained |

## Generated Files

The existing project stack files already cover this module:

| File | Source | Status |
|------|--------|--------|
| `docs/stack-backend.md` | Existing project doc | Already defined |
| `docs/architecture-backend.md` | Existing project doc | Already defined |
| `docs/deployment.md` | Existing project doc | Already defined |

No new technology decisions are required beyond the existing project stack. The Notification module follows the same patterns as auth, identity, work, and other modules.

## Notification-Specific Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Notification event ingestion | Synchronous service calls from Work/Cycle modules | Simple push model; events are triggered inline from existing use cases |
| Database storage | PostgreSQL `notifications` table with `expires_at` | Store-and-forward pattern; no separate queue needed for v1 |
| Read status tracking | `read_at` column (nullable timestamp) | Simpler than separate read-receipts table; NULL = unread pattern |
| Expiration mechanism | SQL WHERE clause exclusion + periodic DELETE batch job | 90-day TTL doesn't require Redis TTL; DB cleanup is sufficient for v1 |
| Preferences storage | JSONB column in `notification_preferences` | Flexible per-type toggles without schema changes |

## ADR References

No new ADRs required — existing technology decisions are sufficient.

## Next Steps

1. Proceed to design phase with confirmed tech stack
2. Design-backend artifact will detail module structure, repository patterns, and event flow
