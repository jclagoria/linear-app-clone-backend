# Team — API Contract

## Endpoint: Create Team

- **Method**: POST
- **Path**: `/api/v1/organizations/:organizationId/teams`
- **Auth**: JWT (access token) + organization member
- **Rate Limit**: 10 requests/min per user

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Team name (min 1, max 255 chars) |
| `key` | string | Yes | Team key — issue prefix (e.g., "ENG"), uppercase alpha, min 1, max 10 chars |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 201 | `{ "data": { "team": TeamObject } }` | Team created successfully |

**TeamObject:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Team identifier |
| `organizationId` | string (UUID) | Parent organization identifier |
| `name` | string | Team name |
| `key` | string | Team key for issue prefixes |
| `memberCount` | integer | Number of team members |
| `createdAt` | string (ISO 8601) | Creation timestamp |
| `updatedAt` | string (ISO 8601) | Last update timestamp |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid input | `{ "error": { "code": "VALIDATION_ERROR", "message": "Invalid input", "details": [...] } }` |
| 401 | Missing/invalid auth | `{ "error": { "code": "UNAUTHORIZED", "message": "Authentication required" } }` |
| 403 | Not org member | `{ "error": { "code": "FORBIDDEN", "message": "Not an organization member" } }` |
| 404 | Organization not found | `{ "error": { "code": "NOT_FOUND", "message": "Organization not found" } }` |
| 409 | Duplicate key | `{ "error": { "code": "CONFLICT", "message": "Team key already exists in this organization" } }` |
| 500 | Internal error | `{ "error": { "code": "SERVER_ERROR", "message": "Internal server error" } }` |

---

## Endpoint: List Teams

- **Method**: GET
- **Path**: `/api/v1/organizations/:organizationId/teams`
- **Auth**: JWT (access token) + organization member
- **Rate Limit**: 30 requests/min per user

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `organizationId` | string (UUID) | Yes | Organization identifier (path param) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ "data": { "teams": TeamObject[] } }` | Teams retrieved successfully |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": { "code": "UNAUTHORIZED", "message": "Authentication required" } }` |
| 403 | Not org member | `{ "error": { "code": "FORBIDDEN", "message": "Not an organization member" } }` |
| 404 | Organization not found | `{ "error": { "code": "NOT_FOUND", "message": "Organization not found" } }` |
| 500 | Internal error | `{ "error": { "code": "SERVER_ERROR", "message": "Internal server error" } }` |

---

## Endpoint: Get Team Details

- **Method**: GET
- **Path**: `/api/v1/teams/:teamId`
- **Auth**: JWT (access token) + team member
- **Rate Limit**: 30 requests/min per user

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `teamId` | string (UUID) | Yes | Team identifier (path param) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ "data": { "team": TeamObject } }` | Team details retrieved successfully |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": { "code": "UNAUTHORIZED", "message": "Authentication required" } }` |
| 403 | Not team member | `{ "error": { "code": "FORBIDDEN", "message": "Not a team member" } }` |
| 404 | Team not found | `{ "error": { "code": "NOT_FOUND", "message": "Team not found" } }` |
| 500 | Internal error | `{ "error": { "code": "SERVER_ERROR", "message": "Internal server error" } }` |

---

## Endpoint: Delete Team

- **Method**: DELETE
- **Path**: `/api/v1/teams/:teamId`
- **Auth**: JWT (access token) + team admin
- **Rate Limit**: 5 requests/min per user

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `teamId` | string (UUID) | Yes | Team identifier (path param) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 204 | (no body) | Team deleted successfully |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": { "code": "UNAUTHORIZED", "message": "Authentication required" } }` |
| 403 | Not team admin | `{ "error": { "code": "FORBIDDEN", "message": "Only team admins can delete the team" } }` |
| 404 | Team not found | `{ "error": { "code": "NOT_FOUND", "message": "Team not found" } }` |
| 500 | Internal error | `{ "error": { "code": "SERVER_ERROR", "message": "Internal server error" } }` |

---

## Endpoint: List Team Members

- **Method**: GET
- **Path**: `/api/v1/teams/:teamId/members`
- **Auth**: JWT (access token) + team member
- **Rate Limit**: 30 requests/min per user

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `teamId` | string (UUID) | Yes | Team identifier (path param) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ "data": { "members": TeamMemberObject[] } }` | Members retrieved successfully |

**TeamMemberObject:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Membership identifier |
| `userId` | string (UUID) | User identifier |
| `name` | string | User display name |
| `email` | string | User email |
| `role` | string | Member role (`admin`, `member`) |
| `joinedAt` | string (ISO 8601) | When user joined the team |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": { "code": "UNAUTHORIZED", "message": "Authentication required" } }` |
| 403 | Not team member | `{ "error": { "code": "FORBIDDEN", "message": "Not a team member" } }` |
| 404 | Team not found | `{ "error": { "code": "NOT_FOUND", "message": "Team not found" } }` |
| 500 | Internal error | `{ "error": { "code": "SERVER_ERROR", "message": "Internal server error" } }` |

---

## Endpoint: Add Team Member

- **Method**: POST
- **Path**: `/api/v1/teams/:teamId/members`
- **Auth**: JWT (access token) + team admin
- **Rate Limit**: 10 requests/min per user

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `teamId` | string (UUID) | Yes | Team identifier (path param) |
| `userId` | string (UUID) | Yes | User identifier to add |
| `role` | string | No | Member role (`member` by default, or `admin`) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 201 | `{ "data": { "member": TeamMemberObject } }` | Member added successfully |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid input | `{ "error": { "code": "VALIDATION_ERROR", "message": "Invalid input", "details": [...] } }` |
| 401 | Missing/invalid auth | `{ "error": { "code": "UNAUTHORIZED", "message": "Authentication required" } }` |
| 403 | Not team admin | `{ "error": { "code": "FORBIDDEN", "message": "Only team admins can manage members" } }` |
| 404 | Team or user not found | `{ "error": { "code": "NOT_FOUND", "message": "Team or user not found" } }` |
| 409 | Already a member | `{ "error": { "code": "CONFLICT", "message": "User is already a team member" } }` |
| 422 | User not org member | `{ "error": { "code": "BUSINESS_RULE_ERROR", "message": "User is not a member of the organization" } }` |
| 500 | Internal error | `{ "error": { "code": "SERVER_ERROR", "message": "Internal server error" } }` |

---

## Endpoint: Remove Team Member

- **Method**: DELETE
- **Path**: `/api/v1/teams/:teamId/members/:userId`
- **Auth**: JWT (access token) + team admin
- **Rate Limit**: 10 requests/min per user

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `teamId` | string (UUID) | Yes | Team identifier (path param) |
| `userId` | string (UUID) | Yes | User identifier to remove (path param) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 204 | (no body) | Member removed successfully |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": { "code": "UNAUTHORIZED", "message": "Authentication required" } }` |
| 403 | Not team admin | `{ "error": { "code": "FORBIDDEN", "message": "Only team admins can manage members" } }` |
| 404 | Team or membership not found | `{ "error": { "code": "NOT_FOUND", "message": "Team or membership not found" } }` |
| 422 | Cannot remove last admin | `{ "error": { "code": "BUSINESS_RULE_ERROR", "message": "Cannot remove the last team admin" } }` |
| 500 | Internal error | `{ "error": { "code": "SERVER_ERROR", "message": "Internal server error" } }` |

---

## Response Headers

Every response SHALL include rate limit headers:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests allowed in window |
| `X-RateLimit-Remaining` | Requests remaining in current window |
| `X-RateLimit-Reset` | Unix timestamp when window resets |
