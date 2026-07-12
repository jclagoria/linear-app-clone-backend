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
    └── errors/error-handler.ts        # Global error handler
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

## Error Handling

All errors follow a consistent structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description"
  }
}
```

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request body validation failed |
| `UNAUTHORIZED` | 401 | Invalid credentials or missing auth |
| `CONFLICT` | 409 | Resource already exists |
| `SERVER_ERROR` | 500 | Internal server error |

## License

MIT
