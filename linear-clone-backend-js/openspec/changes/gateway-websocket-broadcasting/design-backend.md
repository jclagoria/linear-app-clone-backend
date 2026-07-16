# Gateway — Backend Design

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| WebSocket Library | ws | Lightweight, no framework overhead; native WebSocket API |
| Server Integration | Standalone ws.Server alongside Fastify | Decoupled lifecycle; no Fastify WebSocket plugin needed |
| Connection Registry | In-memory Map<string, Connection> | Simple, fast; lost on restart (acceptable for initial version) |
| Subscription Manager | In-memory Map<channel, Set<connectionId>> | O(1) lookups for broadcasting |
| Online Status | Redis SET with TTL | Survives gateway restart; TTL handles unclean disconnects |
| Event Broadcasting | In-process EventEmitter + direct iteration | Single-instance; Redis pub/sub when scaling needed |
| Module Architecture | Hexagonal (Ports & Adapters) | Consistent with existing modules |

## Module Structure

```
src/modules/gateway/
  domain/
    connection.ts         # Connection entity + value objects
    channel.ts            # Channel value object
    event.ts              # Event envelope type
  application/
    ports/
      in/
        authenticate-use-case.ts     # Auth message handler
        subscribe-use-case.ts        # Subscribe message handler
        unsubscribe-use-case.ts      # Unsubscribe message handler
        event-broadcaster.ts         # Event broadcast port
      out/
        connection-repository.ts     # Connection storage port
        subscription-repository.ts   # Subscription storage port
    authenticate-connection.ts       # Authenticate use case
    manage-subscription.ts           # Subscribe/unsubscribe use case
    broadcast-event.ts               # Broadcast event use case
    manage-online-status.ts          # Online/offline status use case
  adapters/
    in/
      websocket-server.ts            # ws.Server setup + message router
      message-handler.ts             # Message dispatcher (authenticate, subscribe, etc.)
    out/
      in-memory-connection-repository.ts   # Connection store
      in-memory-subscription-repository.ts # Subscription store
      redis-online-status.ts               # Online status adapter
      in-process-event-emitter.ts          # Local event emitter
  __tests__/
    authenticate-connection.test.ts
    manage-subscription.test.ts
    broadcast-event.test.ts
    websocket-integration.test.ts
```

## API Contracts

No REST endpoints. All communication is via WebSocket message protocol (see `specs/api/websocket-protocol.md`).

### WebSocket Server

- **Port**: Same HTTP port via server upgrade or separate WS port (configurable via `WS_PORT` env var)
- **Path**: `/ws`
- **Max payload**: 100 KB

### Message Router

```
WS Message (JSON parse)
  → type === "authenticate" → AuthenticateConnection use case
  → type === "subscribe"    → ManageSubscription use case
  → type === "unsubscribe"  → ManageSubscription use case
  → type === "ping"         → pong response
  → unknown                 → { type: "error", message: "unknown_message_type" }
```

## Data Model

No database tables required for initial version. Connection and subscription state lives in memory. Online status uses Redis.

### Connection (in-memory)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | string (UUID) | PK, not null | Generated on auth success |
| userId | string (UUID) | not null | Authenticated user |
| ws | WebSocket | not null | Raw WebSocket reference |
| status | enum | authenticating, connected, disconnected | Current state |

### Subscription (in-memory)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| connectionId | string | PK (compound) | |
| channel | string | PK (compound) | `team:{id}`, `issue:{id}`, `user:{id}` |

### Redis Online Status

| Key | Type | TTL | Notes |
|-----|------|-----|-------|
| `online:{userId}` | String | 30s (refreshed on ping) | "1" if online |

## Business Logic

### AuthenticateConnection

- **Responsibility**: Verify JWT, create connection record, set up auto-subscriptions, mark user online
- **Rules**:
  - Token MUST be a valid JWT (verified via jose, reusing auth module's public key/secret)
  - On success: assign connection ID, set status → connected, auto-subscribe to channels, mark user online
  - On failure: send error, close connection
  - Auth timeout: 5 seconds (configurable via `WS_AUTH_TIMEOUT_MS` env var)
- **Dependencies**: TokenService (auth module), ConnectionRepository, SubscriptionRepository, OnlineStatus

### ManageSubscription

- **Responsibility**: Subscribe/unsubscribe a connection to/from a channel
- **Rules**:
  - Channel format MUST match `{type}:{id}` (team, issue, user)
  - User MUST have access to the channel (team member, issue watcher/assignee, or own user channel)
  - Duplicate subscription is idempotent
  - Unsubscribe from non-subscribed channel is silently ignored
- **Dependencies**: ConnectionRepository, SubscriptionRepository, Channel access check (user service)

### BroadcastEvent

- **Responsibility**: Send event to all connections subscribed to a channel
- **Rules**:
  - Event MUST include: type, channel, event name, data, timestamp, userId
  - Each subscribed connection receives the event as JSON
  - Failed connections (write error) are removed and marked disconnected
  - If a connection fails, check if user should be marked offline
- **Dependencies**: SubscriptionRepository, WebSocket connections list

### ManageOnlineStatus

- **Responsibility**: Track user online/offline state via Redis
- **Rules**:
  - On first connection: set `online:{userId}` → "1" with 30s TTL
  - On last disconnection: remove `online:{userId}`
  - On ping: refresh TTL (connection is alive)
  - TTL handles crash/network loss graceful degradation

## Security

- **Authentication**: JWT (jose) — token sent as first WebSocket message
- **Authorization**: Channel access validated per subscribe request
- **Input Sanitization**: All messages JSON-parsed with Zod schema validation
- **Timeout**: Unauthenticated connections terminated after 5 seconds
- **Rate Limiting**: (Out of scope for initial version)

## Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | AuthenticateConnection, ManageSubscription, BroadcastEvent use cases |
| Unit | Vitest | Connection/Channel domain entities |
| Integration | Vitest + Testcontainers | Redis online status adapter |
| Integration | Vitest + ws client | Full WebSocket connect → auth → subscribe → event flow |
| Contract | Vitest | Message format compliance (request/response schemas) |

### Key Test Scenarios

- Valid token → authenticated → auto-subscribed → receives events
- Invalid token → error → connection closed
- Auth timeout → error → connection closed
- Subscribe to team channel → receives team events
- Unsubscribe → stops receiving events
- Multiple connections per user → both receive events
- User online → connect → online flag set → disconnect → flag removed
- Concurrent connections: one disconnects, others remain, user stays online
