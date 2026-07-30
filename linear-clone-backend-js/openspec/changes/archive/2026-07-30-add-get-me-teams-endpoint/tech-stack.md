# Tech Selection — Linear App Clone (Backend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Backend Runtime | Node.js 24 LTS | Existing project stack; no new runtime needed | — |
| Backend Framework | Fastify 5 | Existing project stack; no new framework needed | — |
| Database | PostgreSQL 16 | Existing project stack | — |
| ORM | Drizzle ORM | Existing project stack | — |
| Cache | Redis 7 | Existing project stack | — |
| Auth | JWT (jose) + bcrypt | Existing project stack | — |
| Deployment | Docker | Existing project stack | — |

## Generated Files

The tech-selection skill references these existing docs:

| File | Source | Status |
|------|--------|--------|
| `docs/stack-backend.md` | Existing project doc | ✅ already exists |
| `docs/architecture-backend.md` | Existing project doc | ✅ already exists |
| `docs/deployment.md` | Existing project doc | ✅ already exists |

No new technology decisions are required for this change. The `GET /api/v1/me/teams` endpoint uses existing stack components (Fastify controller, Drizzle repository, JWT auth middleware) — no new libraries, infrastructure, or deployment changes.

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| — | — | — | — | No new technology decisions needed |

## ADR References

- No new ADRs required. Existing architecture decisions in `docs/architecture-backend.md` cover hexagonal layering and module structure.

## Next Steps

1. Review generated docs in `docs/` (existing docs are sufficient)
2. Proceed to design phase with tech stack confirmed
