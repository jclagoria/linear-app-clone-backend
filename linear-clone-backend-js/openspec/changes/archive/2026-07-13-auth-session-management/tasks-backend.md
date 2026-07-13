# Tasks — Auth Session Management (Backend)

## Scaffold

- [x] Verify `sessions` table exists with required columns (id, user_id, refresh_token_hash, ip_address, user_agent, remember_me, created_at, last_activity_at, expires_at)
- [x] Verify indexes exist: `sessions_user_id_idx`, `sessions_refresh_token_hash_idx`, `sessions_user_activity_idx`
- [x] Add session management rate limit config to env (RATE_LIMIT_SESSION_LIST=30, RATE_LIMIT_SESSION_REVOKE=30, RATE_LIMIT_SESSION_REVOKE_ALL=10)

## Data Layer

- [x] Extend `SessionRepository` port with new methods: `findById(id, userId)`, `findByUserId(userId)`, `deleteById(id, userId)`, `deleteByIds(ids, userId)`, `findOldestByUserId(userId)`
- [x] Implement new methods in `RedisSessionStore` adapter (or create `DrizzleSessionRepository` for PostgreSQL queries)
- [x] Add `findByUserId` query: select non-expired sessions where user_id = ?, ordered by last_activity_at DESC
- [x] Add `findById` query: select session where id = ? AND user_id = ? (ownership enforced)
- [x] Add `deleteById` query: delete session where id = ? AND user_id = ?
- [x] Add `deleteByIds` query: delete sessions where id IN (?) AND user_id = ?
- [x] Add `findOldestByUserId` query: select session where user_id = ? ORDER BY last_activity_at ASC LIMIT 1

## Business Logic

- [x] Create `ListSessions` use case: takes userId and currentRefreshTokenHash, returns session list with isCurrent flag
- [x] Create `RevokeSession` use case: takes userId, sessionId, and currentRefreshTokenHash, deletes session, emits event
- [x] Create `RevokeAllSessions` use case: takes userId and currentRefreshTokenHash, deletes all except current, emits events, returns count
- [x] Update `LoginUser` use case: add session limit check (count >= 10 → evict oldest) before creating new session
- [x] Add session eviction event emission in LoginUser when limit exceeded

## API Layer

- [x] Create `session-controller.ts` in `adapters/in/` with route handlers for GET /sessions, DELETE /sessions/:id, POST /sessions/revoke-all
- [x] Add Zod validation for path parameter `sessionId` (UUID format)
- [x] Implement GET /sessions handler: extract userId from token, call ListSessions, return { sessions }
- [x] Implement DELETE /sessions/:sessionId handler: extract userId and sessionId, call RevokeSession, return { success: true }
- [x] Implement POST /sessions/revoke-all handler: extract userId, call RevokeAllSessions, return { success: true, revokedCount }
- [x] Add error handling for 404 (session not found) and 401 (unauthorized)
- [x] Register session routes in auth controller under /auth prefix
- [x] Add rate limiting config to each session endpoint

## Events / Messaging

- [x] Define `SessionRevokedEvent` type: { type: 'session_revoked', userId, sessionId, timestamp }
- [x] Define `SessionEvictedEvent` type: { type: 'session_evicted', userId, sessionId, reason: 'limit_exceeded', timestamp }
- [x] Emit SessionRevokedEvent in RevokeSession use case after deletion
- [x] Emit SessionRevokedEvent for each session in RevokeAllSessions use case
- [x] Emit SessionEvictedEvent in LoginUser when session limit eviction occurs

## Security

- [x] Ensure all session endpoints require Bearer JWT via auth middleware
- [x] Enforce session ownership: queries filter by user_id from token, 404 for cross-user access
- [x] Validate sessionId is UUID format via Zod schema
- [x] Add rate limiting to session endpoints (30/min list/revoke, 10/min revoke-all)

## Testing

- [x] Unit test: ListSessions returns sorted sessions, marks current, excludes expired
- [x] Unit test: RevokeSession deletes session, emits event, returns success
- [x] Unit test: RevokeSession returns 404 for non-existent or other user's session
- [x] Unit test: RevokeAllSessions deletes all except current, returns correct count
- [x] Unit test: RevokeAllSessions returns revokedCount 0 when only current session exists
- [x] Unit test: LoginUser evicts oldest session when limit (10) is reached
- [ ] Integration test: GET /sessions with multiple sessions in DB, verify ordering and isCurrent
- [ ] Integration test: DELETE /sessions/:id revokes session, verify DB deletion
- [ ] Integration test: DELETE /sessions/:id returns 404 for other user's session
- [ ] Integration test: POST /sessions/revoke-all revokes all, verify only current remains
- [ ] Integration test: Login with 10 sessions triggers eviction
- [ ] Contract test: Response shape matches specs-api for all three endpoints
- [ ] Contract test: Status codes match specs-api
- [ ] Contract test: Error responses match standard error format

## Review

- [ ] Self-review: verify all tasks complete, tests pass
- [ ] PR checklist: code follows hexagonal architecture, no secrets, error handling complete
