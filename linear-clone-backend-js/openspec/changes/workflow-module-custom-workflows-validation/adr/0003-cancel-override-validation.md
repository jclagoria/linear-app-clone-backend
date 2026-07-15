---
status: accepted
date: 2026-07-15
decision-makers: Backend team
consulted: Product, Architecture review
informed: Work Module team
---

# ADR-0003: Cancel State Transitions Bypass All Validation

## Context and Problem Statement

Users must be able to cancel any issue regardless of its current state, even if no explicit transition to a `canceled` state is defined in the team's workflow. Requiring teams to define explicit "any → Canceled" transitions in their custom workflows would be error-prone and violate the expectation that cancellation is always available.

## Decision Drivers

- Cancellation must always be possible — no workflow configuration should block it
- Teams should not be required to remember to add cancel transitions
- Validation logic must be simple and predictable

## Considered Options

- **Cancel override rule** — if the target state has type `canceled`, validation always passes
- **Implicit transitions** — the system auto-creates hidden transitions from every state to every canceled state
- **Require explicit transitions** — teams must define cancel transitions in their workflow

## Decision Outcome

Chosen option: "Cancel override rule", because it guarantees cancellation is always available without requiring teams to configure it, and keeps the validation logic simple — a single type check before the transition lookup.

### Consequences

- Good, because cancellation is always available regardless of workflow configuration
- Good, because the validation rule is simple: check `toState.type === 'canceled'` before consulting transitions
- Bad, because it is an implicit rule that may surprise users who expect strict workflow enforcement (documented in validation response `reason` field)
- Neutral, because it aligns with common issue-tracker behavior (e.g., Linear, Jira)

### Confirmation

The `validateTransition` use case checks the `type` of the target state. If it equals `canceled`, the validation returns `{ valid: true }` immediately without consulting `workflow_transitions`. This behavior is documented in the validate-transition endpoint response.

## Pros and Cons of the Options

### Cancel override rule

- Good, because simple to implement — single type check
- Good, because guaranteed availability — no configuration needed
- Neutral, because documented as an implicit override in validation response

### Implicit transitions

- Good, because validation can still use the standard transition lookup (no special case)
- Bad, because requires maintaining synthetic transition records
- Bad, because complicates the workflow state model with invisible data

### Require explicit transitions

- Good, because no implicit rules — all transitions are explicitly defined
- Bad, because teams can accidentally block cancellation by forgetting to define transitions
- Bad, because violates user expectation that cancellation is always available

## More Information

The at-most-one-canceled-state rule (each team may have at most one state of type `canceled`) ensures there is never ambiguity about which state is the cancel target. The default workflow also includes "any → Canceled" as an always-allowed transition for consistency.
