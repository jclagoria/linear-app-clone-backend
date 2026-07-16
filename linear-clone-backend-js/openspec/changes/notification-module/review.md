# Review — Notification Module: Creation & Delivery

## Spec Compliance

Verify after implementation:

| Requirement | Source | Status |
|-------------|--------|--------|
| Notifications created for all 6 event types | specs-business: NOTIF-1 | Pending |
| Recipient resolution matches event type table | specs-business: NOTIF-9 | Pending |
| Notifications stored in database (store-and-forward) | specs-business: Feature "Notification Creation" | Pending |
| WebSocket delivery is best-effort | specs-business: NOTIF-8 | Pending |
| Notifications expire after 90 days | specs-business: NOTIF-5 | Pending |
| User can get notifications (paginated, sorted desc) | specs-api: List notifications | Pending |
| Unread count included in response | specs-api: NotificationListResponse | Pending |
| User can mark notification as read (idempotent) | specs-api: Mark read, specs-business: NOTIF-6 | Pending |
| User can mark all notifications as read | specs-api: Mark all read | Pending |
| No email/push in v1 — in-app only | specs-business: Feature "Notification Preferences" | Pending |

## Edge Cases

- **Empty notification list**: User with no notifications receives `{ data: [], unreadCount: 0, pagination: { hasMore: false, nextCursor: null } }`
- **All notifications expired**: Same as empty list — expired notifications are excluded
- **Duplicate mark-read**: Calling PATCH on already-read notification returns 200 with no error
- **Empty mark-all**: User with no unread notifications receives `{ success: true, updatedCount: 0 }`
- **Notification for non-existent user**: Not applicable — notifications created via events from authenticated actions
- **Self-notification**: Comment author does not receive `comment_added` notification for their own comment
- **Rate limiting**: All endpoints have rate limits defined in specs-api
- **Unauthenticated requests**: All endpoints return 401 without valid JWT

## Leakage Check

- [ ] No implementation details leaked into specs
- [ ] Specs reference behavior, not code structure
- [ ] API contracts in specs-api match the actual route signatures

## Performance Bounds

| Concern | Bound | Notes |
|---------|-------|-------|
| Notification creation latency | < 50ms per notification | Simple INSERT + event publish; batch creation for team-wide events |
| List endpoint P99 | < 100ms | Indexed query by user_id + created_at |
| List with filter P99 | < 100ms | read_at index covers filter |
| Mark-all for 1000 notifications | < 500ms | Bulk UPDATE with WHERE user_id AND read_at IS NULL |

## Migration Rollback

The `notifications` and `notification_preferences` tables are additive — no existing tables are modified. Rollback strategy:

1. Remove notification routes from `app.ts`
2. Remove `NotificationService` calls from Work and Cycle module use cases
3. Drop `notifications` and `notification_preferences` tables (or leave for data retention)
4. Rollback: `drizzle-kit drop` or manual `DROP TABLE IF EXISTS notifications, notification_preferences`

## Backward Compatibility

- All notification endpoints are **new** — no existing API is modified
- Work and Cycle module use cases are **extended** with notification service calls — existing behavior is preserved
- The `notifications` and `notification_preferences` tables are **new** — no existing schema is altered
- Response formats follow existing patterns (`{ data: ... }`, `{ data: ..., pagination: ... }`)

## Checklist

- [ ] All requirements covered
- [ ] Scenarios pass
- [ ] Error states handled
- [ ] No technical detail in specs
- [ ] Performance bounds defined and validated
- [ ] Migration rollback strategy documented
- [ ] Backward compatibility verified or breaking change justified
