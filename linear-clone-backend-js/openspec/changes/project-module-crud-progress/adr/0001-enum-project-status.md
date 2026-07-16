---
status: accepted
date: 2026-07-15
decision-makers: Juan Carlos Lagoria
---

# ADR-0001: Use Enum for Project Status Instead of Workflow Join Table

## Context and Problem Statement

The application already has a sophisticated workflow system for issues: `workflow_states` and `workflow_transitions` tables that allow configurable state machines per team. For projects, we need a status lifecycle (Planned → In Progress → Completed/Canceled). Should we reuse the existing workflow system or use a simpler approach?

## Decision Drivers

- Project lifecycle is fixed and simple (4 statuses, linear progression)
- Reusing the workflow system would introduce unnecessary complexity (join tables, configurable transitions for a fixed flow)
- Consistency with the rest of the codebase vs. keeping things simple

## Considered Options

- A. Enum column on `projects` table with hard-coded transition rules
- B. Reuse `workflow_states` + `workflow_transitions` tables (same as issues)
- C. Separate `project_statuses` table with FK from `projects`

## Decision Outcome

Chosen option: "A. Enum column on `projects` table", because the project lifecycle is fixed, simple, and unlikely to need customization per team — unlike the issue workflow which intentionally supports team-specific configuration.

### Consequences

- Good, because schema is simple: one enum type + one column vs. multiple join tables
- Good, because transition validation is explicit in application code (easy to read and test)
- Bad, because changing the lifecycle in the future would require a database migration and code change
- Bad, because projects cannot have team-specific custom statuses (unlike issues)

### Confirmation

The `projects` table uses `pgEnum('project_status', [...])` and transition logic is tested via unit tests in `change-project-status.test.ts`.

## Pros and Cons of the Options

### A. Enum column

- Good, because single column, no joins needed
- Good, because transitions are explicit in code
- Bad, because lifecycle is hard-coded

### B. Reuse workflow_states table

- Good, because consistent with issue workflow implementation
- Neutral, because would require duplicating states per team or creating shared states
- Bad, because project lifecycle is simpler and doesn't benefit from configurability
- Bad, because would add unnecessary JOIN complexity to every project read

### C. Separate project_statuses table

- Good, because allows adding/removing statuses without code changes
- Bad, because over-engineered for a fixed 4-status lifecycle
- Bad, because still requires FK joins without the configurable transition benefit of option B

## More Information

Project lifecycle is intentionally rigid: Planned → In Progress → Completed/Canceled. This matches the spec and common project management conventions.
