# Identity — API Contract

## Endpoint: List User Teams

- **Method**: GET
- **Path**: `/api/v1/me/teams`
- **Auth**: Bearer JWT (access token)
- **Rate Limit**: 30 req/min

### Request

No query parameters or request body. Authentication is via `Authorization: Bearer <token>` header.

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ data: { teams: Team[] } }` | List of teams the authenticated user belongs to |

**Team object**:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Team identifier |
| `name` | string | Team display name |
| `key` | string | Team key (e.g., `ENG`) |
| `orgId` | string (UUID) | Organization identifier |
| `orgName` | string | Organization display name |

**Example response**:

```json
{
  "data": {
    "teams": [
      {
        "id": "047d1d73-0b6f-4386-9acb-061b9cecea50",
        "name": "Engineering",
        "key": "ENG",
        "orgId": "d48e1311-278d-4996-9fab-7f9435a1c9af",
        "orgName": "Acme Corp"
      }
    ]
  }
}
```

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing or invalid access token | `{ "error": "unauthorized" }` |
| 429 | Rate limit exceeded | `{ "error": "rate_limited", "retry_after": 60 }` |
| 500 | Internal server error | `{ "error": "internal_error" }` |
