# ADR Manifest — Work Module: Comments, Labels, and Issue Watchers

- Status: completed
- Review date: 2026-07-14

## Review Summary

ADR review completed for this change. Three architecture decisions were identified and documented.

## In-Force ADRs Reviewed

- None — `<repo>/adr/` has no in-force ADRs.

## New Durable ADRs Created

| File | Title | Status |
|------|-------|--------|
| `adr/0001-extend-work-module.md` | Extend existing work module with subdomains for comments, labels, and watchers | Accepted |
| `adr/0002-soft-delete-pattern.md` | Soft-delete for comments and labels | Accepted |
| `adr/0003-flat-comment-threading.md` | Flat comment threading (no nested replies) | Accepted |

## Decisions Not Recorded

- Reuse of existing auth/infrastructure (JWT, team membership, event publisher) — this is an implementation detail, not an architectural decision. The pattern is already established by existing issue endpoints.
- Label color as hex string — standard convention, no architectural significance.
