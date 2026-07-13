# Auth — Business Specification

## Behaviour

**Feature:** Token Refresh with Rotation

A user SHALL be able to exchange a valid, unused refresh token for a new access token and refresh token pair. The old refresh token MUST be invalidated upon successful rotation to prevent reuse.

### Requirement: Refresh Token Rotation

#### Scenario: Successful token refresh

- **GIVEN** a valid, non-expired, non-revoked refresh token associated with an active session
- **WHEN** the user calls POST /api/v1/auth/refresh with the refresh token
- **THEN** a new access token (15-minute expiry) and refresh token (7-day expiry) are returned
- **AND** the old refresh token is marked as revoked in the session store
- **AND** the new refresh token is stored in the session store with 7-day TTL

#### Scenario: Refresh with expired token

- **GIVEN** a refresh token that has exceeded its 7-day expiry
- **WHEN** the user calls POST /api/v1/auth/refresh with the expired token
- **THEN** the request fails with 401 and error code "token_expired"

#### Scenario: Refresh with revoked token (reuse attempt)

- **GIVEN** a refresh token that was already used for rotation or explicitly revoked
- **WHEN** the user calls POST /api/v1/auth/refresh with the revoked token
- **THEN** the request fails with 401 and error code "token_revoked"
- **AND** the session associated with the token MUST be invalidated

#### Scenario: Refresh with malformed token

- **GIVEN** a string that is not a valid JWT format
- **WHEN** the user calls POST /api/v1/auth/refresh with the malformed token
- **THEN** the request fails with 400 and error code "invalid_token"

---

**Feature:** Logout

A user SHALL be able to terminate their session, invalidating all associated refresh tokens. The endpoint MUST be idempotent — calling logout multiple times with the same token MUST return success.

### Requirement: Session Termination

#### Scenario: Successful logout

- **GIVEN** an authenticated user with an active session
- **WHEN** the user calls POST /api/v1/auth/logout with a valid access token
- **THEN** the session record is deleted from the session store
- **AND** all refresh tokens associated with the session are invalidated
- **AND** a success response (200) is returned

#### Scenario: Logout with invalid token

- **GIVEN** a missing or expired access token
- **WHEN** the user calls POST /api/v1/auth/logout
- **THEN** the request fails with 401 and error code "unauthorized"

#### Scenario: Idempotent logout (double call)

- **GIVEN** a user who has already logged out (session deleted)
- **WHEN** the user calls POST /api/v1/auth/logout again with the same token
- **THEN** the request succeeds with 200 and `{ "success": true }`
- **AND** no error is returned

---

## Data Model

### Session

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | string (UUID) | PK, unique | Session identifier |
| `userId` | string (UUID) | FK → User.id, not null | Owner of the session |
| `refreshToken` | string | unique, not null | Hashed refresh token |
| `createdAt` | timestamp | not null | Session creation time |
| `expiresAt` | timestamp | not null | TTL-based expiry (7 days) |
| `revokedAt` | timestamp | nullable | Set when token is rotated or revoked |

### Relationships

Session --belongs to--> User: Each session belongs to one user. A user MAY have multiple sessions (multi-device, though not in scope).

## Business Rules

1. **Single-use refresh token**: A refresh token MUST only be accepted once. After rotation, the old token MUST be marked as revoked.
2. **Session invalidation on reuse**: If a revoked refresh token is presented, the entire session MUST be invalidated to detect potential token theft.
3. **Access token validation**: Access tokens are validated statelessly via JWT signature. No server-side lookup is required.
4. **Refresh token validation**: Refresh tokens MUST be validated against the session store (Redis). The token hash is compared, not the raw value.
5. **Logout idempotency**: Logout MUST always return 200 regardless of whether the session exists. Errors MUST NOT be returned for missing sessions.
6. **TTL enforcement**: Expired refresh tokens MUST be rejected. Redis TTL handles automatic cleanup, but explicit expiry check is required for security.

## Security

- **Token storage**: Refresh tokens are stored as bcrypt hashes in Redis. Raw tokens are never persisted.
- **Rotation as detection**: Using an already-rotated refresh token triggers session invalidation, indicating potential compromise.
- **No access token blacklist**: Access tokens are validated statelessly. A compromised access token expires naturally (15 minutes).
- **Bearer auth**: Logout requires a valid access token in the Authorization header.
- **No auth on refresh**: The refresh endpoint does not require a valid access token — it authenticates solely via the refresh token.