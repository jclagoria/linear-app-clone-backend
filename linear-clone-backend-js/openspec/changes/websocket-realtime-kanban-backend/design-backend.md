# WebSocket Real-Time — Backend Design

## Architecture Decisions

### AD-1: In-Process Event Bridge (Work → Gateway)

**Decision**: Bridge work module events to gateway via shared `InProcessEventEmitter` instance injected into both modules.

**Rationale**: The work module's `InMemoryEventPublisher` currently stores events in memory only. We need those events to reach the gateway's `InProcessEventEmitter` for broadcast. A bridge adapter subscribes to work events and republishes them as gateway events.

**Trade-offs**:
- ✅ Zero latency, no serialization cost
- ✅ No new infrastructure (Redis pub/sub, Kafka)
- ❌ Not horizontally scalable (single-node only)
- ❌ Events lost on process restart (acceptable for real-time notifications)

**Implementation**: Create `WorkToGatewayBridge` adapter that implements `EventPublisher` and internally calls `InProcessEventEmitter.broadcast()`.

### AD-2: Channel Access Validation via Port Queries

**Decision**: Validate channel access by querying module ports (team membership, issue association) at subscription time.

**Rationale**: Channel validation ensures users only receive events they're authorized to see. Using existing module ports maintains hexagonal architecture consistency.

**Trade-offs**:
- ✅ Consistent with existing architecture
- ✅ Testable via port mocks
- ❌ Adds cross-module dependency at runtime
- ❌ Slight latency on subscribe (DB query)

**Implementation**: `ManageSubscription` gains a `ChannelValidator` port that queries identity/work modules.

### AD-3: Auto-Subscription on Authentication

**Decision**: Call `autoSubscribeUserChannels()` during `AuthenticateConnection` with team/issue IDs fetched from module ports.

**Rationale**: Users should automatically receive relevant events without manual subscription. This matches Linear's behavior where users see updates for their teams and watched issues.

**Trade-offs**:
- ✅ Better UX — no manual subscription needed
- ✅ Uses existing `autoSubscribeUserChannels()` utility
- ❌ Requires cross-module queries during auth (latency)
- ❌ Large team/issue sets could slow authentication

**Implementation**: `AuthenticateConnection` queries `TeamQueryPort` and `IssueQueryPort` after JWT verification, then calls `autoSubscribeUserChannels()`.

## API Contracts

### WebSocket Messages (Inbound)

#### Subscribe

```json
{
  "type": "subscribe",
  "channel": "team:{teamId}"
}
```

- **Validation**: Channel format must match `^(team|issue|user):(.+)$`
- **Auth**: Connection must be authenticated
- **Response**: `{ "type": "subscribed", "channel": "team:{teamId}" }` or error

#### Unsubscribe

```json
{
  "type": "unsubscribe",
  "channel": "team:{teamId}"
}
```

- **Response**: `{ "type": "unsubscribed", "channel": "team:{teamId}" }`

### WebSocket Messages (Outbound Events)

#### Issue Created

```json
{
  "type": "event",
  "channel": "team:{teamId}",
  "event": "issue.created",
  "data": {
    "id": "uuid",
    "title": "string",
    "teamId": "uuid",
    "assigneeId": "uuid|null",
    "status": "string",
    "priority": "number",
    "createdAt": "ISO-8601"
  },
  "timestamp": "ISO-8601",
  "userId": "uuid"
}
```

#### Issue Updated

```json
{
  "type": "event",
  "channel": "team:{teamId}",
  "event": "issue.updated",
  "data": {
    "id": "uuid",
    "changes": {
      "field": "newValue"
    }
  },
  "timestamp": "ISO-8601",
  "userId": "uuid"
}
```

#### Issue Deleted

```json
{
  "type": "event",
  "channel": "team:{teamId}",
  "event": "issue.deleted",
  "data": {
    "id": "uuid"
  },
  "timestamp": "ISO-8601",
  "userId": "uuid"
}
```

#### Comment Created/Updated/Deleted

```json
{
  "type": "event",
  "channel": "issue:{issueId}",
  "event": "comment.created",
  "data": {
    "id": "uuid",
    "issueId": "uuid",
    "body": "string",
    "userId": "uuid",
    "createdAt": "ISO-8601"
  },
  "timestamp": "ISO-8601",
  "userId": "uuid"
}
```

#### Label Created/Updated/Deleted

```json
{
  "type": "event",
  "channel": "team:{teamId}",
  "event": "label.created",
  "data": {
    "id": "uuid",
    "name": "string",
    "color": "string"
  },
  "timestamp": "ISO-8601",
  "userId": "uuid"
}
```

#### Watcher Added/Removed

```json
{
  "type": "event",
  "channel": "issue:{issueId}",
  "event": "watcher.added",
  "data": {
    "issueId": "uuid",
    "userId": "uuid"
  },
  "timestamp": "ISO-8601",
  "userId": "uuid"
}
```

### Error Responses

```json
{
  "type": "error",
  "code": "forbidden",
  "message": "You do not have access to this channel"
}
```

| Code | Description |
|------|-------------|
| `forbidden` | User lacks access to the channel |
| `invalid_channel` | Channel format is invalid |
| `connection_not_found` | Connection not authenticated |
| `unauthenticated` | Authentication required |

## Data Model

### No New Database Tables

This change uses in-memory storage only:

| Storage | Type | Purpose | Lifetime |
|---------|------|---------|----------|
| `InMemoryConnectionRepository` | Map | Active WebSocket connections | Process lifetime |
| `InMemorySubscriptionRepository` | Map | Channel subscriptions | Process lifetime |
| `InProcessEventEmitter` | EventEmitter | Event broadcasting | Process lifetime |

### In-Memory Structures

```
SubscriptionRepository
  Map<connectionId, Set<channel>>
  Map<channel, Set<connectionId>>
```

## Business Logic

### WorkToGatewayBridge

- **Responsibility**: Convert work module events to gateway events and broadcast
- **Rules**:
  - Map work event types to gateway event names (e.g., `issue.created` → `issue.created`)
  - Determine target channel from event data (team channel for issue events, issue channel for comment events)
  - Include full event data in gateway event payload
- **Dependencies**: `InProcessEventEmitter`, `EventPublisher` port

### ManageSubscription (Enhanced)

- **Responsibility**: Validate channel access before subscribing
- **Rules**:
  - `team:{id}` → Query `TeamQueryPort.isUserMember(userId, teamId)`
  - `issue:{id}` → Query `IssueQueryPort.isUserWatchingOrAssigned(userId, issueId)`
  - `user:{id}` → Verify `id === userId`
- **Dependencies**: `ConnectionRepository`, `SubscriptionRepository`, `ChannelValidator`

### AuthenticateConnection (Enhanced)

- **Responsibility**: Auto-subscribe to team/issue channels after auth
- **Rules**:
  - Query `TeamQueryPort.getUserTeamIds(userId)` for team channels
  - Query `IssueQueryPort.getUserIssueIds(userId)` for issue channels
  - Call `autoSubscribeUserChannels(connectionId, userId, subscriptionRepo, { teamIds, issueIds })`
- **Dependencies**: `ConnectionRepository`, `SubscriptionRepository`, `OnlineStatus`, `TokenVerifier`, `TeamQueryPort`, `IssueQueryPort`

## Security

- **Authentication**: JWT verification in `AuthenticateConnection` (existing)
- **Authorization**: Channel access validation in `ManageSubscription` (new)
- **Input Sanitization**: Zod validation on all inbound messages
- **Rate Limiting**: Max 100 subscribe/unsubscribe per connection per minute
- **Connection Limits**: `WS_MAX_CONNECTIONS` (1000 default)

## Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | `WorkToGatewayBridge`, `ManageSubscription` channel validation, `autoSubscribeUserChannels` |
| Integration | Vitest + Testcontainers | Full auth → subscribe → event broadcast flow |
| Contract | Vitest | WebSocket message format validation against specs-api |

### Key Test Cases

1. **Auto-subscription**: Auth → verify user/team/issue channels subscribed
2. **Channel validation**: Subscribe to team channel → verify membership check
3. **Event bridge**: Work event published → verify gateway event broadcast
4. **Forbidden access**: Subscribe to unauthorized channel → verify error
5. **Idempotent subscribe**: Subscribe twice → verify no duplicate events
