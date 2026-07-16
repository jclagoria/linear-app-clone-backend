# ADR-0001: Store-and-Forward Notification Model

- **Status**: Accepted
- **Date**: 2026-07-16

## Context

The notification module needs to deliver notifications to users. Two primary models exist:
1. **Push-only**: Deliver via WebSocket only; if user is offline, notification is lost.
2. **Store-and-forward**: Persist notifications to database, then attempt WebSocket delivery; stored notification is available on next connection.

The spec requires in-app notifications with best-effort WebSocket delivery — notifications must not be lost if the user is offline.

## Decision

Adopt **store-and-forward** model with PostgreSQL as the notification store.

- All notifications are persisted to the `notifications` table before any delivery attempt.
- After persistence, a `NotificationCreated` event is published for the Gateway to broadcast via WebSocket.
- WebSocket delivery is best-effort — failure does not affect the stored notification.
- Expired notifications (90 days) are excluded from queries and periodically cleaned up.

## Consequences

- **Positive**: No notification loss — users always see notifications on next connection.
- **Positive**: Simple architecture — no external message broker needed for v1.
- **Positive**: Pagination, filtering, and read-tracking are natural database queries.
- **Negative**: Database storage grows linearly with notification volume (mitigated by 90-day TTL + cleanup).
- **Negative**: Creating a notification for many recipients (e.g., team-wide cycle event) generates N rows in a single transaction.

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| Push-only (WebSocket, no storage) | Violates requirement — notifications lost if offline |
| External event bus (RabbitMQ, Redis Streams) | Unnecessary complexity for v1; synchronous push is sufficient |
| Redis-only storage | Lacks query flexibility (filtering, pagination by read status) |
