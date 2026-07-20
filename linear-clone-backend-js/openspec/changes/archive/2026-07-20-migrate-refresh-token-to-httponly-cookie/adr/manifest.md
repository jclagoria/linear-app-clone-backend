# ADR Manifest — Refresh Token Cookie Migration

- Status: completed
- Review date: 2026-07-18

## Review Summary

ADR review completed for this change. One new ADR created documenting the HttpOnly cookie storage decision.

## In-Force ADRs Reviewed

- None — repository-level ADR directory does not exist yet.

## New Durable ADRs Created

| File | Title | Status |
|------|-------|--------|
| `adr/0001-httponly-cookie-for-refresh-token.md` | HttpOnly Cookie for Refresh Token Storage | Accepted |

## Decisions Not Recorded

- The choice of `@fastify/cookie` over raw `set-cookie` header manipulation does not warrant a full ADR — it is a standard Fastify plugin choice.
- The backward-compatible body fallback is a temporary transition strategy, not a permanent architectural decision.
