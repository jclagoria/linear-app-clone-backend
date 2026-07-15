---
status: accepted
date: 2026-07-15
decision-makers: Backend team
consulted: Architecture review
informed: Work Module team
---

# ADR-0001: Embed Default Workflow in Code Rather Than Database

## Context and Problem Statement

Every team must have a valid set of workflow transitions even before any custom workflow is defined. The default workflow (Todo → In Progress → In Review → Done, plus any → Canceled) must be available from the moment the system starts, with zero setup. Storing it in the database would require a seed migration and a DB query on every transition validation, even for teams that never customize their workflow.

## Decision Drivers

- Transition validation must be fast for the common case (teams using default workflow)
- Zero-touch onboarding — new teams should work without DB setup
- Avoid unnecessary DB round-trips for teams that never customize

## Considered Options

- **Embedded in-memory object** — define default workflow as a TypeScript object in the codebase
- **Seeded database table** — insert default states and transitions during migration, query at runtime
- **Configuration file** — define defaults in a YAML/JSON config file loaded at startup

## Decision Outcome

Chosen option: "Embedded in-memory object", because it avoids DB reads for the common case, keeps the default workflow co-located with the validation logic, and requires zero deployment steps for new teams.

### Consequences

- Good, because default workflow resolution is instant (no I/O) for teams without custom workflows
- Good, because the default is always consistent with the code version — no migration drift
- Bad, because changing the default workflow requires a code deployment (not a DB update)
- Neutral, because the default workflow is expected to change rarely (if ever)

### Confirmation

The default workflow is defined as a module-level constant in `src/modules/workflow/domain/default-workflow.ts`. The transition validation service references this constant when the team has no custom states.

## Pros and Cons of the Options

### Embedded in-memory object

- Good, because zero I/O cost for default workflow checks
- Good, because co-located with validation logic — single source of truth
- Neutral, because requires code change to modify defaults

### Seeded database table

- Good, because defaults can be updated without deployment
- Bad, because every validation query must check DB (even for non-customizing teams)
- Bad, because seed migrations must be kept in sync with code expectations

### Configuration file

- Good, because defaults are externalized from code
- Bad, because introduces another file to manage and validate
- Bad, because file loading adds startup complexity without benefit over in-memory

## More Information

The workflow resolution logic checks for the presence of team-scoped rows in `workflow_states` — an EXISTS query. If no rows exist, the embedded default is used. This avoids the need for any DB call beyond the EXISTS check.
