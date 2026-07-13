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
│   └── auth/
│       ├── domain/                    # Entities & schemas (users, sessions)
│       ├── application/               # Use cases + port interfaces
│       │   └── ports/                 # Repository & service interfaces
│       ├── adapters/
│       │   ├── in/                    # Controllers & DTOs (HTTP layer)
│       │   └── out/                   # DB, Redis, JWT implementations
│       └── __tests__/
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

## Authentication

### JWT Tokens

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
| `BusinessRuleError` | 422 | `BUSINESS_RULE_ERROR` | Domain rule violation |
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
