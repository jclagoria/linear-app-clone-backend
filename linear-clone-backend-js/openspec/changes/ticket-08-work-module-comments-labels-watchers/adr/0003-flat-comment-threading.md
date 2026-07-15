---
status: accepted
date: 2026-07-14
decision-makers: Engineering team
---

# Flat comment threading (no nested replies)

## Context and Problem Statement

Issue comments can be organized as flat (all comments at the same level, ordered chronologically) or threaded (comments can reply to specific comments, creating nested discussions). The choice affects UI complexity, data model, and moderation.

## Decision Drivers

- Minimize initial implementation complexity
- Support Linear-like comment experience (linear uses flat threading with optional reply-to markers)
- Avoid complex moderation of nested threads in v1

## Considered Options

- Option 1: Flat threading — all comments at the same level, ordered by `created_at`
- Option 2: Nested threading — comments reference a `parent_id` for replies

## Decision Outcome

Chosen option: "Flat threading", because it provides a working comment system with minimal complexity and aligns with the out-of-scope decision in the proposal. Nested replies can be added later as a `parent_id` column without breaking the existing API.

### Consequences

- Good, because simplest data model — no `parent_id`, no recursion in queries.
- Good, because fastest to implement — single ordered list.
- Good, because the API contract is simple (list → create → update → delete).
- Bad, because some users expect threaded discussions.
- Bad, because migrating to threading later requires a `parent_id` migration and API version change.

### Confirmation

The `issue_comments` table SHALL NOT include a `parent_id` column in v1. The list endpoint SHALL return comments ordered by `created_at` ascending. If threading is added later, it SHALL use an optional `parent_id UUID REFERENCES issue_comments(id)` column.

## Pros and Cons of the Options

### Flat threading

- Good, because trivial data model and query pattern.
- Good, because all comments are equally visible in chronological order.
- Bad, because context-specific replies are disconnected from their parent.

### Nested threading

- Good, because replies are visually grouped with their parent.
- Bad, because moderation is harder (deleting a parent may cascade).
- Bad, because queries require recursive CTEs or application-level tree building.
- Bad, because UI rendering is more complex.
- Good, because familiar pattern from Linear, GitHub, Slack threads.

## More Information

Flat threading is explicitly listed as out-of-scope in the change proposal. If the team observes users wanting threaded replies, the `parent_id` column can be added in a follow-up change without breaking existing flat comments.
