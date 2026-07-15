# Linear Clone Backend

REST API backend for a Linear-inspired project management application. Built with **Hexagonal Architecture** (Ports & Adapters) using TypeScript.

## Technologies

| Category | Technology |
|----------|------------|
| Runtime | Node.js (ESM) |
| Language | TypeScript 7 |
| Framework | Fastify 5 |
| ORM | Drizzle ORM |
| Database | PostgreSQL 16 |
| Cache | Redis (Upstash) |
| Auth | JWT (`jose`), bcrypt |
| Validation | Zod |
| Testing | Vitest |
| Linting | ESLint + Prettier |
| Package Manager | pnpm |
| Migrations | Drizzle Kit |

## Project Structure

```
src/
├── server.ts                          # Entry point
├── app.ts                             # Fastify app setup, plugins, routes
├── modules/
│   ├── auth/
│   │   ├── domain/                    # Entities & schemas (users, sessions)
│   │   ├── application/               # Use cases + port interfaces
│   │   │   └── ports/                 # Repository & service interfaces
│   │   ├── adapters/
│   │   │   ├── in/                    # Controllers & DTOs (HTTP layer)
│   │   │   └── out/                   # DB, Redis, JWT implementations
│   │   └── __tests__/
│   ├── identity/
│   │   ├── domain/                    # Entities (user profile, organization, members)
│   │   ├── application/               # Use cases + port interfaces
│   │   │   └── ports/                 # Repository & service interfaces
│   │   ├── adapters/
│   │   │   ├── in/                    # Controllers, DTOs, middleware
│   │   │   └── out/                   # DB implementations
│   │   └── __tests__/                 # Unit, integration, contract tests
│       └── work/
│       ├── domain/                    # Entities & schemas (issues, statuses, labels, comments, watchers)
│       ├── application/               # Use cases + port interfaces
│       │   └── ports/                 # Repository & event interfaces
│       ├── adapters/
│       │   ├── in/                    # Controllers & DTOs (issue, comment, label, watcher APIs)
│       │   └── out/                   # DB repositories, event publisher
│       └── __tests__/                 # Unit tests
└── shared/
    ├── config/env.ts                  # Environment configuration
    ├── database/index.ts              # Drizzle + pg Pool
    ├── errors/
    │   ├── index.ts                   # Export all error classes
    │   ├── base-error.ts              # Abstract base error class
    │   ├── not-found.ts               # NotFoundError (404)
    │   ├── validation.ts              # ValidationError (400)
    │   ├── conflict.ts                # ConflictError (409)
    │   ├── unauthorized.ts            # UnauthorizedError (401)
    │   ├── forbidden.ts               # ForbiddenError (403)
    │   ├── business-rule.ts           # BusinessRuleError (422)
    │   ├── rate-limit.ts              # RateLimitError (429)
    │   ├── internal.ts                # InternalError (500)
    │   ├── error-handler.ts           # Global error handler
    │   └── types.ts                   # Error TypeScript interfaces
    └── rate-limiting/
        ├── index.ts                   # Export rate limit plugin
        ├── rate-limit-plugin.ts       # Fastify rate limit plugin
        └── in-memory-store.ts         # In-memory rate limit store
```

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL database
- Redis instance
- pnpm

### Installation

```bash
pnpm install
```

### Environment Variables

Copy `.env-example` to `.env` and configure:

```bash
cp .env-example .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) |
| `PORT` | Server port (default: 3000) |
| `RATE_LIMIT_REGISTER` | Max register requests/min per IP (default: 3) |
| `RATE_LIMIT_LOGIN` | Max login requests/min per IP (default: 5) |
| `RATE_LIMIT_SESSION_LIST` | Max session list requests/min per user (default: 30) |
| `RATE_LIMIT_SESSION_REVOKE` | Max session revoke requests/min per user (default: 30) |
| `RATE_LIMIT_SESSION_REVOKE_ALL` | Max revoke-all requests/min per user (default: 10) |
| `SESSION_LIMIT` | Max active sessions per user (default: 10) |

### Database Setup

```bash
pnpm db:migrate
# or push schema directly (dev):
pnpm db:push
```

### Run Development

```bash
pnpm dev
```

Server starts at `http://localhost:3000`.

### Run Tests

```bash
pnpm test
```

### Build & Start (Production)

```bash
pnpm build
pnpm start
```

## API Endpoints

Base URL: `http://localhost:3000`

### Health Check

```
GET /api/health
```

**cURL:**

```bash
curl http://localhost:3000/api/health
```

**Response (200):**

```json
{
  "status": "ok"
}
```

---

### Register User

```
POST /api/v1/auth/register
```

Creates a new user account and returns JWT tokens.

**cURL:**

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "securePass123"
  }'
```

**Request Body:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `email` | string | Yes | Valid email format |
| `name` | string | Yes | Min 1 character |
| `password` | string | Yes | Min 8 characters |

**Response (201):**

```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2026-07-11T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input (email, name, or password) |
| 409 | `CONFLICT` | Email already registered |

**Error Example (400):**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "password", "message": "Password must be at least 8 characters" }
    ]
  }
}
```

**Error Example (409):**

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Email already registered"
  }
}
```

---

### Login User

```
POST /api/v1/auth/login
```

Authenticates a user and returns JWT tokens. Supports "Remember Me" for extended refresh token lifetime.

**cURL:**

```bash
# Standard login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePass123"
  }'

# Login with "Remember Me" (30-day refresh token instead of 7-day)
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePass123",
    "rememberMe": true
  }'
```

**Request Body:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `email` | string | Yes | - | User email |
| `password` | string | Yes | - | User password |
| `rememberMe` | boolean | No | `false` | Extends refresh token to 30 days |

> `ipAddress` and `userAgent` are extracted from the request automatically.

**Response (200):**

```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input |
| 401 | `UNAUTHORIZED` | Invalid email or password |

**Error Example (401):**

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid email or password"
  }
}
```

---

### Refresh Token

```
POST /api/v1/auth/refresh
```

Exchanges a valid refresh token for a new token pair. The old refresh token is invalidated (single-use rotation).

**cURL:**

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }'
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `refreshToken` | string | Yes | The refresh token to rotate |

**Response (200):**

```json
{
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 401 | `TOKEN_EXPIRED` | Refresh token has expired |
| 401 | `TOKEN_REVOKED` | Refresh token has been revoked or already used |
| 422 | `VALIDATION_FAILED` | Missing or invalid refreshToken field |

---
 
### Logout
 
```
POST /api/v1/auth/logout
```
 
Terminates the user's session and invalidates all refresh tokens. Requires a valid access token. Idempotent — calling multiple times returns success.
 
**cURL:**
 
```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```
 
**Headers:**
 
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <accessToken>` |
 
**Response (200):**
 
```json
{
  "data": {
    "success": true
  }
}
```
 
**Errors:**
 
| Status | Code | Message |
|--------|------|---------|
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
 
---
 
### List Sessions
 
```
GET /api/v1/auth/sessions
```
 
Returns all active sessions for the authenticated user, including device information and which session is the current one.
 
**cURL:**
 
```bash
curl -X GET http://localhost:3000/api/v1/auth/sessions \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```
 
**Headers:**
 
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <accessToken>` |
 
**Response (200):**
 
```json
{
  "data": {
    "sessions": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
        "rememberMe": false,
        "createdAt": "2026-07-10T19:30:00.000Z",
        "lastActivityAt": "2026-07-13T02:54:39.000Z",
        "isCurrent": true
      },
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "ipAddress": "10.0.0.50",
        "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)...",
        "rememberMe": true,
        "createdAt": "2026-07-12T08:15:00.000Z",
        "lastActivityAt": "2026-07-12T22:10:00.000Z",
        "isCurrent": false
      }
    ]
  }
}
```
 
**Session Object:**
 
| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Session identifier |
| `ipAddress` | string | Client IP address (IPv4 or IPv6) |
| `userAgent` | string | Client device/browser user agent |
| `rememberMe` | boolean | Whether "Remember Me" was used at login |
| `createdAt` | string (ISO 8601) | When the session was created |
| `lastActivityAt` | string (ISO 8601) | Last token refresh time |
| `isCurrent` | boolean | `true` if this is the session making the request |
 
**Ordering:** Sessions are sorted by `lastActivityAt` descending (most recently active first).
 
**Filtering:** Only non-expired sessions are returned.
 
**Errors:**
 
| Status | Code | Message |
|--------|------|---------|
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 500 | `SERVER_ERROR` | Internal server error |
 
**Rate Limit:** 30 requests/minute per user
 
---
 
### Revoke Session
 
```
DELETE /api/v1/auth/sessions/:sessionId
```
 
Revokes (terminates) a specific session by its identifier. Revoking the current session is equivalent to logging out.
 
**cURL:**
 
```bash
curl -X DELETE http://localhost:3000/api/v1/auth/sessions/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```
 
**Headers:**
 
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <accessToken>` |
 
**Path Parameters:**
 
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sessionId` | string (UUID) | Yes | The session to revoke |
 
**Response (200):**
 
```json
{
  "data": {
    "success": true
  }
}
```
 
**Errors:**
 
| Status | Code | Message |
|--------|------|---------|
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 404 | `NOT_FOUND` | Session not found or does not belong to user |
| 500 | `SERVER_ERROR` | Internal server error |
 
**Rate Limit:** 30 requests/minute per user
 
---
 
### Revoke All Sessions
 
```
POST /api/v1/auth/sessions/revoke-all
```
 
Revokes all sessions except the current one, effectively signing out from all other devices while remaining authenticated on the current device.
 
**cURL:**
 
```bash
curl -X POST http://localhost:3000/api/v1/auth/sessions/revoke-all \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```
 
**Headers:**
 
| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <accessToken>` |
 
**Response (200):**
 
```json
{
  "data": {
    "success": true,
    "revokedCount": 3
  }
}
```
 
**Behavior:** The current session (the one used to make the request) is preserved. All other non-expired sessions for the user are revoked. The `revokedCount` field reflects the number of sessions revoked (excluding the current session).
 
If no other sessions exist, the response is `{ "success": true, "revokedCount": 0 }`.
 
**Errors:**
 
| Status | Code | Message |
|--------|------|---------|
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 500 | `SERVER_ERROR` | Internal server error |
 
**Rate Limit:** 10 requests/minute per user

---

### Get User Profile

```
GET /api/v1/users/me
```

Returns the authenticated user's profile information.

**cURL:**

```bash
curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Headers:**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <accessToken>` |

**Response (200):**

```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "John Doe",
      "avatarUrl": "https://example.com/avatar.jpg",
      "createdAt": "2026-07-11T10:00:00.000Z",
      "updatedAt": "2026-07-13T12:00:00.000Z"
    }
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 404 | `NOT_FOUND` | User not found |

**Rate Limit:** 30 requests/minute per user

---

### Update User Profile

```
PATCH /api/v1/users/me
```

Updates the authenticated user's profile information. Only provided fields are updated.

**cURL:**

```bash
curl -X PATCH http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "avatarUrl": "https://example.com/new-avatar.jpg"
  }'
```

**Headers:**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <accessToken>` |

**Request Body:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | string | No | 1-255 characters |
| `avatarUrl` | string \| null | No | Valid URL format, or null to clear |

**Response (200):**

```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "Jane Doe",
      "avatarUrl": "https://example.com/new-avatar.jpg",
      "createdAt": "2026-07-11T10:00:00.000Z",
      "updatedAt": "2026-07-13T14:00:00.000Z"
    }
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input (name or avatarUrl) |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 404 | `NOT_FOUND` | User not found |

**Rate Limit:** 10 requests/minute per user

---

### Create Organization

```
POST /api/v1/organizations
```

Creates a new organization. The authenticated user becomes the organization owner.

**cURL:**

```bash
curl -X POST http://localhost:3000/api/v1/organizations \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Organization"
  }'
```

**Headers:**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <accessToken>` |

**Request Body:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | string | Yes | 1-255 characters, unique |

**Response (201):**

```json
{
  "data": {
    "organization": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "My Organization",
      "createdAt": "2026-07-13T14:00:00.000Z",
      "updatedAt": "2026-07-13T14:00:00.000Z"
    }
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input (name) |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 409 | `CONFLICT` | Organization name already exists |

**Rate Limit:** 5 requests/minute per user

---

### List User Organizations

```
GET /api/v1/organizations
```

Returns all organizations the authenticated user belongs to.

**cURL:**

```bash
curl http://localhost:3000/api/v1/organizations \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Headers:**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <accessToken>` |

**Response (200):**

```json
{
  "data": {
    "organizations": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "My Organization",
        "createdAt": "2026-07-13T14:00:00.000Z",
        "updatedAt": "2026-07-13T14:00:00.000Z"
      },
      {
        "id": "660e8400-e29b-41d4-a716-446655440002",
        "name": "Another Organization",
        "createdAt": "2026-07-12T10:00:00.000Z",
        "updatedAt": "2026-07-12T10:00:00.000Z"
      }
    ]
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 401 | `UNAUTHORIZED` | Missing or invalid access token |

**Rate Limit:** 30 requests/minute per user

---

### Get Organization Details

```
GET /api/v1/organizations/:organizationId
```

Returns details for a specific organization. User must be a member of the organization.

**cURL:**

```bash
curl http://localhost:3000/api/v1/organizations/550e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Headers:**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <accessToken>` |

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organizationId` | string (UUID) | Yes | Organization identifier |

**Response (200):**

```json
{
  "data": {
    "organization": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "My Organization",
      "createdAt": "2026-07-13T14:00:00.000Z",
      "updatedAt": "2026-07-13T14:00:00.000Z"
    }
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 403 | `FORBIDDEN` | Not an organization member |
| 404 | `NOT_FOUND` | Organization not found |

**Rate Limit:** 30 requests/minute per user

---

### Delete Organization

```
DELETE /api/v1/organizations/:organizationId
```

Soft-deletes an organization and all its members. Only the organization owner can delete an organization.

**cURL:**

```bash
curl -X DELETE http://localhost:3000/api/v1/organizations/550e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Headers:**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <accessToken>` |

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organizationId` | string (UUID) | Yes | Organization identifier |

**Response (204):**

No body returned on success.

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 403 | `FORBIDDEN` | Only organization owner can delete |
| 404 | `NOT_FOUND` | Organization not found |

**Rate Limit:** 5 requests/minute per user

---

### Create Team

```
POST /api/v1/organizations/:organizationId/teams
```

Creates a new team within an organization. The authenticated user must be an organization member and becomes the team admin. The team key must be unique within the organization.

**cURL:**

```bash
curl -X POST http://localhost:3000/api/v1/organizations/550e8400-e29b-41d4-a716-446655440001/teams \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering",
    "key": "ENG"
  }'
```

**Headers:**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <accessToken>` |

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organizationId` | string (UUID) | Yes | Organization identifier |

**Request Body:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | string | Yes | 1-255 characters |
| `key` | string | Yes | 1-10 uppercase letters, unique within org |

> The `key` is automatically uppercased. Lowercase or special characters are rejected.

**Response (201):**

```json
{
  "data": {
    "team": {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "organizationId": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Engineering",
      "key": "ENG",
      "memberCount": 1,
      "createdAt": "2026-07-13T15:00:00.000Z",
      "updatedAt": "2026-07-13T15:00:00.000Z"
    }
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input (name, key) |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 403 | `FORBIDDEN` | Not an organization member |
| 409 | `CONFLICT` | Team key already exists in this organization |

**Rate Limit:** 10 requests/minute per user

---

### List Teams

```
GET /api/v1/organizations/:organizationId/teams
```

Returns all active (non-deleted) teams within an organization. The authenticated user must be an organization member.

**cURL:**

```bash
curl http://localhost:3000/api/v1/organizations/550e8400-e29b-41d4-a716-446655440001/teams \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Headers:**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <accessToken>` |

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organizationId` | string (UUID) | Yes | Organization identifier |

**Response (200):**

```json
{
  "data": {
    "teams": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "name": "Engineering",
        "key": "ENG",
        "memberCount": 5,
        "createdAt": "2026-07-13T15:00:00.000Z",
        "updatedAt": "2026-07-13T15:00:00.000Z"
      },
      {
        "id": "660e8400-e29b-41d4-a716-446655440011",
        "name": "Design",
        "key": "DSG",
        "memberCount": 3,
        "createdAt": "2026-07-13T15:30:00.000Z",
        "updatedAt": "2026-07-13T15:30:00.000Z"
      }
    ]
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 403 | `FORBIDDEN` | Not an organization member |

**Rate Limit:** 30 requests/minute per user

---

### Get Team Details

```
GET /api/v1/teams/:teamId
```

Returns details for a specific team. The authenticated user must be a team member.

**cURL:**

```bash
curl http://localhost:3000/api/v1/teams/550e8400-e29b-41d4-a716-446655440010 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Headers:**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <accessToken>` |

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `teamId` | string (UUID) | Yes | Team identifier |

**Response (200):**

```json
{
  "data": {
    "team": {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "organizationId": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Engineering",
      "key": "ENG",
      "memberCount": 5,
      "createdAt": "2026-07-13T15:00:00.000Z",
      "updatedAt": "2026-07-13T15:00:00.000Z"
    }
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 403 | `FORBIDDEN` | Not a team member |
| 404 | `NOT_FOUND` | Team not found |

**Rate Limit:** 30 requests/minute per user

---

### Delete Team

```
DELETE /api/v1/teams/:teamId
```

Soft-deletes a team and all its memberships. Only team admins can delete a team. A `TeamDeleted` event is published for downstream consumers (e.g., nullifying team references on issues).

**cURL:**

```bash
curl -X DELETE http://localhost:3000/api/v1/teams/550e8400-e29b-41d4-a716-446655440010 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Headers:**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <accessToken>` |

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `teamId` | string (UUID) | Yes | Team identifier |

**Response (204):**

No body returned on success.

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 403 | `FORBIDDEN` | Only team admins can perform this action |
| 404 | `NOT_FOUND` | Team not found |

**Rate Limit:** 5 requests/minute per user

---

### Add Team Member

```
POST /api/v1/teams/:teamId/members
```

Adds a user to a team with a specified role. The authenticated user must be a team admin. The target user must be a member of the team's organization.

**cURL:**

```bash
curl -X POST http://localhost:3000/api/v1/teams/550e8400-e29b-41d4-a716-446655440010/members \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440002",
    "role": "member"
  }'
```

**Headers:**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <accessToken>` |

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `teamId` | string (UUID) | Yes | Team identifier |

**Request Body:**

| Field | Type | Required | Default | Constraints |
|-------|------|----------|---------|-------------|
| `userId` | string (UUID) | Yes | - | User to add, must be an org member |
| `role` | string | No | `member` | `member` or `admin` |

**Response (201):**

```json
{
  "data": {
    "member": {
      "id": "550e8400-e29b-41d4-a716-446655440020",
      "userId": "550e8400-e29b-41d4-a716-446655440002",
      "role": "member",
      "joinedAt": "2026-07-13T16:00:00.000Z"
    }
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input (userId, role) |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 403 | `FORBIDDEN` | Only team admins can add members |
| 404 | `NOT_FOUND` | Team not found |
| 409 | `CONFLICT` | User is already a team member |
| 422 | `BUSINESS_RULE_ERROR` | User is not an organization member |

**Rate Limit:** 10 requests/minute per user

---

### Remove Team Member

```
DELETE /api/v1/teams/:teamId/members/:userId
```

Removes a user from a team (soft-delete). The authenticated user must be a team admin. Cannot remove the last admin from the team.

**cURL:**

```bash
curl -X DELETE http://localhost:3000/api/v1/teams/550e8400-e29b-41d4-a716-446655440010/members/550e8400-e29b-41d4-a716-446655440002 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Headers:**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <accessToken>` |

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `teamId` | string (UUID) | Yes | Team identifier |
| `userId` | string (UUID) | Yes | Member to remove |

**Response (204):**

No body returned on success.

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 403 | `FORBIDDEN` | Only team admins can remove members |
| 404 | `NOT_FOUND` | Team or member not found |
| 409 | `CONFLICT` | Cannot remove the last admin from the team |

**Rate Limit:** 10 requests/minute per user

---

### List Team Members

```
GET /api/v1/teams/:teamId/members
```

Returns all active members of a team with their user profile details. The authenticated user must be a team member.

**cURL:**

```bash
curl http://localhost:3000/api/v1/teams/550e8400-e29b-41d4-a716-446655440010/members \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Headers:**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer <accessToken>` |

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `teamId` | string (UUID) | Yes | Team identifier |

**Response (200):**

```json
{
  "data": {
    "members": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440020",
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "admin",
        "joinedAt": "2026-07-13T15:00:00.000Z"
      },
      {
        "id": "660e8400-e29b-41d4-a716-446655440021",
        "userId": "550e8400-e29b-41d4-a716-446655440002",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "member",
        "joinedAt": "2026-07-13T16:00:00.000Z"
      }
    ]
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 403 | `FORBIDDEN` | Not a team member |
| 404 | `NOT_FOUND` | Team not found |

**Rate Limit:** 30 requests/minute per user

---

## Issues API

All issue endpoints require authentication via `Authorization: Bearer <accessToken>`.

### Create Issue

```
POST /api/v1/issues
```

Creates a new issue with auto-generated identifier (e.g. `ENG-1`), default status (Todo), and default priority (0).

**cURL:**

```bash
curl -X POST http://localhost:3000/api/v1/issues \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement login page",
    "description": "Build the login page with email/password",
    "teamId": "550e8400-e29b-41d4-a716-446655440010",
    "priority": 2,
    "parentId": "660e8400-e29b-41d4-a716-446655440100"
  }'
```

**Request Body:**

| Field | Type | Required | Default | Constraints |
|-------|------|----------|---------|-------------|
| `title` | string | Yes | - | 1-255 characters |
| `description` | string | No | - | - |
| `teamId` | string (UUID) | Yes | - | User must be a team member |
| `priority` | number | No | `0` | 0 (none) to 4 (urgent) |
| `projectId` | string (UUID) | No | - | - |
| `parentId` | string (UUID) | No | - | Must belong to the same team |
| `assigneeId` | string (UUID) | No | - | Must be a team member |
| `cycleId` | string (UUID) | No | - | - |
| `labelIds` | string[] (UUID) | No | - | - |

**Response (201):**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440100",
    "identifier": "ENG-1",
    "title": "Implement login page",
    "description": "Build the login page with email/password",
    "teamId": "550e8400-e29b-41d4-a716-446655440010",
    "projectId": null,
    "assigneeId": null,
    "priority": 2,
    "statusId": "550e8400-e29b-41d4-a716-446655440000",
    "parentId": "660e8400-e29b-41d4-a716-446655440100",
    "cycleId": null,
    "sortOrder": 0,
    "sequence": 1,
    "createdAt": "2026-07-14T10:00:00.000Z",
    "updatedAt": "2026-07-14T10:00:00.000Z",
    "completedAt": null,
    "canceledAt": null,
    "deletedAt": null
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input (title, teamId, etc.) |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 422 | `BUSINESS_RULE_ERROR` | User is not a team member, or parent issue belongs to a different team |

**Rate Limit:** 60 requests/minute per user

---

### Get Issue

```
GET /api/v1/issues/:id
```

Fetches a single issue by its UUID or string identifier (e.g. `ENG-1`).

**cURL:**

```bash
curl http://localhost:3000/api/v1/issues/ENG-1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Issue UUID or identifier (e.g. `ENG-1`) |

**Response (200):**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440100",
    "identifier": "ENG-1",
    "title": "Implement login page",
    "description": "Build the login page with email/password",
    "teamId": "550e8400-e29b-41d4-a716-446655440010",
    "projectId": null,
    "assigneeId": null,
    "priority": 2,
    "statusId": "550e8400-e29b-41d4-a716-446655440000",
    "parentId": null,
    "cycleId": null,
    "sortOrder": 0,
    "sequence": 1,
    "createdAt": "2026-07-14T10:00:00.000Z",
    "updatedAt": "2026-07-14T10:00:00.000Z",
    "completedAt": null,
    "canceledAt": null,
    "deletedAt": null
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 404 | `NOT_FOUND` | Issue not found |

**Rate Limit:** 120 requests/minute per user

---

### Update Issue

```
PATCH /api/v1/issues/:id
```

Partially updates an issue's fields. Only provided fields are modified.

**cURL:**

```bash
curl -X PATCH http://localhost:3000/api/v1/issues/ENG-1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build login page",
    "priority": 1,
    "description": null
  }'
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Issue UUID or identifier |

**Request Body:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | string | No | 1-255 characters |
| `description` | string \| null | No | Pass `null` to clear |
| `projectId` | string (UUID) \| null | No | Must belong to the same team |
| `priority` | number | No | 0 (none) to 4 (urgent) |
| `cycleId` | string (UUID) \| null | No | - |

**Response (200):**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440100",
    "identifier": "ENG-1",
    "title": "Build login page",
    "description": null,
    "teamId": "550e8400-e29b-41d4-a716-446655440010",
    "projectId": null,
    "assigneeId": null,
    "priority": 1,
    "statusId": "550e8400-e29b-41d4-a716-446655440000",
    "parentId": null,
    "cycleId": null,
    "sortOrder": 0,
    "sequence": 1,
    "createdAt": "2026-07-14T10:00:00.000Z",
    "updatedAt": "2026-07-14T10:30:00.000Z",
    "completedAt": null,
    "canceledAt": null,
    "deletedAt": null
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input (empty title, invalid UUID) |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 404 | `NOT_FOUND` | Issue not found |
| 422 | `BUSINESS_RULE_ERROR` | Project belongs to a different team |

**Rate Limit:** 60 requests/minute per user

---

### Change Issue Status

```
PATCH /api/v1/issues/:id/status
```

Transitions an issue to a new status. Validates against the default workflow transition map. Sets `completedAt` when moving to Done/Canceled, clears it when reopening.

**Default Workflow:**

```
Backlog → Todo → In Progress → Done
  ↓       ↓          ↓
Canceled Canceled  Canceled
```

**cURL:**

```bash
curl -X PATCH http://localhost:3000/api/v1/issues/ENG-1/status \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "statusId": "550e8400-e29b-41d4-a716-446655440002"
  }'
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Issue UUID or identifier |

**Request Body:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `statusId` | string (UUID) | Yes | Target status ID |

**Response (200):**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440100",
    "identifier": "ENG-1",
    "title": "Implement login page",
    "priority": 0,
    "statusId": "550e8400-e29b-41d4-a716-446655440002",
    "completedAt": null,
    "canceledAt": null
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input (statusId) |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 404 | `NOT_FOUND` | Issue not found |
| 422 | `BUSINESS_RULE_ERROR` | Invalid transition (e.g. Todo → Done directly) |

**Rate Limit:** 60 requests/minute per user

---

### Assign Issue

```
PATCH /api/v1/issues/:id/assignee
```

Assigns or unassigns an issue. The assignee must be a member of the same team. Pass `null` to unassign.

**cURL:**

```bash
# Assign
curl -X PATCH http://localhost:3000/api/v1/issues/ENG-1/assignee \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "assigneeId": "550e8400-e29b-41d4-a716-446655440020"
  }'

# Unassign
curl -X PATCH http://localhost:3000/api/v1/issues/ENG-1/assignee \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "assigneeId": null
  }'
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Issue UUID or identifier |

**Request Body:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `assigneeId` | string (UUID) \| null | Yes | Must be a team member, or null to unassign |

**Response (200):**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440100",
    "identifier": "ENG-1",
    "title": "Implement login page",
    "assigneeId": "550e8400-e29b-41d4-a716-446655440020",
    ...
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input (assigneeId) |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 404 | `NOT_FOUND` | Issue not found |
| 422 | `BUSINESS_RULE_ERROR` | Assignee is not a team member |

**Rate Limit:** 60 requests/minute per user

---

### Delete Issue

```
DELETE /api/v1/issues/:id
```

Soft-deletes an issue by setting its `deletedAt` timestamp. The issue remains in the database but is excluded from default queries.

**cURL:**

```bash
curl -X DELETE http://localhost:3000/api/v1/issues/ENG-1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Issue UUID or identifier |

**Response (204):**

No body returned on success.

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 404 | `NOT_FOUND` | Issue not found |

**Rate Limit:** 30 requests/minute per user

---

### List Issues

```
GET /api/v1/issues
```

Lists issues with filters, cursor-based pagination, and configurable page size. Soft-deleted issues are excluded by default. Results are sorted by priority (desc), then creation date (desc).

**cURL:**

```bash
# List issues for a team
curl "http://localhost:3000/api/v1/issues?teamId=550e8400-e29b-41d4-a716-446655440010&limit=20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."

# Paginate with cursor
curl "http://localhost:3000/api/v1/issues?cursor=eyJpZCI6IjU1M...&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `teamId` | string (UUID) | No | - | Filter by team |
| `statusId` | string (UUID) | No | - | Filter by status |
| `assigneeId` | string (UUID) | No | - | Filter by assignee |
| `projectId` | string (UUID) | No | - | Filter by project |
| `cycleId` | string (UUID) | No | - | Filter by cycle |
| `labelIds` | string | No | - | Comma-separated label UUIDs |
| `cursor` | string | No | - | Opaque cursor for pagination |
| `limit` | number | No | `50` | 1-100 |
| `includeDeleted` | boolean | No | `false` | Include soft-deleted issues |

**Response (200):**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440100",
      "identifier": "ENG-1",
      "title": "Implement login page",
      "description": null,
      "teamId": "550e8400-e29b-41d4-a716-446655440010",
      "projectId": null,
      "assigneeId": "550e8400-e29b-41d4-a716-446655440020",
      "priority": 2,
      "statusId": "550e8400-e29b-41d4-a716-446655440002",
      "parentId": null,
      "cycleId": null,
      "sortOrder": 0,
      "sequence": 1,
      "createdAt": "2026-07-14T10:00:00.000Z",
      "updatedAt": "2026-07-14T10:30:00.000Z",
      "completedAt": null,
      "canceledAt": null,
      "deletedAt": null
    }
  ],
  "pagination": {
    "nextCursor": "eyJpZCI6IjU1M...",
    "hasMore": false
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid query parameters |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |

**Rate Limit:** 60 requests/minute per user

---

### Issue Response Object

All issue endpoints return issues with the following structure:

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Internal issue ID |
| `identifier` | string | Human-readable ID (e.g. `ENG-1`) |
| `title` | string | Issue title |
| `description` | string \| null | Issue description |
| `teamId` | string (UUID) | Parent team |
| `projectId` | string (UUID) \| null | Project assignment |
| `assigneeId` | string (UUID) \| null | Assigned user |
| `priority` | number | 0 (none) to 4 (urgent) |
| `statusId` | string (UUID) | Current status |
| `parentId` | string (UUID) \| null | Parent issue |
| `cycleId` | string (UUID) \| null | Cycle assignment |
| `sortOrder` | number | Manual ordering |
| `sequence` | number | Per-team sequence number |
| `createdAt` | string (ISO 8601) | Creation timestamp |
| `updatedAt` | string (ISO 8601) | Last update timestamp |
| `completedAt` | string (ISO 8601) \| null | Completion timestamp |
| `canceledAt` | string (ISO 8601) \| null | Cancellation timestamp |
| `deletedAt` | string (ISO 8601) \| null | Soft-delete timestamp |

---

## Comments API

All comment endpoints require authentication via `Authorization: Bearer <accessToken>`.

### List Issue Comments

```
GET /api/v1/issues/:id/comments
```

Returns all non-deleted comments for an issue.

**cURL:**

```bash
curl http://localhost:3000/api/v1/issues/ENG-1/comments \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Issue UUID or identifier |

**Response (200):**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440200",
      "issueId": "550e8400-e29b-41d4-a716-446655440100",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "body": "This is a comment",
      "createdAt": "2026-07-14T10:00:00.000Z",
      "updatedAt": "2026-07-14T10:00:00.000Z",
      "deletedAt": null
    }
  ]
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 401 | `UNAUTHORIZED` | Missing or invalid access token |

**Rate Limit:** 120 requests/minute per user

---

### Create Comment

```
POST /api/v1/issues/:id/comments
```

Adds a comment to an issue. The authenticated user must be a team member.

**cURL:**

```bash
curl -X POST http://localhost:3000/api/v1/issues/ENG-1/comments \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "body": "This is a comment"
  }'
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Issue UUID or identifier |

**Request Body:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `body` | string | Yes | Minimum 1 character |

**Response (201):**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440200",
    "issueId": "550e8400-e29b-41d4-a716-446655440100",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "body": "This is a comment",
    "createdAt": "2026-07-14T10:00:00.000Z",
    "updatedAt": "2026-07-14T10:00:00.000Z",
    "deletedAt": null
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Empty body or invalid input |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 404 | `NOT_FOUND` | Issue not found |
| 422 | `BUSINESS_RULE_ERROR` | User is not a team member |

**Rate Limit:** 60 requests/minute per user

---

### Update Comment

```
PATCH /api/v1/issues/:id/comments/:commentId
```

Updates a comment's body. Only the comment author can update it.

**cURL:**

```bash
curl -X PATCH http://localhost:3000/api/v1/issues/ENG-1/comments/550e8400-e29b-41d4-a716-446655440200 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "body": "Updated comment body"
  }'
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (UUID) | Yes | Issue UUID |
| `commentId` | string (UUID) | Yes | Comment UUID |

**Request Body:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `body` | string | Yes | Minimum 1 character |

**Response (200):**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440200",
    "issueId": "550e8400-e29b-41d4-a716-446655440100",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "body": "Updated comment body",
    "createdAt": "2026-07-14T10:00:00.000Z",
    "updatedAt": "2026-07-14T10:30:00.000Z",
    "deletedAt": null
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Empty body or invalid input |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 403 | `FORBIDDEN` | Comment not owned by user |
| 404 | `NOT_FOUND` | Comment not found |

**Rate Limit:** 60 requests/minute per user

---

### Delete Comment

```
DELETE /api/v1/issues/:id/comments/:commentId
```

Soft-deletes a comment. Only the comment author can delete it.

**cURL:**

```bash
curl -X DELETE http://localhost:3000/api/v1/issues/ENG-1/comments/550e8400-e29b-41d4-a716-446655440200 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (UUID) | Yes | Issue UUID |
| `commentId` | string (UUID) | Yes | Comment UUID |

**Response (204):**

No body returned on success.

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 403 | `FORBIDDEN` | Comment not owned by user |
| 404 | `NOT_FOUND` | Comment not found |

**Rate Limit:** 30 requests/minute per user

---

## Labels API

All label endpoints require authentication via `Authorization: Bearer <accessToken>`.

### List Labels

```
GET /api/v1/labels
```

Returns all non-deleted workspace labels.

**cURL:**

```bash
curl http://localhost:3000/api/v1/labels \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Response (200):**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440300",
      "name": "bug",
      "description": "Something is broken",
      "color": "#ef4444",
      "createdAt": "2026-07-14T10:00:00.000Z",
      "updatedAt": "2026-07-14T10:00:00.000Z",
      "deletedAt": null
    }
  ]
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 401 | `UNAUTHORIZED` | Missing or invalid access token |

**Rate Limit:** 120 requests/minute per user

---

### Create Label

```
POST /api/v1/labels
```

Creates a new workspace label with a unique name.

**cURL:**

```bash
curl -X POST http://localhost:3000/api/v1/labels \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "bug",
    "description": "Something is broken",
    "color": "#ef4444"
  }'
```

**Request Body:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | string | Yes | 1-100 characters, unique |
| `description` | string \| null | No | Max 500 characters |
| `color` | string \| null | No | Max 7 characters (hex color) |

**Response (201):**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440300",
    "name": "bug",
    "description": "Something is broken",
    "color": "#ef4444",
    "createdAt": "2026-07-14T10:00:00.000Z",
    "updatedAt": "2026-07-14T10:00:00.000Z",
    "deletedAt": null
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 409 | `CONFLICT` | Label name already exists |

**Rate Limit:** 60 requests/minute per user

---

### Update Label

```
PATCH /api/v1/labels/:id
```

Updates a label's name, description, or color.

**cURL:**

```bash
curl -X PATCH http://localhost:3000/api/v1/labels/550e8400-e29b-41d4-a716-446655440300 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "bug",
    "color": "#dc2626"
  }'
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (UUID) | Yes | Label UUID |

**Request Body:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | string | No | 1-100 characters, unique |
| `description` | string \| null | No | Max 500 characters |
| `color` | string \| null | No | Max 7 characters (hex color) |

**Response (200):**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440300",
    "name": "bug",
    "color": "#dc2626",
    "createdAt": "2026-07-14T10:00:00.000Z",
    "updatedAt": "2026-07-14T10:30:00.000Z",
    "deletedAt": null
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 404 | `NOT_FOUND` | Label not found |
| 409 | `CONFLICT` | Label name already exists |

**Rate Limit:** 60 requests/minute per user

---

### Delete Label

```
DELETE /api/v1/labels/:id
```

Soft-deletes a label. Existing label-issue associations are preserved but the label is hidden from default queries.

**cURL:**

```bash
curl -X DELETE http://localhost:3000/api/v1/labels/550e8400-e29b-41d4-a716-446655440300 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (UUID) | Yes | Label UUID |

**Response (204):**

No body returned on success.

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 404 | `NOT_FOUND` | Label not found |

**Rate Limit:** 30 requests/minute per user

---

### Get Issue Labels

```
GET /api/v1/issues/:id/labels
```

Returns all labels attached to an issue.

**cURL:**

```bash
curl http://localhost:3000/api/v1/issues/ENG-1/labels \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Issue UUID or identifier |

**Response (200):**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440300",
      "name": "bug",
      "description": "Something is broken",
      "color": "#ef4444",
      "createdAt": "2026-07-14T10:00:00.000Z",
      "updatedAt": "2026-07-14T10:00:00.000Z",
      "deletedAt": null
    }
  ]
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 401 | `UNAUTHORIZED` | Missing or invalid access token |

**Rate Limit:** 120 requests/minute per user

---

### Attach Label

```
POST /api/v1/issues/:id/labels
```

Attaches a label to an issue. The authenticated user must be a team member.

**cURL:**

```bash
curl -X POST http://localhost:3000/api/v1/issues/ENG-1/labels \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "labelId": "550e8400-e29b-41d4-a716-446655440300"
  }'
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Issue UUID or identifier |

**Request Body:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `labelId` | string (UUID) | Yes | Label UUID |

**Response (201):**

```json
{
  "data": {
    "issueId": "550e8400-e29b-41d4-a716-446655440100",
    "labelId": "550e8400-e29b-41d4-a716-446655440300"
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 404 | `NOT_FOUND` | Issue or label not found |
| 409 | `CONFLICT` | Label already attached to this issue |
| 422 | `BUSINESS_RULE_ERROR` | User is not a team member |

**Rate Limit:** 60 requests/minute per user

---

### Detach Label

```
DELETE /api/v1/issues/:id/labels/:labelId
```

Removes a label from an issue.

**cURL:**

```bash
curl -X DELETE http://localhost:3000/api/v1/issues/ENG-1/labels/550e8400-e29b-41d4-a716-446655440300 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (UUID) | Yes | Issue UUID |
| `labelId` | string (UUID) | Yes | Label UUID |

**Response (204):**

No body returned on success.

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 404 | `NOT_FOUND` | Label not attached to this issue |

**Rate Limit:** 60 requests/minute per user

---

## Watchers API

All watcher endpoints require authentication via `Authorization: Bearer <accessToken>`.

### List Watchers

```
GET /api/v1/issues/:id/watchers
```

Returns all users watching an issue.

**cURL:**

```bash
curl http://localhost:3000/api/v1/issues/ENG-1/watchers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Issue UUID or identifier |

**Response (200):**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440400",
      "issueId": "550e8400-e29b-41d4-a716-446655440100",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2026-07-14T10:00:00.000Z"
    }
  ]
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 401 | `UNAUTHORIZED` | Missing or invalid access token |

**Rate Limit:** 120 requests/minute per user

---

### Add Watcher

```
POST /api/v1/issues/:id/watchers
```

Adds a user as a watcher on an issue. The authenticated user must be a team member. If `userId` is omitted, the authenticated user is added.

**cURL:**

```bash
# Add yourself as watcher
curl -X POST http://localhost:3000/api/v1/issues/ENG-1/watchers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{}'

# Add another user as watcher
curl -X POST http://localhost:3000/api/v1/issues/ENG-1/watchers \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440020"
  }'
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Issue UUID or identifier |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | string (UUID) | No | Defaults to authenticated user |

**Response (201):**

```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440400",
    "issueId": "550e8400-e29b-41d4-a716-446655440100",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-07-14T10:00:00.000Z"
  }
}
```

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 404 | `NOT_FOUND` | Issue not found |
| 409 | `CONFLICT` | User is already watching this issue |
| 422 | `BUSINESS_RULE_ERROR` | User is not a team member |

**Rate Limit:** 60 requests/minute per user

---

### Remove Watcher

```
DELETE /api/v1/issues/:id/watchers/:userId
```

Removes a user from an issue's watchers. Only the authenticated user can remove themselves.

**cURL:**

```bash
curl -X DELETE http://localhost:3000/api/v1/issues/ENG-1/watchers/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (UUID) | Yes | Issue UUID |
| `userId` | string (UUID) | Yes | User UUID to remove |

**Response (204):**

No body returned on success.

**Errors:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `VALIDATION_ERROR` | Invalid input |
| 401 | `UNAUTHORIZED` | Missing or invalid access token |
| 404 | `NOT_FOUND` | Watcher not found |

**Rate Limit:** 60 requests/minute per user

---

## Authentication

| Token | Algorithm | Expiry | Usage |
|-------|-----------|--------|-------|
| Access Token | HS256 | 15 minutes | API authorization |
| Refresh Token | HS256 | 7 days (30 days with `rememberMe`) | Token renewal |

**Access Token Payload:**
 
```json
{
  "sub": "user-uuid",
  "type": "access",
  "sid": "session-uuid",
  "iat": 1720701600,
  "jti": "unique-token-id"
}
```
 
### Session Management

- Sessions are stored in PostgreSQL (authoritative) and cached in Redis (fast lookup)
- Maximum **10 active sessions** per user (configurable via `SESSION_LIMIT`)
- When the limit is reached, the oldest session (by last activity) is evicted
- Refresh tokens are stored as **bcrypt hashes only** — raw tokens are never persisted

### Rate Limiting
 
| Endpoint | Limit |
|----------|-------|
| Global | 100 requests/min per IP |
| Register | 3 requests/min per IP |
| Login | 5 requests/min per IP |
| Refresh | 10 requests/min per IP |
| List Sessions | 30 requests/min per user |
| Revoke Session | 30 requests/min per user |
| Revoke All Sessions | 10 requests/min per user |
| Get User Profile | 30 requests/min per user |
| Update User Profile | 10 requests/min per user |
| Create Organization | 5 requests/min per user |
| List Organizations | 30 requests/min per user |
| Get Organization Details | 30 requests/min per user |
| Delete Organization | 5 requests/min per user |
| Create Team | 10 requests/min per user |
| List Teams | 30 requests/min per user |
| Get Team Details | 30 requests/min per user |
| Delete Team | 5 requests/min per user |
| Add Team Member | 10 requests/min per user |
| Remove Team Member | 10 requests/min per user |
| List Team Members | 30 requests/min per user |
| Create Issue | 60 requests/min per user |
| Get Issue | 120 requests/min per user |
| Update Issue | 60 requests/min per user |
| Change Issue Status | 60 requests/min per user |
| Assign Issue | 60 requests/min per user |
| Delete Issue | 30 requests/min per user |
| List Issues | 60 requests/min per user |
| List Issue Comments | 120 requests/min per user |
| Create Comment | 60 requests/min per user |
| Update Comment | 60 requests/min per user |
| Delete Comment | 30 requests/min per user |
| List Labels | 120 requests/min per user |
| Create Label | 60 requests/min per user |
| Update Label | 60 requests/min per user |
| Delete Label | 30 requests/min per user |
| Get Issue Labels | 120 requests/min per user |
| Attach Label | 60 requests/min per user |
| Detach Label | 60 requests/min per user |
| List Watchers | 120 requests/min per user |
| Add Watcher | 60 requests/min per user |
| Remove Watcher | 60 requests/min per user |

**Rate Limit Headers:**

All rate-limited responses include:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in current window
- `Retry-After`: Seconds to wait (only on 429 responses)

## Error Handling

All errors follow a consistent structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "details": []
  }
}
```

### Error Types

| Error Class | HTTP Status | Code | Description |
|-------------|-------------|------|-------------|
| `NotFoundError` | 404 | `NOT_FOUND` | Entity not found |
| `ValidationError` | 400 | `VALIDATION_ERROR` | Input validation failed |
| `ConflictError` | 409 | `CONFLICT` | Duplicate resource |
| `UnauthorizedError` | 401 | `UNAUTHORIZED` | Authentication required |
| `ForbiddenError` | 403 | `FORBIDDEN` | Insufficient permissions |
| `BusinessRuleError` | 422 | `BUSINESS_RULE_ERROR` | Domain rule violation (e.g. last admin removal, non-org member) |
| `RateLimitError` | 429 | `RATE_LIMITED` | Too many requests |
| `InternalError` | 500 | `SERVER_ERROR` | Unexpected server error |

### Error Response Examples

**ValidationError (with details):**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": [
      { "field": "email", "message": "Must be a valid email address" }
    ]
  }
}
```

**NotFoundError:**

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

**RateLimitError:**

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Rate limit exceeded. Try again later."
  }
}
```

### Rate Limit Headers

Rate-limited endpoints include the following response headers:

| Header | Description | Example |
|--------|-------------|---------|
| `X-RateLimit-Limit` | Maximum requests allowed per window | `5` |
| `X-RateLimit-Remaining` | Requests remaining in current window | `3` |
| `Retry-After` | Seconds until next request is allowed (429 response only) | `45` |

## License

MIT
