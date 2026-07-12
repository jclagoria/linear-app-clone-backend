# Auth — API Contract

## Endpoint: Register

- **Method**: POST
- **Path**: `/api/v1/auth/register`
- **Auth**: None
- **Rate Limit**: 3 requests/min per IP

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User email address |
| `name` | string | Yes | User display name |
| `password` | string | Yes | User password (min 8 chars) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 201 | `{ "data": { "user": UserObject, "accessToken": string, "refreshToken": string } }` | Registration successful |

**UserObject:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | User identifier |
| `email` | string | User email |
| `name` | string | User display name |
| `createdAt` | string (ISO 8601) | Account creation timestamp |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid input | `{ "error": { "code": "VALIDATION_ERROR", "message": "Invalid input", "details": [{ "field": "email", "message": "Invalid email format" }] } }` |
| 409 | Duplicate email | `{ "error": { "code": "CONFLICT", "message": "Email already registered" } }` |
| 429 | Rate limit exceeded | `{ "error": { "code": "RATE_LIMITED", "message": "Rate limit exceeded", "retry_after": 60 } }` |
| 500 | Internal error | `{ "error": { "code": "SERVER_ERROR", "message": "Internal server error" } }` |

---

## Endpoint: Login

- **Method**: POST
- **Path**: `/api/v1/auth/login`
- **Auth**: None
- **Rate Limit**: 5 requests/min per IP

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User email address |
| `password` | string | Yes | User password |
| `rememberMe` | boolean | No | Extend refresh token to 30 days (default: false) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ "data": { "user": UserObject, "accessToken": string, "refreshToken": string } }` | Login successful |

**UserObject:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | User identifier |
| `email` | string | User email |
| `name` | string | User display name |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Invalid credentials | `{ "error": { "code": "UNAUTHORIZED", "message": "Invalid email or password" } }` |
| 429 | Rate limit exceeded | `{ "error": { "code": "RATE_LIMITED", "message": "Rate limit exceeded", "retry_after": 60 } }` |
| 500 | Internal error | `{ "error": { "code": "SERVER_ERROR", "message": "Internal server error" } }` |

---

## Endpoint: Token Validation (Internal)

- **Method**: N/A (service-to-service)
- **Path**: Internal function call
- **Auth**: N/A

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | string | Yes | Access token to validate |

### Output

| Field | Type | Description |
|-------|------|-------------|
| `valid` | boolean | Whether token is valid |
| `userId` | string | User ID (if valid) |
| `expiresAt` | string (ISO 8601) | Token expiration (if valid) |

### Errors

| Condition | Result |
|-----------|--------|
| Invalid signature | `{ "valid": false }` |
| Expired token | `{ "valid": false }` |
| Malformed token | `{ "valid": false }` |

---

## Token Structure

### Access Token

| Claim | Type | Description |
|-------|------|-------------|
| `sub` | string (UUID) | User ID |
| `iat` | number (Unix) | Issued at |
| `exp` | number (Unix) | Expiration (15 minutes) |
| `type` | string | `"access"` |

### Refresh Token

| Claim | Type | Description |
|-------|------|-------------|
| `sub` | string (UUID) | User ID |
| `jti` | string (UUID) | Unique token ID |
| `iat` | number (Unix) | Issued at |
| `exp` | number (Unix) | Expiration (7 days, or 30 days with rememberMe) |
| `type` | string | `"refresh"` |

---

## Response Headers

Every response SHALL include rate limit headers:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests allowed in window |
| `X-RateLimit-Remaining` | Requests remaining in current window |
| `X-RateLimit-Reset` | Unix timestamp when window resets |
