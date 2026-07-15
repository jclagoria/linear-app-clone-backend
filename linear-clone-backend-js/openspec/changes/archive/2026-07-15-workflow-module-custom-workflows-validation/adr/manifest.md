# ADR Manifest — Workflow Module: Custom Workflows & Validation

- Status: completed
- Review date: 2026-07-15

## Review Summary

ADR review completed for this change. Three new ADRs were created covering the key architectural decisions in the workflow module design.

## In-Force ADRs Reviewed

- None — `adr/` has no in-force ADRs (this is the first set of ADRs for the project).

## New Durable ADRs Created

| File | Title | Status |
|------|-------|--------|
| `adr/0001-embedded-default-workflow.md` | Embed Default Workflow in Code Rather Than Database | Accepted |
| `adr/0002-append-only-state-history.md` | Append-Only State History for Audit Trail | Accepted |
| `adr/0003-cancel-override-validation.md` | Cancel State Transitions Bypass All Validation | Accepted |

## Decisions Not Recorded

- **Module location**: New `workflow` module under `src/modules/workflow/` follows the existing project convention (no architectural decision needed).
- **Validation via port interface**: The Work Module depends on a `WorkflowValidationService` port; this is standard hexagonal architecture already mandated by the project, not a new decision.
- **PostgreSQL enum for state type**: Using a Drizzle custom enum matches the existing pattern — consistent with the established ORM decision.
