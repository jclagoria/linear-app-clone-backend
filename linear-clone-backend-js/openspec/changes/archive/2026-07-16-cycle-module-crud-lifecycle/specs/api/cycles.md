# Cycles — API Contract

## Endpoint: Create Cycle

- **Method**: POST
- **Path**: `/api/v1/cycles`
- **Auth**: JWT (required)
- **Rate Limit**: 30/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `teamId` | string | yes | UUID of the team the cycle belongs to. |
| `name` | string | yes | Cycle name. MUST NOT be empty. Max 255 characters. |
| `description` | string | no | Cycle description. |
| `startDate` | string (ISO date) | yes | Start date of the cycle. MUST be today or future. |
| `endDate` | string (ISO date) | yes | End date of the cycle. MUST be after `startDate`. |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 201 | Cycle object | Cycle created with status `draft`. |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid input | `{ "error": "validation_failed", "details": [...] }` |
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 403 | Insufficient permissions | `{ "error": "forbidden" }` |
| 422 | Start date is past | `{ "error": "unprocessable", "details": "Start date must be today or future" }` |
| 422 | End date before start | `{ "error": "unprocessable", "details": "End date must be after start date" }` |
| 429 | Rate limit exceeded | `{ "error": "rate_limited", "retry_after": 60 }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: Get Cycle

- **Method**: GET
- **Path**: `/api/v1/cycles/:cycleId`
- **Auth**: JWT (required)
- **Rate Limit**: 60/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cycleId` | string | path | Cycle UUID. |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | Cycle object | Full cycle details including status. |
| 404 | Error | Cycle not found. |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 403 | Insufficient permissions | `{ "error": "forbidden" }` |
| 404 | Cycle not found | `{ "error": "not_found" }` |
| 429 | Rate limit exceeded | `{ "error": "rate_limited", "retry_after": 60 }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: List Cycles for Team

- **Method**: GET
- **Path**: `/api/v1/teams/:teamId/cycles`
- **Auth**: JWT (required)
- **Rate Limit**: 60/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `teamId` | string | path | Team UUID. |
| `status` | string | no | Filter by status: `draft`, `active`, `completed`. |
| `cursor` | string | no | Cursor for pagination. Omit for first page. |
| `limit` | number | no | Max results per page. Range: 1-100. Default: 50. |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | Paginated cycle list | Cycles sorted by start date (desc). |

### Pagination Response Schema

```json
{
  "data": [ /* Cycle objects */ ],
  "pagination": {
    "nextCursor": "string or null",
    "hasMore": true
  }
}
```

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid cursor/limit | `{ "error": "validation_failed", "details": [...] }` |
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 403 | Insufficient permissions | `{ "error": "forbidden" }` |
| 429 | Rate limit exceeded | `{ "error": "rate_limited", "retry_after": 60 }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: Update Cycle

- **Method**: PATCH
- **Path**: `/api/v1/cycles/:cycleId`
- **Auth**: JWT (required)
- **Rate Limit**: 30/min

### Request

Only provided fields SHALL be updated. Omitted fields MUST remain unchanged.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cycleId` | string | path | Cycle UUID. |
| `name` | string | no | New name. MUST NOT be empty if provided. |
| `description` | string | no | New description. |
| `startDate` | string (ISO date) | no | New start date. |
| `endDate` | string (ISO date) | no | New end date. |

Dates are only modifiable when cycle status is `draft`.

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | Cycle object | Cycle updated successfully. |
| 400 | Invalid input | `{ "error": "validation_failed", "details": [...] }` |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid input | `{ "error": "validation_failed", "details": [...] }` |
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 403 | Insufficient permissions | `{ "error": "forbidden" }` |
| 404 | Cycle not found | `{ "error": "not_found" }` |
| 422 | Dates modifiable only in Draft | `{ "error": "unprocessable", "details": "Dates can only be modified in Draft status" }` |
| 429 | Rate limit exceeded | `{ "error": "rate_limited", "retry_after": 60 }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: Activate Cycle

- **Method**: POST
- **Path**: `/api/v1/cycles/:cycleId/activate`
- **Auth**: JWT (required)
- **Rate Limit**: 10/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cycleId` | string | path | Cycle UUID. |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | Cycle object | Cycle activated. Any previously active cycle for the team is auto-completed. Start date is set to activation time if cycle was in Draft. |
| 422 | Error | Cycle cannot be activated (e.g., already completed). |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 403 | Insufficient permissions | `{ "error": "forbidden" }` |
| 404 | Cycle not found | `{ "error": "not_found" }` |
| 422 | Already active | `{ "error": "unprocessable", "details": "Cycle is already active" }` |
| 422 | Already completed | `{ "error": "unprocessable", "details": "Completed cycles cannot be activated" }` |
| 429 | Rate limit exceeded | `{ "error": "rate_limited", "retry_after": 60 }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: Complete Cycle

- **Method**: POST
- **Path**: `/api/v1/cycles/:cycleId/complete`
- **Auth**: JWT (required)
- **Rate Limit**: 10/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cycleId` | string | path | Cycle UUID. |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | Cycle object | Cycle completed. Cannot be reactivated. |
| 422 | Error | Cycle cannot be completed (e.g., already completed, still in draft). |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 403 | Insufficient permissions | `{ "error": "forbidden" }` |
| 404 | Cycle not found | `{ "error": "not_found" }` |
| 422 | Already completed | `{ "error": "unprocessable", "details": "Cycle is already completed" }` |
| 422 | Draft cannot be completed | `{ "error": "unprocessable", "details": "Draft cycles must be activated before completion" }` |
| 429 | Rate limit exceeded | `{ "error": "rate_limited", "retry_after": 60 }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: Delete Cycle (Draft only)

- **Method**: DELETE
- **Path**: `/api/v1/cycles/:cycleId`
- **Auth**: JWT (required)
- **Rate Limit**: 30/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cycleId` | string | path | Cycle UUID. |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 204 | — | Cycle deleted. No content returned. |
| 422 | Error | Cycle cannot be deleted (not in Draft). |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 403 | Insufficient permissions | `{ "error": "forbidden" }` |
| 404 | Cycle not found | `{ "error": "not_found" }` |
| 422 | Not a Draft | `{ "error": "unprocessable", "details": "Only Draft cycles can be deleted" }` |
| 429 | Rate limit exceeded | `{ "error": "rate_limited", "retry_after": 60 }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Cycle Object Schema

```json
{
  "id": "uuid",
  "teamId": "uuid",
  "name": "string",
  "description": "string | null",
  "status": "draft | active | completed",
  "startDate": "ISO date",
  "endDate": "ISO date",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601",
  "completedAt": "ISO-8601 | null"
}
```
