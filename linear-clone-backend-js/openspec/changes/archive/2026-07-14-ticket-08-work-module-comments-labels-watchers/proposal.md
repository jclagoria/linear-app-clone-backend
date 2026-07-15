# Work Module — Comments, Labels, and Issue Watchers

## Problem Statement

The work module currently supports issue CRUD, status transitions, and assignment. Users cannot comment on issues, manage labels, or watch issues for updates — all of which are essential for team collaboration in a Linear-like project management tool.

## Motivation

Comments enable asynchronous discussion on issues. Labels provide flexible categorization beyond status. Watchers let team members track issue activity without being directly assigned. Together, these features complete the core collaboration layer of the work module.

## Scope

- **In scope**:
  - Issue comments: create, update, delete (soft-delete), list by issue
  - Label management CRUD (workspace-level labels)
  - Label assignment: attach/detach labels to/from issues
  - Issue watchers: add/remove watchers, list watchers per issue
  - Event publishing for all mutations (comments, labels, watchers)
  - Authentication and authorization (team membership checks)
- **Out of scope**:
  - Nested/reply comments (flat threading only)
  - Rich text / markdown rendering in comments
  - Real-time WebSocket delivery of events (event publishing only)
  - Notification system (email, in-app, push)
  - Label color management
  - Bulk operations

## Capabilities

- **comment-management**: Create, update, delete, and list comments on issues
- **label-management**: Create, update, delete workspace labels
- **label-assignment**: Attach and detach labels to/from issues
- **issue-watchers**: Add, remove, and list watchers on issues

## Impact

- **src/modules/work/** — New domain entities, use cases, ports, and adapters for comments, labels, and watchers
- **Database** — New tables: `issue_comments`, `labels`, `issue_watchers` (the existing `issue_labels` junction table already exists)
- **API** — New REST endpoints under `/issues/:id/comments`, `/labels`, `/issues/:id/labels`, `/issues/:id/watchers`
- **Events** — New event types for comment/label/watcher mutations consumed by existing `EventPublisher`
