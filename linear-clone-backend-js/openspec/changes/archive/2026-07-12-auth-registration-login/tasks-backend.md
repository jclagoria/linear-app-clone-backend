# Tasks — Auth Registration Login (Backend)

## Scaffold

- [x] Initialize Node.js project with pnpm (`pnpm init`)
- [x] Install dependencies: fastify, drizzle-orm, ioredis, jose, bcrypt, zod, uuid, dotenv
- [x] Install dev dependencies: typescript, vitest, @types/node, @types/bcrypt, drizzle-kit
- [x] Configure TypeScript (`tsconfig.json`)
- [x] Create project structure: `src/modules/`, `src/shared/`
- [x] Configure ESLint and Prettier
- [x] Create `package.json` scripts: dev, build, test, lint

## Data Layer

- [x] Configure Drizzle ORM with PostgreSQL connection
- [x] Create users table schema (`src/modules/auth/domain/user.ts`)
- [x] Create sessions table schema (`src/modules/auth/domain/session.ts`)
- [x] Generate initial migration (`drizzle-kit generate`)
- [x] Create UserRepository port (`src/modules/auth/application/ports/user-repository.ts`)
- [x] Implement DrizzleUserRepository adapter (`src/modules/auth/adapters/out/drizzle-user-repository.ts`)
- [x] Create SessionRepository port (`src/modules/auth/application/ports/session-repository.ts`)
- [x] Implement RedisSessionStore adapter (`src/modules/auth/adapters/out/redis-session-store.ts`)

## Business Logic

- [x] Create RegisterUser use case (`src/modules/auth/application/register-user.ts`)
- [x] Create LoginUser use case (`src/modules/auth/application/login-user.ts`)
- [x] Create ValidateToken use case (`src/modules/auth/application/validate-token.ts`)
- [x] Create TokenService port (`src/modules/auth/application/ports/token-service.ts`)
- [x] Implement TokenService adapter with jose (`src/modules/auth/adapters/out/token-service.ts`)
- [x] Create EventPublisher port (`src/modules/auth/application/ports/event-publisher.ts`)
- [x] Implement in-memory EventPublisher adapter (`src/modules/auth/adapters/out/in-memory-event-publisher.ts`)

## API Layer

- [x] Create Fastify app setup (`src/app.ts`)
- [x] Create server entry point (`src/server.ts`)
- [x] Create AuthController (`src/modules/auth/adapters/in/auth-controller.ts`)
- [x] Define request/response DTOs with Zod schemas
- [x] Create POST /api/v1/auth/register route
- [x] Create POST /api/v1/auth/login route
- [x] Implement error handler middleware
- [x] Add rate limiting middleware (register: 3/min, login: 5/min per IP)
- [x] Add rate limit headers to responses

## Events / Messaging

- [x] Define UserRegistered event type
- [x] Define UserLoggedIn event type
- [x] Emit UserRegistered event on registration
- [x] Emit UserLoggedIn event on login

## Security

- [x] Implement password hashing with bcrypt (cost factor 12)
- [x] Implement JWT access token generation (15 min expiry)
- [x] Implement refresh token generation (7/30 days expiry)
- [x] Store refresh token hashes in Redis
- [x] Implement session limit enforcement (10 max, evict oldest)
- [x] Add input validation with Zod schemas
- [x] Ensure error messages don't disclose email existence
- [x] Configure CORS for frontend

## Testing

### Unit Tests

- [x] Test User entity creation and validation
- [x] Test password hashing and verification
- [x] Test token generation and validation
- [x] Test session limit enforcement logic
- [x] Test email validation (format, uniqueness)
- [x] Test password validation (min length)

### Integration Tests

- [x] Test user registration flow (API → Database)
- [x] Test login flow (API → Database → Redis)
- [x] Test session eviction under limit
- [x] Test rate limiting behavior
- [x] Test duplicate email rejection
- [x] Test invalid credentials rejection

### Contract Tests

- [x] Test API response schemas match specs-api
- [x] Test error responses match error contract
- [x] Test rate limit headers present
- [x] Test 201 response for registration
- [x] Test 200 response for login
- [x] Test 400/401/409/429 error responses

## Review

- [x] Self-review code for security vulnerabilities
- [x] Verify all tasks from specs are implemented
- [x] Run full test suite
- [x] Run linter and fix issues
- [x] Create PR with description
