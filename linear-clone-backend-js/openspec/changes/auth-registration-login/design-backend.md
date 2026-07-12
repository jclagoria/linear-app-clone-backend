# Auth Module — Backend Design

## Architecture Decisions

### Hexagonal Architecture (Ports & Adapters)

The Auth Module follows hexagonal architecture with clear separation between domain logic and infrastructure:

- **Domain layer**: Pure TypeScript entities (User, Session) with business rules
- **Application layer**: Use cases (RegisterUser, LoginUser, ValidateToken) with port interfaces
- **Adapters**: Controllers (HTTP), Repositories (PostgreSQL, Redis), Services (JWT, bcrypt)

**Rationale**: Enables testing domain logic without infrastructure, supports swapping implementations (e.g., Redis → PostgreSQL for sessions).

### JWT Dual Token Strategy

Access tokens (15 min) are stateless JWTs. Refresh tokens (7/30 days) are stored as hashes in Redis sessions.

**Rationale**: Access tokens avoid database lookups on every request. Refresh tokens enable session revocation and management.

## API Contracts

### POST /api/v1/auth/register

- **Request**: `{ email: string, name: string, password: string }`
- **Response 201**: `{ data: { user: UserObject, accessToken: string, refreshToken: string } }`
- **Response 400**: `{ error: { code: "VALIDATION_ERROR", message: "...", details: [...] } }`
- **Response 409**: `{ error: { code: "CONFLICT", message: "Email already registered" } }`
- **Response 429**: `{ error: { code: "RATE_LIMITED", message: "...", retry_after: 60 } }`

### POST /api/v1/auth/login

- **Request**: `{ email: string, password: string, rememberMe?: boolean }`
- **Response 200**: `{ data: { user: UserObject, accessToken: string, refreshToken: string } }`
- **Response 401**: `{ error: { code: "UNAUTHORIZED", message: "Invalid email or password" } }`
- **Response 429**: `{ error: { code: "RATE_LIMITED", message: "...", retry_after: 60 } }`

## Data Model

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### Sessions Table

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT NOT NULL,
  remember_me BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_activity_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_refresh_token ON sessions(refresh_token_hash);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

### Redis Session Storage

Refresh tokens are also stored in Redis for fast lookup:

```
Key: session:{session_id}
Value: { userId, refreshTokenHash, ipAddress, userAgent, rememberMe, createdAt, lastActivityAt, expiresAt }
TTL: 7 days (or 30 days with rememberMe)
```

## Business Logic

### RegisterUser Service

- **Responsibility**: Create new user account, hash password, issue tokens
- **Rules**:
  - Email format validation (RFC 5322)
  - Email uniqueness check
  - Password minimum 8 characters
  - Password hashed with bcrypt (cost factor 12)
  - Access token (15 min) and refresh token (7 days) issued
- **Dependencies**: UserRepository, TokenService

### LoginUser Service

- **Responsibility**: Authenticate user, create session, issue tokens
- **Rules**:
  - Email lookup (constant-time comparison)
  - Password verification with bcrypt
  - Session creation with IP and user agent
  - Session limit enforcement (10 max, evict oldest)
  - RememberMe extends refresh token to 30 days
  - Emit UserLoggedIn event
- **Dependencies**: UserRepository, SessionRepository, TokenService, EventPublisher

### ValidateToken Service

- **Responsibility**: Verify access token signature and expiry
- **Rules**:
  - Cryptographic signature verification (jose)
  - Expiry check
  - Extract userId from claims
- **Dependencies**: TokenService

## Security

### Authentication

- **Access tokens**: Signed JWTs with HS256 (or RS256 for production)
- **Refresh tokens**: Opaque tokens stored as bcrypt hashes in Redis
- **Password hashing**: bcrypt with adaptive cost factor (12)

### Rate Limiting

- **Register**: 3 requests/min per IP
- **Login**: 5 requests/min per IP
- **Implementation**: Redis-based sliding window

### Input Validation

- **Zod schemas** at API boundary for request validation
- **Domain invariants** enforced in use cases
- **SQL injection prevention**: Parameterized queries via Drizzle ORM

### Error Handling

- **Consistent error format**: `{ error: { code, message, details? } }`
- **No information disclosure**: Login errors always return "Invalid email or password"
- **Rate limit headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | Domain entities, use cases, validators |
| Integration | Vitest + Testcontainers | Repository, Redis, full API flow |
| Contract | Vitest | API contract verification |

### Unit Tests

- User entity creation and validation
- Password hashing and verification
- Token generation and validation
- Session limit enforcement logic

### Integration Tests

- User registration flow (API → Database)
- Login flow (API → Database → Redis)
- Session eviction under limit
- Rate limiting behavior

### Contract Tests

- API response schemas match specs-api
- Error responses match error contract
- Rate limit headers present
