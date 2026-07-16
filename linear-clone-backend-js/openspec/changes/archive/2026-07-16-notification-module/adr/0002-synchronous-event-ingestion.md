# ADR-0002: Synchronous Event Ingestion from Emitting Modules

- **Status**: Accepted
- **Date**: 2026-07-16

## Context

Notifications are triggered by events from other modules (Work, Cycle). Two ingestion patterns exist:
1. **Asynchronous (event bus)**: Emitting modules publish events to a bus; Notification module consumes asynchronously.
2. **Synchronous (direct call)**: Emitting modules call `NotificationService.create()` directly after successful mutations.

For v1, simplicity and speed of implementation are prioritized over full decoupling.

## Decision

Use **synchronous direct calls** from emitting modules into the Notification module's application service.

- Work and Cycle module use cases import and call `NotificationService` directly.
- The notification module exports a clear `NotificationService` interface.
- Recipient resolution and preference filtering happen inline.
- Events are still published for Gateway delivery (WebSocket broadcast).

## Consequences

- **Positive**: Simple implementation — no message broker, no consumer setup.
- **Positive**: Transactional consistency — notification creation is in the same request context as the triggering action.
- **Positive**: Easy to understand and debug.
- **Negative**: Tighter coupling between modules — emitting modules depend on notification service interface.
- **Negative**: Notification creation adds latency to the original request (mitigated by simple DB insert).

## Alternatives Considered

| Alternative | Reason Rejected |
|-------------|----------------|
| Event bus (RabbitMQ) | Over-engineering for v1; no existing bus infrastructure |
| Database-level triggers | Opacity, hard to test, no preference filtering |
| Deferred background job | Adds infrastructure dependency (Bull/BullMQ) for v1 |

## Future Migration Path

If notification volume grows or tighter decoupling is needed, the synchronous call can be replaced with an event bus adapter without changing the interface — only the injection point changes.
