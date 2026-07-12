# Tasks — Auth Token Refresh & Logout (Backend)

## Scaffold

- [x] Create session store adapter interface in `src/modules/auth/application/ports/`
- [x] Create refresh token service interface in `src/modules/auth/application/ports/`
- [x] Create logout service interface in `src/modules/auth/application/ports/`

## Data Layer

- [x] Implement `RedisSessionStore` adapter in `src/modules/auth/adapters/out/`
  - [x] `create(jti, data, ttl)` — store session with 7-day TTL
  - [x] `findByJti(jti)` — lookup session by refresh token ID
  - [x] `revoke(jti)` — set revokedAt timestamp
  - [x] `deleteByUserId(userId)` — delete all sessions for logout
- [x] Define session data type in `src/modules/auth/domain/`

## Business Logic

- [x] Implement `RefreshTokenService` in `src/modules/auth/application/`
  - [x] Validate JWT signature and `type: "refresh"` claim
  - [x] Extract `jti` and lookup session in Redis
  - [x] Compare token hash with stored hash using bcrypt
  - [x] Handle revoked/missing session → return 401 token_revoked
  - [x] Mark current session as revoked
  - [x] Generate new token pair (new jti for refresh token)
  - [x] Store new session with 7-day TTL
  - [x] Return new token pair
- [x] Implement `LogoutService` in `src/modules/auth/application/`
  - [x] Extract `sub` (user ID) from validated access token
  - [x] Find and delete session for user (if exists)
  - [x] Return `{ success: true }` — always
- [x] Extend JWT utility to support `type` claim and `jti` generation
  - [x] `signAccessToken(userId)` — 15-min expiry, `type: "access"`
  - [x] `signRefreshToken(userId)` — 7-day expiry, `type: "refresh"`, generate `jti`
  - [x] `verifyToken(token, expectedType)` — validate signature, check type claim

## API Layer

- [x] Create `POST /api/v1/auth/refresh` route in `src/modules/auth/adapters/in/`
  - [x] Request DTO with Zod validation (`refreshToken` required string)
  - [x] Call RefreshTokenService
  - [x] Return 200 with new token pair
  - [x] Error mapping: 400 (invalid_token), 401 (token_expired, token_revoked), 422 (validation_failed)
- [x] Create `POST /api/v1/auth/logout` route in `src/modules/auth/adapters/in/`
  - [x] Require Bearer JWT (access token) — use existing auth middleware
  - [x] Call LogoutService
  - [x] Return 200 with `{ success: true }`
  - [x] Error mapping: 401 (unauthorized)
- [x] Register new routes in auth module plugin

## Security

- [x] Ensure refresh token is not logged or exposed in error messages
- [x] Validate access token format before passing to LogoutService
- [x] Use constant-time comparison for bcrypt hash verification
- [x] Verify `type: "refresh"` claim on refresh endpoint

## Testing

- [x] Unit tests for RefreshTokenService
  - [x] Valid rotation returns new token pair
  - [x] Expired refresh token returns 401 token_expired
  - [x] Revoked refresh token returns 401 token_revoked
  - [x] Malformed token returns 400 invalid_token
  - [x] Bcrypt comparison failure returns 401 token_revoked
- [x] Unit tests for LogoutService
  - [x] Successful logout deletes session
  - [x] Idempotent logout (double call) returns 200
  - [x] Logout with no session returns 200
- [x] Unit tests for JWT utility
  - [x] signAccessToken generates valid token with type: "access"
  - [x] signRefreshToken generates valid token with type: "refresh" and jti
  - [x] verifyToken rejects wrong type
  - [x] verifyToken rejects expired token
- [ ] Integration tests with Testcontainers (Redis)
  - [ ] Full refresh flow: create session → refresh → old token rejected → new token works
  - [ ] Full logout flow: create session → logout → session deleted → idempotent
  - [ ] Redis TTL: session expires after 7 days
- [x] Contract tests
  - [x] POST /api/v1/auth/refresh: request/response schema validation
  - [x] POST /api/v1/auth/logout: response schema, 401 on missing token

## Review

- [x] Self-review against acceptance criteria from LAG-8
- [x] Verify all error codes match specs-api
- [x] Run linting and type checking
- [ ] Create PR with descriptive title and body
