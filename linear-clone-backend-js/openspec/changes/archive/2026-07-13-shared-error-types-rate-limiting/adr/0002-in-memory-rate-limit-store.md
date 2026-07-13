---
status: "accepted"
date: 2026-07-13
decision-makers: [Engineering Team]
consulted: []
informed: []
---

# Use In-Memory Rate Limit Store for MVP

## Context and Problem Statement

Rate limiting is required on authentication endpoints to prevent abuse. For the initial implementation, we need a simple rate limit storage mechanism that doesn't require external dependencies. This is an MVP decision — we may need to upgrade to a distributed store for production scaling.

## Decision Drivers

- Need for rate limiting on login, register, and refresh endpoints
- MVP simplicity — avoid external dependencies
- Easy upgrade path for future scaling
- Per-IP rate limiting requirement

## Considered Options

- In-memory store (Map-based)
- Redis store from day one
- Database-backed store

## Decision Outcome

Chosen option: "In-memory store (Map-based)", because it provides simple implementation with no external dependencies for the MVP, while allowing an easy upgrade path to Redis when scaling is needed.

### Consequences

- Good, because no external dependency for initial implementation
- Good, because simple implementation with minimal configuration
- Good, because easy to test locally
- Bad, because rate limit state is lost on server restart
- Bad, because cannot scale to multiple instances without shared state
- Bad, because memory usage grows with number of unique clients

### Confirmation

Verify by checking that:
1. Rate limit plugin correctly uses in-memory store
2. Request counts are tracked per IP per endpoint
3. Rate limit headers are included in responses
4. 429 response is returned when limit exceeded

## Pros and Cons of the Options

### In-memory store (Map-based)

Simple, no external dependency for MVP.

- Good, because no Redis/database dependency
- Good, because fast read/write operations
- Good, because easy to implement and test
- Neutral, because suitable for single-instance deployment
- Bad, because state lost on restart
- Bad, because not distributed

### Redis store from day one

Use Redis for distributed rate limit storage.

- Good, because distributed across instances
- Good, because state persists across restarts
- Bad, because adds external dependency
- Bad, because more complex setup and configuration
- Bad, because overkill for MVP single-instance deployment

### Database-backed store

Store rate limit state in PostgreSQL.

- Good, because persistent storage
- Good, because no additional infrastructure
- Bad, because high latency for rate limit checks
- Bad, because database becomes bottleneck
- Bad, because complex cleanup of expired entries

## More Information

This decision supports the rate limiting requirements defined in `specs/business/error-handling.md`. The in-memory store is a temporary solution — when scaling to multiple instances, we will upgrade to Redis store (which is already in the tech stack).
