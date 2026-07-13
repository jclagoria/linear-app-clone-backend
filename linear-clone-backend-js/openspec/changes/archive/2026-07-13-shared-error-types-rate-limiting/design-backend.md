# Shared Module — Backend Design

## Architecture Decisions

| Decision | Rationale | Trade-offs |
|----------|-----------|------------|
| Custom error class hierarchy | Extensible, type-safe, maps directly to HTTP codes | Requires manual class creation for new error types |
| Fastify onError hook for error formatting | Centralized error response formatting | Single point of failure — must handle all error types |
| In-memory rate limit store for MVP | Simple, no Redis dependency | Cannot scale to multiple instances |
| Zod for input validation | Already in stack, excellent TypeScript support | Schema definitions duplicated between validation and types |

## Module Structure

```
src/shared/
├── errors/
│   ├── index.ts              # Export all error classes
│   ├── base-error.ts         # Abstract base error class
│   ├── not-found.ts          # NotFoundError
│   ├── validation.ts         # ValidationError
│   ├── conflict.ts           # ConflictError
│   ├── unauthorized.ts       # UnauthorizedError
│   ├── forbidden.ts          # ForbiddenError
│   ├── business-rule.ts      # BusinessRuleError
│   ├── rate-limit.ts         # RateLimitError
│   └── internal.ts           # InternalError
└── rate-limiting/
    ├── index.ts              # Export rate limit plugin
    ├── rate-limit-plugin.ts  # Fastify plugin registration
    └── in-memory-store.ts    # In-memory store implementation
```

## Error Class Hierarchy

### Base Error Class

```typescript
abstract class BaseError extends Error {
  abstract readonly statusCode: number;
  abstract readonly code: string;
  readonly details?: ErrorDetail[];

  constructor(message: string, details?: ErrorDetail[]) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.details && { details: this.details }),
      },
    };
  }
}
```

### Error Classes

| Class | statusCode | code | Has details |
|-------|-----------|------|-------------|
| NotFoundError | 404 | NOT_FOUND | No |
| ValidationError | 400 | VALIDATION_ERROR | Yes |
| ConflictError | 409 | CONFLICT | No |
| UnauthorizedError | 401 | UNAUTHORIZED | No |
| ForbiddenError | 403 | FORBIDDEN | No |
| BusinessRuleError | 422 | BUSINESS_RULE_ERROR | No |
| RateLimitError | 429 | RATE_LIMITED | No |
| InternalError | 500 | SERVER_ERROR | No |

## Error Handler

Fastify onError hook that:

1. Catches all errors thrown in route handlers
2. Checks if error is instance of BaseError
3. If yes: serializes using toJSON() with appropriate status code
4. If no: wraps in InternalError, logs original, returns 500

```typescript
fastify.setErrorHandler((error, request, reply) => {
  if (error instanceof BaseError) {
    reply.status(error.statusCode).send(error.toJSON());
  } else {
    // Log unexpected error
    request.log.error(error);
    const internalError = new InternalError();
    reply.status(500).send(internalError.toJSON());
  }
});
```

## Rate Limiting Design

### Plugin Configuration

```typescript
fastify.register(rateLimit, {
  max: 100,           // Default limit
  timeWindow: '1 minute',
  errorResponseBuilder: (request, context) => ({
    error: {
      code: 'RATE_LIMITED',
      message: 'Rate limit exceeded. Try again later.',
    },
  }),
  addHeadersOnExceeding: {
    'x-ratelimit-limit': true,
    'x-ratelimit-remaining': true,
  },
  addHeaders: {
    'x-ratelimit-limit': true,
    'x-ratelimit-remaining': true,
    'retry-after': true,
  },
});
```

### Per-Route Overrides

| Route | Limit | Window |
|-------|-------|--------|
| POST /api/v1/auth/login | 5 | 1 minute |
| POST /api/v1/auth/register | 3 | 1 minute |
| POST /api/v1/auth/refresh | 10 | 1 minute |

### In-Memory Store

```typescript
class InMemoryStore {
  private store: Map<string, { count: number; expiresAt: number }>;

  async increment(key: string, windowMs: number): Promise<{ count: number; ttl: number }> {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || entry.expiresAt < now) {
      this.store.set(key, { count: 1, expiresAt: now + windowMs });
      return { count: 1, ttl: windowMs };
    }

    entry.count++;
    return { count: entry.count, ttl: entry.expiresAt - now };
  }

  async decrement(key: string): Promise<void> {
    const entry = this.store.get(key);
    if (entry && entry.count > 0) {
      entry.count--;
    }
  }

  async reset(key: string): Promise<void> {
    this.store.delete(key);
  }
}
```

## Business Logic

### Error Service

- **Responsibility**: Create typed error instances with consistent formatting
- **Rules**: 
  - ValidationError MUST include details array
  - All other errors MUST NOT include details
  - InternalError MUST NOT expose exception messages
- **Dependencies**: None (pure utility)

### Rate Limit Service

- **Responsibility**: Track request counts per IP per endpoint
- **Rules**:
  - Sliding window algorithm (rolling 1-minute windows)
  - Request count persists across window boundary until TTL expires
  - Headers included on ALL responses (not just 429)
- **Dependencies**: In-memory store (or Redis store for production)

## Security

- **Authentication**: N/A — shared module, no auth logic
- **Authorization**: N/A — used by authenticated routes
- **Input Sanitization**: Error messages sanitized to prevent information leakage
- **Rate Limit Bypass**: No bypass mechanism — all requests subject to limits
- **IP Detection**: Uses X-Forwarded-For header when behind reverse proxy

## Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | Error class instantiation, toJSON serialization, status codes |
| Unit | Vitest | Rate limit store increment/decrement/reset |
| Integration | Vitest + Fastify test | Error handler hook, rate limit plugin behavior |
| Contract | Vitest | Response format matches OpenAPI schema |

### Test Cases

**Error Classes**:
- Each error class returns correct statusCode and code
- toJSON produces correct response format
- ValidationError includes details, others do not
- InternalError message is generic (not exception message)

**Rate Limiting**:
- Request within limit passes and includes headers
- Request exceeding limit returns 429 with Retry-After
- Window expiry resets counter
- Different IPs tracked independently
