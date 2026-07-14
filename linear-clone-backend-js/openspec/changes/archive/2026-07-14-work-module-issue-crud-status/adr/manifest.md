# ADR Manifest — Work Module Issue CRUD & Status

- Status: completed
- Review date: 2026-07-14

## Review Summary

ADR review completed for this change. Four architectural decisions were identified and recorded.

## New Durable ADRs Created

| File | Title | Status |
|------|-------|--------|
| `adr/0001-issue-identifier-sequence.md` | Issue Identifier Generation — Database Sequence per Team | Accepted |
| `adr/0002-default-workflow-embedding.md` | Default Workflow Embedding — Hardcoded Status Transitions | Accepted |
| `adr/0003-soft-delete-pattern.md` | Soft-Delete Pattern — `deletedAt` Timestamp | Accepted |
| `adr/0004-cursor-pagination.md` | Cursor-based Pagination — Composite Cursor | Accepted |

## Decisions Not Recorded

- Module structure (hexagonal): Follows existing project convention; no new decision needed.
- Tech stack (Fastify, Drizzle, Vitest): Already decided in prior ADRs (ADR-005, ADR-010).
