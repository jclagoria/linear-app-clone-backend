# Project Module — Technology Stack

## Decision Summary

The Project module uses the same established stack as the rest of the backend. No new technologies are required.

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Backend Runtime | Node.js 24 LTS | Existing, team-proven | None for this module |
| Backend Framework | Fastify 5 | Existing, all modules use Fastify | Consistent with codebase |
| Database | PostgreSQL 16 | Existing, ACID compliance needed for project lifecycle | None |
| ORM | Drizzle ORM | Existing, type-safe, SQL-like | Must define new schema and generate migration |
| Auth | JWT (jose) + bcrypt | Existing, stateless tokens | Same pattern as all other modules |
| Cache | Redis 7 | Existing (if needed for future optimization) | Not required for CRUD |
| API Protocol | REST (JSON) | Existing | Consistent with codebase |
| Testing | Vitest | Existing | Pattern established |

## Generated Files

Existing docs (no changes needed):

| File | Status |
|------|--------|
| `docs/stack-backend.md` | Already defined — no updates needed |
| `docs/architecture-backend.md` | Already defined — no updates needed |
| `docs/deployment.md` | Already defined — no updates needed |

## Key Implementation Details

- **Database**: New `projects` table using Drizzle's `pgTable`, following existing patterns in `src/modules/*/domain/*.ts`
- **Migration**: Generated via `pnpm db:generate` after schema definition
- **Validation**: Zod schemas at API boundary (same pattern as work module)
- **Repository**: Drizzle-based implementation following `drizzle-issue-repository.ts` pattern
- **Error handling**: Domain error classes following existing pattern (`ProjectNotFoundError`, etc.)

## ADR References

No new architectural decisions required — this module follows existing patterns established in the codebase.

## Next Steps

1. Proceed to design phase with the established stack
2. Define `projects` table schema using Drizzle
3. Implement use cases following existing patterns
4. Register routes in `src/app.ts`
