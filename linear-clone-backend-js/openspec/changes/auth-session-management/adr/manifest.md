# ADR Manifest — Auth Session Management

- Status: completed
- Review date: 2026-07-13

## Review Summary

ADR review completed for the Auth Module — Session Management change.

## In-Force ADRs Reviewed

- ADR-0001: Use Hexagonal Architecture (from auth-registration-login)
- ADR-0002: Use JWT Dual Token Strategy (from auth-registration-login)
- ADR-0003: Use PostgreSQL with Drizzle ORM (from auth-registration-login)
- ADR-0004: Use Redis for Session Storage (from auth-registration-login)
- ADR-0005: Use bcrypt for Password Hashing (from auth-registration-login)
- ADR-0001: Use Redis for Refresh Token Storage (from auth-token-refresh-logout)

## New Durable ADRs Created

| File | Title | Status |
|------|-------|--------|
| `adr/0006-current-session-identification.md` | Current Session Identification via Refresh Token Hash | Accepted |
| `adr/0007-session-listing-postgresql.md` | Session Listing from PostgreSQL Directly | Accepted |
| `adr/0008-session-limit-enforcement.md` | Session Limit Enforcement in Use Case Layer | Accepted |

## Decisions Not Recorded

- Event emission via In-process EventPublisher: inherited from existing pattern, no new decision.
- Rate limiting per endpoint: inherited from existing pattern, no new decision.
