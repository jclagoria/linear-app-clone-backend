# Tasks — Auth Registration Login (Backend)

## Scaffold

- [ ] Initialize Node.js project with pnpm (`pnpm init`)
- [ ] Install dependencies: fastify, drizzle-orm, ioredis, jose, bcrypt, zod, uuid, dotenv
- [ ] Install dev dependencies: typescript, vitest, @types/node, @types/bcrypt, drizzle-kit
- [ ] Configure TypeScript (`tsconfig.json`)
- [ ] Create project structure: `src/modules/`, `src/shared/`
- [ ] Configure ESLint and Prettier
- [ ] Create `package.json` scripts: dev, build, test, lint

## Data Layer

- [ ] Configure Drizzle ORM with PostgreSQL connection
- [ ] Create users table schema (`src/modules/auth/domain/user.ts`)
- [ ] Create sessions table schema (`src/modules/auth/domain/session.ts`)
- [ ] Generate initial migration (`drizzle-kit generate`)
- [ ] Create UserRepository port (`src/modules/auth/application/ports/user-repository.ts`)
- [ ] Implement DrizzleUserRepository adapter (`src/modules/auth/adapters/out/drizzle-user-repository.ts`)
- [ ] Create SessionRepository port (`src/modules/auth/application/ports/session-repository.ts`)
- [ ] Implement RedisSessionStore adapter (`src/modules/auth/adapters/out/redis-session-store.ts`)

## Business Logic

- [ ] Create RegisterUser use case (`src/modules/auth/application/register-user.ts`)
- [ ] Create LoginUser use case (`src/modules/auth/application/login-user.ts`)
- [ ] Create ValidateToken use case (`src/modules/auth/application/validate-token.ts`)
- [ ] Create TokenService port (`src/modules/auth/application/ports/token-service.ts`)
- [ ] Implement TokenService adapter with jose (`src/modules/auth/adapters/out/token-service.ts`)
- [ ] Create EventPublisher port (`src/modules/auth/application/ports/event-publisher.ts`)
- [ ] Implement in-memory EventPublisher adapter (`src/modules/auth/adapters/out/in-memory-event-publisher.ts`)

## API Layer

- [ ] Create Fastify app setup (`src/app.ts`)
- [ ] Create server entry point (`src/server.ts`)
- [ ] Create AuthController (`src/modules/auth/adapters/in/auth-controller.ts`)
- [ ] Define request/response DTOs with Zod schemas
- [ ] Create POST /api/v1/auth/register route
- [ ] Create POST /api/v1/auth/login route
- [ ] Implement error handler middleware
- [ ] Add rate limiting middleware (register: 3/min, login: 5/min per IP)
- [ ] Add rate limit headers to responses

## Events / Messaging

- [ ] Define UserRegistered event type
- [ ] Define UserLoggedIn event type
- [ ] Emit UserRegistered event on registration
- [ ] Emit UserLoggedIn event on login

## Security

- [ ] Implement password hashing with bcrypt (cost factor 12)
- [ ] Implement JWT access token generation (15 min expiry)
- [ ] Implement refresh token generation (7/30 days expiry)
- [ ] Store refresh token hashes in Redis
- [ ] Implement session limit enforcement (10 max, evict oldest)
- [ ] Add input validation with Zod schemas
- [ ] Ensure error messages don't disclose email existence
- [ ] Configure CORS for frontend

## Testing

### Unit Tests

- [ ] Test User entity creation and validation
- [ ] Test password hashing and verification
- [ ] Test token generation and validation
- [ ] Test session limit enforcement logic
- [ ] Test email validation (format, uniqueness)
- [ ] Test password validation (min length)

### Integration Tests

- [ ] Test user registration flow (API → Database)
- [ ] Test login flow (API → Database → Redis)
- [ ] Test session eviction under limit
- [ ] Test rate limiting behavior
- [ ] Test duplicate email rejection
- [ ] Test invalid credentials rejection

### Contract Tests

- [ ] Test API response schemas match specs-api
- [ ] Test error responses match error contract
- [ ] Test rate limit headers present
- [ ] Test 201 response for registration
- [ ] Test 200 response for login
- [ ] Test 400/401/409/429 error responses

## Review

- [ ] Self-review code for security vulnerabilities
- [ ] Verify all tasks from specs are implemented
- [ ] Run full test suite
- [ ] Run linter and fix issues
- [ ] Create PR with description
