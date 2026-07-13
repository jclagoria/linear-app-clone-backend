# Auth — Session Management Backend Design

## Architecture Decisions

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| Current session identification | Match refresh token hash from request context | Stateless — no need to store session ID in access token claims | Requires passing session hash through request context |
| Session listing | Query PostgreSQL directly | Sessions table already exists in PostgreSQL; Redis is cache for TTL/lookups | Slightly higher latency than Redis-only, but sessions are not high-frequency reads |
| Revocation storage | Delete from PostgreSQL, invalidate in Redis | PostgreSQL is source of truth; Redis cache must stay consistent | Two-write, but Redis delete is best-effort |
| Event emission | In-process EventPublisher | Already exists, lightweight | Events lost on crash; no distributed audit trail yet |
| Session limit enforcement | Check-and-evict in use case layer | Simple, no distributed lock needed for single-instance | Not safe for horizontal scaling without Redis lock |

## API Contracts

### GET /api/v1/auth/sessions

- **Method**: GET
- **Path**: `/api/v1/auth/sessions`
- **Auth**: Bearer JWT (access token required)
- **Rate Limit**: 30 req/min per user
- **Request**: None
- **Response**:
```json
{
  "sessions": [
    {
      "id": "uuid",
      "ipAddress": "string",
      "userAgent": "string",
      "rememberMe": false,
      "createdAt": "ISO-8601",
      "lastActivityAt": "ISO-8601",
      "isCurrent": true
    }
  ]
}
```
- **Status Codes**: 200, 401, 500

### DELETE /api/v1/auth/sessions/:sessionId

- **Method**: DELETE
- **Path**: `/api/v1/auth/sessions/:sessionId`
- **Auth**: Bearer JWT (access token required)
- **Rate Limit**: 30 req/min per user
- **Request**: Path parameter `sessionId` (UUID)
- **Response**:
```json
{ "success": true }
```
- **Status Codes**: 200, 401, 404, 500

### POST /api/v1/auth/sessions/revoke-all

- **Method**: POST
- **Path**: `/api/v1/auth/sessions/revoke-all`
- **Auth**: Bearer JWT (access token required)
- **Rate Limit**: 10 req/min per user
- **Request**: None
- **Response**:
```json
{ "success": true, "revokedCount": 3 }
```
- **Status Codes**: 200, 401, 500

## Data Model

### Sessions Table (existing)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | UUID | PK | Session identifier |
| `user_id` | UUID | FK → users(id), NOT NULL | Session owner |
| `refresh_token_hash` | VARCHAR(255) | UNIQUE, NOT NULL | Bcrypt hash of refresh token |
| `ip_address` | VARCHAR(45) | NOT NULL | Client IP |
| `user_agent` | TEXT | NOT NULL | Client device/browser info |
| `remember_me` | BOOLEAN | NOT NULL, default false | Remember Me flag |
| `created_at` | TIMESTAMP | NOT NULL | Session creation time |
| `last_activity_at` | TIMESTAMP | NOT NULL | Last token refresh time |
| `expires_at` | TIMESTAMP | NOT NULL | Session expiry |

### Indexes

| Index | Columns | Purpose |
|-------|---------|---------|
| `sessions_pkey` | `id` | Primary key lookup |
| `sessions_user_id_idx` | `user_id` | List sessions by user |
| `sessions_refresh_token_hash_idx` | `refresh_token_hash` | Lookup by token hash |
| `sessions_user_activity_idx` | `user_id, last_activity_at` | Eviction query (oldest by activity) |

### Migrations

No new migrations needed — the `sessions` table already exists with the required schema.

## Business Logic

### ListSessions Use Case

- **Responsibility**: Return all active sessions for a user with current session marked
- **Rules**:
  - Filter to non-expired sessions only (`expires_at > NOW()`)
  - Sort by `last_activity_at` DESC
  - Mark the current session by matching refresh token hash from request context
- **Dependencies**: SessionRepository (findByUserId, findByRefreshTokenHash)

### RevokeSession Use Case

- **Responsibility**: Delete a specific session and invalidate its refresh token
- **Rules**:
  - Session must belong to the requesting user (enforced by query)
  - Revoking current session = logout (no special handling needed — client discards tokens)
  - Emit `session_revoked` event after deletion
  - Delete from PostgreSQL, then invalidate Redis cache
- **Dependencies**: SessionRepository (findById, deleteById), EventPublisher

### RevokeAllSessions Use Case

- **Responsibility**: Delete all sessions except the current one
- **Rules**:
  - Identify current session by refresh token hash
  - Delete all other non-expired sessions for the user
  - Emit `session_revoked` event for each deleted session
  - Return count of revoked sessions
  - Wrap in transaction — all-or-nothing
- **Dependencies**: SessionRepository (findByUserId, deleteByIds), EventPublisher

### Session Limit Enforcement (in LoginUser)

- **Responsibility**: Evict oldest session when limit (10) is exceeded
- **Rules**:
  - Count active sessions before creating new one
  - If count >= 10, delete session with oldest `last_activity_at`
  - Emit `session_evicted` event for the evicted session
  - Create new session after eviction
- **Dependencies**: SessionRepository (countByUserId, deleteOldestByUserId)

## Security

- **Authentication**: All endpoints require valid Bearer JWT access token
- **Authorization**: Users can only manage their own sessions — queries filter by `user_id` from token
- **Input Validation**: Zod schemas at controller boundary; UUID path parameters validated
- **Rate Limiting**: Per-user limits (30 req/min for list/revoke, 10 req/min for revoke-all)
- **Token Storage**: Refresh tokens stored as bcrypt hashes — raw tokens never persisted
- **Audit Trail**: Session revocation and eviction events emitted via EventPublisher
- **No Session Fixation**: Session IDs generated server-side (UUID v4 random)

## Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | ListSessions, RevokeSession, RevokeAllSessions use cases in isolation |
| Integration | Vitest + Testcontainers | SessionRepository PostgreSQL queries, full API route testing |
| Contract | Vitest | API contract verification (request/response shape, status codes) |

### Unit Test Cases

- ListSessions: returns sessions sorted by lastActivityAt, marks current session, excludes expired
- RevokeSession: deletes session, emits event, returns success
- RevokeSession: returns 404 for non-existent session
- RevokeAllSessions: deletes all except current, returns revokedCount
- RevokeAllSessions: returns revokedCount 0 when only current session exists

### Integration Test Cases

- GET /sessions: full flow with authenticated user, multiple sessions in DB
- DELETE /sessions/:id: revokes session, verifies DB deletion
- DELETE /sessions/:id: returns 404 for other user's session
- POST /sessions/revoke-all: revokes all, verifies only current remains
- Session limit: login with 10 sessions triggers eviction

### Contract Test Cases

- Response shape matches specs-api for all three endpoints
- Status codes match specs-api
- Error responses match standard error format
