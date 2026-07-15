# Tech Selection — Workflow Module (Backend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Backend Runtime | Node.js 24 LTS | Existing stack — all modules use it | No trade-off; consistent across project |
| Backend Framework | Fastify 5 | Existing stack — DI, validation, plugin system | No trade-off; consistent across project |
| Database | PostgreSQL 16 | Existing stack — enum support for state types (unstarted/in_progress/completed/canceled), FK constraints | No trade-off; consistent across project |
| ORM | Drizzle ORM | Existing stack — type-safe queries, migration support | Drizzle enum handling needs custom migration steps for state types |
| Cache | Redis 7 | Existing stack — not needed for v1 workflow module (state history is append-only DB, no caching required) | Slightly higher latency for history queries without cache; acceptable for v1 |
| Architecture | Hexagonal (modular monolith) | Existing pattern — new `workflow` module under `src/modules/workflow/` with domain/application/adapters layers | Consistent; no deviation needed |
| Validation | Zod schemas | Existing stack — API boundary validation + domain invariants | State type enum validation needs custom Zod enum |
| Deployment | Docker | Existing stack — no changes to deployment pipeline | No trade-off; consistent across project |

## Generated Files

The tech-selection process verified these files in `docs/`:

| File | Status |
|------|--------|
| `docs/stack-backend.md` | ✅ Already exists, no changes needed |
| `docs/architecture-backend.md` | ✅ Already exists, no changes needed |
| `docs/deployment.md` | ✅ Already exists, no changes needed |

> All stack and architecture decisions are consistent with this change's requirements. The Workflow Module follows the same patterns as existing modules.

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| 1 | All | Existing stack decisions | — | Approved as-is |

## Next Steps

1. Proceed to design phase with tech stack now confirmed
2. Design-backend will detail the hexagonal module structure, Drizzle schema, and validation service
