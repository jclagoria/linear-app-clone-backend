---
status: "accepted"
date: 2026-07-14
decision-makers: Juan Carlos Lagoria
consulted: N/A
informed: N/A
---

# Issue Identifier Generation — Database Sequence per Team

## Context and Problem Statement

Issues in Linear have human-readable identifiers like `ENG-123` that combine a team key with a sequential number. The identifier must be unique per team, monotonically increasing, and maintainable across the system lifecycle. How should the sequence number be generated?

## Decision Drivers

- Identifiers must be unique per team (no duplicates even after soft-delete)
- Sequence must be monotonically increasing
- Must work across horizontal scaling (multiple app instances)
- Must not rely on external services

## Considered Options

- Database sequence per team (PostgreSQL sequence)
- Database counter table with atomic increment
- UUID generated with team prefix
- Snowflake-style ID with team component
- Application-level counter with Redis

## Decision Outcome

Chosen option: "Database sequence per team", because it provides atomic, monotonically increasing numbers per team using PostgreSQL's built-in sequence mechanism, works across multiple app instances without coordination, and requires no external infrastructure.

### Consequences

- Good, because sequences are atomic and provide gapless (or nearly gapless) monotonic numbers
- Good, because sequences are natively supported by PostgreSQL and require no additional infrastructure
- Bad, because sequences are a database-side concern and introduce coupling between identifier generation and the database
- Bad, because if a team's sequence is exhausted (unlikely with 64-bit), migration is needed

### Confirmation

Identifier uniqueness per team SHALL be enforced by a unique index on `(team_id, identifier)`.

## Pros and Cons of the Options

### Database sequence per team

- Good, because PostgreSQL sequences are atomic and thread-safe across connections
- Good, because sequences survive restarts and are crash-safe
- Neutral, because sequences can have gaps (e.g., from rolled-back transactions)
- Bad, because each team needs its own sequence (management overhead)

### Database counter table with atomic increment

- Good, because uses standard PostgreSQL table with `UPDATE ... RETURNING`
- Bad, because row-level locking can become a bottleneck for teams with high issue creation rates

### UUID generated with team prefix

- Good, because requires no state management
- Bad, because UUIDs are not human-readable or sequential

### Snowflake-style ID with team component

- Good, because works without database round-trip
- Bad, because requires clock synchronization and worker ID management; over-engineered for this use case

### Application-level counter with Redis

- Good, because fast (in-memory)
- Bad, because Redis data loss means sequence reset; adds infrastructure dependency

## More Information

Each team gets a dedicated PostgreSQL sequence named `issue_seq_{team_id}`. A new sequence is created when a team is created. The sequence value is read via `nextval()` and combined with the team key to produce the identifier at insert time.
