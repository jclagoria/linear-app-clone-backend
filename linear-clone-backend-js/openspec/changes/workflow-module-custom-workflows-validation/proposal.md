# Workflow Module — Custom Workflows & Validation

## Problem Statement

The current system relies on a hardcoded default workflow (Todo → In Progress → In Review → Done) embedded in the Work Module. Teams have no way to define custom workflows that match their processes — different teams may require different states, transitions, or approval gates. Status changes are not validated against any rules, and there is no audit trail of state transitions.

## Motivation

Teams need the flexibility to model their own workflows. Without custom workflows, every team is forced into the same linear process regardless of their actual needs. Adding transition validation prevents illegal status changes (e.g., jumping from Todo directly to Done without passing through intermediate states). State history tracking provides an append-only audit log for compliance and debugging. This change delivers the foundational workflow infrastructure that the Work Module depends on for status management.

## Scope

- **In scope**:
  - Custom workflow state CRUD (team-scoped states with types: unstarted, in_progress, completed, canceled)
  - Custom workflow transition definition (valid from-state → to-state pairs)
  - Transition validation service (synchronously validates status changes against workflow rules)
  - State history tracking (append-only log of every status change with timestamp and user)
  - Workflow resolution logic (check if team has custom workflow; fall back to default if not)
  - Storage tables: `workflow_states`, `workflow_transitions`, `state_history`
  - Integration point with Work Module for querying valid transitions

- **Out of scope**:
  - Tracking changes to title, description, assignee, priority, or labels (v1 only tracks status changes)
  - Parallel/conditional transitions or advanced workflow features (e.g., approvals, auto-transitions)
  - Workflow visualization or UI
  - Role-based permissions on workflow editing (team admin only — no granular RBAC)

## Impact

The Workflow Module is a new standalone module in the backend. The Work Module must query it to determine valid transitions and validate status changes. All modules that update issue status will now go through transition validation. The storage layer adds three new tables. No existing API contracts change — the Work Module's status update endpoints remain the same, but internally they call the transition validation service. Future modules that manage issues will also consume the workflow resolution logic.
