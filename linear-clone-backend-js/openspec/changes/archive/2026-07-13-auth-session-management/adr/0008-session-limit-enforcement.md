# ADR-0008: Session Limit Enforcement in Use Case Layer

- Status: Accepted
- Date: 2026-07-13

## Context

The system must enforce a maximum of 10 active sessions per user. When a new login would exceed this limit, the oldest session by `last_activity_at` must be evicted automatically.

## Decision

Enforce the session limit in the `LoginUser` use case layer using a check-and-evict pattern: count active sessions before creating a new one, and if the count is >= 10, delete the oldest session before inserting the new one.

## Consequences

- **Positive**: Simple implementation — no distributed locks or Redis atomic operations needed.
- **Positive**: Business logic stays in the domain layer, not infrastructure.
- **Positive**: Eviction event is emitted in the same transaction context as login.
- **Negative**: Not safe for horizontal scaling — two simultaneous logins could exceed the limit without a distributed lock.
- **Neutral**: Acceptable for single-instance deployment; can add Redis-based locking later if scaling horizontally.

## Alternatives Considered

1. **Redis sorted set with ZADD + ZREMRANGEBYRANK**: Atomic eviction, but moves business logic to infrastructure and adds complexity.
2. **Database trigger**: Enforces at DB level, but events cannot be emitted from triggers easily.
3. **Distributed lock via Redis RedLock**: Safe for horizontal scaling, but over-engineered for current single-instance deployment.
