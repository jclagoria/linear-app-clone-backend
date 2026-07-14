# Tech Selection — Linear App Clone (Backend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Backend Runtime | Node.js 24 LTS | ESM-native, high I/O throughput, team expertise | Not suitable for CPU-bound workloads |
| Backend Framework | Fastify 5 | High performance, schema validation, TypeScript-first | Smaller ecosystem than Express |
| Database | PostgreSQL 16 | Relational, ACID, JSON support, mature ORM ecosystem | Heavier than SQLite for local dev |
| ORM | Drizzle ORM | SQL-first, compile-time safety, lightweight | Fewer community resources than Prisma |
| Cache | Redis 7 | Fast pub/sub, session management, TTL support | Additional infrastructure dependency |
| Auth | JWT (jose) + bcrypt | Stateless tokens, dual token pattern (access + refresh) | Token revocation requires Redis |
| Validation | Zod | TypeScript-first, composable schemas | Runtime overhead on large payloads |
| Testing | Vitest 3 | ESM-native, Jest-compatible, fast | Newer tooling with smaller community |
| Real-time | WebSocket (Socket.IO or ws) | Live updates for collaborative features | Adds connection state management |
| Containerization | Docker + Compose | Parity between dev and prod environments | Single-node only; needs K8s for scale |

## Generated Files

The tech-selection skill generated these files in `docs/`:

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-backend.md` | `openspec/schemas/backend-schema/templates/technology/stack-templates.md` | ✅ already exists |
| `docs/architecture-backend.md` | `openspec/schemas/backend-schema/templates/technology/architecture-templates.md` | ✅ already exists |
| `docs/deployment.md` | `openspec/schemas/backend-schema/templates/technology/deployment-templates.md` | ✅ already exists |

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| 1 | Backend Framework | Express | Fastify | Approved — Fastify chosen for performance + TypeScript-first |
| 2 | ORM | Prisma | Drizzle ORM | Approved — SQL-first, compile-time safety, lighter (ADR-005) |
| 3 | Testing | Jest | Vitest | Approved — ESM-native, 2-3x faster (ADR-010) |
| 4 | Lint | Biome | ESLint | Approved — Layer-aware boundary enforcement (ADR-009) |

## ADR References

- ADR-001: Clean Architecture (Hexagonal) — Enforce dependency direction; testability
- ADR-005: Drizzle ORM — SQL-first, compile-time safety over Prisma
- ADR-009: ESLint + @typescript-eslint — Only tool with layer-aware boundary rules
- ADR-010: Vitest over Jest — ESM-native, 2-3x faster, Jest-compatible API

## Next Steps

1. Review generated docs in `docs/`
2. Proceed to design phase with tech stack now defined
3. Update ADRs if new architectural decisions emerge during design
