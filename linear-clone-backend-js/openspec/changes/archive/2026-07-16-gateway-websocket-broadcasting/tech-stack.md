# Tech Selection — Gateway WebSocket Module (Backend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| WebSocket Library | ws | Lightweight, battle-tested, no framework overhead, native WebSocket API | No built-in rooms/namespaces (must implement manually), no auto-reconnection |
| Connection State | In-memory Map (Node.js) | Simple, zero infrastructure dependency for initial implementation | Lost on restart; requires Redis pub/sub for horizontal scaling later |
| Auth Integration | `@fastify/jwt` / jose (existing) | Reuses existing auth module token verification | Gateway needs direct JWT verification (not Fastify hook) |
| Online Status | Redis-backed flag | Already have Redis in stack; TTL-based expiry handles crashes gracefully | Extra Redis calls on connect/disconnect |
| Event Broadcasting | In-process EventEmitter | Simple pub/sub within same process for single-instance | Not horizontally scalable without Redis pub/sub |
| Dependency | Socket.IO or ws | ws chosen for leaner dependency; no reconnection/fallback overhead | Clients must implement reconnection logic |

## Existing Stack (Confirmed)

All existing technology decisions from `docs/stack-backend.md` and `docs/architecture-backend.md` remain unchanged:

- **Runtime**: Node.js 24 LTS
- **Framework**: Fastify 5 (HTTP only; WebSocket runs alongside)
- **Database**: PostgreSQL 16 + Drizzle ORM
- **Cache**: Redis 7 (ioredis)
- **Auth**: JWT (jose) + bcrypt
- **Language**: TypeScript 5.x
- **Testing**: Vitest

## WebSocket-Specific Additions

| Library | Version | Purpose |
|---------|---------|---------|
| ws | latest | WebSocket server |
| @types/ws | latest | TypeScript types |

## Architecture Impact

- WebSocket server runs on a separate port or same port via Fastify WebSocket plugin
- Gateway module follows hexagonal architecture (same pattern as existing modules)
- Connection registry and subscription manager live in-memory
- Online status persisted to Redis

## References

- Existing stack: `docs/stack-backend.md`
- Existing architecture: `docs/architecture-backend.md`
- Tech Research Digest: `.agents/skills/repomix-reference/references/tech-research-digest.md`
