# Notification Module — Creation & Delivery

## Problem Statement

The system currently has no mechanism for notifying users about relevant events — assignments, mentions, comments, status changes, or cycle lifecycle events. Users have no way to know when something requires their attention unless they actively poll for changes.

## Motivation

Notifications are essential for a collaborative issue-tracking platform. Without them, users miss critical updates: being assigned an issue, being mentioned in a comment, or a cycle starting/completing. This change delivers the core notification infrastructure (create, store, retrieve, mark read) with in-app delivery, establishing the foundation that other modules will emit events to.

## Scope

- **In scope**:
  - Notification creation for 6 event types: `issue_assigned`, `issue_mentioned`, `comment_added`, `statusChanged`, `cycle_started`, `cycle_completed`
  - Recipient resolution per event type (assignee, mentioned users, watchers, team members)
  - Database storage (store-and-forward model)
  - REST API: list notifications (sorted desc, unread count), mark read, mark all read
  - 90-day expiration on notifications
  - WebSocket delivery via Gateway module (best-effort)
  - Notification preferences (email/in-app toggle — optional)
- **Out of scope**:
  - Email or push notifications (v1 is in-app only)
  - Notification grouping or digest
  - Retry mechanism for failed WebSocket delivery

## Impact

- **Notification Module** (new): domain entities, repository, use cases, controller
- **Gateway Module**: receives notification events and broadcasts to user's WebSocket connection
- **Work Module**: emits `IssueAssigned`, `IssueMentioned`, `CommentAdded`, `IssueStatusChanged` events consumed by Notification
- **Cycle Module**: emits `CycleStarted`, `CycleCompleted` events consumed by Notification
- **Identity Module**: provides team membership data for cycle event recipient resolution
- **Database**: new `notifications` and `notification_preferences` tables
