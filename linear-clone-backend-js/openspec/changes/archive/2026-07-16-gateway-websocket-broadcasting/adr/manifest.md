# ADR Manifest — Gateway WebSocket & Broadcasting

- Status: completed
- Review date: 2026-07-16

## Review Summary

ADR review completed for this change. Four significant architectural decisions were identified and recorded.

## In-Force ADRs Reviewed

- None — `adr/` has no in-force ADRs at repo level.

## New Durable ADRs Created

| File | Title | Status |
|------|-------|--------|
| `adr/001-websocket-library.md` | Use `ws` Library for WebSocket Server | Accepted |
| `adr/002-connection-state-strategy.md` | Store Connection and Subscription State In-Memory | Accepted |
| `adr/003-event-broadcasting-strategy.md` | Use In-Process EventEmitter for Event Broadcasting | Accepted |
| `adr/004-online-status-redis.md` | Track Online Status in Redis with TTL | Accepted |

## Decisions Not Recorded

- Hexagonal architecture for gateway module — follows existing project-wide convention (already established in `docs/architecture-backend.md`), no new decision needed.
- ws server port strategy (separate vs shared with Fastify) — implementation detail, not architecturally significant.
- Channel access validation approach — implementation detail within existing auth patterns.
