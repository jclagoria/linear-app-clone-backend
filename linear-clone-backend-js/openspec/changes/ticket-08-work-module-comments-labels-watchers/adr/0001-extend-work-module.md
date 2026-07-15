---
status: accepted
date: 2026-07-14
decision-makers: Engineering team
---

# Extend existing work module with subdomains for comments, labels, and watchers

## Context and Problem Statement

The project needs to add comments (on issues), label CRUD and assignment, and issue watchers. These features could be implemented either as separate modules (`comments/`, `labels/`, `watchers/`) or as extensions of the existing `work/` module. The decision affects code organization, dependency management, and team navigation.

## Decision Drivers

- Maintain hexagonal architecture boundaries
- Minimize cross-module coupling
- Keep related features co-located (issues, comments, labels, watchers all pertain to work items)
- Avoid premature modularization for features that share the same domain context

## Considered Options

- Option 1: Extend existing `work/` module with new subdomains
- Option 2: Create separate modules (`comments/`, `labels/`, `watchers/`) under `src/modules/`

## Decision Outcome

Chosen option: "Extend existing `work/` module with new subdomains", because comments, labels, and watchers are all inherently scoped to work items (issues). Extending the existing module avoids adding three near-empty module directories with redundant ports and adapters, while keeping all issue-related features together.

### Consequences

- Good, because related code stays co-located, reducing navigation overhead.
- Good, because labels and watchers reuse the existing `work` module's domain entities and repositories directly.
- Good, because team membership validation and event publishing infrastructure are already wired in the module's controller.
- Bad, because the `work/` module grows larger; may warrant splitting if it exceeds ~20 use cases.
- Bad, because external modules (e.g., `notifications/`) that need to reference comments have a transitive dependency on `work/`.

### Confirmation

New files for comments, labels, and watchers SHALL be created under `src/modules/work/domain/`, `src/modules/work/application/`, and `src/modules/work/adapters/`. A separate controller registration function SHALL be exported for each subdomain (e.g., `commentRoutes`, `labelRoutes`, `watcherRoutes`).

## Pros and Cons of the Options

### Extend existing `work/` module

- Good, because all work-item-related features are in one place.
- Good, because existing infrastructure (auth, team membership, event publishing) is reused without new wiring.
- Neutral, because the module's internal structure (domain/application/adapters) provides clear separation within the module.
- Bad, because the module grows in size; may require future refactoring.

### Create separate modules

- Good, because each feature has its own isolated module with clear boundaries.
- Bad, because each new module duplicates the same wiring pattern (controller → use case → repository → event publisher).
- Bad, because labels and watchers have no independent domain identity outside of issues.
- Bad, because cross-module access patterns (e.g., label assignment from issues) become more complex.

## More Information

This follows the existing pattern where issues, statuses, and labels are already co-located in `src/modules/work/`. The hexagonal architecture within the module provides sufficient separation: each subdomain has its own domain entities, use cases, ports, and adapters, but shares common infrastructure (database connection, event publisher, auth).
