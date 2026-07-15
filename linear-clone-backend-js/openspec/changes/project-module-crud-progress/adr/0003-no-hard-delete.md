---
status: accepted
date: 2026-07-15
decision-makers: Juan Carlos Lagoria
---

# ADR-0003: Canceled as Terminal Status Instead of Hard Delete

## Context and Problem Statement

Projects need a way to be removed from active view. The options are hard delete, soft delete (`deletedAt`), or a terminal status (`canceled`). The spec explicitly requires no hard delete.

## Decision Drivers

- Spec requirement: "No hard delete — use status 'Canceled' only"
- Deleting a project would orphan associated issue data
- Business value: canceled projects serve as an audit trail
- Users need to understand why a project is gone

## Considered Options

- A. Use `canceled` status as terminal (no hard or soft delete)
- B. Soft delete with `deletedAt` timestamp
- C. Hard delete (excluded by spec)

## Decision Outcome

Chosen option: "A. Use `canceled` status as terminal", because it satisfies the spec requirement, preserves audit trail, and makes the project's disposition explicit to users. When canceled, all issue-project associations are cleared (`projectId = null`) but issues remain.

### Consequences

- Good, because no data loss — audit trail is maintained
- Good, because the UI can show "Canceled" as an explicit state
- Good, because issues remain intact (just lose project association)
- Bad, because storage is never reclaimed (acceptable for typical project volumes)
- Bad, because filtering out canceled projects requires a `WHERE status != 'canceled'` clause

### Confirmation

The `change-project-status.ts` use case enforces that only team admins can transition to `canceled`. On cancel, the use case updates all associated issues to set `projectId = null`. The list/find queries filter out canceled projects by default unless explicitly requested.

## Pros and Cons of the Options

### A. Canceled status

- Good, explicit semantics — users see "Canceled" not "deleted"
- Good, can be undone (if business rules change)
- Bad, storage is not reclaimed

### B. Soft delete (deletedAt)

- Good, simple pattern used elsewhere in the codebase
- Neutral, needs null checks in queries
- Bad, doesn't communicate *why* the project is gone
- Bad, requires `WHERE deletedAt IS NULL` on every query

### C. Hard delete

- Bad, violates spec requirement
- Bad, loses all association history
- Bad, potential data loss from user error

## More Information

The existing `issues` table uses `deletedAt` for soft delete of individual issues — a different use case (user-initiated deletion with undo). For projects, the spec explicitly chose `canceled` to match Linear's product behavior.
