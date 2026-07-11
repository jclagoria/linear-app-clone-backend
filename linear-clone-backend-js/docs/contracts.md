# Module Contracts & Interactions

> Define how backend and frontend modules communicate and interact.

---

## 1. Communication Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │    Auth     │  │    API      │  │  Realtime   │           │
│  │   Module    │  │   Module    │  │   Module    │           │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘           │
└─────────┼────────────────┼────────────────┼─────────────────────┘
          │                │                │
          │ HTTP           │ HTTP           │ WebSocket
          │                │                │
┌─────────┼────────────────┼────────────────┼─────────────────────┐
│         ▼                ▼                ▼                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │    Auth     │  │   Gateway   │  │  Gateway    │           │
│  │   Module    │  │   Module    │  │   Module    │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│                        BACKEND                                 │
└─────────────────────────────────────────────────────────────────┘
```

> **Note:** The backend has a single **Gateway Module** that handles all WebSocket/realtime functionality (connection management, event broadcasting, channel subscriptions). The frontend's **Realtime Module** communicates with the backend's **Gateway Module** over WebSocket.

---

## 2. API Contract

### 2.1 Request Format

```
POST /api/v1/issues
Content-Type: application/json
Authorization: Bearer <access-token>

{
  "teamId": "uuid",
  "title": "Fix login bug",
  "description": "Users cannot login with special characters",
  "priority": 2,
  "assigneeId": "uuid",
  "labelIds": ["uuid", "uuid"]
}
```

### 2.2 Response Format

**Success (2xx):**
```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "uuid"
  }
}
```

**Error (4xx/5xx):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "title", "message": "Title is required" }
    ]
  }
}
```

**Paginated:**
```json
{
  "data": [...],
  "pagination": {
    "cursor": "base64-encoded-cursor",
    "hasMore": true,
    "total": 150
  }
}
```

---

## 3. Authentication Contract

### 3.1 Login Request/Response

```
Request:
  POST /api/v1/auth/login
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }

Response (200):
  {
    "data": {
      "user": {
        "id": "uuid",
        "email": "user@example.com",
        "name": "John Doe"
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
```

### 3.2 Token Refresh Contract

```
Request:
  POST /api/v1/auth/refresh
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }

Response (200):
  {
    "data": {
      "accessToken": "new-access-token",
      "refreshToken": "new-refresh-token"
    }
  }

Response (401):
  {
    "error": {
      "code": "INVALID_TOKEN",
      "message": "Refresh token is invalid or expired"
    }
  }
```

### 3.3 Authenticated Request

```
Request:
  GET /api/v1/issues?teamId=uuid
  Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response (200):
  {
    "data": [...]
  }

Response (401):
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Invalid or expired token"
    }
  }
```

---

## 4. Module Interaction Contracts

### 4.1 Auth Module Interactions

| Frontend Action | Backend Module | Event/Data |
|-----------------|----------------|------------|
| Login | Auth Module | POST /auth/login |
| Register | Auth Module | POST /auth/register |
| Refresh Token | Auth Module | POST /auth/refresh |
| Logout | Auth Module | POST /auth/logout |
| Check Auth | Auth Module | Token validation |

**Frontend Auth Module → Backend Auth Module:**
```
Login:
  Input: { email, password }
  Output: { user, accessToken, refreshToken }

Refresh:
  Input: { refreshToken }
  Output: { accessToken, refreshToken }

Logout:
  Input: { refreshToken }
  Output: { success }
```

---

### 4.2 Identity Module Interactions

| Frontend Action | Backend Module | Event/Data |
|-----------------|----------------|------------|
| Get Profile | Identity Module | GET /users/me |
| Update Profile | Identity Module | PATCH /users/me |
| Create Org | Identity Module | POST /organizations |
| Create Team | Identity Module | POST /teams |
| Add Member | Identity Module | POST /teams/:id/members |

**Frontend → Backend Identity:**
```
Get User:
  Input: { userId }
  Output: { user }

Create Team:
  Input: { organizationId, name, key }
  Output: { team }

Add Team Member:
  Input: { teamId, userId }
  Output: { membership }
```

---

### 4.3 Work Module Interactions

| Frontend Action | Backend Module | Event/Data |
|-----------------|----------------|------------|
| List Issues | Work Module | GET /issues |
| Create Issue | Work Module | POST /issues |
| Update Issue | Work Module | PATCH /issues/:id |
| Delete Issue | Work Module | DELETE /issues/:id |
| Change Status | Work Module | PATCH /issues/:id/status |
| Assign Issue | Work Module | PATCH /issues/:id/assign |
| Add Comment | Work Module | POST /issues/:id/comments |

**Frontend → Backend Work:**
```
List Issues:
  Input: { teamId, status?, assigneeId?, cursor?, limit? }
  Output: { issues[], pagination }

Create Issue:
  Input: { teamId, title, description?, assigneeId?, priority?, labelIds? }
  Output: { issue }

Change Status:
  Input: { issueId, status }
  Output: { issue }

Add Comment:
  Input: { issueId, body }
  Output: { comment }
```

---

### 4.4 Realtime Contract

**WebSocket Connection:**
```
Connection:
  URL: ws://localhost:3000
  Auth: Token sent in first message

Messages (Client → Server):
  { type: "authenticate", token: "jwt-token" }
  { type: "subscribe", channel: "team:uuid" }
  { type: "unsubscribe", channel: "team:uuid" }
  { type: "ping" }

Messages (Server → Client):
  { type: "authenticated", userId: "uuid" }
  { type: "event", channel: "team:uuid", event: "issue.created", data: {...} }
  { type: "pong" }
  { type: "error", message: "..." }
```

**Event Types:**
```typescript
interface RealtimeEvent {
  type: string;           // Event type (issue.created, etc.)
  channel: string;        // Channel (team:uuid, issue:uuid)
  data: any;             // Event payload
  timestamp: string;     // ISO timestamp
  userId: string;        // User who triggered event
}
```

**Event Channels:**
| Channel | Scope | Events |
|---------|-------|--------|
| `team:{teamId}` | All team members | issue.*, cycle.* |
| `issue:{issueId}` | Issue watchers | comment.*, statusChanged |
| `user:{userId}` | Specific user | notification.*, assignment |

---

### 4.5 Project Module Interactions

| Frontend Action | Backend Module | Event/Data |
|-----------------|----------------|------------|
| List Projects | Project Module | GET /projects |
| Create Project | Project Module | POST /projects |
| Update Project | Project Module | PATCH /projects/:id |
| Get Progress | Project Module | GET /projects/:id |

**Frontend → Backend Project:**
```
List Projects:
  Input: { teamId }
  Output: { projects[] }

Create Project:
  Input: { teamId, name, description?, startDate?, targetDate? }
  Output: { project }

Get Progress:
  Input: { projectId }
  Output: { progress: 0-100, totalIssues, completedIssues }
```

---

### 4.6 Cycle Module Interactions

| Frontend Action | Backend Module | Event/Data |
|-----------------|----------------|------------|
| List Cycles | Cycle Module | GET /cycles |
| Create Cycle | Cycle Module | POST /cycles |
| Activate Cycle | Cycle Module | POST /cycles/:id/activate |
| Complete Cycle | Cycle Module | POST /cycles/:id/complete |

**Frontend → Backend Cycle:**
```
List Cycles:
  Input: { teamId }
  Output: { cycles[] }

Create Cycle:
  Input: { teamId, name, startDate, endDate }
  Output: { cycle }

Activate Cycle:
  Input: { cycleId }
  Output: { cycle }
```

---

## 5. State Synchronization Contract

### 5.1 Cache Invalidation Rules

| Action | Cache to Invalidate |
|--------|---------------------|
| Create Issue | Issues list for team |
| Update Issue | Specific issue, issues list |
| Delete Issue | Issues list for team |
| Change Status | Specific issue, issues list |
| Create Project | Projects list for team |
| Create Cycle | Cycles list for team |

### 5.2 Optimistic Update Contract

```typescript
interface OptimisticUpdate {
  // What to update immediately
  action: "update" | "add" | "remove";
  target: string;           // e.g., "issues", "issues:uuid"
  data: any;               // New data
  
  // How to revert on failure
  revert: {
    action: "update" | "add" | "remove";
    target: string;
    data: any;             // Previous data
  };
  
  // API request to confirm
  request: {
    method: "POST" | "PATCH" | "DELETE";
    url: string;
    body?: any;
  };
}
```

**Example: Status Change**
```typescript
// Optimistic update
{
  action: "update",
  target: "issues:uuid",
  data: { status: "done", completedAt: "2024-01-01T00:00:00Z" },
  revert: {
    action: "update",
    target: "issues:uuid",
    data: { status: "in_review", completedAt: null }
  },
  request: {
    method: "PATCH",
    url: "/api/v1/issues/uuid/status",
    body: { status: "done" }
  }
}
```

---

## 6. Error Contract

### 6.1 Error Types

| Code | HTTP Status | Backend Type | Description |
|------|-------------|--------------|-------------|
| `VALIDATION_ERROR` | 400 | `ValidationError` | Input validation failed |
| `UNAUTHORIZED` | 401 | `UnauthorizedError` | Authentication required |
| `FORBIDDEN` | 403 | `ForbiddenError` | Insufficient permissions |
| `NOT_FOUND` | 404 | `NotFoundError` | Resource not found |
| `CONFLICT` | 409 | `ConflictError` | Resource already exists |
| `BUSINESS_RULE_ERROR` | 422 | `BusinessRuleError` | Domain rule violation |
| `RATE_LIMITED` | 429 | `RateLimitError` | Too many requests |
| `SERVER_ERROR` | 500 | `InternalError` | Unexpected server error |

### 6.2 Frontend Error Handling

```typescript
interface ErrorHandler {
  // Network errors
  onNetworkError: () => void;
  
  // Auth errors
  onUnauthorized: () => void;      // Redirect to login
  onForbidden: () => void;         // Show permission error
  
  // Business errors
  onValidationError: (details: FieldError[]) => void;
  onNotFound: () => void;
  onConflict: (message: string) => void;
  
  // Generic
  onServerError: () => void;
  onUnknown: (error: any) => void;
}
```

---

## 7. Event Flow Contract

### 7.1 Issue Creation Flow

```
Frontend                     Backend                    WebSocket
   │                            │                          │
   │  POST /issues              │                          │
   │ ─────────────────────────> │                          │
   │                            │  Create issue            │
   │                            │  Generate identifier     │
   │                            │  Save to database        │
   │                            │                          │
   │  201 Created               │                          │
   │ <───────────────────────── │                          │
   │                            │                          │
   │                            │  IssueCreated event      │
   │                            │ ───────────────────────> │
   │                            │                          │
   │                            │  Broadcast to team       │
   │ <──────────────────────────────────────────────────── │
   │                            │                          │
   │  Update local state        │                          │
   │  (already done)            │                          │
```

### 7.2 Status Change Flow

```
Frontend                     Backend                    WebSocket
   │                            │                          │
   │  Optimistic update         │                          │
   │  (immediate)               │                          │
   │                            │                          │
   │  PATCH /issues/:id/status  │                          │
   │ ─────────────────────────> │                          │
   │                            │  Validate transition     │
   │                            │  Update status           │
   │                            │  Set completedAt         │
   │                            │                          │
   │  200 OK                    │                          │
   │ <───────────────────────── │                          │
   │                            │                          │
   │                            │  StatusChanged event     │
   │                            │ ───────────────────────> │
   │                            │                          │
   │  Confirm optimistic        │                          │
   │ <──────────────────────────────────────────────────── │
   │                            │                          │
```

---

## 8. Data Transformation Contract

### 8.1 API → Frontend

| API Field | Frontend Field | Transformation |
|-----------|----------------|----------------|
| `createdAt` | `createdAt` | ISO string → Relative time |
| `status` | `statusLabel` | "in_progress" → "In Progress" |
| `priority` | `priorityLabel` | 2 → "High" |
| `assigneeId` | `assignee` | ID → User object (from cache) |

### 8.2 Frontend → API

| Frontend Field | API Field | Transformation |
|----------------|-----------|----------------|
| `title` | `title` | Trimmed string |
| `description` | `description` | Markdown (or null) |
| `priority` | `priority` | Label → Number |
| `assignee` | `assigneeId` | User object → ID |

---

## 9. Security Contract

### 9.1 Token Storage

| Location | Data | Lifetime |
|----------|------|----------|
| Memory | Access token | Session |
| Secure cookie | Refresh token | 7 days |
| Local storage | User preferences | Permanent |

### 9.2 Token Usage

| Context | Header |
|---------|--------|
| HTTP requests | `Authorization: Bearer <token>` |
| WebSocket | First message: `{ type: "authenticate", token: "..." }` |

### 9.3 Token Refresh

```
1. API returns 401
2. Frontend checks if refresh token exists
3. Frontend calls POST /auth/refresh
4. If success: Update tokens, retry original request
5. If failure: Logout, redirect to login
```

---

## 10. Module Dependency Matrix

| Module | Depends On | Used By |
|--------|------------|---------|
| Auth | None | All modules |
| Identity | Auth | Work, Project, Cycle |
| Work | Auth, Identity | Workflow, Project, Cycle |
| Workflow | Work | Work |
| Project | Work | Work |
| Cycle | Work | Work |
| Notification | Work, Identity | Gateway |
| Gateway | Auth | Realtime (frontend) |

**Dependency Rules:**
- Auth module has no dependencies
- Lower modules cannot depend on higher modules
- Cross-module communication via events only
