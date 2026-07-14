---
status: "accepted"
date: 2026-07-14
decision-makers: Juan Carlos Lagoria
consulted: N/A
informed: N/A
---

# Default Workflow Embedding — Hardcoded Status Transitions

## Context and Problem Statement

Issues follow workflow status transitions (Todo → In Progress → In Review → Done). The default workflow must be enforced on status changes. Custom workflows will be added later (Ticket 09). Should the default workflow be embedded in code or configurable from the start?

## Decision Drivers

- Must enforce valid transitions and reject invalid ones
- Must support the `completedAt` timestamp behavior on terminal states
- Must allow future extension to custom workflows without breaking existing data
- Should minimize complexity for the initial implementation

## Considered Options

- Hardcoded workflow statuses with embedded transition rules
- Database-driven workflow configuration
- External workflow engine (e.g., Temporal, Camunda)

## Decision Outcome

Chosen option: "Hardcoded workflow statuses with embedded transition rules", because it is the simplest approach that satisfies current requirements and can be easily migrated to a configurable system in Ticket 09.

### Consequences

- Good, because implementation is straightforward with a simple transition map
- Good, because transition validation is fast (no database lookups)
- Bad, because adding or changing workflows requires code changes (deferred to Ticket 09)
- Bad, because multi-tenant workflow customization is not supported yet

### Confirmation

Status transitions SHALL be validated against a hardcoded transition map before allowing the change. Invalid transitions SHALL return a 422 error.

## Pros and Cons of the Options

### Hardcoded workflow statuses

- Good, because zero infrastructure needed
- Good, because transition rules are type-safe and can be unit tested
- Bad, because every workflow change requires a deployment

### Database-driven workflow configuration

- Good, because workflows can be configured at runtime
- Bad, because adds significant complexity for no current requirement
- Bad, because must handle validation of user-provided workflow definitions

### External workflow engine

- Good, because supports complex workflow patterns (retries, parallel steps, timeouts)
- Bad, because dramatically over-engineered for issue status transitions

## More Information

The default workflow is defined as:

```
Todo (unstarted) → In Progress (started) → In Review (started) → Done (completed)
Any state → Canceled (canceled)
```

The transition map is a static TypeScript object that maps `(currentStatusType, targetStatusType)` to validity. Ticket 09 will introduce a `workflows` table and replace the hardcoded map.
