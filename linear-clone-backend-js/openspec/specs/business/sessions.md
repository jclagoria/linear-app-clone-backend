# Auth — Session Management Business Specification

## Behaviour

**Feature:** Session Listing

A user SHALL be able to view all active sessions for their account, including device information and which session is the current one. This enables users to identify unauthorized access.

### Requirement: List Active Sessions

#### Scenario: User lists sessions

- **GIVEN** an authenticated user with one or more active sessions
- **WHEN** the user requests GET /api/v1/auth/sessions
- **THEN** all non-expired sessions belonging to the user are returned
- **AND** each session includes id, ipAddress, userAgent, rememberMe, createdAt, lastActivityAt, and isCurrent
- **AND** the current session (matching the request token) has isCurrent set to true
- **AND** sessions are sorted by lastActivityAt descending (most recently active first)

#### Scenario: User with single session

- **GIVEN** an authenticated user with exactly one active session
- **WHEN** the user requests GET /api/v1/auth/sessions
- **THEN** a single session is returned with isCurrent set to true

#### Scenario: Expired sessions excluded

- **GIVEN** an authenticated user with both active and expired sessions
- **WHEN** the user requests GET /api/v1/auth/sessions
- **THEN** only non-expired sessions are returned
- **AND** expired sessions are not included in the response

---

**Feature:** Session Revocation

A user SHALL be able to revoke (terminate) a specific session by its identifier. Revoking the current session is equivalent to logging out.

### Requirement: Revoke a Specific Session

#### Scenario: User revokes another session

- **GIVEN** an authenticated user with multiple active sessions
- **WHEN** the user sends DELETE /api/v1/auth/sessions/:sessionId for a non-current session
- **THEN** the specified session is deleted
- **AND** the refresh token associated with that session is invalidated
- **AND** a 200 response with { success: true } is returned
- **AND** a session_revoked event is emitted for audit logging

#### Scenario: User revokes current session

- **GIVEN** an authenticated user
- **WHEN** the user sends DELETE /api/v1/auth/sessions/:sessionId for the current session
- **THEN** the session is deleted
- **AND** the refresh token is invalidated
- **AND** a 200 response with { success: true } is returned
- **AND** the client SHOULD treat this as a logout

#### Scenario: Revoking a non-existent session

- **GIVEN** an authenticated user
- **WHEN** the user sends DELETE /api/v1/auth/sessions/:sessionId for a session that does not exist or belongs to another user
- **THEN** a 404 response with { error: "not_found" } is returned
- **AND** no side effects occur

#### Scenario: Revoked session token reuse

- **GIVEN** a session that has been revoked
- **WHEN** the revoked session's refresh token is presented to POST /api/v1/auth/refresh
- **THEN** the request fails with 401 and error code "token_revoked"

---

**Feature:** Revoke All Sessions

A user SHALL be able to revoke all sessions except the current one, effectively signing out from all other devices while remaining authenticated on the current device.

### Requirement: Revoke All Other Sessions

#### Scenario: User revokes all other sessions

- **GIVEN** an authenticated user with multiple active sessions
- **WHEN** the user sends POST /api/v1/auth/sessions/revoke-all
- **THEN** all sessions except the current one are deleted
- **AND** all refresh tokens for those sessions are invalidated
- **AND** a 200 response with { success: true, revokedCount: N } is returned where N is the number of revoked sessions
- **AND** a session_revoked event is emitted for each revoked session

#### Scenario: User with only current session

- **GIVEN** an authenticated user with exactly one active session (the current one)
- **WHEN** the user sends POST /api/v1/auth/sessions/revoke-all
- **THEN** no sessions are revoked
- **AND** a 200 response with { success: true, revokedCount: 0 } is returned

#### Scenario: Idempotent revoke all

- **GIVEN** an authenticated user who previously called revoke-all
- **WHEN** the user sends POST /api/v1/auth/sessions/revoke-all again
- **THEN** no sessions are revoked (only current session exists)
- **AND** a 200 response with { success: true, revokedCount: 0 } is returned

---

**Feature:** Session Limit Enforcement

The system SHALL enforce a maximum of 10 active sessions per user. When a new session is created and the limit would be exceeded, the oldest session by last_activity_at MUST be evicted automatically.

### Requirement: Automatic Session Eviction

#### Scenario: Login within session limit

- **GIVEN** a user with 8 active sessions
- **WHEN** the user logs in from a new device
- **THEN** a new session is created
- **AND** the total session count becomes 9

#### Scenario: Login exceeds session limit

- **GIVEN** a user with 10 active sessions (the maximum)
- **WHEN** the user logs in from a new device
- **THEN** the session with the oldest last_activity_at is evicted
- **AND** the new session is created
- **AND** the evicted session's refresh token is invalidated
- **AND** a session_evicted event is emitted for audit logging

#### Scenario: Eviction picks oldest by activity

- **GIVEN** a user with 10 active sessions with varying last_activity_at values
- **WHEN** a new login triggers eviction
- **THEN** the session with the oldest (earliest) last_activity_at value is evicted
- **AND** all other sessions remain active

---

## Data Model

### Session

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | UUID | PK, unique | Session identifier |
| `user_id` | UUID | FK → users(id), not null | Owner of the session |
| `refresh_token_hash` | VARCHAR(255) | unique, not null | Hashed refresh token (bcrypt) |
| `ip_address` | VARCHAR(45) | not null | Client IP (IPv4 or IPv6) |
| `user_agent` | TEXT | not null | Client device/browser info |
| `remember_me` | BOOLEAN | not null, default false | Whether "Remember Me" was used |
| `created_at` | TIMESTAMP | not null | Session creation time |
| `last_activity_at` | TIMESTAMP | not null | Last token refresh time |
| `expires_at` | TIMESTAMP | not null | Session expiration time |

### Relationships

Session --belongs to--> User: Each session belongs to one user. A user MAY have multiple sessions (multi-device).

---

## Business Rules

1. **Ownership**: Users MUST only be able to list and revoke their own sessions. Cross-user session access MUST be rejected with 404.
2. **Current session identification**: The current session is identified by matching the refresh token hash from the request's access token session context.
3. **Revoked token invalidation**: When a session is revoked, its refresh token MUST be invalidated. Subsequent refresh attempts with that token MUST fail with 401 "token_revoked".
4. **Revocation events**: Each session revocation MUST emit a `session_revoked` event with session ID, user ID, and timestamp for audit logging.
5. **Eviction events**: Each automatic eviction during login MUST emit a `session_evicted` event with evicted session ID, user ID, and reason ("limit_exceeded").
6. **Session limit**: Maximum 10 active sessions per user. This limit is enforced at login time, not at session listing time.
7. **Eviction strategy**: When eviction is needed, the session with the oldest `last_activity_at` is evicted. If multiple sessions share the same oldest timestamp, any one of them may be evicted.
8. **Revocation is permanent**: Once revoked, a session cannot be restored. A new login is required to create a new session.
9. **No partial revocation**: Revoke-all MUST either revoke all other sessions or fail entirely. Partial revocation MUST NOT occur.

---

## Security

- **Authentication**: All session management endpoints require a valid Bearer JWT access token.
- **Authorization**: Users can only manage their own sessions. Session IDs MUST NOT be guessable (UUID v4).
- **Token storage**: Refresh tokens are stored as bcrypt hashes. Raw tokens are never persisted.
- **Audit trail**: Session revocation and eviction events MUST be emitted for audit logging.
- **No session fixation**: Session IDs are generated server-side and are not client-controllable.
- **Rate limiting**: Session management endpoints are rate-limited per user to prevent abuse.
