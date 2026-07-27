# WebSocket Real-Time Backend Changes for Kanban

## Problem Statement

The WebSocket gateway module is fully implemented with authentication, subscription management, and broadcast capabilities, but it is not wired into the rest of the application. When a user connects, they only subscribe to their personal `user:{userId}` channel. Issue and team events are not broadcast, and the gateway has no knowledge of which channels a user should receive. This means the Kanban board cannot receive real-time updates when issues change.

## Motivation

Real-time updates are a core feature of the Kanban experience. Without them, users must manually refresh to see changes made by teammates. This degrades collaboration and makes the app feel sluggish compared to the reference Linear application. Wiring the gateway to the work and identity modules closes this gap and delivers a production-ready real-time backend.

## Scope

- **In scope**:
  - Auto-subscribe authenticated users to their team and issue channels on connection
  - Validate channel access before allowing subscriptions (prevent unauthorized channel access)
  - Bridge work module events (issue, comment, label, watcher changes) to the gateway's event emitter for broadcast
  - New port interfaces for cross-module queries (team membership, issue watchers)
  - New adapter implementing event bridging between modules

- **Out of scope**:
  - Frontend WebSocket client integration
  - Redis/Kafka-based event broadcasting (current `InProcessEventEmitter` is sufficient for single-instance)
  - WebSocket horizontal scaling across multiple instances
  - Presence or typing indicator features
  - Message persistence or replay

## Impact

- **Gateway module**: `AuthenticateConnection` use case gains new dependencies (team/issue query ports). `ManageSubscription` gains channel access validation.
- **Work module**: Controllers switch from `InMemoryEventPublisher` to a new `ModuleEventBridge` adapter that forwards events to the gateway.
- **Identity module**: Exposes `TeamMemberQuery` port for cross-module team membership queries.
- **New files**: `ModuleEventBridge` adapter, `ChannelAccessValidator` port, `TeamMemberQuery` port, `WatcherQuery` port.
- **Existing files modified**: `authenticate-connection.ts`, `manage-subscription.ts`, `issue-controller.ts`, `comment-controller.ts`, `label-controller.ts`, `watcher-controller.ts`, gateway setup/wiring.
- **Consumers**: Frontend Kanban board will receive real-time `issue.updated`, `comment.created`, etc. events once this is implemented.
