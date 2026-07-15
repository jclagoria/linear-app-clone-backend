# Issue Watchers — API Contract

## Endpoint: List Issue Watchers

- **Method**: GET
- **Path**: `/issues/:id/watchers`
- **Auth**: JWT (Bearer token)
- **Rate Limit**: 120 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Issue ID (path param) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ data: Watcher[] }` | Users watching the issue |

### Errors

| Code | Condition |
|------|-----------|
| 401 | Missing or invalid auth token |
| 404 | Issue not found |

---

## Endpoint: Add Watcher to Issue

- **Method**: POST
- **Path**: `/issues/:id/watchers`
- **Auth**: JWT (Bearer token)
- **Rate Limit**: 60 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Issue ID (path param) |
| `userId` | UUID | No | User to add (defaults to authenticated user) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 201 | `{ data: Watcher }` | Watcher added |

### Errors

| Code | Condition |
|------|-----------|
| 400 | Validation error |
| 401 | Missing or invalid auth token |
| 404 | Issue not found |
| 409 | User is already watching this issue |
| 422 | User not a team member |

---

## Endpoint: Remove Watcher from Issue

- **Method**: DELETE
- **Path**: `/issues/:id/watchers/:userId`
- **Auth**: JWT (Bearer token)
- **Rate Limit**: 60 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Issue ID (path param) |
| `userId` | UUID | Yes | User ID (path param, defaults to authenticated user if omitted) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 204 | No content | Watcher removed |

### Errors

| Code | Condition |
|------|-----------|
| 401 | Missing or invalid auth token |
| 404 | Issue or watcher link not found |

---

## Data Schema: Watcher (junction)

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `issueId` | UUID | Issue reference |
| `userId` | UUID | User reference |
| `createdAt` | ISO 8601 | Creation timestamp |
