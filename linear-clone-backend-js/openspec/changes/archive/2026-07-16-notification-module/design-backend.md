# Notifications — Backend Design

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Module structure | Hexagonal (ports & adapters) | Matches existing modules (auth, work, cycle) |
| Event ingestion | Synchronous service calls from Work/Cycle use cases | Events are triggered inline — no event bus needed for v1 |
| Notification creation | Application service called by emitting module's use case | Simple push model; each emitting module calls `NotificationService.create()` |
| Recipient resolution | Resolved at creation time per event type | Deterministic; recipients snapshot at event time |
| WebSocket delivery | Gateway module's `EventPublisher.broadcast()` | Existing Gateway pattern — notification module publishes `notification:new` event |
| Expiration | `expires_at` column + scheduled cleanup job | Simple TTL, no external scheduler needed |
| Read status | `read_at` nullable timestamp | NULL = unread, timestamp = read; idempotent updates |

## Module Structure

```
src/modules/notification/
  domain/
    index.ts
    notification.ts
    notification-preferences.ts
    errors.ts
  application/
    create-notification.ts
    list-notifications.ts
    mark-notification-read.ts
    mark-all-notifications-read.ts
    get-notification-preferences.ts
    update-notification-preferences.ts
    ports/
      notification-repository.ts
      notification-preferences-repository.ts
      event-publisher.ts
  adapters/
    in/
      notification-controller.ts
      dto.ts
    out/
      drizzle-notification-repository.ts
      drizzle-notification-preferences-repository.ts
      in-memory-event-publisher.ts
  __tests__/
    create-notification.test.ts
    list-notifications.test.ts
    mark-notification-read.test.ts
    mark-all-notifications-read.test.ts
    notification-preferences.test.ts
```

## API Contracts

### List notifications

- **Method**: GET
- **Path**: `/api/v1/notifications`
- **Auth**: JWT (required)
- **Request query**: `{ filter?: "read" | "unread", cursor?: string, limit?: number }`
- **Response**: `{ data: Notification[], unreadCount: number, pagination: PaginationMeta }`
- **Status Codes**: 200, 401, 422, 429, 500

### Mark notification as read

- **Method**: PATCH
- **Path**: `/api/v1/notifications/:id/read`
- **Auth**: JWT (required)
- **Request params**: `{ id: UUID }`
- **Response**: `{ success: true }`
- **Status Codes**: 200, 401, 404, 429, 500

### Mark all notifications as read

- **Method**: PATCH
- **Path**: `/api/v1/notifications/read-all`
- **Auth**: JWT (required)
- **Response**: `{ success: true, updatedCount: number }`
- **Status Codes**: 200, 401, 429, 500

### Get notification preferences

- **Method**: GET
- **Path**: `/api/v1/notifications/preferences`
- **Auth**: JWT (required)
- **Response**: `{ data: NotificationPreferences }`
- **Status Codes**: 200, 401, 500

### Update notification preferences

- **Method**: PATCH
- **Path**: `/api/v1/notifications/preferences`
- **Auth**: JWT (required)
- **Request body**: `{ inApp?: boolean, email?: boolean, types?: Record<string, boolean> }`
- **Response**: `{ data: NotificationPreferences }`
- **Status Codes**: 200, 400, 401, 429, 500

## Data Model

### `notifications`

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | `uuid` | PK, defaultRandom | Auto-generated |
| `user_id` | `uuid` | NOT NULL, FK → users(id) | Recipient |
| `type` | `varchar(50)` | NOT NULL | One of 6 notification types |
| `title` | `varchar(255)` | NOT NULL | Human-readable summary |
| `body` | `text` | Nullable | Extended description |
| `link` | `varchar(500)` | Nullable | Deep link |
| `read_at` | `timestamp` | Nullable | NULL = unread |
| `created_at` | `timestamp` | NOT NULL, defaultNow | Creation time |
| `expires_at` | `timestamp` | NOT NULL | created_at + 90 days |

**Indexes:**
- `(user_id, created_at DESC)` — primary query (list, sorted by date)
- `(user_id, read_at)` — filter by read/unread
- `(expires_at)` — cleanup job

### `notification_preferences`

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `user_id` | `uuid` | PK, FK → users(id) | One row per user |
| `in_app` | `boolean` | NOT NULL, default true | In-app notifications |
| `email` | `boolean` | NOT NULL, default false | Reserved for future |
| `types` | `jsonb` | NOT NULL | `{ "issue_assigned": true, ... }` |
| `updated_at` | `timestamp` | NOT NULL, defaultNow | Last update |

### Migrations

| Version | Description |
|---------|-------------|
| V1 | Create `notifications` table with all fields, indexes, FK to users |
| V1 | Create `notification_preferences` table with JSONB types field, FK to users |

## Business Logic

### `CreateNotification`

- **Responsibility**: Create a notification for a specific user and optionally trigger WebSocket delivery
- **Rules**:
  - Validates notification type is one of the 6 defined types
  - Sets `expires_at` = `created_at + 90 days`
  - Always stores in database regardless of WebSocket outcome
  - Publishes `NotificationCreated` event for Gateway delivery
- **Dependencies**: `NotificationRepository`, `EventPublisher`

### `ListNotifications`

- **Responsibility**: Query notifications for authenticated user with optional filter and pagination
- **Rules**:
  - Default sort by `created_at` descending
  - Excludes expired notifications (`expires_at > NOW()`)
  - Includes `unreadCount` in response (count of notifications with NULL `read_at`)
  - Filter by `read_at IS NULL` (unread) or `read_at IS NOT NULL` (read)
  - Cursor-based pagination
- **Dependencies**: `NotificationRepository`

### `MarkNotificationRead`

- **Responsibility**: Mark a single notification as read
- **Rules**:
  - Idempotent — no error if already read
  - Only the notification owner can mark it as read
  - Sets `read_at` to current timestamp
  - Publishes `NotificationRead` event for Gateway to update client
- **Dependencies**: `NotificationRepository`, `EventPublisher`

### `MarkAllNotificationsRead`

- **Responsibility**: Mark all unread notifications for the authenticated user as read
- **Rules**:
  - Only affects notifications belonging to the calling user
  - Only affects notifications where `read_at IS NULL`
  - Returns count of updated rows
  - Publishes `NotificationRead` event for Gateway
- **Dependencies**: `NotificationRepository`, `EventPublisher`

### `GetNotificationPreferences`

- **Responsibility**: Get the authenticated user's notification preferences
- **Rules**:
  - Creates default preferences row if none exists (upsert pattern)
  - Returns defaults if not yet configured
- **Dependencies**: `NotificationPreferencesRepository`

### `UpdateNotificationPreferences`

- **Responsibility**: Update the authenticated user's notification preferences
- **Rules**:
  - Partial update — only provided fields are changed
  - `types` field is merged, not replaced
  - Creates row if not exists (upsert)
- **Dependencies**: `NotificationPreferencesRepository`

## Event Flow

### Notification Creation Flow

```
1. Work/Cycle use case completes an action (assignment, comment, etc.)
2. Use case calls NotificationService.create(eventPayload)
3. NotificationService:
   a. Resolves recipients by event type (via RecipientResolver)
   b. Creates notification records in DB for each recipient
   c. Filters out recipients who have disabled that notification type in preferences
   d. Publishes NotificationCreated event per recipient
4. Notification module's EventPublisher broadcasts to Gateway
5. Gateway delivers to user:userId channel (best-effort)
```

### RecipientResolver

| Event Type | Resolution |
|------------|-----------|
| `issue_assigned` | Issue's `assignee_id` |
| `issue_mentioned` | Parsed @mentions from comment body |
| `comment_added` | Query `issue_watchers` table for issue |
| `statusChanged` | Query `issue_watchers` table for issue |
| `cycle_started` | Query team members (from identity module) |
| `cycle_completed` | Query team members (from identity module) |

## Integration Points

### With Work Module

Work module use cases (AssignIssue, AddComment, ChangeIssueStatus) will call `NotificationService` after successful mutation:

```typescript
// In Work module use case after successful operation:
await this.notificationService.create({
  type: 'issue_assigned',
  actorId: currentUserId,
  targetId: issueId,
  metadata: { assigneeId, issueTitle, issueIdentifier }
});
```

The notification module exports a `NotificationService` interface that other modules depend on via constructor injection.

### With Cycle Module

Cycle module use cases (ActivateCycle, CompleteCycle) will call `NotificationService`:

```typescript
await this.notificationService.create({
  type: 'cycle_started',
  actorId: currentUserId,
  targetId: cycleId,
  metadata: { teamId, cycleName }
});
```

### With Gateway Module

Notification module publishes events that Gateway subscribes to:

| Event | Gateway Action |
|-------|---------------|
| `NotificationCreated` | Broadcast `notification:new` to `user:{userId}` channel |
| `NotificationRead` | Broadcast `notification:read` to `user:{userId}` channel |

## Security

| Concern | Strategy |
|---------|----------|
| Authentication | All endpoints require valid JWT access token (via existing auth middleware) |
| Authorization | Notifications scoped to `user_id` from JWT; users can only access their own data |
| Input validation | Zod schemas at controller boundary (dto.ts) |
| Rate limiting | Per-user rate limits via existing `@fastify/rate-limit` |
| Data isolation | All repository queries filter by `user_id` from authenticated token |

## Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | Use cases, domain logic, recipient resolution |
| Integration | Vitest + Testcontainers | Repository queries, full API flow, pagination |
| Events | Vitest | Event publishing on notification create/read |

## Event Publisher Integration

The notification module's `InMemoryEventPublisher` will follow the same pattern as other modules — collecting events in memory during tests and delegating to the Gateway's broadcast in production. The production adapter will be injected at app bootstrap.

The Gateway module already defines an `EventPublisher` interface. The notification module will use a compatible publisher that routes `NotificationCreated` and `NotificationRead` events to the Gateway for WebSocket broadcast.
