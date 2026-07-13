# Auth — Session Management API Contract

## Endpoint: List Sessions

- **Method**: GET
- **Path**: `/api/v1/auth/sessions`
- **Auth**: Bearer JWT (access token)
- **Rate Limit**: 30 req/min per user

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| — | — | — | No body required |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ sessions: Session[] }` | List of active sessions |

```json
{
  "sessions": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      "rememberMe": false,
      "createdAt": "2026-07-10T19:30:00.000Z",
      "lastActivityAt": "2026-07-13T02:54:39.000Z",
      "isCurrent": true
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "ipAddress": "10.0.0.50",
      "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      "rememberMe": true,
      "createdAt": "2026-07-12T08:15:00.000Z",
      "lastActivityAt": "2026-07-12T22:10:00.000Z",
      "isCurrent": false
    }
  ]
}
```

### Session Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Session identifier |
| `ipAddress` | string | Client IP address (IPv4 or IPv6) |
| `userAgent` | string | Client device/browser user agent string |
| `rememberMe` | boolean | Whether "Remember Me" was used at login |
| `createdAt` | string (ISO 8601) | When the session was created |
| `lastActivityAt` | string (ISO 8601) | Last token refresh time |
| `isCurrent` | boolean | `true` if this is the session making the request |

### Ordering

Sessions MUST be returned sorted by `last_activity_at` descending (most recently active first).

### Filtering

Only non-expired sessions MUST be returned. Expired sessions are excluded from the response.

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing or invalid access token | `{ "error": "unauthorized" }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: Revoke Session

- **Method**: DELETE
- **Path**: `/api/v1/auth/sessions/:sessionId`
- **Auth**: Bearer JWT (access token)
- **Rate Limit**: 30 req/min per user

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sessionId` | string (UUID) | yes | Path parameter — the session to revoke |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ success: true }` | Session revoked successfully |

```json
{
  "success": true
}
```

### Revoking Current Session

If the user revokes the session that matches the current request's token, the response SHALL be 200 with `{ "success": true }`. The client SHOULD treat this as a logout and discard its tokens.

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing or invalid access token | `{ "error": "unauthorized" }` |
| 404 | Session not found or does not belong to user | `{ "error": "not_found", "details": "Session not found" }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: Revoke All Sessions

- **Method**: POST
- **Path**: `/api/v1/auth/sessions/revoke-all`
- **Auth**: Bearer JWT (access token)
- **Rate Limit**: 10 req/min per user

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| — | — | — | No body required |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ success: true, revokedCount: number }` | All other sessions revoked |

```json
{
  "success": true,
  "revokedCount": 3
}
```

### Behavior

The current session (the one used to make the request) MUST be preserved. All other non-expired sessions for the user MUST be revoked. The `revokedCount` field SHALL reflect the number of sessions revoked (excluding the current session).

If no other sessions exist, the response SHALL be `{ "success": true, "revokedCount": 0 }`.

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing or invalid access token | `{ "error": "unauthorized" }` |
| 500 | Internal error | `{ "error": "internal_error" }` |
