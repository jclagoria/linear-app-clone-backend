---
status: "accepted"
date: 2026-07-14
decision-makers: Juan Carlos Lagoria
---

# Soft-Delete Cascade Strategy for Team Deletion

## Context and Problem Statement

When a team is deleted, several related entities must be handled: team memberships must be removed, and issues referencing the team must be disassociated. The system uses soft-deletion (setting `deletedAt`). How should cascading effects be applied consistently?

## Decision Drivers

- Memberships must be soft-deleted (not hard-deleted) for audit trail
- Issues must not be deleted — only their team reference must be nullified
- Cascade logic must be explicit and testable
- Pattern must be consistent with existing Organization deletion cascade

## Considered Options

- Application-level cascade (use case orchestrates all updates)
- Database-level cascade (triggers or foreign key CASCADE rules)
- Event-driven cascade (publish event, consumer handles effects)

## Decision Outcome

Chosen option: "Application-level cascade", because it is consistent with the existing Organization deletion pattern, makes the deletion flow explicit and testable, and avoids hidden database logic.

### Consequences

- Good, because cascade logic is visible in the use case — easy to understand, test, and modify
- Good, because consistent with existing `DeleteOrganization` use case pattern
- Good, because soft-delete semantics (setting `deletedAt` vs hard-delete) are easier to manage in application code
- Bad, because future issue nullification requires the use case to also call an IssueRepository or publish an event
- Bad, because not atomic — if one step fails, some records may be soft-deleted while others remain. Mitigated by wrapping in a database transaction

### Confirmation

The `DeleteTeam` use case calls `teamMemberRepository.deleteByTeamId()` and `teamRepository.delete()` within a transaction. Issue nullification is handled via an event (`TeamDeleted`) consumed by the Work Module.

## Pros and Cons of the Options

### Application-level cascade

- Good, because explicit and testable
- Good, because consistent with existing `DeleteOrganization` pattern
- Good, because can easily incorporate business logic (e.g., skip cascade for certain conditions)
- Bad, because multiple operations are not automatically transactional — must explicitly wrap in a transaction

### Database-level cascade

- Good, because atomic and automatic
- Bad, because hard-delete cascades (ON DELETE CASCADE) conflict with soft-delete pattern
- Bad, because hidden logic — developers may not realize deletion triggers side effects
- Bad, because PostgreSQL does not support soft-delete triggers natively without trigger functions

### Event-driven cascade

- Good, because decouples team deletion from downstream effects
- Good, because Work Module can handle issue nullification asynchronously
- Bad, because memberships would not be immediately removed — eventual consistency could cause race conditions
- Bad, because adds complexity for a simple cascade path (member removal is synchronous and expected)

## More Information

This decision mirrors the existing `DeleteOrganization` use case at `src/modules/identity/application/delete-organization.ts`, which also uses application-level cascade (soft-deletes members first, then the organization). The same pattern ensures consistency across the Identity Module.
