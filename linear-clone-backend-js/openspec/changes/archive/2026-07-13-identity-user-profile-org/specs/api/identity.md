# Identity — API Contract

## Endpoint: Get User Profile

- **Method**: GET
- **Path**: `/api/v1/users/me`
- **Auth**: JWT (access token)
- **Rate Limit**: 30 requests/min per user

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| (none) | - | - | - |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ "data": { "user": UserProfileObject } }` | Profile retrieved successfully |

**UserProfileObject:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | User identifier |
| `email` | string | User email (read-only) |
| `name` | string | User display name |
| `avatarUrl` | string \| null | User avatar URL |
| `createdAt` | string (ISO 8601) | Account creation timestamp |
| `updatedAt` | string (ISO 8601) | Last profile update timestamp |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": { "code": "UNAUTHORIZED", "message": "Authentication required" } }` |
| 404 | User not found | `{ "error": { "code": "NOT_FOUND", "message": "User not found" } }` |
| 500 | Internal error | `{ "error": { "code": "SERVER_ERROR", "message": "Internal server error" } }` |

---

## Endpoint: Update User Profile

- **Method**: PATCH
- **Path**: `/api/v1/users/me`
- **Auth**: JWT (access token)
- **Rate Limit**: 10 requests/min per user

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | User display name (min 1, max 255 chars) |
| `avatarUrl` | string \| null | No | User avatar URL (valid URL format) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ "data": { "user": UserProfileObject } }` | Profile updated successfully |

**UserProfileObject:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | User identifier |
| `email` | string | User email (read-only) |
| `name` | string | User display name |
| `avatarUrl` | string \| null | User avatar URL |
| `createdAt` | string (ISO 8601) | Account creation timestamp |
| `updatedAt` | string (ISO 8601) | Last profile update timestamp |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid input | `{ "error": { "code": "VALIDATION_ERROR", "message": "Invalid input", "details": [{ "field": "avatarUrl", "message": "Invalid URL format" }] } }` |
| 401 | Missing/invalid auth | `{ "error": { "code": "UNAUTHORIZED", "message": "Authentication required" } }` |
| 403 | Not owner | `{ "error": { "code": "FORBIDDEN", "message": "Can only update own profile" } }` |
| 404 | User not found | `{ "error": { "code": "NOT_FOUND", "message": "User not found" } }` |
| 500 | Internal error | `{ "error": { "code": "SERVER_ERROR", "message": "Internal server error" } }` |

---

## Endpoint: Create Organization

- **Method**: POST
- **Path**: `/api/v1/organizations`
- **Auth**: JWT (access token)
- **Rate Limit**: 5 requests/min per user

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Organization name (min 1, max 255 chars) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 201 | `{ "data": { "organization": OrganizationObject } }` | Organization created successfully |

**OrganizationObject:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Organization identifier |
| `name` | string | Organization name |
| `createdAt` | string (ISO 8601) | Creation timestamp |
| `updatedAt` | string (ISO 8601) | Last update timestamp |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid input | `{ "error": { "code": "VALIDATION_ERROR", "message": "Invalid input", "details": [{ "field": "name", "message": "Name is required" }] } }` |
| 401 | Missing/invalid auth | `{ "error": { "code": "UNAUTHORIZED", "message": "Authentication required" } }` |
| 409 | Duplicate name | `{ "error": { "code": "CONFLICT", "message": "Organization name already exists" } }` |
| 500 | Internal error | `{ "error": { "code": "SERVER_ERROR", "message": "Internal server error" } }` |

---

## Endpoint: List User Organizations

- **Method**: GET
- **Path**: `/api/v1/organizations`
- **Auth**: JWT (access token)
- **Rate Limit**: 30 requests/min per user

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| (none) | - | - | - |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ "data": { "organizations": OrganizationObject[] } }` | Organizations retrieved successfully |

**OrganizationObject:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Organization identifier |
| `name` | string | Organization name |
| `createdAt` | string (ISO 8601) | Creation timestamp |
| `updatedAt` | string (ISO 8601) | Last update timestamp |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": { "code": "UNAUTHORIZED", "message": "Authentication required" } }` |
| 500 | Internal error | `{ "error": { "code": "SERVER_ERROR", "message": "Internal server error" } }` |

---

## Endpoint: Get Organization Details

- **Method**: GET
- **Path**: `/api/v1/organizations/:organizationId`
- **Auth**: JWT (access token) + organization member
- **Rate Limit**: 30 requests/min per user

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `organizationId` | string (UUID) | Yes | Organization identifier (path param) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ "data": { "organization": OrganizationObject } }` | Organization details retrieved successfully |

**OrganizationObject:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Organization identifier |
| `name` | string | Organization name |
| `createdAt` | string (ISO 8601) | Creation timestamp |
| `updatedAt` | string (ISO 8601) | Last update timestamp |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": { "code": "UNAUTHORIZED", "message": "Authentication required" } }` |
| 403 | Not member | `{ "error": { "code": "FORBIDDEN", "message": "Not an organization member" } }` |
| 404 | Organization not found | `{ "error": { "code": "NOT_FOUND", "message": "Organization not found" } }` |
| 500 | Internal error | `{ "error": { "code": "SERVER_ERROR", "message": "Internal server error" } }` |

---

## Endpoint: Delete Organization

- **Method**: DELETE
- **Path**: `/api/v1/organizations/:organizationId`
- **Auth**: JWT (access token) + organization owner
- **Rate Limit**: 5 requests/min per user

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `organizationId` | string (UUID) | Yes | Organization identifier (path param) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 204 | (no body) | Organization deleted successfully |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": { "code": "UNAUTHORIZED", "message": "Authentication required" } }` |
| 403 | Not owner | `{ "error": { "code": "FORBIDDEN", "message": "Only organization owner can delete" } }` |
| 404 | Organization not found | `{ "error": { "code": "NOT_FOUND", "message": "Organization not found" } }` |
| 500 | Internal error | `{ "error": { "code": "SERVER_ERROR", "message": "Internal server error" } }` |

---

## Response Headers

Every response SHALL include rate limit headers:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests allowed in window |
| `X-RateLimit-Remaining` | Requests remaining in current window |
| `X-RateLimit-Reset` | Unix timestamp when window resets |
