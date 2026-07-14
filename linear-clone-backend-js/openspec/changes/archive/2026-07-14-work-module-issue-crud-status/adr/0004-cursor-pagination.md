---
status: "accepted"
date: 2026-07-14
decision-makers: Juan Carlos Lagoria
consulted: N/A
informed: N/A
---

# Cursor-based Pagination — Composite Cursor

## Context and Problem Statement

Issue list queries must support pagination to handle large result sets. The pagination mechanism must be consistent across the API and avoid common offset-based issues like phantom reads on live data.

## Decision Drivers

- Must provide stable pagination even when items are inserted or deleted between pages
- Must support a maximum page size of 100 items
- Must perform efficiently on large datasets
- Must be consistent with the API contract in specs-api

## Considered Options

- Cursor-based pagination using composite cursor (sort values)
- Offset-based pagination (skip/take)
- Keyset pagination using a single column
- Page-based pagination (page number + size)

## Decision Outcome

Chosen option: "Cursor-based pagination using composite cursor of (priority, createdAt, id)", because it provides stable pagination that is unaffected by new insertions, performs efficiently with database indexes, and avoids the phantom read problem of offset-based pagination.

### Consequences

- Good, because cursor-based pagination is stable — inserting new items does not shift existing pages
- Good, because composite cursor works efficiently with a database index on (priority DESC, createdAt DESC, id)
- Good, because no offset means consistent performance regardless of page depth
- Bad, because cursor pagination does not support random access (jump to page N)
- Bad, because cursor encoding/decoding adds minor complexity

### Confirmation

The pagination cursor SHALL be a base64-encoded string containing `priority`, `createdAt`, and `id` of the last item on the current page. Clients SHALL pass this cursor unchanged to get the next page.

## Pros and Cons of the Options

### Cursor-based pagination (composite cursor)

- Good, because stable across data mutations
- Good, because O(1) performance regardless of page position
- Neutral, because requires encoding/decoding of cursor values
- Bad, because does not support "jump to page N" UX pattern

### Offset-based pagination (skip/take)

- Good, because simple to implement and understand
- Bad, because pages can shift or duplicate items when data changes between requests
- Bad, because performance degrades with large offsets (database must still scan skipped rows)

### Keyset pagination using a single column

- Good, because simple and efficient
- Bad, because the sort order must be on a single unique column, which conflicts with the required sort priority

### Page-based pagination (page number + size)

- Good, because intuitive for clients
- Bad, because same phantom read issues as offset-based pagination

## More Information

The cursor encodes three fields: `priority` (the sort priority), `createdAt` (the timestamp), and `id` (for tie-breaking). The SQL query uses `WHERE (priority, created_at, id) < (cursor_priority, cursor_created_at, cursor_id)` to fetch the next page. This leverages a composite index for efficient lookups.
