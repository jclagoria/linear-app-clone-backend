# ADR Manifest — Identity User Profile & Organization

- Status: completed
- Review date: 2026-07-13

## Review Summary

ADR review completed for this change. Three significant architectural decisions were identified and documented.

## In-Force ADRs Reviewed

- None — this is the first ADR creation for the Identity module.

## New Durable ADRs Created

| File | Title | Status |
|------|-------|--------|
| `adr/0001-hexagonal-architecture-identity-module.md` | Hexagonal Architecture for Identity Module | Accepted |
| `adr/0002-shared-entity-ownership-users-table.md` | Shared Entity Ownership Between Auth and Identity Modules | Accepted |
| `adr/0003-soft-deletion-strategy.md` | Soft Deletion Strategy for All Entities | Accepted |

## Decisions Not Recorded

- API contract design decisions (covered in design-backend.md)
- Rate limiting strategy (implementation detail, not architectural)
- Input validation approach (standard pattern, not significant decision)
- Testing strategy (standard practice, not architectural)
