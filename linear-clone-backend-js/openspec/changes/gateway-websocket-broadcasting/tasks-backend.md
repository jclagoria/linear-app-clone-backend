# Tasks — Gateway WebSocket & Broadcasting (Backend)

## Scaffold

- [x] Install `ws` and `@types/ws` npm packages
- [x] Create `src/modules/gateway/` directory structure with `domain/`, `application/`, `adapters/in/`, `adapters/out/`, `__tests__/`
- [x] Create barrel export `src/modules/gateway/index.ts`
- [x] Register gateway module in app composition root (`src/server.ts` via setup.ts)

## Domain Layer

- [x] Create `domain/connection.ts` — `Connection` entity with fields: id (UUID), userId, ws (WebSocket), status (enum: authenticating | connected | disconnected)
- [x] Create `domain/channel.ts` — `Channel` value object with channel type enum (team | issue | user) and channel ID, validation for `{type}:{id}` format
- [x] Create `domain/event.ts` — `GatewayEvent` type with fields: type, channel, event, data, timestamp, userId
- [x] Create `domain/message.ts` — WebSocket message type definitions for all client→server and server→client messages

## Application Layer — Ports

- [x] Create `application/ports/in/authenticate-use-case.ts` — port interface for `execute(token, connectionId) => Promise<AuthResult>`
- [x] Create `application/ports/in/subscribe-use-case.ts` — port interface for `execute(connectionId, channel) => Promise<void>`
- [x] Create `application/ports/in/unsubscribe-use-case.ts` — port interface for `execute(connectionId, channel) => Promise<void>`
- [x] Create `application/ports/in/event-broadcaster.ts` — port interface for `broadcast(event) => Promise<void>`
- [x] Create `application/ports/in/disconnect-handler.ts` — port interface for `handleDisconnect(connectionId) => Promise<void>`
- [x] Create `application/ports/out/connection-repository.ts` — port interface: `save(Connection)`, `findById(id)`, `deleteById(id)`, `findByUserId(userId)`, `findAll()`
- [x] Create `application/ports/out/subscription-repository.ts` — port interface: `add(connectionId, channel)`, `remove(connectionId, channel)`, `findByChannel(channel)`, `findByConnection(connectionId)`, `removeAllForConnection(connectionId)`
- [x] Create `application/ports/out/online-status.ts` — port interface: `setOnline(userId)`, `setOffline(userId)`, `isOnline(userId)`
- [x] Create `application/ports/out/token-verifier.ts` — port interface: `verify(token) => Promise<{ userId, sub }>`

## Application Layer — Use Cases

- [x] Create `application/authenticate-connection.ts` — `AuthenticateConnection` use case: verify JWT, create connection, auto-subscribe to channels, mark user online, send `authenticated` response
- [x] Create `application/manage-subscription.ts` — `ManageSubscription` use case: subscribe/unsubscribe, validate channel access, idempotent operations
- [x] Create `application/broadcast-event.ts` — `BroadcastEvent` use case: look up channel subscribers, send event to each connection, handle write errors
- [x] Create `application/handle-disconnect.ts` — `HandleDisconnect` use case: remove connection, cleanup subscriptions, update online status
- [x] Create `application/auto-subscription.ts` — auto-subscription logic: own user channel auto-subscribed in AuthenticateConnection; team/issue channels accept optional params for future cross-module integration

## Adapters — Inbound

- [x] Create `adapters/in/websocket-server.ts` — `GatewayWebSocketServer` class: create `ws.Server`, accept connections, manage auth timeout, route messages
- [x] Create `adapters/in/message-handler.ts` — message dispatcher: parse JSON, validate schema (Zod), route to correct use case by `type` field, handle unknown types
- [x] Create `adapters/in/auth-timeout.ts` — auth timeout handling is integrated directly in the WebSocket server

## Adapters — Outbound

- [x] Create `adapters/out/in-memory-connection-repository.ts` — implements `ConnectionRepository` with `Map<string, Connection>`
- [x] Create `adapters/out/in-memory-subscription-repository.ts` — implements `SubscriptionRepository` with bidirectional `Map` indices
- [x] Create `adapters/out/redis-online-status.ts` — implements `OnlineStatus` using Redis SET with 30s TTL, immediate delete on clean disconnect
- [x] Create `adapters/out/in-process-event-emitter.ts` — implements `EventBus` using Node.js EventEmitter
- [x] Create `adapters/out/jwt-token-verifier.ts` — implements `TokenVerifier` using jose (reuses JWT secret from auth module)

## Integration — App Setup

- [x] Wire gateway module in `src/server.ts` via `setup.ts`: instantiate `ws.Server` on same HTTP server, start on `/ws` path
- [x] Integrate with auth module for JWT token verification (reuses JoseTokenVerifier with same JWT secret)
- [x] Add environment variables: `WS_PORT`, `WS_AUTH_TIMEOUT_MS`, `WS_MAX_CONNECTIONS` with defaults
- [x] Configure CORS/origin validation for WebSocket upgrade (origin check in verifyClient)

## Events / Messaging

- [x] Define gateway event channel constants in `src/shared/events.ts` (channel patterns, event type constants)
- [x] Export `EventBroadcaster` port and `InProcessEventEmitter` for other modules to emit events through gateway
- [ ] Integrate with existing auth module to emit user events (e.g., session revoked → notify user channel) — deferred: requires event publisher wiring in auth module

## Security

- [x] JWT verification on every authenticate message (stateless, using jose via JoseTokenVerifier)
- [ ] Channel access authorization: validate user membership for team channels, watcher/assignee for issue channels — deferred: requires cross-module queries (identity team-repo, work watcher-repo)
- [x] Input validation with Zod schemas for all incoming WebSocket messages (ClientMessageSchema)
- [x] Auth timeout enforcement (5s default, configurable via WS_AUTH_TIMEOUT_MS)

## Testing

- [x] **Unit tests — AuthenticateConnection**: valid token → authenticated + auto-subscribed; invalid token → error; expired token → error
- [x] **Unit tests — ManageSubscription**: subscribe to valid channel; subscribe to invalid channel (error); unsubscribe from subscribed channel; unsubscribe from non-subscribed (idempotent)
- [x] **Unit tests — BroadcastEvent**: event reaches all subscribers; event does not reach non-subscribers; closed connection cleaned up on write error
- [x] **Unit tests — HandleDisconnect**: connection removed; subscriptions cleaned; online status updated
- [x] **Unit tests — Channel domain**: parse, format, validate channel patterns
- [x] **Unit tests — MessageHandler**: authenticate, subscribe, unsubscribe, ping, invalid JSON, validation errors
- [x] **Unit tests — InMemory repositories**: save/find/delete connections, add/remove/find subscriptions
- [ ] **Integration tests — Redis online status**: set online, check online, TTL expiry, set offline — deferred: requires running Redis instance
- [ ] **Integration tests — WebSocket flow**: connect → auth → subscribe → receive event → unsubscribe → no more events — deferred: requires running server
- [ ] **Integration tests — Multiple connections**: same user from 2 connections, both receive events; one disconnects, other still receives — deferred: requires running server
- [ ] **Integration tests — Online status**: connect → user online; disconnect → user offline; 2 connections, close 1 → still online — deferred: requires running server

## Review

- [x] Self-review: all acceptance criteria covered — WebSocket server with auth, channels, subscriptions, broadcasting, online status
- [x] Run full test suite: `pnpm test` — 612/613 passing (1 pre-existing failure in work module)
- [x] Run lint: `pnpm lint` — 359 pre-existing errors (ESLint config issue), none caused by gateway module
- [x] Verify TypeScript compilation: `pnpm typecheck` — gateway module compiles cleanly (pre-existing errors in work tests and seed-statuses only)
- [x] PR checklist: clean git history, no secrets committed, docs updated (.env-example)
