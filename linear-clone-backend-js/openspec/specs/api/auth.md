# Auth — API Contract

## Endpoint: Refresh Token

- **Method**: POST
- **Path**: `/api/v1/auth/refresh`
- **Auth**: None (refresh token provided in body)
- **Rate Limit**: TBD

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `refreshToken` | string | yes | The single-use refresh token to rotate |

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ accessToken, refreshToken }` | New token pair issued |

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid or malformed refresh token | `{ "error": "invalid_token", "details": "Refresh token is malformed" }` |
| 401 | Expired refresh token | `{ "error": "token_expired", "details": "Refresh token has expired" }` |
| 401 | Revoked or already-used refresh token | `{ "error": "token_revoked", "details": "Refresh token has been revoked or already used" }` |
| 422 | Missing required field | `{ "error": "validation_failed", "details": [{ "field": "refreshToken", "message": "Required" }] }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: Logout

- **Method**: POST
- **Path**: `/api/v1/auth/logout`
- **Auth**: Bearer JWT (access token)
- **Rate Limit**: TBD

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| — | — | — | No body required |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ success: true }` | Session deleted, refresh token invalidated |

```json
{
  "success": true
}
```

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing or invalid access token | `{ "error": "unauthorized" }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

### Idempotency

Calling logout when no active session exists SHALL return 200 with `{ "success": true }`. The endpoint MUST be idempotent — repeated calls with the same token MUST NOT return errors.