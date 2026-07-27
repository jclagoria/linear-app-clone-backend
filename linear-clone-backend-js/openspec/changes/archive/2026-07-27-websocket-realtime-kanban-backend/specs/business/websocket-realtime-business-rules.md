# WebSocket Real-Time — Business Specification

## Behaviour

### Feature: Auto-Subscription on Authentication

When a user authenticates via WebSocket, the gateway SHALL automatically subscribe them to all relevant channels based on their team memberships and watched/assigned issues. This ensures users receive real-time updates without manual subscription management.

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

### Feature: Channel Access Validation

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

### Feature: Event Broadcasting

The gateway SHALL broadcast events from the work module to all subscribed connections on the relevant channel. Events SHALL be delivered in order and without duplication.

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

### GatewayEvent

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| type | string | fixed: `"event"` | Message type identifier |
| channel | string | required | Channel the event belongs to |
| event | string | required | Event type (e.g., `issue.updated`) |
| data | object | required | Event payload (varies by event type) |
| timestamp | string (ISO 8601) | required | When the event occurred |
| userId | string (UUID) | required | User who triggered the event |

### Channel

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| type | ChannelType | required | Enum: `team`, `issue`, `user` |
| id | string (UUID) | required | Entity identifier |

### Relationships

- **User** --belongs to many--> **Team**: Determines `team:{id}` channel access
- **User** --watches/assigned to many--> **Issue**: Determines `issue:{id}` channel access
- **User** --has one--> **User Channel**: `user:{userId}` (self only)

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

## Security

1. Authentication MUST be completed before any subscription is allowed
2. Channel access validation MUST check team membership or issue association
3. Users MUST NOT subscribe to channels they don't have access to
4. The gateway MUST NOT expose internal event routing or connection IDs to clients
5. Rate limiting SHOULD be applied to subscription messages (prevent abuse)
