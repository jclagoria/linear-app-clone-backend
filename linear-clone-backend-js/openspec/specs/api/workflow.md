# Workflow Module — API Contract

## Endpoint: List Workflow States

- **Method**: GET
- **Path**: `/api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/states`
- **Auth**: JWT
- **Rate Limit**: 120 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| workspaceId | string (uuid) | YES | Workspace identifier |
| teamId | string (uuid) | YES | Team identifier |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ "data": WorkflowState[], "total": number }` | Array of workflow states ordered by position |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid input | `{ "error": "validation_failed", "details": [...] }` |
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 403 | Insufficient permissions | `{ "error": "forbidden" }` |
| 404 | Resource not found | `{ "error": "not_found" }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: Create Workflow State

- **Method**: POST
- **Path**: `/api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/states`
- **Auth**: JWT
- **Rate Limit**: 30 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| workspaceId | string (uuid) | YES | Workspace identifier |
| teamId | string (uuid) | YES | Team identifier |
| name | string (1-100) | YES | Display name of the state |
| type | enum | YES | One of: `unstarted`, `in_progress`, `completed`, `canceled` |
| position | number | NO | Sort order among states of same team |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 201 | `{ "data": WorkflowState }` | Created workflow state |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid input | `{ "error": "validation_failed", "details": [...] }` |
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 403 | Insufficient permissions | `{ "error": "forbidden" }` |
| 409 | Duplicate state name | `{ "error": "conflict", "details": "state_name_taken" }` |
| 422 | Invalid type value | `{ "error": "unprocessable", "details": [...] }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: Update Workflow State

- **Method**: PUT
- **Path**: `/api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/states/{stateId}`
- **Auth**: JWT
- **Rate Limit**: 30 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| workspaceId | string (uuid) | YES | Workspace identifier |
| teamId | string (uuid) | YES | Team identifier |
| stateId | string (uuid) | YES | Workflow state identifier |
| name | string (1-100) | NO | Display name |
| type | enum | NO | One of: `unstarted`, `in_progress`, `completed`, `canceled` |
| position | number | NO | Sort order |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ "data": WorkflowState }` | Updated workflow state |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid input | `{ "error": "validation_failed", "details": [...] }` |
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 403 | Insufficient permissions | `{ "error": "forbidden" }` |
| 404 | State not found | `{ "error": "not_found" }` |
| 409 | Duplicate state name | `{ "error": "conflict", "details": "state_name_taken" }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: Delete Workflow State

- **Method**: DELETE
- **Path**: `/api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/states/{stateId}`
- **Auth**: JWT
- **Rate Limit**: 15 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| workspaceId | string (uuid) | YES | Workspace identifier |
| teamId | string (uuid) | YES | Team identifier |
| stateId | string (uuid) | YES | Workflow state identifier |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 204 | No content | State deleted successfully |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 403 | Insufficient permissions | `{ "error": "forbidden" }` |
| 404 | State not found | `{ "error": "not_found" }` |
| 409 | State in use by transitions | `{ "error": "conflict", "details": "state_in_use" }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: List Workflow Transitions

- **Method**: GET
- **Path**: `/api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/transitions`
- **Auth**: JWT
- **Rate Limit**: 120 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| workspaceId | string (uuid) | YES | Workspace identifier |
| teamId | string (uuid) | YES | Team identifier |
| fromStateId | string (uuid) | NO | Filter by source state |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ "data": WorkflowTransition[] }` | Array of transitions |

---

## Endpoint: Create Workflow Transition

- **Method**: POST
- **Path**: `/api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/transitions`
- **Auth**: JWT
- **Rate Limit**: 30 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| workspaceId | string (uuid) | YES | Workspace identifier |
| teamId | string (uuid) | YES | Team identifier |
| fromStateId | string (uuid) | YES | Source state identifier |
| toStateId | string (uuid) | YES | Destination state identifier |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 201 | `{ "data": WorkflowTransition }` | Created transition rule |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid input | `{ "error": "validation_failed", "details": [...] }` |
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 403 | Insufficient permissions | `{ "error": "forbidden" }` |
| 404 | fromStateId or toStateId not found | `{ "error": "not_found" }` |
| 409 | Duplicate transition | `{ "error": "conflict", "details": "transition_exists" }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: Delete Workflow Transition

- **Method**: DELETE
- **Path**: `/api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/transitions/{transitionId}`
- **Auth**: JWT
- **Rate Limit**: 15 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| workspaceId | string (uuid) | YES | Workspace identifier |
| teamId | string (uuid) | YES | Team identifier |
| transitionId | string (uuid) | YES | Transition identifier |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 204 | No content | Transition deleted successfully |

---

## Endpoint: Validate Transition

- **Method**: POST
- **Path**: `/api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/validate-transition`
- **Auth**: JWT
- **Rate Limit**: 60 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| workspaceId | string (uuid) | YES | Workspace identifier |
| teamId | string (uuid) | YES | Team identifier |
| issueId | string (uuid) | YES | Issue to validate transition for |
| toStateId | string (uuid) | YES | Target state identifier |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ "data": { "valid": boolean, "fromState": WorkflowState, "toState": WorkflowState, "reason": string\|null } }` | Validation result |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid input | `{ "error": "validation_failed", "details": [...] }` |
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 404 | Issue or state not found | `{ "error": "not_found" }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: Get State History

- **Method**: GET
- **Path**: `/api/v1/issues/{issueId}/workflow/history`
- **Auth**: JWT
- **Rate Limit**: 60 req/min

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| issueId | string (uuid) | YES | Issue identifier |
| cursor | string | NO | Pagination cursor |
| limit | number (1-100) | NO | Page size (default: 50) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ "data": StateHistoryEntry[], "nextCursor": string\|null }` | Append-only state history, newest first |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 404 | Issue not found | `{ "error": "not_found" }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Shared Schemas

### WorkflowState

```json
{
  "id": "uuid",
  "teamId": "uuid",
  "name": "string",
  "type": "unstarted | in_progress | completed | canceled",
  "position": "number",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### WorkflowTransition

```json
{
  "id": "uuid",
  "fromStateId": "uuid",
  "toStateId": "uuid",
  "createdAt": "ISO8601"
}
```

### StateHistoryEntry

```json
{
  "id": "uuid",
  "issueId": "uuid",
  "fromStateId": "uuid | null",
  "toStateId": "uuid",
  "userId": "uuid",
  "createdAt": "ISO8601"
}
```
