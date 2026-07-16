# Tech Selection — Linear App Clone (Backend)

## Decision Summary

The Cycle module does not introduce any new technology decisions. It uses the same stack already established and documented in `docs/stack-backend.md` and `docs/architecture-backend.md`.

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Backend Runtime | Node.js 24 LTS | Existing, documented in `docs/stack-backend.md` | N/A — no change |
| Backend Framework | Fastify 5 | Existing, documented in `docs/stack-backend.md` | N/A — no change |
| Database | PostgreSQL 16 | Existing, documented in `docs/stack-backend.md` | N/A — no change |
| ORM | Drizzle ORM | Existing, documented in `docs/stack-backend.md` | N/A — no change |
| Cache | Redis 7 | Existing, documented in `docs/stack-backend.md` | N/A — no change |
| Auth | JWT (jose) + bcrypt | Existing, documented in `docs/stack-backend.md` | N/A — no change |
| Deployment | TBD — existing config | Existing deployment setup applies | N/A — no change |

## Generated Files

No new files generated in `docs/`. The existing `docs/stack-backend.md` and `docs/architecture-backend.md` already cover the stack used by the Cycle module.

## Interactive Review Log

No interactive review needed — this change reuses the existing, established stack.

## ADR References

No new ADR entries required for technology decisions.

## Next Steps

1. Proceed to design phase with the existing stack
2. The Cycle module follows the same patterns as existing modules (auth, identity, work, project)
