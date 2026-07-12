# Auth Token Refresh & Logout — Backend Design

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Refresh token storage | Redis hash | TTL support, fast lookup, no SQL overhead for key-value |
| Token hashing | bcrypt | Constant-time comparison, prevents timing attacks |
| Rotation detection | jti claim | Unique token ID enables reuse detection without family tracking |
| Session model | One session per token pair | Simplifies rotation — each session holds one refresh token |
| Logout strategy | Delete session record | Simple, atomic, idempotent — no blacklist needed |

## API Contracts

### POST /api/v1/auth/refresh

- **Method**: POST
- **Path**: `/api/v1/auth/refresh`
- **Auth**: None (refresh token in body)
- **Request**:

```json
{
  "refreshToken": "string (JWT)"
}
```

- **Response 200**:

```json
{
  "accessToken": "string (JWT)",
  "refreshToken": "string (JWT)"
}
```

- **Error responses**: 400 (invalid_token), 401 (token_expired, token_revoked), 422 (validation_failed), 500

### POST /api/v1/auth/logout

- **Method**: POST
- **Path**: `/api/v1/auth/logout`
- **Auth**: Bearer JWT (access token)
- **Request**: No body
- **Response 200**:

```json
{
  "success": true
}
```

- **Error responses**: 401 (unauthorized), 500
- **Idempotency**: Always returns 200 if token is valid, even if session already deleted

## Data Model

### Session (Redis)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `key` | string | `session:{jti}` | Redis key pattern |
| `userId` | string (UUID) | not null | Owner reference |
| `refreshTokenHash` | string | not null | bcrypt hash of refresh token |
| `createdAt` | number | not null | Unix timestamp |
| `expiresAt` | number | not null | Unix timestamp (7 days) |
| `revokedAt` | number | nullable | Set on rotation or explicit revoke |

### Migrations

No SQL migrations required. Session data is stored in Redis with TTL-based expiry.

### Token Claims

**Access Token:**
```json
{
  "sub": "user-id",
  "iat": 1234567890,
  "exp": 1234568790,
  "type": "access"
}
```

**Refresh Token:**
```json
{
  "sub": "user-id",
  "jti": "unique-token-id",
  "iat": 1234567890,
  "exp": 1234654290,
  "type": "refresh"
}
```

## Business Logic

### RefreshToken Service

- **Responsibility**: Validate refresh token, rotate, issue new pair
- **Steps**:
  1. Validate JWT signature and `type: "refresh"` claim
  2. Extract `jti` and lookup session in Redis: `GET session:{jti}`
  3. Compare provided token hash with stored `refreshTokenHash` using bcrypt
  4. If not found or already revoked → return 401 token_revoked
  5. Mark current session as revoked: `SET session:{jti} revokedAt=now`
  6. Generate new token pair (new `jti` for refresh token)
  7. Store new session: `SET session:{new-jti} {...} EX 604800`
  8. Return new token pair

- **Dependencies**: JWT utility, Redis session store, bcrypt

### Logout Service

- **Responsibility**: Delete session, invalidate refresh token
- **Steps**:
  1. Validate access token (handled by auth middleware)
  2. Extract `sub` (user ID) from token
  3. Find and delete session for this user (if exists)
  4. Return `{ success: true }` — always, regardless of session state

- **Dependencies**: Redis session store

### JWT Utility

- **Sign access token**: 15-minute expiry, `type: "access"`
- **Sign refresh token**: 7-day expiry, `type: "refresh"`, generate `jti`
- **Verify token**: Validate signature, check expiry, return claims
- **Dependencies**: jose library, environment secret

## Security

- **Authentication**: Access tokens validated statelessly via JWT signature. Refresh tokens validated against Redis session store.
- **Authorization**: Logout requires valid access token. Refresh does not require access token.
- **Token storage**: Refresh tokens stored as bcrypt hashes. Raw tokens never persisted.
- **Rotation security**: Using a revoked refresh token triggers session invalidation — detects potential token theft.
- **Input validation**: Zod schema validates `refreshToken` field presence and type.
- **Error messages**: Generic error codes (no user enumeration).

## Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | RefreshToken service, Logout service, JWT utility |
| Integration | Vitest + Testcontainers | Redis session store, full refresh flow, full logout flow |
| Contract | Vitest | API contract verification against specs-api |

### Unit Tests

- RefreshToken: valid rotation, expired token, revoked token, malformed token, bcrypt comparison failure
- Logout: successful logout, idempotent logout (double call), session not found
- JWT utility: sign/verify access, sign/verify refresh, expired token handling

### Integration Tests

- Full refresh flow: create session → refresh → verify old token rejected → verify new token works
- Full logout flow: create session → logout → verify session deleted → verify idempotent
- Redis TTL: verify session expires after 7 days

### Contract Tests

- POST /api/v1/auth/refresh: request/response schema validation, error code mapping
- POST /api/v1/auth/logout: response schema, 401 on missing token
