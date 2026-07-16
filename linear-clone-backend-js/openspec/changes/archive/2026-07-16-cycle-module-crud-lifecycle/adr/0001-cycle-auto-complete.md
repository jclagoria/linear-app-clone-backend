# ADR-0001: Cycle Auto-Complete on Activation

- **Status**: Accepted
- **Date**: 2026-07-15

## Context

Per the cycle lifecycle spec, only one cycle can be active at a time per team. When a user activates a new cycle while another is already active, the currently active cycle must be auto-completed.

## Decision

Auto-complete the currently active cycle (if any) within the same team as part of the `ActivateCycle` use case, atomically in a single transaction. The `CycleActivated` event is emitted for the new cycle, and a separate `CycleCompleted` event is emitted for the auto-completed cycle.

## Consequences

- Positive: No orphaned active cycles. The invariant (one active per team) is enforced at the application layer.
- Positive: Events allow consumers (e.g., WebSocket broadcasts, analytics) to react to both the activation and the auto-completion.
- Negative: Activation is no longer a single-cycle operation — it must query for and potentially update another cycle.
- Trade-off: Could alternatively reject activation if an active cycle exists and require manual completion, but auto-complete is more user-friendly and matches Linear's behavior.

## Alternatives Considered

1. Reject activation with "Complete the current active cycle first" — rejected as poor UX.
2. Track active cycle as a team-level column (`teams.active_cycle_id`) — rejected to avoid schema coupling and stale references.
