---
status: "accepted"
date: 2026-07-13
decision-makers: Backend Team
consulted: Tech Lead, Data Team
informed: Engineering
---

# Soft Deletion Strategy for All Entities

## Context and Problem Statement

All entities in the Identity module (User, Organization, OrganizationMember) need to support deletion operations. We need to decide how to handle deletions to maintain audit trails, support potential recovery, and manage data relationships.

## Decision Drivers

- Maintain audit trail for compliance and debugging
- Support potential user/account recovery scenarios
- Handle cascading relationships (Organization → Teams, Members)
- Avoid data loss while cleaning up active data
- Support efficient queries by filtering deleted records

## Considered Options

- Soft deletion with `deletedAt` timestamp
- Hard deletion with audit log
- Archive to separate table before deletion
- Logical deletion with boolean flag

## Decision Outcome

Chosen option: "Soft deletion with `deletedAt` timestamp", because it provides audit trail through timestamps, supports recovery by clearing the timestamp, enables efficient filtering with indexed queries, and handles cascading relationships gracefully.

### Consequences

- Good, because preserves complete audit trail with deletion timestamps
- Good, because supports recovery by clearing deletedAt
- Good, because efficient queries with indexed deletedAt column
- Good, because cascading soft-deletion preserves referential integrity
- Bad, because increases storage requirements over time
- Bad, because requires additional WHERE clauses in all queries
- Bad, because hard delete requires explicit cleanup operations

### Confirmation

Compliance will be confirmed through:
- Unit tests verifying soft deletion and recovery operations
- Integration tests ensuring cascading soft-deletion works correctly
- Performance tests confirming query efficiency with deletedAt index

## Pros and Cons of the Options

### Soft Deletion with `deletedAt` Timestamp

Mark records as deleted by setting a timestamp, then filter in queries.

- Good, because preserves complete record for audit
- Good, because recovery is simple (clear the timestamp)
- Good, because efficient with proper indexing
- Good, because cascading relationships maintained
- Neutral, because requires consistent query patterns
- Bad, because storage grows over time
- Bad, because all queries need deletedAt filtering

### Hard Deletion with Audit Log

Permanently delete records but log the operation before deletion.

- Good, because minimal storage overhead
- Good, because clean data model
- Neutral, because audit log is separate from data
- Bad, because recovery requires restoring from logs
- Bad, because referential integrity issues with cascading
- Bad, because audit log can become inconsistent with data

### Archive to Separate Table Before Deletion

Move records to archive tables before deleting from active tables.

- Good, because keeps active tables clean
- Good, because archive can be optimized differently
- Neutral, because requires table synchronization
- Bad, because complex migration logic
- Bad, because queries across active/archive require UNION
- Bad, because adds significant infrastructure complexity

### Logical Deletion with Boolean Flag

Use a boolean `isDeleted` flag instead of timestamp.

- Good, because simple implementation
- Good, because easy to understand
- Neutral, because similar benefits to timestamp approach
- Bad, because loses deletion timing information
- Bad, because no audit trail for when deletion occurred
- Bad, because harder to implement recovery with time-based logic

## More Information

This decision follows the Tech Research Digest recommendation for soft deletion with audit trail. The `deletedAt` timestamp provides more information than a boolean flag, enabling time-based queries and recovery windows.

Implementation details:
- All entities include `deletedAt` timestamp column
- Queries filter by `deletedAt IS NULL` by default
- Cascading soft-deletion for Organization → Teams, Members
- Recovery operations clear the `deletedAt` timestamp
- Optional hard delete after configurable retention period

References:
- Tech Research Digest recommendation for soft deletion
- Existing codebase patterns for soft deletion
- Compliance requirements for audit trail
- Domain-Driven Design aggregate root patterns
