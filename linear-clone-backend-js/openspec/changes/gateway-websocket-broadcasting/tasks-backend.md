# Tasks — Gateway WebSocket & Broadcasting (Backend)

## Scaffold

- [ ] Install `ws` and `@types/ws` npm packages
- [ ] Create `src/modules/gateway/` directory structure with `domain/`, `application/`, `adapters/in/`, `adapters/out/`, `__tests__/`
- [ ] Create barrel export `src/modules/gateway/index.ts`
- [ ] Register gateway module in app composition root (`src/app.ts`)

## Domain Layer

- [ ] Create `domain/connection.ts` — `Connection` entity with fields: id (UUID), userId, ws (WebSocket), status (enum: authenticating | connected | disconnected)
- [ ] Create `domain/channel.ts` — `Channel` value object with channel type enum (team | issue | user) and channel ID, validation for `{type}:{id}` format
- [ ] Create `domain/event.ts` — `GatewayEvent` type with fields: type, channel, event, data, timestamp, userId
- [ ] Create `domain/message.ts` — WebSocket message type definitions for all client→server and server→client messages

## Application Layer — Ports

- [ ] Create `application/ports/in/authenticate-use-case.ts` — port interface for `execute(token, connectionId) => Promise<AuthResult>`
- [ ] Create `application/ports/in/subscribe-use-case.ts` — port interface for `execute(connectionId, channel) => Promise<void>`
- [ ] Create `application/ports/in/unsubscribe-use-case.ts` — port interface for `execute(connectionId, channel) => Promise<void>`
- [ ] Create `application/ports/in/event-broadcaster.ts` — port interface for `broadcast(event) => Promise<void>`
- [ ] Create `application/ports/in/disconnect-handler.ts` — port interface for `handleDisconnect(connectionId) => Promise<void>`
- [ ] Create `application/ports/out/connection-repository.ts` — port interface: `save(Connection)`, `findById(id)`, `deleteById(id)`, `findByUserId(userId)`, `findAll()`
- [ ] Create `application/ports/out/subscription-repository.ts` — port interface: `add(connectionId, channel)`, `remove(connectionId, channel)`, `findByChannel(channel)`, `findByConnection(connectionId)`, `removeAllForConnection(connectionId)`
- [ ] Create `application/ports/out/online-status.ts` — port interface: `setOnline(userId)`, `setOffline(userId)`, `isOnline(userId)`
- [ ] Create `application/ports/out/token-verifier.ts` — port interface: `verify(token) => Promise<{ userId, sub }>`

## Application Layer — Use Cases

- [ ] Create `application/authenticate-connection.ts` — `AuthenticateConnection` use case: verify JWT, create connection, auto-subscribe to channels, mark user online, send `authenticated` response
- [ ] Create `application/manage-subscription.ts` — `ManageSubscription` use case: subscribe/unsubscribe, validate channel access, idempotent operations
- [ ] Create `application/broadcast-event.ts` — `BroadcastEvent` use case: look up channel subscribers, send event to each connection, handle write errors
- [ ] Create `application/handle-disconnect.ts` — `HandleDisconnect` use case: remove connection, cleanup subscriptions, update online status
- [ ] Create `application/auto-subscription.ts` — auto-subscription logic: team channels, watched issue channels, own user channel

## Adapters — Inbound

- [ ] Create `adapters/in/websocket-server.ts` — `WebSocketServer` class: create `ws.Server`, accept connections, manage auth timeout (5s configurable), route messages
- [ ] Create `adapters/in/message-handler.ts` — message dispatcher: parse JSON, validate schema (Zod), route to correct use case by `type` field, handle unknown types
- [ ] Create `adapters/in/auth-timeout.ts` — timer logic for 5-second auth window per connection

## Adapters — Outbound

- [ ] Create `adapters/out/in-memory-connection-repository.ts` — implements `ConnectionRepository` with `Map<string, Connection>`
- [ ] Create `adapters/out/in-memory-subscription-repository.ts` — implements `SubscriptionRepository` with `Map<string, Set<string>>`
- [ ] Create `adapters/out/redis-online-status.ts` — implements `OnlineStatus` using Redis SET with 30s TTL, immediate delete on clean disconnect
- [ ] Create `adapters/out/in-process-event-emitter.ts` — implements `EventBus` using Node.js EventEmitter
- [ ] Create `adapters/out/jwt-token-verifier.ts` — implements `TokenVerifier` using jose (reuses auth module verification logic)

## Integration — App Setup

- [ ] Wire gateway module in `src/app.ts`: instantiate `ws.Server`, start on configurable port/path
- [ ] Integrate with auth module for JWT token verification (validate-token use case)
- [ ] Add environment variables: `WS_PORT`, `WS_AUTH_TIMEOUT_MS` with defaults
- [ ] Configure CORS/origin validation for WebSocket upgrade (if same-port mode)

## Events / Messaging

- [ ] Define gateway event channel constants in `src/shared/events.ts` (channel patterns, event type constants)
- [ ] Export `EventBroadcaster` port for other modules to emit events through gateway
- [ ] Integrate with existing auth module to emit user events (e.g., session revoked → notify user channel)

## Security

- [ ] JWT verification on every authenticate message (stateless, using jose)
- [ ] Channel access authorization: validate user membership for team channels, watcher/assignee for issue channels
- [ ] Input validation with Zod schemas for all incoming WebSocket messages
- [ ] Auth timeout enforcement (5s default, configurable)

## Testing

- [ ] **Unit tests — AuthenticateConnection**: valid token → authenticated + auto-subscribed; invalid token → error + close; timeout → error + close
- [ ] **Unit tests — ManageSubscription**: subscribe to valid channel; subscribe to invalid channel (error); unsubscribe from subscribed channel; unsubscribe from non-subscribed (idempotent)
- [ ] **Unit tests — BroadcastEvent**: event reaches all subscribers; event does not reach non-subscribers; closed connection cleaned up on write error
- [ ] **Unit tests — HandleDisconnect**: connection removed; subscriptions cleaned; online status updated
- [ ] **Unit tests — AutoSubscription**: auto-sub to team channels, issue channels, user channel on auth
- [ ] **Integration tests — Redis online status**: set online, check online, TTL expiry, set offline
- [ ] **Integration tests — WebSocket flow**: connect → auth → subscribe → receive event → unsubscribe → no more events
- [ ] **Integration tests — Multiple connections**: same user from 2 connections, both receive events; one disconnects, other still receives
- [ ] **Integration tests — Online status**: connect → user online; disconnect → user offline; 2 connections, close 1 → still online

## Review

- [ ] Self-review: verify all acceptance criteria from LAG-19 are covered
- [ ] Run full test suite: `pnpm test`
- [ ] Run lint: `pnpm lint`
- [ ] Verify TypeScript compilation: `pnpm typecheck`
- [ ] PR checklist: clean git history, no secrets committed, docs updated
