---
status: "accepted"
date: 2026-07-16
decision-makers: "Juan Carlos Lagoria"
---

# Track Online Status in Redis with TTL

## Context and Problem Statement

The system needs to track which users are currently online (have at least one active WebSocket connection). This status is used for presence indicators and routing decisions. The online status must be reasonably accurate even if a connection drops ungracefully.

## Decision Drivers

- Must survive gateway restarts (unlike in-memory state)
- Must handle unclean disconnects (crash, network loss) without leaving ghost online entries
- Redis is already in the infrastructure stack
- Low latency for read/write operations

## Considered Options

- Redis with TTL-based expiry
- In-memory only (same as connections)
- PostgreSQL with heartbeat rows

## Decision Outcome

Chosen option: "Redis with TTL-based expiry", because Redis is already available, TTL handles unclean disconnects automatically, and read/write latency is sub-millisecond.

### Consequences

- Good, because TTL automatically cleans up after crashed connections
- Good, because Redis is already in the stack (no new dependency)
- Good, because fast read/write compared to PostgreSQL
- Bad, because TTL refresh requires periodic ping from client
- Bad, because a very short TTL (30s) means brief false-offline windows on disconnect

### Confirmation

Online status SHALL be stored as `SET online:{userId} "1"` with 30-second TTL in Redis. The TTL SHALL be refreshed on each ping or event received from the connection. On clean disconnect, the key SHALL be deleted immediately.

## Pros and Cons of the Options

### Redis with TTL

- Good, because TTL handles all disconnect scenarios automatically
- Good, because Redis is existing infrastructure
- Good, because O(1) read/write
- Bad, because 30s window where status could be stale

### In-memory only

- Good, because simplest implementation
- Bad, because lost on restart
- Bad, because no TTL for crash recovery (ghost online entries)

### PostgreSQL

- Good, because persistent and transactional
- Bad, because slower writes (connection/disconnect churn)
- Bad, because requires cleanup job for crashed connections
