# Issue Comments — API Contract

## Endpoint: List Comments on Issue

- **Method**: GET
- **Path**: `/issues/:id/comments`
- **Auth**: JWT (Bearer token)
- **Rate Limit**: 120 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Issue ID (path param) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ data: Comment[] }` | List of comments on the issue, ordered by `createdAt` ascending |

### Errors

| Code | Condition |
|------|-----------|
| 401 | Missing or invalid auth token |
| 404 | Issue not found |

---

## Endpoint: Create Comment

- **Method**: POST
- **Path**: `/issues/:id/comments`
- **Auth**: JWT (Bearer token)
- **Rate Limit**: 60 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Issue ID (path param) |
| `body` | string (max 65535) | Yes | Comment content in markdown |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 201 | `{ data: Comment }` | Created comment |

### Errors

| Code | Condition |
|------|-----------|
| 400 | Validation error (empty body, too long) |
| 401 | Missing or invalid auth token |
| 404 | Issue not found |
| 422 | User not a team member |

---

## Endpoint: Update Comment

- **Method**: PATCH
- **Path**: `/issues/:id/comments/:commentId`
- **Auth**: JWT (Bearer token)
- **Rate Limit**: 60 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Issue ID (path param) |
| `commentId` | UUID | Yes | Comment ID (path param) |
| `body` | string (max 65535) | Yes | Updated comment content |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ data: Comment }` | Updated comment |

### Errors

| Code | Condition |
|------|-----------|
| 400 | Validation error |
| 401 | Missing or invalid auth token |
| 403 | User is not the comment author |
| 404 | Issue or comment not found |

---

## Endpoint: Delete Comment

- **Method**: DELETE
- **Path**: `/issues/:id/comments/:commentId`
- **Auth**: JWT (Bearer token)
- **Rate Limit**: 30 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Issue ID (path param) |
| `commentId` | UUID | Yes | Comment ID (path param) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 204 | No content | Comment soft-deleted successfully |

### Errors

| Code | Condition |
|------|-----------|
| 401 | Missing or invalid auth token |
| 403 | User is not the comment author |
| 404 | Issue or comment not found |

---

## Data Schema: Comment

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique identifier |
| `issueId` | UUID | Parent issue |
| `userId` | UUID | Author |
| `body` | string | Markdown content |
| `createdAt` | ISO 8601 | Creation timestamp |
| `updatedAt` | ISO 8601 | Last update timestamp |
| `deletedAt` | ISO 8601 or null | Soft-delete timestamp |
