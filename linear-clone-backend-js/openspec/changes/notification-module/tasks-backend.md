# Tasks — Notification Module (Backend)

## Scaffold

- [ ] Create `src/modules/notification/` directory structure (domain, application, adapters, tests)
- [ ] Create barrel exports in `domain/index.ts`

## Data Layer

- [ ] Define `notifications` Drizzle table schema in `domain/notification.ts`
- [ ] Define `notification_preferences` Drizzle table schema in `domain/notification-preferences.ts`
- [ ] Create domain error classes in `domain/errors.ts`
- [ ] Create `NotificationRepository` port interface in `application/ports/notification-repository.ts`
- [ ] Create `NotificationPreferencesRepository` port interface in `application/ports/notification-preferences-repository.ts`
- [ ] Implement `DrizzleNotificationRepository` adapter — findMany with cursor pagination, findByUserAndId, create, markRead, markAllRead, countUnread
- [ ] Implement `DrizzleNotificationPreferencesRepository` adapter — getByUserId, upsert
- [ ] Register notification schemas in `shared/database/index.ts`
- [ ] Generate Drizzle migration files for `notifications` and `notification_preferences` tables

## Business Logic

- [ ] Implement `CreateNotification` use case — input validation, expiry date computation, DB insert, event publication
- [ ] Implement `ListNotifications` use case — cursor pagination, read/unread filter, unread count, exclude expired
- [ ] Implement `MarkNotificationRead` use case — ownership check, idempotent read_at update, event publication
- [ ] Implement `MarkAllNotificationsRead` use case — bulk update of user's unread notifications, return count
- [ ] Implement `GetNotificationPreferences` use case — fetch or create defaults (upsert)
- [ ] Implement `UpdateNotificationPreferences` use case — partial merge of types field
- [ ] Create `EventPublisher` port interface in `application/ports/event-publisher.ts`
- [ ] Implement `InMemoryEventPublisher` adapter for testing

## API Layer

- [ ] Create Zod request/response schemas in `adapters/in/dto.ts`
- [ ] Implement `NotificationController` — register routes and wire use cases
- [ ] Register notification routes in `app.ts` with prefix `/api/v1/notifications`

## Integration — Work Module

- [ ] Add `NotificationService` call to `AssignIssue` use case (issue_assigned event)
- [ ] Add `NotificationService` call to `AddComment` use case (issue_mentioned + comment_added events)
- [ ] Add `NotificationService` call to `ChangeIssueStatus` use case (statusChanged event)

## Integration — Cycle Module

- [ ] Add `NotificationService` call to `ActivateCycle` use case (cycle_started event)
- [ ] Add `NotificationService` call to `CompleteCycle` use case (cycle_completed event)

## Integration — Gateway Module

- [ ] Wire notification `EventPublisher` to Gateway's broadcast for `NotificationCreated` and `NotificationRead` events

## Events / Messaging

- [ ] Publish `NotificationCreated` event on notification creation (consumed by Gateway)
- [ ] Publish `NotificationRead` event on mark-read/mark-all (consumed by Gateway to update client unread count)

## Security

- [ ] Verify all notification endpoints use existing auth middleware (JWT required)
- [ ] Verify all repository queries scope by `user_id` from authenticated token

## Testing

- [ ] Unit tests: `CreateNotification` — validates type, sets expiry, publishes event
- [ ] Unit tests: `ListNotifications` — pagination, filter by read/unread, unread count, excludes expired
- [ ] Unit tests: `MarkNotificationRead` — idempotency, ownership check, publishes event
- [ ] Unit tests: `MarkAllNotificationsRead` — count of updated rows, idempotency
- [ ] Unit tests: `GetNotificationPreferences` — default creation if not exists
- [ ] Unit tests: `UpdateNotificationPreferences` — partial merge, upsert
- [ ] Integration tests: Repository queries against test database
- [ ] Integration tests: Full API flow (create → list → mark read → list)

## Review

- [ ] Self-review: verify all 6 notification types are supported
- [ ] Self-review: verify recipient resolution matches spec (assignee, mentioned, watchers, team members)
- [ ] Self-review: verify 90-day exclusion works correctly in queries
- [ ] Self-review: verify mark-all only affects the authenticated user
- [ ] Self-review: verify expired notification cleanup query
