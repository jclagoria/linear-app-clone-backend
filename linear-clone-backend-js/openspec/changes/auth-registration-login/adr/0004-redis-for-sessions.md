---
status: "accepted"
date: 2026-07-11
decision-makers: Backend Team
consulted: None
informed: None
---

# Use Redis for Session Storage

## Context and Problem Statement

The authentication system needs fast session storage for refresh tokens, with support for TTL-based expiration and session management.

## Decision Drivers

- Fast read/write performance for session operations
- Built-in TTL support for automatic expiration
- Support for session limit enforcement
- Pub/sub capability for future real-time features

## Considered Options

- Redis
- PostgreSQL (sessions table)
- In-memory Map
- Memcached

## Decision Outcome

Chosen option: "Redis", because it provides the best combination of performance, features, and simplicity for session storage.

### Consequences

- Good, because sub-millisecond latency for session operations
- Good, because built-in TTL eliminates manual expiration logic
- Good, because pub/sub enables future real-time features
- Bad, because requires additional infrastructure
- Bad, because data loss risk if not configured with persistence

### Confirmation

- Verify session operations are fast (<1ms)
- Verify TTL-based expiration works correctly
- Verify session limit enforcement is efficient
- Verify persistence is configured for production

## Pros and Cons of the Options

### Redis

- Good, because extremely fast (in-memory)
- Good, because built-in TTL support
- Good, because pub/sub for real-time features
- Good, because data structures match session model
- Neutral, because requires infrastructure
- Bad, because memory usage can grow

### PostgreSQL (sessions table)

- Good, because no additional infrastructure
- Good, because ACID compliance
- Good, because joins with user table possible
- Neutral, because slower than Redis for session operations
- Bad, because requires manual TTL logic
- Bad, because session cleanup queries can be expensive

### In-memory Map

- Good, because no external dependency
- Good, because extremely fast
- Neutral, because lost on server restart
- Bad, because no persistence
- Bad, because no pub/sub capability
- Bad, because not suitable for production

## More Information

- See `design-backend.md` for Redis session storage design
- See `docs/stack-backend.md` for stack details
