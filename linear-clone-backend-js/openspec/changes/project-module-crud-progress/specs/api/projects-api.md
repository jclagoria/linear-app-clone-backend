# Project Module — API Contract

## Base Path

All endpoints are prefixed with `/api/v1`.

## Common Auth

- **Auth**: JWT Bearer token in `Authorization` header
- **Rate Limit**: 60 requests per minute per user

---

## Endpoint: Create Project

- **Method**: POST
- **Path**: `/api/v1/projects`
- **Auth**: JWT required
- **Rate Limit**: 30/min

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `teamId` | string (UUID) | YES | Team the project belongs to |
| `name` | string (1-255) | YES | Project name |
| `description` | string | NO | Project description |
| `startDate` | string (ISO 8601 date) | NO | Project start date |
| `targetDate` | string (ISO 8601 date) | NO | Project target completion date |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 201 | `ProjectResponse` | Project created successfully |

### Errors

| Code | Condition |
|------|-----------|
| 400 | Invalid input (missing name, empty name, invalid dates) |
| 401 | Missing/invalid auth |
| 403 | User is not a member of the specified team |
| 422 | Target date is before start date |

---

## Endpoint: List Projects

- **Method**: GET
- **Path**: `/api/v1/projects`
- **Auth**: JWT required
- **Rate Limit**: 60/min

### Query Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `teamId` | string (UUID) | YES | Filter by team |
| `status` | string | NO | Filter by status name |
| `cursor` | string (base64) | NO | Pagination cursor |
| `limit` | integer (1-100) | NO | Page size (default: 20) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `PaginatedProjectsResponse` | List of projects |

### Errors

| Code | Condition |
|------|-----------|
| 401 | Missing/invalid auth |
| 403 | User is not a member of the specified team |

---

## Endpoint: Get Project

- **Method**: GET
- **Path**: `/api/v1/projects/:projectId`
- **Auth**: JWT required
- **Rate Limit**: 60/min

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `ProjectResponse` | Project details with progress |

### Errors

| Code | Condition |
|------|-----------|
| 401 | Missing/invalid auth |
| 403 | User is not a member of the project's team |
| 404 | Project not found |

---

## Endpoint: Update Project

- **Method**: PATCH
- **Path**: `/api/v1/projects/:projectId`
- **Auth**: JWT required
- **Rate Limit**: 30/min

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string (1-255) | NO | Project name |
| `description` | string | NO | Project description |
| `startDate` | string (ISO 8601) | NO | Project start date |
| `targetDate` | string (ISO 8601) | NO | Project target date |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `ProjectResponse` | Project updated successfully |

### Errors

| Code | Condition |
|------|-----------|
| 400 | Invalid input (empty name, invalid dates) |
| 401 | Missing/invalid auth |
| 403 | User is not a member of the project's team |
| 404 | Project not found |
| 422 | Target date is before start date |

---

## Endpoint: Change Project Status

- **Method**: PATCH
- **Path**: `/api/v1/projects/:projectId/status`
- **Auth**: JWT required
- **Rate Limit**: 30/min

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string (enum) | YES | New status: `planned`, `in_progress`, `completed`, `canceled` |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `ProjectResponse` | Status updated successfully |

### Errors

| Code | Condition |
|------|-----------|
| 400 | Invalid status value |
| 401 | Missing/invalid auth |
| 403 | User is not a team admin (cancel requires admin); invalid transition |
| 404 | Project not found |
| 422 | Cannot reopen completed project |

---

## Endpoint: Get Project Progress

- **Method**: GET
- **Path**: `/api/v1/projects/:projectId/progress`
- **Auth**: JWT required
- **Rate Limit**: 60/min

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `ProjectProgressResponse` | Progress calculation |

### Errors

| Code | Condition |
|------|-----------|
| 401 | Missing/invalid auth |
| 403 | User is not a member of the project's team |
| 404 | Project not found |

---

## Endpoint: Add Issue to Project

- **Method**: POST
- **Path**: `/api/v1/projects/:projectId/issues`
- **Auth**: JWT required
- **Rate Limit**: 30/min

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `issueId` | string (UUID) | YES | ID of the issue to associate |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `ProjectResponse` | Issue associated successfully |

### Errors

| Code | Condition |
|------|-----------|
| 400 | Missing issueId |
| 401 | Missing/invalid auth |
| 403 | Issue and project belong to different teams |
| 404 | Project or issue not found |
| 409 | Issue already associated with a different project |

---

## Endpoint: Remove Issue from Project

- **Method**: DELETE
- **Path**: `/api/v1/projects/:projectId/issues/:issueId`
- **Auth**: JWT required
- **Rate Limit**: 30/min

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `ProjectResponse` | Issue disassociated successfully |

### Errors

| Code | Condition |
|------|-----------|
| 401 | Missing/invalid auth |
| 403 | User is not a member of the project's team |
| 404 | Project or issue not found, or issue not associated with this project |

---

## Schemas

### ProjectResponse

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Project ID |
| `teamId` | string (UUID) | Team ID |
| `name` | string | Project name |
| `description` | string | Project description |
| `status` | string | Current status |
| `startDate` | string | Start date |
| `targetDate` | string | Target date |
| `progress` | integer | Progress percentage (0-100) |
| `issueCount` | integer | Total issue count |
| `completedIssueCount` | integer | Completed issue count |
| `createdAt` | string (ISO 8601) | Creation timestamp |
| `updatedAt` | string (ISO 8601) | Last update timestamp |

### PaginatedProjectsResponse

| Field | Type | Description |
|-------|------|-------------|
| `data` | `ProjectResponse[]` | Array of projects |
| `nextCursor` | string | Cursor for next page |
| `hasMore` | boolean | Whether more results exist |

### ProjectProgressResponse

| Field | Type | Description |
|-------|------|-------------|
| `projectId` | string (UUID) | Project ID |
| `totalIssues` | integer | Total number of issues |
| `completedIssues` | integer | Number of completed issues |
| `progress` | integer | Progress percentage (0-100) |
