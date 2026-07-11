# Tech Selection — Linear App Clone Backend

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Backend Runtime | Node.js 24 LTS | Modern async I/O, TypeScript support, fast startup | Single-threaded, requires clustering for CPU-intensive tasks |
| Package Manager | pnpm | Fast, disk-efficient, strict dependency resolution | Smaller ecosystem than npm, some compatibility edge cases |
| Backend Framework | Fastify | High performance, schema-based validation, TypeScript-first | Smaller ecosystem than Express, less middleware available |
| Database | PostgreSQL 16 | ACID, JSON support, full-text search, mature | Heavier than SQLite, requires separate service |
| ORM | Drizzle ORM | Type-safe, lightweight, SQL-like API, auto migrations | Newer than TypeORM/Prisma, smaller community |
| Cache / Sessions | Redis | In-memory, fast, pub/sub support, widely used | Extra service dependency, persistence requires config |
| JWT Library | jose | Lightweight, JOSE standards, Edge Runtime compatible | Newer than jsonwebtoken, less tutorials available |
| Password Hashing | bcrypt | Industry standard, adaptive, built-in to Node.js | Slower than scrypt, but battle-tested |
| Testing | Vitest | Fast, ESM-native, TypeScript-first, Jest-compatible | Newer than Jest, some plugins not yet available |
| Containerization | Docker | Industry standard, consistent environments | Requires Dockerfile maintenance, image size concerns |
| Deployment | Docker Compose | Simple local dev, single-node production | No built-in scaling, manual orchestration |

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| 1 | Backend Runtime | Node.js 24 | — | Approved |
| 2 | Backend Framework | Fastify | — | Approved |
| 3 | Database | PostgreSQL | — | Approved |
| 4 | ORM | Drizzle ORM | — | Approved |
| 5 | Cache | Redis | — | Approved |
| 6 | JWT | jose | — | Approved |
| 7 | Password Hashing | bcrypt | — | Approved |
| 8 | Testing | Vitest | — | Approved |
| 9 | Deployment | Docker Compose | — | Approved |

## ADR References

- ADR-0001: Backend framework selection (Fastify) — see `adr.md` for full record.
- ADR-0002: Database selection (PostgreSQL + Drizzle) — see `adr.md` for full record.
- ADR-0003: Auth strategy (JWT + bcrypt + Redis sessions) — see `adr.md` for full record.

## Next Steps

1. Review generated docs in `docs/`
2. Proceed to design phase with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design
