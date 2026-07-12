# ADR Manifest — Auth Token Refresh & Logout

- Status: completed
- Review date: 2026-07-12

## Review Summary

ADR review completed for this change. One significant architectural decision documented.

## In-Force ADRs Reviewed

- None — `<repo>/adr/` has no in-force ADRs.

## New Durable ADRs Created

| File | Title | Status |
|------|-------|--------|
| `adr/0001-refresh-token-storage-redis.md` | Refresh Token Storage in Redis | Accepted |

## Decisions Not Recorded

- **bcrypt for token hashing**: Standard security practice, no alternatives considered. Not significant enough for ADR.
- **jti-based rotation detection**: Direct implementation of the single-use refresh token pattern. No alternatives considered.
- **Delete-on-logout**: Simplest possible approach. No alternatives considered.
