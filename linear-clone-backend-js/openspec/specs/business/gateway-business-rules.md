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

**Feature:** Auto-Subscription on Authentication

Upon successful authentication, the Gateway SHALL automatically subscribe the connection to team channels, watched issue channels, and the user's own channel. This ensures users receive real-time updates without manual subscription management.

### Requirement: AutoSubscribe

#### Scenario: Auto-subscribe on authentication

- **GIVEN** a user belongs to teams T1, T2, watches issue I1, and is assigned issue I2
- **WHEN** the user authenticates via WebSocket
- **THEN** the connection SHALL be auto-subscribed to `team:T1`, `team:T2`, `issue:I1`, `issue:I2`, and `user:{userId}`

#### Requirement: User Channel Subscription

##### Scenario: User subscribes to personal channel on authentication

- **GIVEN** a user with ID `user-123` connects to the WebSocket gateway
- **WHEN** the user sends a valid `authenticate` message
- **THEN** the gateway SHALL subscribe the connection to channel `user:user-123`
- **AND** the user SHALL receive events published to `user:user-123`

#### Requirement: Team Channel Subscription

##### Scenario: User subscribes to team channels on authentication

- **GIVEN** a user with ID `user-123` is a member of teams `team-A` and `team-B`
- **WHEN** the user authenticates via WebSocket
- **THEN** the gateway SHALL subscribe the connection to channels `team:team-A` and `team:team-B`
- **AND** the user SHALL receive all events published to those team channels

##### Scenario: User with no team memberships

- **GIVEN** a user with ID `user-456` belongs to no teams
- **WHEN** the user authenticates via WebSocket
- **THEN** the gateway SHALL subscribe the connection only to `user:user-456`
- **AND** no team channel subscriptions SHALL be created

#### Requirement: Issue Channel Subscription

##### Scenario: User subscribes to watched issue channels

- **GIVEN** a user with ID `user-123` watches issues `issue-1` and `issue-2`
- **WHEN** the user authenticates via WebSocket
- **THEN** the gateway SHALL subscribe the connection to channels `issue:issue-1` and `issue:issue-2`
- **AND** the user SHALL receive events published to those issue channels

##### Scenario: User subscribes to assigned issue channels

- **GIVEN** a user with ID `user-123` is assigned to issue `issue-3`
- **WHEN** the user authenticates via WebSocket
- **THEN** the gateway SHALL subscribe the connection to channel `issue:issue-3`
- **AND** the user SHALL receive events published to that issue channel

##### Scenario: User with no watched or assigned issues

- **GIVEN** a user with ID `user-456` watches no issues and is assigned to none
- **WHEN** the user authenticates via WebSocket
- **THEN** no issue channel subscriptions SHALL be created

---

**Feature:** Channel Access Validation

The gateway SHALL validate that a user has permission to subscribe to a channel before allowing the subscription. This prevents unauthorized access to team or issue events.

#### Requirement: Team Channel Access

##### Scenario: Team member subscribes to team channel

- **GIVEN** a user with ID `user-123` is a member of team `team-A`
- **WHEN** the user sends a `subscribe` message for channel `team:team-A`
- **THEN** the subscription SHALL succeed
- **AND** the user SHALL receive events published to `team:team-A`

##### Scenario: Non-member subscribes to team channel

- **GIVEN** a user with ID `user-456` is NOT a member of team `team-A`
- **WHEN** the user sends a `subscribe` message for channel `team:team-A`
- **THEN** the subscription SHALL fail with error code `forbidden`
- **AND** no subscription SHALL be created

#### Requirement: Issue Channel Access

##### Scenario: Issue watcher subscribes to issue channel

- **GIVEN** a user with ID `user-123` watches issue `issue-1`
- **WHEN** the user sends a `subscribe` message for channel `issue:issue-1`
- **THEN** the subscription SHALL succeed

##### Scenario: Issue assignee subscribes to issue channel

- **GIVEN** a user with ID `user-123` is assigned to issue `issue-2`
- **WHEN** the user sends a `subscribe` message for channel `issue:issue-2`
- **THEN** the subscription SHALL succeed

##### Scenario: Non-watcher/non-assignee subscribes to issue channel

- **GIVEN** a user with ID `user-456` does NOT watch and is NOT assigned to issue `issue-3`
- **WHEN** the user sends a `subscribe` message for channel `issue:issue-3`
- **THEN** the subscription SHALL fail with error code `forbidden`
- **AND** no subscription SHALL be created

#### Requirement: User Channel Access

##### Scenario: User subscribes to own user channel

- **GIVEN** a user with ID `user-123`
- **WHEN** the user sends a `subscribe` message for channel `user:user-123`
- **THEN** the subscription SHALL succeed

##### Scenario: User subscribes to another user's channel

- **GIVEN** a user with ID `user-123`
- **WHEN** the user sends a `subscribe` message for channel `user:user-456`
- **THEN** the subscription SHALL fail with error code `forbidden`
- **AND** no subscription SHALL be created

#### Requirement: Channel Format Validation

##### Scenario: Invalid channel format

- **GIVEN** an authenticated user
- **WHEN** the user sends a `subscribe` message with channel `invalid-format`
- **THEN** the subscription SHALL fail with error code `invalid_channel`
- **AND** no subscription SHALL be created

##### Scenario: Unknown channel type

- **GIVEN** an authenticated user
- **WHEN** the user sends a `subscribe` message with channel `project:some-id`
- **THEN** the subscription SHALL fail with error code `invalid_channel`
- **AND** no subscription SHALL be created

---

**Feature:** Event Broadcasting

The gateway SHALL broadcast events from the work module to all subscribed connections on the relevant channel. Events SHALL be delivered in order and without duplication.

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

#### Requirement: Issue Event Broadcasting

##### Scenario: Issue created event broadcast to team

- **GIVEN** a user is subscribed to channel `team:team-A`
- **WHEN** an issue is created in team `team-A`
- **THEN** the gateway SHALL broadcast an `issue.created` event to channel `team:team-A`
- **AND** the event data SHALL contain the full issue object
- **AND** the event SHALL include a timestamp

##### Scenario: Issue updated event broadcast to team and issue channel

- **GIVEN** a user is subscribed to channels `team:team-A` and `issue:issue-1`
- **WHEN** issue `issue-1` in team `team-A` is updated
- **THEN** the gateway SHALL broadcast an `issue.updated` event to both channels
- **AND** the user SHALL receive the event only once (deduplication)

##### Scenario: Issue deleted event broadcast

- **GIVEN** a user is subscribed to channel `team:team-A`
- **WHEN** an issue in team `team-A` is soft-deleted
- **THEN** the gateway SHALL broadcast an `issue.deleted` event to channel `team:team-A`
- **AND** the event data SHALL contain only the issue ID

#### Requirement: Comment Event Broadcasting

##### Scenario: Comment created event broadcast to issue channel

- **GIVEN** a user is subscribed to channel `issue:issue-1`
- **WHEN** a comment is created on issue `issue-1`
- **THEN** the gateway SHALL broadcast a `comment.created` event to channel `issue:issue-1`
- **AND** the event data SHALL contain the full comment object

##### Scenario: Comment updated event broadcast

- **GIVEN** a user is subscribed to channel `issue:issue-1`
- **WHEN** a comment on issue `issue-1` is edited
- **THEN** the gateway SHALL broadcast a `comment.updated` event to channel `issue:issue-1`

##### Scenario: Comment deleted event broadcast

- **GIVEN** a user is subscribed to channel `issue:issue-1`
- **WHEN** a comment on issue `issue-1` is deleted
- **THEN** the gateway SHALL broadcast a `comment.deleted` event to channel `issue:issue-1`
- **AND** the event data SHALL contain only the comment ID

#### Requirement: Label Event Broadcasting

##### Scenario: Label created event broadcast to team

- **GIVEN** a user is subscribed to channel `team:team-A`
- **WHEN** a label is created in team `team-A`
- **THEN** the gateway SHALL broadcast a `label.created` event to channel `team:team-A`

##### Scenario: Label updated event broadcast

- **GIVEN** a user is subscribed to channel `team:team-A`
- **WHEN** a label in team `team-A` is modified
- **THEN** the gateway SHALL broadcast a `label.updated` event to channel `team:team-A`

##### Scenario: Label deleted event broadcast

- **GIVEN** a user is subscribed to channel `team:team-A`
- **WHEN** a label in team `team-A` is deleted
- **THEN** the gateway SHALL broadcast a `label.deleted` event to channel `team:team-A`

#### Requirement: Watcher Event Broadcasting

##### Scenario: Watcher added event broadcast to issue channel

- **GIVEN** a user is subscribed to channel `issue:issue-1`
- **WHEN** a user starts watching issue `issue-1`
- **THEN** the gateway SHALL broadcast a `watcher.added` event to channel `issue:issue-1`
- **AND** the event data SHALL contain `issueId` and `userId`

##### Scenario: Watcher removed event broadcast

- **GIVEN** a user is subscribed to channel `issue:issue-1`
- **WHEN** a user stops watching issue `issue-1`
- **THEN** the gateway SHALL broadcast a `watcher.removed` event to channel `issue:issue-1`

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

### GatewayEvent

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| type | string | fixed: `"event"` | Message type identifier |
| channel | string | required | Channel the event belongs to |
| event | string | required | Event type (e.g., `issue.updated`) |
| data | object | required | Event payload (varies by event type) |
| timestamp | string (ISO 8601) | required | When the event occurred |
| userId | string (UUID) | required | User who triggered the event |

### Relationships

- **User** --belongs to many--> **Team**: Determines `team:{id}` channel access
- **User** --watches/assigned to many--> **Issue**: Determines `issue:{id}` channel access
- **User** --has one--> **User Channel**: `user:{userId}` (self only)

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

1. Auto-subscription SHALL occur only once per connection, during the `authenticate` flow
2. Manual `subscribe` messages SHALL be validated against access control rules
3. Duplicate subscriptions SHALL be idempotent (no error, no duplicate events)
4. `unsubscribe` SHALL remove the subscription silently (no error if not subscribed)
5. Channel access is determined by:
   - `team:{id}`: User must be an active member of the team
   - `issue:{id}`: User must be watching or assigned to the issue
   - `user:{id}`: User can only subscribe to their own user channel
6. Events SHALL be broadcast to all subscribed connections on the channel
7. Events SHALL NOT be persisted by the gateway (fire-and-forget)
8. Event ordering SHALL be preserved per channel (FIFO)
9. A connection SHALL NOT receive events before successful authentication
10. Channel subscriptions are per-connection, not per-user
11. Auto-subscription runs on every new connection
12. A connection SHALL NOT be subscribed to a channel the user does not have access to
13. Events SHALL include an ISO-8601 timestamp and the originating userId
14. An event targeted to an issue channel MUST reach both issue watchers and the issue assignee
15. All event messages SHALL follow the envelope: `{ type: "event", channel, event, data, timestamp, userId }`

## Security

1. Authentication MUST be completed before any subscription is allowed
2. Channel access validation MUST check team membership or issue association
3. Users MUST NOT subscribe to channels they don't have access to
4. The gateway MUST NOT expose internal event routing or connection IDs to clients
5. Rate limiting SHOULD be applied to subscription messages (prevent abuse)
6. WebSocket connections SHALL authenticate using JWT (jose library, reused from auth module)
7. Token SHALL be verified on every `authenticate` message (stateless JWT verification)
8. Channel access SHALL be validated: user MUST be a team member for team channels, MUST be watcher/assignee for issue channels, MUST be the user for user channels
9. Unauthenticated connections SHALL NOT receive any events
10. After failed authentication, connection SHALL be closed immediately
11. Ping/pong SHOULD be used to detect stale connections
