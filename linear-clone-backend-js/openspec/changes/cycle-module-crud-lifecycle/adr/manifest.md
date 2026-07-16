# ADR Manifest — Cycle Module CRUD & Lifecycle

- Status: completed
- Review date: 2026-07-15

## Review Summary

ADR review completed for this change. Two significant architectural decisions were identified and recorded.

## In-Force ADRs Reviewed

- None — repository-level `adr/` has no in-force ADRs.

## New Durable ADRs Created

| File | Title | Status |
|------|-------|--------|
| `adr/0001-cycle-auto-complete.md` | Cycle Auto-Complete on Activation | Accepted |
| `adr/0002-cycle-enum-status.md` | Cycle Status as Database Enum | Accepted |

## Decisions Not Recorded

- Drizzle ORM and hexagonal architecture: already established patterns in the project, documented in `docs/architecture-backend.md`. No new ADR needed.
- Cursor-based pagination: already established pattern in work and project modules. No new ADR needed.
