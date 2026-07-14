---
status: "accepted"
date: 2026-07-14
decision-makers: Juan Carlos Lagoria
consulted: N/A
informed: N/A
---

# Soft-Delete Pattern — `deletedAt` Timestamp

## Context and Problem Statement

Issues must be deletable but data recovery and audit trails may be needed. Hard deletion risks accidental data loss and breaks referential integrity for comments, labels, and other related entities.

## Decision Drivers

- Must allow data recovery within a reasonable window
- Must maintain referential integrity with child entities
- Must not pollute default queries with deleted data
- Must be consistent with existing Identity module patterns

## Considered Options

- Soft-delete with `deletedAt` timestamp
- Hard-delete with audit log
- Soft-delete with `isDeleted` boolean flag
- Move to separate archive table

## Decision Outcome

Chosen option: "Soft-delete with `deletedAt` timestamp", because it is consistent with the Identity module pattern, preserves referential integrity, and enables straightforward cleanup jobs.

### Consequences

- Good, because data can be recovered by setting `deletedAt` to null
- Good, because `deletedAt` as a nullable timestamp gives more information than a boolean
- Good, because partial unique indexes (WHERE `deleted_at IS NULL`) keep unique constraints clean
- Bad, because database size grows with soft-deleted records (mitigated by periodic cleanup jobs)
- Bad, because all queries must explicitly filter `deleted_at IS NULL` unless including deleted records

### Confirmation

All issue queries SHALL exclude records with non-null `deletedAt` by default. The `includeDeleted=true` parameter SHALL override this behavior.

## Pros and Cons of the Options

### Soft-delete with `deletedAt` timestamp

- Good, because timestamp provides deletion time for auditing
- Good, because partial unique indexes work naturally with nullable timestamps
- Neutral, because requires query discipline to filter by default

### Hard-delete with audit log

- Good, because keeps database size minimal
- Bad, because loses referential integrity with child entities (comments, labels)

### Soft-delete with `isDeleted` boolean flag

- Good, because simple to understand and query
- Bad, because partial unique indexes require null-based pattern instead
- Bad, because no deletion timestamp is available

### Move to separate archive table

- Good, because keeps main table small
- Bad, because querying data across tables is more complex
- Bad, because restoring a deleted issue requires moving data back

## More Information

This pattern is already established in the Identity module (`teams.deleted_at`, `users.deleted_at`, `team_members.deleted_at`). The Work module SHALL follow the same convention.
