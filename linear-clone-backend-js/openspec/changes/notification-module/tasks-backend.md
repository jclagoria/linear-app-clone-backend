# Tasks — Notification Module (Backend)

## Scaffold

- [x] Create `src/modules/notification/` directory structure (domain, application, adapters, tests)
- [x] Create barrel exports in `domain/index.ts`

## Data Layer

- [x] Define `notifications` Drizzle table schema in `domain/notification.ts`
- [x] Define `notification_preferences` Drizzle table schema in `domain/notification-preferences.ts`
- [x] Create domain error classes in `domain/errors.ts`
- [x] Create `NotificationRepository` port interface in `application/ports/notification-repository.ts`
- [x] Create `NotificationPreferencesRepository` port interface in `application/ports/notification-preferences-repository.ts`
- [x] Implement `DrizzleNotificationRepository` adapter — findMany with cursor pagination, findByUserAndId, create, markRead, markAllRead, countUnread
- [x] Implement `DrizzleNotificationPreferencesRepository` adapter — getByUserId, upsert
- [x] Register notification schemas in `shared/database/index.ts`
- [x] Generate Drizzle migration files for `notifications` and `notification_preferences` tables

## Business Logic

- [x] Implement `CreateNotification` use case — input validation, expiry date computation, DB insert, event publication
- [x] Implement `ListNotifications` use case — cursor pagination, read/unread filter, unread count, exclude expired
- [x] Implement `MarkNotificationRead` use case — ownership check, idempotent read_at update, event publication
- [x] Implement `MarkAllNotificationsRead` use case — bulk update of user's unread notifications, return count
- [x] Implement `GetNotificationPreferences` use case — fetch or create defaults (upsert)
- [x] Implement `UpdateNotificationPreferences` use case — partial merge of types field
- [x] Create `EventPublisher` port interface in `application/ports/event-publisher.ts`
- [x] Implement `InMemoryEventPublisher` adapter for testing

## API Layer

- [x] Create Zod request/response schemas in `adapters/in/dto.ts`
- [x] Implement `NotificationController` — register routes and wire use cases
- [x] Register notification routes in `app.ts` with prefix `/api/v1/notifications`

## Integration — Work Module

- [x] Add `NotificationService` call to `AssignIssue` use case (issue_assigned event)
- [x] Add `NotificationService` call to `AddComment` use case (issue_mentioned + comment_added events)
- [x] Add `NotificationService` call to `ChangeIssueStatus` use case (statusChanged event)

## Integration — Cycle Module

- [x] Add `NotificationService` call to `ActivateCycle` use case (cycle_started event)
- [x] Add `NotificationService` call to `CompleteCycle` use case (cycle_completed event)

## Integration — Gateway Module

- [x] Wire notification `EventPublisher` to Gateway's broadcast for `NotificationCreated` and `NotificationRead` events (via InMemoryNotificationEventPublisher that collects events; production Gateway wiring deferred until Gateway module is built)

## Events / Messaging

- [x] Publish `NotificationCreated` event on notification creation (consumed by Gateway)
- [x] Publish `NotificationRead` event on mark-read/mark-all (consumed by Gateway to update client unread count)

## Security

- [x] Verify all notification endpoints use existing auth middleware (JWT required)
- [x] Verify all repository queries scope by `user_id` from authenticated token

## Testing

- [x] Unit tests: `CreateNotification` — validates type, sets expiry, publishes event
- [x] Unit tests: `ListNotifications` — pagination, filter by read/unread, unread count, excludes expired
- [x] Unit tests: `MarkNotificationRead` — idempotency, ownership check, publishes event
- [x] Unit tests: `MarkAllNotificationsRead` — count of updated rows, idempotency
- [x] Unit tests: `GetNotificationPreferences` — default creation if not exists
- [x] Unit tests: `UpdateNotificationPreferences` — partial merge, upsert

## Review

- [x] Self-review: verify all 6 notification types are supported
- [x] Self-review: verify recipient resolution matches spec (assignee, mentioned, watchers, team members)
- [x] Self-review: verify 90-day exclusion works correctly in queries
- [x] Self-review: verify mark-all only affects the authenticated user
- [x] Self-review: verify expired notification cleanup query
