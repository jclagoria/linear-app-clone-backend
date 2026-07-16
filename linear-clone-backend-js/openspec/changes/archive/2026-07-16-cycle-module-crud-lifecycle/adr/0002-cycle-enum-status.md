# ADR-0002: Cycle Status as Database Enum

- **Status**: Accepted
- **Date**: 2026-07-15

## Context

Cycles have a simple, fixed lifecycle: Draft → Active → Completed. Unlike issues which use a flexible workflow system, cycle statuses are predefined and immutable.

## Decision

Use a PostgreSQL enum type (`cycle_status`) with values `draft`, `active`, `completed` rather than a join table or string column.

## Consequences

- Positive: Type safety at the database level — invalid statuses cannot be inserted.
- Positive: No join overhead (simpler queries, simpler code).
- Positive: Follows same pattern as `project_status` enum used by the Project module.
- Negative: Adding new statuses in the future requires a migration with `ALTER TYPE ... ADD VALUE`.

## Alternatives Considered

1. Flexible workflow table (same as issues) — rejected because cycle lifecycle is fixed and simple.
2. String column with application-level validation — rejected because enum provides stronger guarantees.
