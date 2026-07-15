---
status: accepted
date: 2026-07-15
decision-makers: Backend team
consulted: Architecture review
informed: Work Module team
---

# ADR-0002: Append-Only State History for Audit Trail

## Context and Problem Statement

Every issue status change must be recorded for audit, debugging, and compliance purposes. Past entries must not be altered or deleted — once a status transition is recorded, it must remain as an immutable fact. The system must guarantee this immutability at the database level, not only at the API level.

## Decision Drivers

- Audit compliance requires immutable history
- Debugging requires accurate reconstruction of past state
- Prevent accidental or malicious data loss
- API must not expose update or delete operations on history

## Considered Options

- **Append-only table with no update/delete API** — no UPDATE/DELETE routes exposed; DB policies prevent direct modification
- **Event log pattern** — history entries are treated as domain events, stored in a dedicated event store table
- **Mutable history with soft-delete** — allow updates but track modifications via metadata

## Decision Outcome

Chosen option: "Append-only table with no update/delete API", because it is the simplest approach that guarantees immutability without introducing a separate event store infrastructure.

### Consequences

- Good, because immutability is enforced at both API and DB level
- Good, because the implementation is straightforward — standard INSERT + SELECT with no special infrastructure
- Bad, because storage grows monotonically (acceptable for v1 — history size per issue is bounded by status change frequency)
- Neutral, because no event store = no event replay capability (not needed for v1)

### Confirmation

The `state_history` table exposes only INSERT (via the history recording service) and SELECT (via the history query endpoint). No UPDATE or DELETE operations are implemented in the repository or API layer. Future DB-level row-security policies can be added as an additional safeguard.

## Pros and Cons of the Options

### Append-only table with no update/delete API

- Good, because simple implementation — standard Drizzle schema with no special tooling
- Good, because no additional infrastructure dependencies
- Bad, because no built-in event replay (acceptable trade-off for v1)

### Event log pattern

- Good, because full event sourcing capabilities (replay, projections)
- Bad, because introduces significant infrastructure complexity (event store, serialization, projection framework)
- Bad, because overengineered for v1 where only status changes are tracked

### Mutable history with soft-delete

- Good, because allows correction of erroneous entries
- Bad, because undermines audit compliance
- Bad, because adds complexity (deleted_at flags, tracking who modified what)

## More Information

The first status change for an issue records `fromStateId` as null. All entries include `userId` to identify who performed the change. Entries are returned newest-first via a `created_at DESC` index. No mechanism exists to alter or remove entries once written.
