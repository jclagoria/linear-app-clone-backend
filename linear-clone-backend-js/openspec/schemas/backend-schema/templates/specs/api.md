# {Domain} — API Contract

## Endpoint: {Name}

- **Method**: GET/POST/PUT/DELETE
- **Path**: `/api/v1/{resource}`
- **Auth**: {JWT / API key / none}
- **Rate Limit**: {req/min}

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|

### Response

| Status | Schema | Description |
|--------|--------|-------------|

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid input | `{ "error": "validation_failed", "details": [...] }` |
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 403 | Insufficient permissions | `{ "error": "forbidden" }` |
| 404 | Resource not found | `{ "error": "not_found" }` |
| 409 | Conflict (duplicate) | `{ "error": "conflict", "details": "..." }` |
| 422 | Unprocessable entity | `{ "error": "unprocessable", "details": [...] }` |
| 429 | Rate limit exceeded | `{ "error": "rate_limited", "retry_after": 60 }` |
| 500 | Internal error | `{ "error": "internal_error" }` |
