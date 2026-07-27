# ADR-0001: In-Process Event Bridge (Work → Gateway)

- Status: Accepted
- Date: 2026-07-26
- Deciders: Backend Architect

## Context

The work module's `InMemoryEventPublisher` stores events in memory only. The gateway module's `InProcessEventEmitter` broadcasts events to WebSocket clients. We need to bridge these so work module events (issue created/updated/deleted, comment created, label created, watcher added) reach subscribed WebSocket clients in real-time.

## Decision

Create a `WorkToGatewayBridge` adapter that implements the work module's `EventPublisher` port and internally calls the gateway's `InProcessEventEmitter.broadcast()`. The bridge is injected as the work module's event publisher during application setup.

## Consequences

### Positive

- Zero-latency event delivery (in-process call)
- No new infrastructure required (no Redis pub/sub, Kafka)
- Consistent with existing hexagonal architecture
- Simple implementation — single adapter class

### Negative

- Not horizontally scalable — events only reach gateway instances in the same process
- Events lost on process restart (acceptable for real-time notifications)
- Tight coupling between work and gateway modules at runtime

### Risks

- If we scale to multiple instances, we'll need to switch to Redis pub/sub or similar
- Mitigation: Document the scaling path; design the bridge interface to be swappable

## Alternatives Considered

### Redis Pub/Sub

- **Pros**: Horizontally scalable, persistent
- **Cons**: Added latency (~1ms), infrastructure dependency, serialization cost
- **Verdict**: Overkill for current single-node deployment

### Kafka/RabbitMQ

- **Pros**: Durable, replayable, scalable
- **Cons**: Heavy infrastructure, operational complexity, overkill for real-time UI updates
- **Verdict**: Not justified for this use case

### Direct Database Polling

- **Pros**: Simple, durable
- **Cons**: High latency, database load, not truly real-time
- **Verdict**: Unacceptable for real-time requirements

## References

- `src/modules/work/adapters/out/in-memory-event-publisher.ts`
- `src/modules/gateway/adapters/out/in-process-event-emitter.ts`
- `design-backend.md` (AD-1)
