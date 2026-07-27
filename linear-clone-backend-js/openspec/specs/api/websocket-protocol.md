# Gateway — WebSocket Protocol Contract

## Connection

- **Protocol**: WebSocket over HTTP/HTTPS
- **Path**: `/ws`
- **Auth**: JWT access token via `authenticate` message (required within 5 seconds of connection)
- **Rate Limit**: 1000 concurrent connections per instance (`WS_MAX_CONNECTIONS`)

### Connection Lifecycle

1. Client opens WebSocket connection to `ws://<host>/ws`
2. Server waits for `authenticate` message within `WS_AUTH_TIMEOUT_MS` (default 5000ms)
3. If no valid `authenticate` received, server closes with code `4001` (authentication timeout)
4. After authentication, client may send `subscribe`/`unsubscribe` messages
5. Server pushes `event` messages to subscribed channels

## Message: Authenticate

- **Direction**: Client → Server
- **Purpose**: Authenticate the WebSocket connection

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | MUST be `"authenticate"` |
| `token` | string | Yes | JWT access token (Bearer token from login/register) |

#### Example

```json
{
  "type": "authenticate",
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

### Response (success)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | MUST be `"authenticated"` |
| `userId` | string (UUID) | Yes | Authenticated user identifier |

#### Example

```json
{
  "type": "authenticated",
  "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

### Response (failure)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | MUST be `"error"` |
| `code` | string | Yes | Error code |
| `message` | string | Yes | Human-readable error description |

## Message: Subscribe

- **Direction**: Client → Server
- **Purpose**: Subscribe to a channel for real-time events

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | MUST be `"subscribe"` |
| `channel` | string | Yes | Channel identifier in format `{type}:{id}` |

#### Channel Formats

| Channel Type | Format | Example | Description |
|--------------|--------|---------|-------------|
| `team` | `team:{teamId}` | `team:550e8400-e29b-41d4-a716-446655440000` | All events for a team |
| `issue` | `issue:{issueId}` | `issue:660e8400-e29b-41d4-a716-446655440001` | All events for an issue |
| `user` | `user:{userId}` | `user:770e8400-e29b-41d4-a716-446655440002` | Personal events for a user |

#### Validation Rules

- Channel format MUST match pattern `^(team|issue|user):[a-f0-9-]+$`
- User MUST have access to the channel (team membership for `team:{id}`, issue watching/assignment for `issue:{id}`)
- Duplicate subscriptions MUST be idempotent (no error, no duplicate events)

#### Example

```json
{
  "type": "subscribe",
  "channel": "team:550e8400-e29b-41d4-a716-446655440000"
}
```

### Response — `subscribed` Message

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | MUST be `"subscribed"` |
| `channel` | string | Yes | The channel that was subscribed |

#### Example

```json
{
  "type": "subscribed",
  "channel": "team:550e8400-e29b-41d4-a716-446655440000"
}
```

### Response — `error` Message (on subscribe failure)

| Code | Condition | Description |
|------|-----------|-------------|
| `invalid_channel` | Channel format does not match pattern | Malformed channel identifier |
| `forbidden` | User does not have access to channel | Not a team member, not watching/assigned to issue |

## Message: Unsubscribe

- **Direction**: Client → Server
- **Purpose**: Unsubscribe from a channel

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | MUST be `"unsubscribe"` |
| `channel` | string | Yes | Channel identifier to unsubscribe from |

#### Example

```json
{
  "type": "unsubscribe",
  "channel": "team:550e8400-e29b-41d4-a716-446655440000"
}
```

### Response — `unsubscribed` Message

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | MUST be `"unsubscribed"` |
| `channel` | string | Yes | The channel that was unsubscribed |

## Message: Ping / Pong

- **Direction**: Client → Server / Server → Client
- **Purpose**: Keep connection alive

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | MUST be `"ping"` |

### Response

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | `"pong"` |

## Message: Event

- **Direction**: Server → Client
- **Purpose**: Deliver real-time event to subscribed client

### Payload

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | MUST be `"event"` |
| `channel` | string | Yes | Channel the event belongs to |
| `event` | string | Yes | Event type identifier |
| `data` | object | Yes | Event payload |
| `timestamp` | string (ISO 8601) | Yes | When the event occurred |

### Event Types

| Event | Channel | Data Schema | Description |
|-------|---------|-------------|-------------|
| `issue.created` | `team:{teamId}` | `Issue` object | New issue created in team |
| `issue.updated` | `team:{teamId}`, `issue:{issueId}` | `Issue` object | Issue fields changed |
| `issue.deleted` | `team:{teamId}`, `issue:{issueId}` | `{ id: string }` | Issue soft-deleted |
| `comment.created` | `issue:{issueId}` | `Comment` object | New comment on issue |
| `comment.updated` | `issue:{issueId}` | `Comment` object | Comment edited |
| `comment.deleted` | `issue:{issueId}` | `{ id: string }` | Comment deleted |
| `label.created` | `team:{teamId}` | `Label` object | New label created |
| `label.updated` | `team:{teamId}` | `Label` object | Label modified |
| `label.deleted` | `team:{teamId}` | `{ id: string }` | Label deleted |
| `watcher.added` | `issue:{issueId}` | `{ issueId: string, userId: string }` | User watching issue |
| `watcher.removed` | `issue:{issueId}` | `{ issueId: string, userId: string }` | User stopped watching |

#### Example — Issue Updated

```json
{
  "type": "event",
  "channel": "team:550e8400-e29b-41d4-a716-446655440000",
  "event": "issue.updated",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "identifier": "ENG-42",
    "title": "Implement real-time updates",
    "statusId": "todo-status-id",
    "assigneeId": "user-id",
    "priority": 2,
    "updatedAt": "2026-07-27T01:30:00.000Z"
  },
  "timestamp": "2026-07-27T01:30:00.000Z"
}
```

## Errors — Standard Error Response

| Code | Condition | Response |
|------|-----------|----------|
| 4001 | Authentication timeout | `{ "type": "error", "code": "auth_failed", "message": "..." }` |
| 4002 | Invalid token | `{ "type": "error", "code": "invalid_token", "message": "..." }` |
| 4003 | Invalid message format | `{ "type": "error", "code": "invalid_message_format", "message": "..." }` |
| 4004 | Invalid channel format | `{ "type": "error", "code": "invalid_channel", "message": "..." }` |
| 4005 | Channel access denied | `{ "type": "error", "code": "forbidden", "message": "..." }` |

### Error Code Details

| Code | Condition | Description |
|------|-----------|-------------|
| `auth_failed` | No `authenticate` received within timeout | Connection closed with code `4001` |
| `invalid_token` | JWT validation failed | Token expired, malformed, or revoked |
| `invalid_message_format` | Malformed JSON or unknown message type | Message rejected |
| `invalid_channel` | Channel format does not match pattern | Malformed channel identifier |
| `forbidden` | User does not have access to channel | Not a team member, not watching/assigned to issue |

### WebSocket Close Codes

| Code | Reason | Description |
|------|--------|-------------|
| 1000 | Normal closure | Client disconnected intentionally |
| 4001 | Authentication timeout | No valid `authenticate` within timeout |
| 4002 | Authentication failed | Invalid or expired token |
| 4003 | Protocol error | Malformed messages or policy violation |

## Channel Types

| Channel Pattern | Description | Auto-subscribed |
|----------------|-------------|-----------------|
| `team:{teamId}` | Team-wide events | Yes, for all team members |
| `issue:{issueId}` | Issue-specific events | Yes, for watchers and assignees |
| `user:{userId}` | User-specific events | Yes, for the authenticated user |

## Auto-Subscription

Upon successful authentication, the server SHALL automatically subscribe the connection to:

1. All `team:{id}` channels for teams the user belongs to
2. All `issue:{id}` channels for issues the user is watching or assigned to
3. The `user:{userId}` channel for the authenticated user
