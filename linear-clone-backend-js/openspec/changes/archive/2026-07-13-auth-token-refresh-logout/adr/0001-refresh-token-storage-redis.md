# ADR-0001: Refresh Token Storage in Redis

- **Status**: Accepted
- **Date**: 2026-07-12
- **Deciders**: Backend team

## Context

We need to store refresh tokens server-side to support rotation (single-use) and revocation. Access tokens are stateless JWTs validated without server lookup. Refresh tokens require server-side state to:

1. Detect reuse of already-rotated tokens
2. Invalidate sessions on logout
3. Enforce 7-day expiry with TTL

Options considered:
- PostgreSQL session table
- Redis key-value store
- JWT with server-side revocation list

## Decision

We will store refresh tokens in Redis using hash keys with the pattern `session:{jti}`.

Each session stores:
- `userId` — owner reference
- `refreshTokenHash` — bcrypt hash of the refresh token
- `createdAt` — creation timestamp
- `expiresAt` — expiry timestamp
- `revokedAt` — set when rotated or revoked

Redis TTL is set to 7 days to match refresh token expiry.

## Consequences

### Positive
- Sub-millisecond lookup for token validation
- TTL-based automatic expiry — no cron jobs needed
- Simple key-value model matches the access pattern (lookup by jti)
- No SQL migrations required for session storage

### Negative
- Additional infrastructure dependency (Redis must be available for auth)
- No relational queries on session data (acceptable — sessions are short-lived)
- Redis is not persistent by default (acceptable — sessions are disposable)

## Alternatives Considered

### PostgreSQL session table
- **Rejected**: Adds SQL overhead for a simple key-value lookup. Requires explicit TTL management or cron cleanup. Overkill for session data.

### JWT with revocation list
- **Rejected**: Would require storing revoked token JTIs in Redis anyway. Indirect approach — storing sessions directly is simpler and more explicit.

## References

- `design-backend.md` — Architecture Decisions section
- `specs/business/auth.md` — Data Model section
