# Gateway — Business Specification

## Behaviour

**Feature:** WebSocket Connection Management

The Gateway SHALL accept WebSocket connections and SHALL require authentication within 5 seconds. Unauthenticated connections SHALL be terminated with an error message.

### Requirement: AuthTimeout

#### Scenario: Successful authentication within timeout

- **GIVEN** a WebSocket connection is established
- **WHEN** the client sends a valid `authenticate` message with a valid JWT within 5 seconds
- **THEN** the server responds with `authenticated` including the user's ID
- **AND** the connection is registered as active for that user

#### Scenario: Authentication timeout

- **GIVEN** a WebSocket connection is established
- **WHEN** the client does not send an `authenticate` message within 5 seconds
- **THEN** the server sends `{ type: "error", message: "auth_timeout" }`
- **AND** the server closes the connection

#### Scenario: Invalid token rejected

- **GIVEN** a WebSocket connection is established
- **WHEN** the client sends an invalid or expired JWT
- **THEN** the server sends `{ type: "error", message: "invalid_token" }`
- **AND** the connection is closed

---

**Feature:** Multiple Connections Per User

The Gateway SHALL allow a single user to have multiple active WebSocket connections simultaneously.

### Requirement: MultiConnection

#### Scenario: User connects from multiple devices

- **GIVEN** a user has an active WebSocket connection
- **WHEN** the same user establishes a second WebSocket connection
- **THEN** both connections remain active
- **AND** events destined for that user are broadcast to all active connections

---

**Feature:** Connection ID Tracking

Each WebSocket connection SHALL be assigned a unique connection ID upon authentication.

### Requirement: ConnectionTracking

#### Scenario: Connection ID assigned on auth

- **GIVEN** a WebSocket connection is established
- **WHEN** authentication succeeds
- **THEN** the connection receives a unique connection ID
- **AND** the connection ID is tracked in the connection registry

---

**Feature:** Online Status

The Gateway SHALL mark a user as online when at least one WebSocket connection is active, and offline when all connections are closed.

### Requirement: OnlineStatus

#### Scenario: User comes online

- **GIVEN** a user has no active WebSocket connections
- **WHEN** the user successfully authenticates via WebSocket
- **THEN** the user SHALL be marked as online

#### Scenario: User goes offline

- **GIVEN** a user has one active WebSocket connection
- **WHEN** that connection is closed
- **THEN** the user SHALL be marked as offline

#### Scenario: User stays online with remaining connections

- **GIVEN** a user has multiple active WebSocket connections
- **WHEN** one of those connections is closed
- **THEN** the user SHALL remain online

---

**Feature:** Channel Subscription

The Gateway SHALL allow authenticated clients to subscribe and unsubscribe from channels.

### Requirement: SubscribeChannel

#### Scenario: Subscribe to valid channel

- **GIVEN** an authenticated WebSocket connection
- **WHEN** the client sends `{ type: "subscribe", channel: "team:abc-123" }`
- **THEN** the client SHALL receive events broadcast on that channel

#### Scenario: Subscribe to invalid channel

- **GIVEN** an authenticated WebSocket connection
- **WHEN** the client sends `{ type: "subscribe", channel: "invalid" }`
- **THEN** the server responds with `{ type: "error", message: "invalid_channel" }`

#### Scenario: Unsubscribe from channel

- **GIVEN** an authenticated WebSocket connection subscribed to `team:abc-123`
- **WHEN** the client sends `{ type: "unsubscribe", channel: "team:abc-123" }`
- **THEN** the client SHALL stop receiving events from that channel

---

**Feature:** Auto-Subscription

Upon successful authentication, the Gateway SHALL automatically subscribe the connection to team channels, watched issue channels, and the user's own channel.

### Requirement: AutoSubscribe

#### Scenario: Auto-subscribe on authentication

- **GIVEN** a user belongs to teams T1, T2, watches issue I1, and is assigned issue I2
- **WHEN** the user authenticates via WebSocket
- **THEN** the connection SHALL be auto-subscribed to `team:T1`, `team:T2`, `issue:I1`, `issue:I2`, and `user:{userId}`

---

**Feature:** Event Broadcasting

The Gateway SHALL route events to the correct channel subscribers.

### Requirement: TeamBroadcast

#### Scenario: Team event reaches all team members

- **GIVEN** users A and B are members of team T1 and both have active connections
- **WHEN** an event is broadcast to `team:T1`
- **THEN** both user A and user B receive the event

### Requirement: IssueBroadcast

#### Scenario: Issue event reaches watchers and assignee

- **GIVEN** user A is assigned to issue I1, user B is watching issue I1
- **WHEN** an event is broadcast to `issue:I1`
- **THEN** both user A and user B receive the event

### Requirement: UserBroadcast

#### Scenario: User event reaches specific user only

- **GIVEN** users A and B both have active connections
- **WHEN** an event is broadcast to `user:A`
- **THEN** only user A receives the event
- **AND** user B does not receive it

---

## Data Model

### Connection

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, not null | Unique connection identifier |
| userId | UUID | FK → users.id, not null | Authenticated user |
| status | enum | connected, authenticating, disconnected | Current connection state |

### Channel

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| name | string | PK, not null | Channel identifier: `team:{id}`, `issue:{id}`, `user:{id}` |
| type | enum | not null | team, issue, user |

### Subscription

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| connectionId | UUID | FK → connection.id, not null | |
| channel | string | FK → channel.name, not null | |
| subscribedAt | timestamp | not null | When subscription was created |

### Event

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| type | string | not null | Event type identifier |
| channel | string | not null | Target channel |
| data | JSON | not null | Event payload |
| timestamp | string | not null | ISO-8601 |
| userId | string | nullable | Who triggered the event |

## Business Rules

- A connection SHALL NOT receive events before successful authentication
- Channel subscriptions are per-connection, not per-user
- Auto-subscription runs on every new connection
- A connection SHALL NOT be subscribed to a channel the user does not have access to
- Events SHALL include an ISO-8601 timestamp and the originating userId
- An event targeted to an issue channel MUST reach both issue watchers and the issue assignee
- All event messages SHALL follow the envelope: `{ type: "event", channel, event, data, timestamp, userId }`

## Security

- WebSocket connections SHALL authenticate using JWT (jose library, reused from auth module)
- Token SHALL be verified on every `authenticate` message (stateless JWT verification)
- Channel access SHALL be validated: user MUST be a team member for team channels, MUST be watcher/assignee for issue channels, MUST be the user for user channels
- Unauthenticated connections SHALL NOT receive any events
- After failed authentication, connection SHALL be closed immediately
- Ping/pong SHOULD be used to detect stale connections
