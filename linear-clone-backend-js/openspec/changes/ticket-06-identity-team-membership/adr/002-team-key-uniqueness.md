---
status: "accepted"
date: 2026-07-14
decision-makers: Juan Carlos Lagoria
---

# Team Key Uniqueness and Validation Strategy

## Context and Problem Statement

Teams require a short alphabetic key (e.g., "ENG", "DES") used as an issue prefix (e.g., ENG-123). This key must be unique within an organization to prevent identifier collisions. How should key uniqueness be enforced and how should validation be handled?

## Decision Drivers

- Keys must be unique within an organization (not globally)
- Keys are user-provided and require format validation
- Soft-deleted teams should not block reuse of their key
- Case-insensitive matching is desirable for UX

## Considered Options

- Composite unique constraint on `(organization_id, key)` with application-level validation
- Partial unique index excluding soft-deleted rows
- Global unique key with organization prefix

## Decision Outcome

Chosen option: "Partial unique index excluding soft-deleted rows", because it enforces uniqueness at the database level while allowing key reuse after team deletion. Application-level validation adds a pre-check for user-friendly error messages.

### Consequences

- Good, because composite unique index `(organization_id, key) WHERE deleted_at IS NULL` enforces domain rule at the database level
- Good, because soft-deleted teams' keys can be reused, matching business expectation
- Good, because application-level pre-check provides immediate user feedback
- Bad, because two-step check (app + DB) means a race condition could theoretically pass app check but fail at DB — handled by catching the constraint violation

### Confirmation

The Drizzle schema includes the composite unique partial index. The CreateTeam use case checks key uniqueness before insertion and catches constraint violation errors as a safety net.

## Pros and Cons of the Options

### Partial unique index excluding soft-deleted rows

- Good, because database-level enforcement with no application logic gaps
- Good, because allows key reuse after soft-delete
- Good, because partial index is efficient — only indexes active rows
- Bad, because requires understanding of PostgreSQL partial index syntax
- Bad, because Drizzle ORM does not natively support partial unique indexes via `pgTable` — requires raw SQL via `db.execute()`

### Composite unique constraint on `(organization_id, key)` with application-level validation

- Good, because standard Drizzle ORM support via unique constraint
- Bad, because soft-deleted rows would prevent key reuse — requires excluding them in application queries
- Bad, because without partial index, the constraint would fail on duplicate even for deleted teams

### Global unique key with organization prefix

- Good, because simple global uniqueness
- Bad, because forces all keys globally unique, limiting key names across orgs
- Bad, because changes the key semantics (e.g., org prefix would make keys less readable)

## More Information

PostgreSQL partial unique index syntax:
```sql
CREATE UNIQUE INDEX idx_team_key_unique_per_org
ON teams (organization_id, key)
WHERE deleted_at IS NULL;
```
