# Notifications — API Contract

## Endpoint: List notifications

- **Method**: GET
- **Path**: `/api/v1/notifications`
- **Auth**: JWT (required)
- **Rate Limit**: 60/min per user

### Query Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `filter` | `"read" \| "unread"` | No | Filter by read status |
| `cursor` | `string` | No | Pagination cursor |
| `limit` | `integer` | No | Max results (default 20, max 100) |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `NotificationListResponse` | Paginated list of notifications |

**`NotificationListResponse`:**

```json
{
  "data": [
    {
      "id": "uuid",
      "type": "issue_assigned",
      "title": "You were assigned to ENG-123",
      "body": "You have been assigned to 'Fix login bug'",
      "link": "/issues/ENG-123",
      "readAt": "2026-07-15T10:00:00Z",
      "createdAt": "2026-07-15T09:00:00Z"
    }
  ],
  "unreadCount": 5,
  "pagination": {
    "hasMore": false,
    "nextCursor": null
  }
}
```

**Notification Types (`type`):**
- `issue_assigned`
- `issue_mentioned`
- `comment_added`
- `statusChanged`
- `cycle_started`
- `cycle_completed`

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 422 | Invalid filter value | `{ "error": "unprocessable" }` |
| 429 | Rate limit exceeded | `{ "error": "rate_limited", "retry_after": 60 }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: Mark notification as read

- **Method**: PATCH
- **Path**: `/api/v1/notifications/:id/read`
- **Auth**: JWT (required)
- **Rate Limit**: 60/min per user

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| (path) `id` | UUID | Yes | Notification ID |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ "success": true }` | Notification marked as read |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 404 | Notification not found | `{ "error": "not_found" }` |
| 429 | Rate limit exceeded | `{ "error": "rate_limited", "retry_after": 60 }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

**Idempotent:** Calling this endpoint on an already-read notification SHALL return 200 without error.

---

## Endpoint: Mark all notifications as read

- **Method**: PATCH
- **Path**: `/api/v1/notifications/read-all`
- **Auth**: JWT (required)
- **Rate Limit**: 10/min per user

### Request

No body required.

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `{ "success": true, "updatedCount": 5 }` | All notifications marked as read |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 429 | Rate limit exceeded | `{ "error": "rate_limited", "retry_after": 60 }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

**Behavior:** SHALL set `readAt` timestamp on every unread notification belonging to the authenticated user. Returns count of updated rows.

---

## Endpoint: Get notification preferences

- **Method**: GET
- **Path**: `/api/v1/notifications/preferences`
- **Auth**: JWT (required)
- **Rate Limit**: 60/min per user

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `NotificationPreferences` | Current user preferences |

**`NotificationPreferences`:**

```json
{
  "inApp": true,
  "email": false,
  "types": {
    "issue_assigned": true,
    "issue_mentioned": true,
    "comment_added": true,
    "statusChanged": true,
    "cycle_started": true,
    "cycle_completed": true
  }
}
```

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## Endpoint: Update notification preferences

- **Method**: PATCH
- **Path**: `/api/v1/notifications/preferences`
- **Auth**: JWT (required)
- **Rate Limit**: 30/min per user

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `inApp` | `boolean` | No | Enable/disable in-app notifications |
| `email` | `boolean` | No | Enable/disable email notifications |
| `types` | `object` | No | Per-type toggle map |

### Response

| Status | Schema | Description |
|--------|--------|-------------|
| 200 | `NotificationPreferences` | Updated preferences |

### Errors

| Code | Condition | Response |
|------|-----------|----------|
| 400 | Invalid preference value | `{ "error": "validation_failed", "details": [...] }` |
| 401 | Missing/invalid auth | `{ "error": "unauthorized" }` |
| 429 | Rate limit exceeded | `{ "error": "rate_limited", "retry_after": 60 }` |
| 500 | Internal error | `{ "error": "internal_error" }` |

---

## WebSocket Events (Notification Delivery)

Notifications are delivered to the authenticated user's WebSocket connection via the Gateway module.

### Event: `notification:new`

```json
{
  "type": "notification:new",
  "payload": {
    "id": "uuid",
    "type": "issue_assigned",
    "title": "You were assigned to ENG-123",
    "body": "You have been assigned to 'Fix login bug'",
    "link": "/issues/ENG-123",
    "createdAt": "2026-07-15T09:00:00Z"
  }
}
```

**Delivery:** Best-effort via the `user:{userId}` channel. If the user is offline when the notification is created, the event is not retried — the notification is stored and available on next connection via GET `/api/v1/notifications`.

### Event: `notification:read`

```json
{
  "type": "notification:read",
  "payload": {
    "id": "uuid",
    "readAt": "2026-07-15T10:00:00Z"
  }
}
```

Broadcast when a notification is marked as read (single or all), for the Gateway to update unread counts in real-time.
