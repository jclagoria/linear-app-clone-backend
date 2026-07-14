# Issues — API Contract

## Endpoint: Create Issue

- **Method**: POST
- **Path**: `/api/v1/issues`
- **Auth**: JWT (required)
- **Rate Limit**: 60/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | yes | Issue title. MUST NOT be empty. Max 255 characters. |
| `description` | string | no | Issue description in Markdown. |
| `teamId` | string | yes | UUID of the team the issue belongs to. |
| `projectId` | string | no | UUID of the project. MUST belong to the same team as `teamId`. |
| `assigneeId` | string | no | UUID of the assigned user. MUST be a member of the issue's team. |
| `priority` | number | no | Priority level: 0 (No Priority), 1 (Urgent), 2 (High), 3 (Medium), 4 (Low). Defaults to 0. |
| `labelIds` | string[] | no | Array of label UUIDs. |
| `parentId` | string | no | UUID of the parent issue. MUST belong to the same team. |
| `cycleId` | string | no | UUID of the cycle. |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 201 | Issue object | Issue created successfully. Auto-generated identifier (`ENG-123`) returned in `identifier` field. |
| 400 | Error | Invalid input (e.g., empty title). |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid input | `{ "error": "validation_failed", "details": [...] }` |
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 403 | Insufficient permissions | `{ "error": "forbidden" }` |
| 404 | Team/Project/User not found | `{ "error": "not_found" }` |
| 409 | Duplicate identifier | `{ "error": "conflict", "details": "..." }` |
| 422 | Parent issue team mismatch | `{ "error": "unprocessable", "details": "Parent issue must belong to same team" }` |
| 429 | Rate limit exceeded | `{ "error": "rate_limited", "retry_after": 60 }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: Get Issue

- **Method**: GET
- **Path**: `/api/v1/issues/:id`
- **Auth**: JWT (required)
- **Rate Limit**: 120/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | path | Issue UUID or identifier (`ENG-123`). |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | Issue object | Full issue details. |
| 404 | Error | Issue not found or soft-deleted. |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 404 | Issue not found | `{ "error": "not_found" }` |
| 429 | Rate limit exceeded | `{ "error": "rate_limited", "retry_after": 60 }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: Update Issue

- **Method**: PATCH
- **Path**: `/api/v1/issues/:id`
- **Auth**: JWT (required)
- **Rate Limit**: 60/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | path | Issue UUID or identifier. |
| `title` | string | no | New title. MUST NOT be empty if provided. |
| `description` | string | no | New description in Markdown. |
| `projectId` | string | no | New project UUID. MUST belong to same team as the issue. Null to unset. |
| `priority` | number | no | New priority level (0-4). |
| `labelIds` | string[] | no | Replaces all labels. |
| `cycleId` | string | no | New cycle UUID. Null to unset. |

Only provided fields SHALL be updated. Omitted fields MUST remain unchanged.

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | Issue object | Issue updated successfully. |
| 400 | Error | Invalid input (e.g., empty title). |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid input | `{ "error": "validation_failed", "details": [...] }` |
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 403 | Insufficient permissions | `{ "error": "forbidden" }` |
| 404 | Issue not found | `{ "error": "not_found" }` |
| 422 | Project team mismatch | `{ "error": "unprocessable", "details": "Project must belong to same team" }` |
| 429 | Rate limit exceeded | `{ "error": "rate_limited", "retry_after": 60 }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: Change Issue Status

- **Method**: PATCH
- **Path**: `/api/v1/issues/:id/status`
- **Auth**: JWT (required)
- **Rate Limit**: 60/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | path | Issue UUID or identifier. |
| `statusId` | string | yes | Target status UUID. MUST follow workflow transition rules. |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | Issue object | Status updated. `completedAt` SHALL be set when transitioning to a completed or canceled state. `completedAt` SHALL be cleared when transitioning from a completed state. |
| 422 | Error | Invalid status transition. |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid input | `{ "error": "validation_failed", "details": [...] }` |
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 403 | Insufficient permissions | `{ "error": "forbidden" }` |
| 404 | Issue/Status not found | `{ "error": "not_found" }` |
| 422 | Invalid transition | `{ "error": "unprocessable", "details": "Cannot transition from current status to target status" }` |
| 429 | Rate limit exceeded | `{ "error": "rate_limited", "retry_after": 60 }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: Assign Issue

- **Method**: PATCH
- **Path**: `/api/v1/issues/:id/assignee`
- **Auth**: JWT (required)
- **Rate Limit**: 60/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | path | Issue UUID or identifier. |
| `assigneeId` | string | no | User UUID to assign. MUST be a member of the issue's team. Null to unassign. |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | Issue object | Assignee updated. |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid input | `{ "error": "validation_failed", "details": [...] }` |
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 403 | Insufficient permissions | `{ "error": "forbidden" }` |
| 404 | Issue/User not found | `{ "error": "not_found" }` |
| 422 | User not a team member | `{ "error": "unprocessable", "details": "Assignee must be a member of the issue's team" }` |
| 429 | Rate limit exceeded | `{ "error": "rate_limited", "retry_after": 60 }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: Delete Issue

- **Method**: DELETE
- **Path**: `/api/v1/issues/:id`
- **Auth**: JWT (required)
- **Rate Limit**: 30/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | path | Issue UUID or identifier. |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 204 | — | Issue soft-deleted (`deletedAt` timestamp set). No content returned. |
| 404 | Error | Issue not found. |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 403 | Insufficient permissions | `{ "error": "forbidden" }` |
| 404 | Issue not found | `{ "error": "not_found" }` |
| 429 | Rate limit exceeded | `{ "error": "rate_limited", "retry_after": 60 }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: List Issues

- **Method**: GET
- **Path**: `/api/v1/issues`
- **Auth**: JWT (required)
- **Rate Limit**: 60/min

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `teamId` | string | no | Filter by team UUID. |
| `statusId` | string | no | Filter by status UUID. |
| `assigneeId` | string | no | Filter by assignee UUID. |
| `projectId` | string | no | Filter by project UUID. |
| `cycleId` | string | no | Filter by cycle UUID. |
| `labelIds` | string | no | Comma-separated label UUIDs. Issues matching ANY label SHALL be returned. |
| `cursor` | string | no | Cursor for pagination. Omit for first page. |
| `limit` | number | no | Max results per page. Range: 1-100. Default: 50. |
| `includeDeleted` | boolean | no | If false (default), soft-deleted issues SHALL be excluded. |

Soft-deleted issues MUST be excluded from default queries unless `includeDeleted=true`.

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | Paginated issue list | Issues sorted by priority (desc), then creation date (desc). Sub-issues ordered after parent. |

### Pagination Response Schema

```json
{
  "data": [ /* Issue objects */ ],
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
| 429 | Rate limit exceeded | `{ "error": "rate_limited", "retry_after": 60 }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Issue Object Schema

```json
{
  "id": "uuid",
  "identifier": "ENG-123",
  "title": "string",
  "description": "string | null",
  "teamId": "uuid",
  "projectId": "uuid | null",
  "assigneeId": "uuid | null",
  "priority": 0,
  "statusId": "uuid",
  "statusLabel": "Todo",
  "labelIds": ["uuid"],
  "cycleId": "uuid | null",
  "parentId": "uuid | null",
  "sortOrder": 0,
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601",
  "completedAt": "ISO-8601 | null",
  "canceledAt": "ISO-8601 | null",
  "deletedAt": "ISO-8601 | null"
}
```
