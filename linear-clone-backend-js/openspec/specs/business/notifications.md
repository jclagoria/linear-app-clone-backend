# Notifications — Business Specification

## Behaviour

**Feature:** Notification Creation

The system SHALL create notifications for relevant events and store them for retrieval. Notifications SHALL expire after 90 days.

### Requirement: Create notification on issue assignment

#### Scenario: User is notified when assigned to issue

- **GIVEN** an issue exists and a user is a member of the issue's team
- **WHEN** the user is assigned to the issue
- **THEN** a notification of type `issue_assigned` SHALL be created for the assignee
- **AND** the notification SHALL contain the issue title and a link to the issue

### Requirement: Create notification on user mention

#### Scenario: User is notified when mentioned in a comment

- **GIVEN** an issue exists and a user is a member of the issue's team
- **WHEN** a comment is created that @mentions the user
- **THEN** a notification of type `issue_mentioned` SHALL be created for each mentioned user
- **AND** the notification SHALL contain the comment snippet and issue link

### Requirement: Create notification on new comment

#### Scenario: Watchers are notified when a comment is added

- **GIVEN** an issue exists and a user is watching the issue (in `issue_watchers`)
- **WHEN** another user creates a comment on the issue
- **THEN** a notification of type `comment_added` SHALL be created for each watcher
- **AND** the notification creator (comment author) SHALL NOT receive the notification

### Requirement: Create notification on status change

#### Scenario: Watchers are notified when issue status changes

- **GIVEN** an issue exists and a user is watching the issue
- **WHEN** the issue status changes
- **THEN** a notification of type `statusChanged` SHALL be created for each watcher

### Requirement: Create notification on cycle start

#### Scenario: Team members are notified when cycle starts

- **GIVEN** a team with multiple members and a cycle exists
- **WHEN** the cycle is activated
- **THEN** a notification of type `cycle_started` SHALL be created for each team member

### Requirement: Create notification on cycle completion

#### Scenario: Team members are notified when cycle completes

- **GIVEN** a team with multiple members and an active cycle exists
- **WHEN** the cycle is completed
- **THEN** a notification of type `cycle_completed` SHALL be created for each team member

---

**Feature:** Notification Retrieval

Users SHALL be able to retrieve their notifications, sorted by creation date descending. The response SHALL include the unread count.

### Requirement: List notifications with pagination

#### Scenario: User retrieves their notifications

- **GIVEN** the user has 25 notifications in the system
- **WHEN** the user requests `GET /api/v1/notifications?limit=20`
- **THEN** the response SHALL contain 20 notifications
- **AND** the response SHALL contain `unreadCount` with the total unread count
- **AND** the response SHALL contain pagination metadata (`hasMore`, `nextCursor`)

#### Scenario: Notifications are sorted by creation date descending

- **GIVEN** the user has notifications created at different times
- **WHEN** the user requests `GET /api/v1/notifications`
- **THEN** the notifications SHALL be ordered by `createdAt` descending (newest first)

#### Scenario: Filter notifications by read status

- **GIVEN** the user has both read and unread notifications
- **WHEN** the user requests `GET /api/v1/notifications?filter=unread`
- **THEN** only unread notifications SHALL be returned
- **WHEN** the user requests `GET /api/v1/notifications?filter=read`
- **THEN** only read notifications SHALL be returned

---

**Feature:** Notification Read Status

Users SHALL be able to mark individual notifications or all notifications as read. Marking as read SHALL be idempotent.

### Requirement: Mark single notification as read

#### Scenario: User marks a notification as read

- **GIVEN** an unread notification exists for the user
- **WHEN** the user sends `PATCH /api/v1/notifications/:id/read`
- **THEN** the notification's `readAt` SHALL be set to the current timestamp
- **AND** the notification SHALL now count as read

#### Scenario: Marking an already-read notification is idempotent

- **GIVEN** a notification already has `readAt` set
- **WHEN** the user sends `PATCH /api/v1/notifications/:id/read` again
- **THEN** the operation SHALL succeed (200)
- **AND** the `readAt` value SHALL remain unchanged

### Requirement: Mark all notifications as read

#### Scenario: User marks all notifications as read

- **GIVEN** the user has 10 unread notifications
- **WHEN** the user sends `PATCH /api/v1/notifications/read-all`
- **THEN** all unread notifications for that user SHALL have `readAt` set
- **AND** the response SHALL include `updatedCount` = 10
- **AND** subsequent calls SHALL return `updatedCount` = 0

---

**Feature:** Notification Preferences

Users SHALL be able to configure notification delivery preferences.

### Requirement: Get notification preferences

#### Scenario: User retrieves their preferences

- **GIVEN** the user exists
- **WHEN** the user requests `GET /api/v1/notifications/preferences`
- **THEN** the response SHALL include `inApp`, `email`, and `types` fields
- **AND** all fields SHALL default to `true` if not configured

### Requirement: Update notification preferences

#### Scenario: User disables in-app notifications for status changes

- **GIVEN** the user has default preferences
- **WHEN** the user sends `PATCH /api/v1/notifications/preferences` with `{ "types": { "statusChanged": false } }`
- **THEN** the `statusChanged` type for in-app SHALL be disabled
- **AND** other types SHALL remain unchanged
- **AND** the response SHALL reflect the updated preferences

---

**Feature:** Notification Expiration

Notifications SHALL expire after 90 days and SHALL be excluded from queries.

### Requirement: Expired notifications are not returned

#### Scenario: Old notifications are excluded

- **GIVEN** a notification was created 91 days ago
- **WHEN** the user requests `GET /api/v1/notifications`
- **THEN** the expired notification SHALL NOT appear in results

---

**Feature:** WebSocket Delivery

Notifications SHALL be delivered in real-time via WebSocket when the user is online. Delivery SHALL be best-effort — notification is always stored regardless of connection status.

### Requirement: WebSocket delivery on notification creation

#### Scenario: Online user receives notification in real-time

- **GIVEN** the user has an active WebSocket connection
- **WHEN** a notification is created for the user
- **THEN** the Gateway SHALL send a `notification:new` event on the `user:{userId}` channel
- **AND** the notification SHALL also be stored in the database

#### Scenario: Offline user receives notification on next connection

- **GIVEN** the user has no active WebSocket connection
- **WHEN** a notification is created for the user
- **THEN** the notification SHALL be stored in the database
- **AND** no WebSocket event SHALL be sent
- **AND** the user SHALL see the notification on next `GET /api/v1/notifications`

---

## Data Model

### `notifications`

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | UUID | PK | Auto-generated |
| `user_id` | UUID | FK → users(id), NOT NULL, INDEX | Notification recipient |
| `type` | VARCHAR(50) | NOT NULL | Enum: issue_assigned, issue_mentioned, comment_added, statusChanged, cycle_started, cycle_completed |
| `title` | VARCHAR(255) | NOT NULL | Human-readable summary |
| `body` | TEXT | NULLABLE | Extended description |
| `link` | VARCHAR(500) | NULLABLE | Deep link to relevant resource |
| `read_at` | TIMESTAMP | NULLABLE | Set when user marks as read; NULL = unread |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation time |
| `expires_at` | TIMESTAMP | NOT NULL, INDEX | `created_at + 90 days` |

**Indexes:**
- `(user_id, created_at DESC)` — primary query pattern (list user notifications sorted by date)
- `(user_id, read_at)` — filter by read/unread
- `(expires_at)` — periodic cleanup

### `notification_preferences`

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `user_id` | UUID | PK, FK → users(id) | One row per user |
| `in_app` | BOOLEAN | NOT NULL, DEFAULT true | In-app notifications enabled |
| `email` | BOOLEAN | NOT NULL, DEFAULT false | Email notifications enabled (reserved for future) |
| `types` | JSONB | NOT NULL | Per-type toggle: `{ "issue_assigned": true, ... }` |
| `updated_at` | TIMESTAMP | NOT NULL | Last update time |

### Relationships

`User` --1:1--> `notification_preferences`: Each user has zero or one preferences row (created on first access with defaults).

`User` --1:N--> `notifications`: Each user can have many notifications.

---

## Business Rules

| ID | Rule | Violation |
|----|------|-----------|
| NOTIF-1 | Notification `type` MUST be one of the 6 defined types | 422 |
| NOTIF-2 | Notification author (event initiator) MUST NOT receive a notification for their own action (e.g., comment author does not get `comment_added`) | No error — implicit exclusion |
| NOTIF-3 | `read_at` is set server-side — clients MUST NOT send it | N/A |
| NOTIF-4 | Notifications with `read_at IS NOT NULL` are considered "read" | N/A |
| NOTIF-5 | Expired notifications (WHERE `expires_at < NOW()`) MUST be excluded from queries and MAY be eventually deleted | N/A |
| NOTIF-6 | Marking an already-read notification as read MUST be idempotent (no error) | N/A |
| NOTIF-7 | Mark-all affects only the authenticated user's unread notifications | N/A |
| NOTIF-8 | Notification creation SHALL NOT fail if WebSocket delivery fails | N/A |
| NOTIF-9 | Recipient resolution for `cycle_started`/`cycle_completed` SHALL use team membership at the time of the event | N/A |

---

## Security

| Concern | Strategy |
|---------|----------|
| Authentication | All endpoints require valid JWT access token |
| Authorization | Users can only read/update their own notifications and preferences |
| Input validation | All input validated via Zod schemas at the controller boundary |
| Rate limiting | Per-user rate limits on all endpoints (see API spec) |
| Data isolation | All queries scoped by `user_id` extracted from authenticated token |
