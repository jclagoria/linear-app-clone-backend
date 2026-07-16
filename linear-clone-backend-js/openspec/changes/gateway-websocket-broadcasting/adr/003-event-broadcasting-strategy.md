---
status: "accepted"
date: 2026-07-16
decision-makers: "Juan Carlos Lagoria"
---

# Use In-Process EventEmitter for Event Broadcasting

## Context and Problem Statement

The Gateway Module needs to route events from producers (domain modules like work, project) to connected WebSocket clients via channel subscriptions. The mechanism for this routing can be in-process (EventEmitter, direct calls) or out-of-process (Redis pub/sub, message queue).

## Decision Drivers

- Must be simple for initial implementation
- Must allow any module to broadcast events without coupling to WebSocket internals
- Multiple gateway instances are not needed initially
- Should allow future migration to Redis pub/sub without rewriting

## Considered Options

- In-process EventEmitter (Node.js built-in)
- Redis pub/sub
- Direct dependency injection (modules call gateway service directly)

## Decision Outcome

Chosen option: "In-process EventEmitter", because it provides a clean decoupled interface for domain modules to broadcast events without knowing about WebSocket internals, and is trivially replaceable with Redis pub/sub later.

### Consequences

- Good, because domain modules emit events without depending on gateway module
- Good, because zero infrastructure overhead
- Good, because EventEmitter can be wrapped behind a port interface, making Redis swap trivial
- Bad, because not horizontally scalable (single process only)
- Bad, because events are lost if gateway restarts (acceptable — clients reconnect and re-sync)

### Confirmation

A port interface (`EventBus`) SHALL define the broadcast contract. The initial adapter SHALL use `EventEmitter`. When multi-instance is needed, a Redis pub/sub adapter SHALL implement the same interface.

## Pros and Cons of the Options

### In-process EventEmitter

- Good, because Node.js built-in, no dependency
- Good, because easy to test (mock EventEmitter)
- Good, because port/adapter pattern makes replacement trivial
- Bad, because single-process only

### Redis pub/sub

- Good, because enables multi-instance broadcasting
- Good, because survives individual instance restarts
- Bad, because adds Redis infrastructure dependency for core feature
- Bad, because more complex setup and testing

### Direct dependency injection

- Good, because explicit type-safe contract
- Bad, because creates circular dependency risk (modules depend on gateway, gateway depends on modules)
- Bad, because tightly couples domain modules to gateway module
