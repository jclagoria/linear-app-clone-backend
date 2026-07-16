---
status: "accepted"
date: 2026-07-16
decision-makers: "Juan Carlos Lagoria"
---

# Store Connection and Subscription State In-Memory

## Context and Problem Statement

The Gateway Module needs to track active WebSocket connections and their channel subscriptions. This state can be stored in-memory (Node.js Maps) or in an external store (Redis/database). We need to choose the storage strategy.

## Decision Drivers

- Low latency for message routing (every broadcast iterates subscriptions)
- Simplicity for initial single-instance deployment
- Must handle connection lifecycle (connect, disconnect, cleanup)
- Future horizontal scaling is anticipated but not immediate

## Considered Options

- In-memory Maps (Node.js)
- Redis (existing infrastructure)
- PostgreSQL (existing database)

## Decision Outcome

Chosen option: "In-memory Maps", because they provide the lowest latency for broadcasting, simplest implementation, and are sufficient for single-instance deployment. Redis will be used only for online status (needs persistence across restarts).

### Consequences

- Good, because O(1) lookups for broadcasting and subscription management
- Good, because no additional infrastructure dependency for core feature
- Good, because simple implementation with clear ownership
- Bad, because state is lost on server restart (connections reconnect naturally)
- Bad, because not horizontally scalable without adding Redis pub/sub layer later

### Confirmation

Connection and subscription state MUST be held in `Map<string, Connection>` and `Map<string, Set<string>>` respectively. These MUST NOT be persisted to database.

## Pros and Cons of the Options

### In-memory Maps

- Good, because fastest possible access (no network hop)
- Good, because zero infrastructure dependency
- Good, because GC handles cleanup on connection close
- Bad, because lost on restart (acceptable — clients reconnect)
- Bad, because cannot scale to multiple instances without Redis

### Redis

- Good, because state survives restarts
- Good, because enables multi-instance horizontal scaling
- Bad, because adds latency to every broadcast operation
- Bad, because increases operational complexity
- Bad, because over-engineering for initial single-instance phase

### PostgreSQL

- Good, because persistent and transactional
- Bad, because too slow for real-time connection/subscription state
- Bad, because connection lifecycle would create excessive churn
