# Labels — API Contract

## Endpoint: List Labels

- **Method**: GET
- **Path**: `/labels`
- **Auth**: JWT (Bearer token)
- **Rate Limit**: 120 req/min

### Request

No parameters.

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ data: Label[] }` | All workspace labels |

### Errors

| Code | Condition |
|------|-----------|
| 401 | Missing or invalid auth token |

---

## Endpoint: Create Label

- **Method**: POST
- **Path**: `/labels`
- **Auth**: JWT (Bearer token)
- **Rate Limit**: 60 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string (max 100) | Yes | Label display name |
| `description` | string (max 500) | No | Optional description |
| `color` | string (hex) | No | Optional hex color |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 201 | `{ data: Label }` | Created label |

### Errors

| Code | Condition |
|------|-----------|
| 400 | Validation error |
| 401 | Missing or invalid auth token |
| 409 | Label name already exists |

---

## Endpoint: Update Label

- **Method**: PATCH
- **Path**: `/labels/:id`
- **Auth**: JWT (Bearer token)
- **Rate Limit**: 60 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Label ID (path param) |
| `name` | string (max 100) | No | Updated name |
| `description` | string (max 500) | No | Updated description |
| `color` | string (hex) | No | Updated color |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ data: Label }` | Updated label |

### Errors

| Code | Condition |
|------|-----------|
| 400 | Validation error |
| 401 | Missing or invalid auth token |
| 404 | Label not found |
| 409 | Label name conflicts with existing label |

---

## Endpoint: Delete Label

- **Method**: DELETE
- **Path**: `/labels/:id`
- **Auth**: JWT (Bearer token)
- **Rate Limit**: 30 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Label ID (path param) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 204 | No content | Label soft-deleted successfully |

### Errors

| Code | Condition |
|------|-----------|
| 401 | Missing or invalid auth token |
| 404 | Label not found |

---

## Endpoint: Get Issue Labels

- **Method**: GET
- **Path**: `/issues/:id/labels`
- **Auth**: JWT (Bearer token)
- **Rate Limit**: 120 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Issue ID (path param) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ data: Label[] }` | Labels attached to the issue |

### Errors

| Code | Condition |
|------|-----------|
| 401 | Missing or invalid auth token |
| 404 | Issue not found |

---

## Endpoint: Attach Label to Issue

- **Method**: POST
- **Path**: `/issues/:id/labels`
- **Auth**: JWT (Bearer token)
- **Rate Limit**: 60 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Issue ID (path param) |
| `labelId` | UUID | Yes | Label ID to attach |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 201 | `{ data: IssueLabel }` | Link created |

### Errors

| Code | Condition |
|------|-----------|
| 400 | Validation error |
| 401 | Missing or invalid auth token |
| 404 | Issue or label not found |
| 409 | Label already attached to issue |

---

## Endpoint: Detach Label from Issue

- **Method**: DELETE
- **Path**: `/issues/:id/labels/:labelId`
- **Auth**: JWT (Bearer token)
- **Rate Limit**: 60 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Issue ID (path param) |
| `labelId` | UUID | Yes | Label ID (path param) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 204 | No content | Label detached from issue |

### Errors

| Code | Condition |
|------|-----------|
| 401 | Missing or invalid auth token |
| 404 | Issue, label, or link not found |

---

## Data Schema: Label

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `name` | string | Display name (unique) |
| `description` | string or null | Optional description |
| `color` | string or null | Hex color code |
| `createdAt` | ISO 8601 | Creation timestamp |
| `updatedAt` | ISO 8601 | Last update timestamp |
| `deletedAt` | ISO 8601 or null | Soft-delete timestamp |

## Data Schema: IssueLabel (junction)

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `issueId` | UUID | Issue reference |
| `labelId` | UUID | Label reference |
| `createdAt` | ISO 8601 | Creation timestamp |
