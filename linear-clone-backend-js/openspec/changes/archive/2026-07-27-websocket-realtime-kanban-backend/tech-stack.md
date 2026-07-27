# Tech Selection — WebSocket Real-Time Kanban Backend

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| WebSocket Library | `ws` (existing) | Already integrated with Fastify HTTP server; lightweight, no Socket.IO overhead | No built-in reconnection or fallback to long-polling |
| Event Bridge | In-process EventEmitter | Zero-latency, no serialization cost; single-node deployment fits | Not horizontally scalable; events lost on restart |
| Subscription Storage | In-memory Map | Fast lookups, no external dependency; sufficient for single-node | Not shared across instances; lost on restart |
| Auth Integration | JWT via `ws` upgrade handshake | Reuses existing JWT infrastructure; stateless verification | Token expiry requires reconnection |
| Channel Validation | Module port queries | Consistent with hexagonal architecture; testable | Requires cross-module dependency injection |
| Schema Validation | Zod (existing) | Already in project; type-safe validation | Already a project dependency |

## Existing Stack (Unchanged)

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Runtime | Node.js | 24 LTS | JavaScript runtime |
| Framework | Fastify | 5.x | HTTP server + WebSocket upgrade |
| Database | PostgreSQL | 16 | Persistent storage |
| ORM | Drizzle ORM | Latest | Type-safe database access |
| Cache | Redis | 7 | Session storage, rate limiting |
| Auth | jose + bcrypt | Latest | JWT tokens, password hashing |
| Language | TypeScript | 5.x | Type safety |
| Testing | Vitest | 3.x | Unit + integration tests |

## WebSocket-Specific Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| WebSocket | `ws` library | Raw WebSocket protocol, integrated with Fastify HTTP server |
| Auth Flow | JWT in first message | Authenticate within 5s timeout |
| Channel Types | `team:{id}`, `issue:{id}`, `user:{id}` | Three channel types for targeted events |
| Event Format | JSON messages | `{ type, channel, event, data, timestamp, userId }` |
| Auto-Subscribe | `autoSubscribeUserChannels()` | Subscribe to team/issue channels on auth |
| Event Bridge | `InProcessEventEmitter` → `InMemoryEventPublisher` | Bridge work module events to gateway |

## Configuration

| Variable | Default | Purpose |
|----------|---------|---------|
| `WS_PORT` | `0` | WebSocket port (0 = reuse HTTP server) |
| `WS_AUTH_TIMEOUT_MS` | `5000` | Authentication timeout (5s) |
| `WS_MAX_CONNECTIONS` | `1000` | Maximum concurrent connections |

## Generated Files

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-backend.md` | Existing (unchanged) | ✅ Already exists |
| `docs/architecture-backend.md` | Existing (unchanged) | ✅ Already exists |
| `docs/deployment.md` | Existing (unchanged) | ✅ Already exists |

## ADR References

- No new ADRs required — this change uses the existing hexagonal architecture and `ws` library already established in the project.

## Next Steps

1. Proceed to `design-backend` artifact for technical design
2. Document the event bridge pattern and channel validation strategy
3. Define the integration points with work module's `InMemoryEventPublisher`
