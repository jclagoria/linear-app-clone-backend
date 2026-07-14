# ADR Manifest — Ticket 06: Identity Module — Team & Membership

- Status: completed
- Review date: 2026-07-14

## Review Summary

ADR review completed for this change. Three architectural decisions were identified and recorded.

## In-Force ADRs Reviewed

- None — this repository has no prior in-force ADRs.

## New Durable ADRs Created

| File | Title | Status |
|------|-------|--------|
| `adr/001-team-in-identity-module.md` | Team Entity Placement in Identity Module | Accepted |
| `adr/002-team-key-uniqueness.md` | Team Key Uniqueness and Validation Strategy | Accepted |
| `adr/003-soft-delete-cascade-strategy.md` | Soft-Delete Cascade Strategy for Team Deletion | Accepted |

## Decisions Not Recorded

- Technology stack decisions — already defined in `docs/stack-backend.md` and `docs/architecture-backend.md`, no changes needed for this ticket
- API route design — follows existing RESTful patterns established in Identity Module controller
- Authorization model — reuses existing JWT + role-check pattern from organization use cases
