---
status: "accepted"
date: 2026-07-14
decision-makers: Juan Carlos Lagoria
---

# Team Entity Placement in Identity Module

## Context and Problem Statement

The system needs teams as an organizational unit for grouping users and scoping work. Teams belong to organizations (managed in the Identity Module) and are referenced by issues (managed in the Work Module, future). Where should the Team entity and its management logic live?

## Decision Drivers

- Teams are organization-scoped and share the same lifecycle as organizations
- Work Module (future) will reference teams via teamId for issue scoping
- Minimize cross-module circular dependencies
- Follow existing module responsibility boundaries

## Considered Options

- Identity Module (existing)
- Work Module (future)
- New standalone Team Module

## Decision Outcome

Chosen option: "Identity Module (existing)", because teams belong to organizations (Identity), share the same membership model (OrganizationMember pattern), and creating a separate module would introduce circular dependencies between Identity and Team modules.

### Consequences

- Good, because teams exist alongside organizations and reuse the same membership, authorization, and event patterns
- Good, because no circular dependency risk — Work Module depends on Identity for both teams and users
- Bad, because Identity Module scope grows beyond user profiles and organizations
- Bad, because Work Module needs a dependency on Identity for team lookups

### Confirmation

Team domain entities, repositories, and use cases are implemented under `src/modules/identity/domain/`, `src/modules/identity/application/`, and `src/modules/identity/adapters/` respectively.

## Pros and Cons of the Options

### Identity Module (existing)

- Good, because Organization → Team is a natural hierarchy within the same module
- Good, because reuses existing authorization patterns (OrganizationMember checks)
- Good, because avoids circular dependencies between modules
- Neutral, because Identity Module now manages three sub-domains: user profiles, organizations, teams
- Bad, because the module becomes larger and may need splitting in the future

### Work Module (future)

- Good, because teams are primarily used by the Work Module for issue scoping
- Bad, because teams belong to organizations (Identity concern), creating a cross-module relationship
- Bad, because would require Work Module to depend on Identity for org membership checks
- Bad, because introduces circular dependency risk if Identity later needs to reference team data from Work

### New Standalone Team Module

- Good, because clean separation of concerns
- Bad, because adds module overhead for a small domain (2 tables, 7 use cases)
- Bad, because would still need to depend on Identity for org membership
- Bad, because premature modularization — can extract later if needed

## More Information

This decision aligns with the existing architecture where Organization management already lives in the Identity Module (see `src/modules/identity/domain/organization.ts`). The same hexagonal pattern, Drizzle table definitions, and repository interfaces will be used.
