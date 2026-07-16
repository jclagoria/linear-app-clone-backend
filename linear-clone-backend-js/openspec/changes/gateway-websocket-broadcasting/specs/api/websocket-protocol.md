# Gateway — WebSocket Protocol Contract

## Connection

- **Protocol**: WebSocket (ws)
- **Path**: `/ws`
- **Auth**: JWT token MUST be sent as the first message after connection
- **Auth timeout**: Client MUST authenticate within 5 seconds (configurable per deployment)

## Message: Authenticate

- **Direction**: Client → Server
- **Purpose**: Authenticate the WebSocket connection

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | MUST be `"authenticate"` |
| `token` | string | Yes | JWT access token |

### Response (success)

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | `"authenticated"` |
| `userId` | string | Authenticated user UUID |

### Response (failure)

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | `"error"` |
| `message` | string | Error description |

## Message: Subscribe

- **Direction**: Client → Server
- **Purpose**: Subscribe to a channel for real-time events

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | MUST be `"subscribe"` |
| `channel` | string | Yes | Channel identifier (`team:{id}`, `issue:{id}`, `user:{id}`) |

### Response

On success: Server begins forwarding events for the channel (no explicit ack).
On invalid channel: `{ type: "error", message: "invalid_channel" }`

## Message: Unsubscribe

- **Direction**: Client → Server
- **Purpose**: Unsubscribe from a channel

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | MUST be `"unsubscribe"` |
| `channel` | string | Yes | Channel identifier |

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

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | `"event"` |
| `channel` | string | Channel this event was broadcast on |
| `event` | string | Event name (e.g., `issue.created`, `issue.updated`) |
| `data` | object | Event payload |
| `timestamp` | string | ISO-8601 timestamp |
| `userId` | string | ID of user who triggered the event |

## Errors

| Code | Condition | Response |
|------|-----------|----------|
| `auth_timeout` | Client did not authenticate within 5s | `{ type: "error", message: "auth_timeout" }` + connection closed |
| `invalid_token` | Token is malformed, expired, or invalid | `{ type: "error", message: "invalid_token" }` |
| `invalid_channel` | Channel format or user lacks access | `{ type: "error", message: "invalid_channel" }` |

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
