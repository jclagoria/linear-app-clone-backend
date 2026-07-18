# Auth — API Contract (Cookie Migration)

## Endpoint: Login

- **Method**: POST
- **Path**: `/api/v1/auth/login`
- **Auth**: None
- **Rate Limit**: 5 req/min per IP

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | yes | User email |
| password | string | yes | User password |
| rememberMe | boolean | no | Extend session to 30 days (default: false) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ data: { user: UserObject, accessToken: string } }` | Login success — no `refreshToken` in body |

### Set-Cookie (Login)

| Cookie | Value |
|--------|-------|
| Name | `refreshToken` |
| HttpOnly | true |
| Secure | true |
| SameSite | Strict |
| Path | `/api/v1/auth/refresh` |
| Max-Age | 604800 (7 days) or 2592000 (30 days if rememberMe) |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid input | `{ "error": { "code": "VALIDATION_ERROR", ... } }` |
| 401 | Invalid credentials | `{ "error": { "code": "UNAUTHORIZED" } }` |
| 429 | Rate limit exceeded | `{ "error": { "code": "RATE_LIMITED" } }` |

---

## Endpoint: Token Refresh

- **Method**: POST
- **Path**: `/api/v1/auth/refresh`
- **Auth**: None (token from cookie)
- **Rate Limit**: 30 req/min per IP

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| refreshToken | string | no | Body fallback — only used if cookie is absent |

The server SHALL read `refreshToken` from the `refreshToken` cookie first. If the cookie is absent, it SHALL fall back to reading `refreshToken` from the request body.

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ data: { accessToken: string } }` | Token rotated — no `refreshToken` in body |

### Set-Cookie (Refresh)

| Cookie | Value |
|--------|-------|
| Name | `refreshToken` |
| HttpOnly | true |
| Secure | true |
| SameSite | Strict |
| Path | `/api/v1/auth/refresh` |
| Max-Age | 604800 (7 days) |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 422 | Missing refresh token (cookie and body) | `{ "error": { "code": "VALIDATION_FAILED" } }` |
| 401 | Token expired | `{ "error": { "code": "TOKEN_EXPIRED" } }` |
| 401 | Token revoked | `{ "error": { "code": "TOKEN_REVOKED" } }` |
| 429 | Rate limit exceeded | `{ "error": { "code": "RATE_LIMITED" } }` |

---

## Endpoint: Logout

- **Method**: POST
- **Path**: `/api/v1/auth/logout`
- **Auth**: Bearer JWT (access token)
- **Rate Limit**: Default

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Authorization | header | yes | Bearer access token |

No request body required.

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ data: { success: true } }` | Session revoked |

### Set-Cookie (Logout)

| Cookie | Value |
|--------|-------|
| Name | `refreshToken` |
| Value | (empty) |
| HttpOnly | true |
| Secure | true |
| SameSite | Strict |
| Path | `/api/v1/auth/refresh` |
| Max-Age | 0 (immediate expiry) |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid access token | `{ "error": { "code": "UNAUTHORIZED" } }` |
| 500 | Internal error | `{ "error": { "code": "INTERNAL_ERROR" } }` |

---

## Shared Response Types

```typescript
// UserObject
interface UserObject {
  id: string;    // uuid
  email: string;
  name: string;
}

// Error detail
interface ErrorDetail {
  code: string;
  message: string;
  details?: Array<{ field: string; message: string }>;
}
```
