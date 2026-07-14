# Tech Selection — Linear App Clone Backend

## Decision Summary

The technology stack for this change is inherited from the existing project. No new technology decisions are required — this change adds domain logic to the Identity Module using the established stack.

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Backend Runtime | Node.js 24 LTS | Existing project stack — documented in `docs/stack-backend.md` | Consistent with codebase |
| Backend Framework | Fastify 5 | Existing project stack — documented in `docs/stack-backend.md` | Consistent with codebase |
| Database | PostgreSQL 16 | Existing project stack — documented in `docs/stack-backend.md` | Consistent with codebase |
| ORM | Drizzle ORM | Existing project stack — documented in `docs/stack-backend.md` | Consistent with codebase |
| Cache | Redis 7 | Existing project stack — documented in `docs/stack-backend.md` | Not needed for team/membership domain |
| Auth | JWT (jose) + bcrypt | Existing project stack — documented in `docs/stack-backend.md` | Consistent with codebase |
| Architecture | Hexagonal (Ports & Adapters) | Existing project architecture — documented in `docs/architecture-backend.md` | Consistent with codebase |

## Generated Files

The tech stack is already defined in the existing project documentation:

| File | Source | Status |
|------|--------|--------|
| `docs/stack-backend.md` | Existing project doc | Already defined |
| `docs/architecture-backend.md` | Existing project doc | Already defined |
| `docs/deployment.md` | Existing project doc | Already defined |

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| N/A | All | Existing project stack | No challenge | Approved — change does not introduce new technology decisions |

## ADR References

No new ADRs required — this change follows existing architectural decisions.

## Next Steps

1. Proceed to design phase with tech stack confirmed
2. Design backend implementation for Team Management (2.3) and Team Membership (2.4)
3. Create implementation tasks
