---
status: accepted
date: 2026-07-15
decision-makers: Juan Carlos Lagoria
---

# ADR-0002: Compute Project Progress on Read Instead of Storing

## Context and Problem Statement

Project progress is calculated as `(completedIssues / totalIssues) * 100`. This requires counting issues associated with each project. We need to decide whether to compute this on every read or maintain a denormalized counter.

## Decision Drivers

- Progress must always be accurate (stale data is confusing)
- Progress is not queried at high frequency (read: progress endpoint)
- Keeping a counter in sync adds complexity (event handlers on issue create/update/delete/status change)

## Considered Options

- A. Compute progress on read via COUNT queries
- B. Store denormalized `issue_count` and `completed_issue_count` on `projects` table
- C. Use a materialized view refreshed periodically

## Decision Outcome

Chosen option: "A. Compute progress on read via COUNT queries", because progress reads are infrequent and accuracy is critical. The performance cost of a COUNT query on the issues table (which has appropriate indexes) is negligible.

### Consequences

- Good, because progress is always accurate — no sync issues
- Good, because no additional complexity in event handlers or write paths
- Bad, because progress read may be slightly slower than a cached value
- Bad, because if progress is read very frequently in the future, this may need optimization

### Confirmation

The `GetProjectProgress` use case runs `SELECT COUNT(*) FROM issues WHERE project_id = $1` and `SELECT COUNT(*) FROM issues WHERE project_id = $1 AND status_id IN (completed_status_ids)`. Unit tests verify correct calculation.

## Pros and Cons of the Options

### A. Compute on read (COUNT)

- Good, always accurate
- Good, simple implementation
- Bad, O(n) on every read (but n = issues per project, typically small)

### B. Denormalized counter

- Good, O(1) read
- Bad, needs event handlers for every issue status change, create, delete
- Bad, risk of drift between counter and actual data

### C. Materialized view

- Good, can be refreshed on schedule
- Bad, stale data between refreshes
- Bad, adds database complexity

## More Information

If performance becomes an issue in the future, option B can be adopted incrementally — the computed approach is a solid default.
