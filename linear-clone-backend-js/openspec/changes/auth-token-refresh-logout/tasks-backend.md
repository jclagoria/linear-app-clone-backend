# Tasks — Auth Token Refresh & Logout (Backend)

## Scaffold

- [ ] Create session store adapter interface in `src/modules/auth/application/ports/`
- [ ] Create refresh token service interface in `src/modules/auth/application/ports/`
- [ ] Create logout service interface in `src/modules/auth/application/ports/`

## Data Layer

- [ ] Implement `RedisSessionStore` adapter in `src/modules/auth/adapters/out/`
  - [ ] `create(jti, data, ttl)` — store session with 7-day TTL
  - [ ] `findByJti(jti)` — lookup session by refresh token ID
  - [ ] `revoke(jti)` — set revokedAt timestamp
  - [ ] `deleteByUserId(userId)` — delete all sessions for logout
- [ ] Define session data type in `src/modules/auth/domain/`

## Business Logic

- [ ] Implement `RefreshTokenService` in `src/modules/auth/application/`
  - [ ] Validate JWT signature and `type: "refresh"` claim
  - [ ] Extract `jti` and lookup session in Redis
  - [ ] Compare token hash with stored hash using bcrypt
  - [ ] Handle revoked/missing session → return 401 token_revoked
  - [ ] Mark current session as revoked
  - [ ] Generate new token pair (new jti for refresh token)
  - [ ] Store new session with 7-day TTL
  - [ ] Return new token pair
- [ ] Implement `LogoutService` in `src/modules/auth/application/`
  - [ ] Extract `sub` (user ID) from validated access token
  - [ ] Find and delete session for user (if exists)
  - [ ] Return `{ success: true }` — always
- [ ] Extend JWT utility to support `type` claim and `jti` generation
  - [ ] `signAccessToken(userId)` — 15-min expiry, `type: "access"`
  - [ ] `signRefreshToken(userId)` — 7-day expiry, `type: "refresh"`, generate `jti`
  - [ ] `verifyToken(token, expectedType)` — validate signature, check type claim

## API Layer

- [ ] Create `POST /api/v1/auth/refresh` route in `src/modules/auth/adapters/in/`
  - [ ] Request DTO with Zod validation (`refreshToken` required string)
  - [ ] Call RefreshTokenService
  - [ ] Return 200 with new token pair
  - [ ] Error mapping: 400 (invalid_token), 401 (token_expired, token_revoked), 422 (validation_failed)
- [ ] Create `POST /api/v1/auth/logout` route in `src/modules/auth/adapters/in/`
  - [ ] Require Bearer JWT (access token) — use existing auth middleware
  - [ ] Call LogoutService
  - [ ] Return 200 with `{ success: true }`
  - [ ] Error mapping: 401 (unauthorized)
- [ ] Register new routes in auth module plugin

## Security

- [ ] Ensure refresh token is not logged or exposed in error messages
- [ ] Validate access token format before passing to LogoutService
- [ ] Use constant-time comparison for bcrypt hash verification
- [ ] Verify `type: "refresh"` claim on refresh endpoint

## Testing

- [ ] Unit tests for RefreshTokenService
  - [ ] Valid rotation returns new token pair
  - [ ] Expired refresh token returns 401 token_expired
  - [ ] Revoked refresh token returns 401 token_revoked
  - [ ] Malformed token returns 400 invalid_token
  - [ ] Bcrypt comparison failure returns 401 token_revoked
- [ ] Unit tests for LogoutService
  - [ ] Successful logout deletes session
  - [ ] Idempotent logout (double call) returns 200
  - [ ] Logout with no session returns 200
- [ ] Unit tests for JWT utility
  - [ ] signAccessToken generates valid token with type: "access"
  - [ ] signRefreshToken generates valid token with type: "refresh" and jti
  - [ ] verifyToken rejects wrong type
  - [ ] verifyToken rejects expired token
- [ ] Integration tests with Testcontainers (Redis)
  - [ ] Full refresh flow: create session → refresh → old token rejected → new token works
  - [ ] Full logout flow: create session → logout → session deleted → idempotent
  - [ ] Redis TTL: session expires after 7 days
- [ ] Contract tests
  - [ ] POST /api/v1/auth/refresh: request/response schema validation
  - [ ] POST /api/v1/auth/logout: response schema, 401 on missing token

## Review

- [ ] Self-review against acceptance criteria from LAG-8
- [ ] Verify all error codes match specs-api
- [ ] Run linting and type checking
- [ ] Create PR with descriptive title and body
