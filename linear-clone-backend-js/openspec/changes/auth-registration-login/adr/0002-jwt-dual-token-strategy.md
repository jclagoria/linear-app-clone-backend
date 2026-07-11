---
status: "accepted"
date: 2026-07-11
decision-makers: Backend Team
consulted: None
informed: None
---

# Use JWT Dual Token Strategy

## Context and Problem Statement

The authentication system needs to balance security (token revocation, session management) with performance (avoiding database lookups on every request).

## Decision Drivers

- Enable session revocation (logout, security incidents)
- Minimize database lookups for authenticated requests
- Support session management (list, revoke, limit)
- Follow industry best practices for JWT authentication

## Considered Options

- JWT Dual Token (access + refresh)
- Session-based authentication (server-side sessions)
- Single JWT with short expiry
- OAuth2 with external provider

## Decision Outcome

Chosen option: "JWT Dual Token (access + refresh)", because it provides stateless access token validation while enabling session management through refresh tokens.

### Consequences

- Good, because access tokens are stateless (no DB lookup per request)
- Good, because refresh tokens enable session revocation
- Good, because session limit enforcement is straightforward
- Bad, because requires Redis storage for refresh tokens
- Bad, because token rotation adds complexity

### Confirmation

- Verify access tokens are validated without database/Redis lookup
- Verify refresh tokens are stored as hashes in Redis
- Verify session revocation invalidates refresh token
- Verify session limit is enforced on login

## Pros and Cons of the Options

### JWT Dual Token (access + refresh)

- Good, because access tokens are stateless and fast
- Good, because refresh tokens enable session management
- Good, because supports "Remember Me" with different expiry
- Neutral, because requires Redis for refresh token storage
- Bad, because more complex than single token approach

### Session-based Authentication

- Good, because simple server-side session management
- Good, because easy to revoke sessions
- Neutral, because requires database lookup per request
- Bad, because doesn't scale well horizontally
- Bad, because stateful server requirement

### Single JWT with Short Expiry

- Good, because simpler implementation
- Good, because no refresh token management
- Neutral, because requires frequent re-authentication
- Bad, because poor user experience (frequent logouts)
- Bad, because no session revocation capability

## More Information

- See `design-backend.md` for token structure details
- See `specs/business/auth.md` for token expiry rules
