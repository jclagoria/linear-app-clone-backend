# ADR-0007: Session Listing from PostgreSQL Directly

- Status: Accepted
- Date: 2026-07-13

## Context

Session listing needs to return all active sessions for a user with device info. The sessions table exists in PostgreSQL, and Redis is used as a cache for token lookups and TTL.

## Decision

Query PostgreSQL directly for session listing rather than maintaining a secondary Redis index. The sessions table already has the required indexes (`user_id`, `last_activity_at`), and session listing is not a high-frequency operation.

## Consequences

- **Positive**: Single source of truth — no cache consistency issues.
- **Positive**: Full SQL query capabilities (sorting, filtering by expiry).
- **Positive**: No additional Redis data structures to maintain.
- **Negative**: Slightly higher latency than Redis-only lookups (~1-2ms vs ~0.5ms).
- **Neutral**: Redis continues to serve token lookup and TTL enforcement for refresh token validation.

## Alternatives Considered

1. **Maintain a Redis sorted set per user**: Faster lookups, but adds write complexity and cache consistency risk.
2. **Hybrid approach (Redis list + PostgreSQL backup)**: Over-engineered for session listing frequency.
