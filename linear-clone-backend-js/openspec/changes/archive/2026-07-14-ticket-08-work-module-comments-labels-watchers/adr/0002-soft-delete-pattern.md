---
status: accepted
date: 2026-07-14
decision-makers: Engineering team
---

# Soft-delete for comments and labels

## Context and Problem Statement

Comments and labels can be deleted by users. The system must decide whether to hard-delete rows from the database or soft-delete them (mark as deleted without removal). This affects data recovery, referential integrity, and query complexity.

## Decision Drivers

- Support accidental-delete recovery
- Preserve referential integrity for historical data (e.g., audit logs, events referencing deleted entities)
- Follow existing patterns in the codebase (issues use soft-delete)

## Considered Options

- Option 1: Soft-delete with `deleted_at` timestamp column
- Option 2: Hard-delete (permanent row removal)

## Decision Outcome

Chosen option: "Soft-delete with `deleted_at` timestamp column", because it matches the existing issue soft-delete pattern and provides recoverability without additional infrastructure.

### Consequences

- Good, because deleted comments and labels can be restored (undo delete).
- Good, because historical event references remain valid (events reference entity IDs that still exist).
- Good, because the pattern is already established for issues — same query pattern (`WHERE deleted_at IS NULL`).
- Bad, because all queries must filter by `deleted_at IS NULL`, adding query complexity.
- Bad, because tables grow with deleted rows; may require TTL-based cleanup in the future.

### Confirmation

Both `issue_comments` and `labels` tables SHALL include a nullable `deleted_at` timestamp column. All repository query methods SHALL include `WHERE deleted_at IS NULL` by default, with an explicit `includeDeleted` option for admin queries.

## Pros and Cons of the Options

### Soft-delete with `deleted_at`

- Good, because recoverable without backup restoration.
- Good, because consistent with existing issue entity pattern.
- Good, because cascade soft-delete is possible (label delete cascades to junction rows).
- Bad, because all queries need a `deleted_at IS NULL` filter.
- Bad, because storage grows with soft-deleted rows.

### Hard-delete

- Good, because simplest implementation — just DELETE the row.
- Good, because no storage growth from deleted data.
- Bad, because no recovery option if deleted accidentally.
- Bad, because event history may reference IDs that no longer exist.
- Bad, because inconsistent with the existing issue soft-delete pattern.

## More Information

The issue entity in `src/modules/work/domain/issue.ts` uses the same soft-delete pattern with `deleted_at` column and `WHERE deleted_at IS NULL` filtering in the repository. The new entities follow this established convention.
