# Tasks — Shared Error Types & Rate Limiting (Backend)

## Scaffold

- [ ] Create `src/shared/errors/` directory structure
- [ ] Create `src/shared/rate-limiting/` directory structure
- [ ] Add TypeScript interfaces for error types in `src/shared/errors/types.ts`

## Data Layer

- [ ] No database migrations required (in-memory storage for MVP)

## Business Logic

### Error Classes

- [ ] Create `BaseError` abstract class with statusCode, code, details, toJSON()
- [ ] Create `NotFoundError` (404, NOT_FOUND)
- [ ] Create `ValidationError` (400, VALIDATION_ERROR) with details array support
- [ ] Create `ConflictError` (409, CONFLICT)
- [ ] Create `UnauthorizedError` (401, UNAUTHORIZED)
- [ ] Create `ForbiddenError` (403, FORBIDDEN)
- [ ] Create `BusinessRuleError` (422, BUSINESS_RULE_ERROR)
- [ ] Create `RateLimitError` (429, RATE_LIMITED)
- [ ] Create `InternalError` (500, SERVER_ERROR) with sanitized message
- [ ] Create barrel export in `src/shared/errors/index.ts`

### Rate Limiting

- [ ] Create `InMemoryStore` class with increment/decrement/reset methods
- [ ] Create `rateLimitPlugin` Fastify plugin with default configuration
- [ ] Configure per-route overrides for auth endpoints (login: 5/min, register: 3/min, refresh: 10/min)
- [ ] Add error response builder for standardized 429 responses
- [ ] Configure rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After)
- [ ] Create barrel export in `src/shared/rate-limiting/index.ts`

## API Layer

### Error Handler

- [ ] Register Fastify onError hook for error handling
- [ ] Implement BaseError detection and serialization
- [ ] Implement fallback to InternalError for unhandled exceptions
- [ ] Add error logging for unexpected exceptions
- [ ] Ensure error response format matches OpenAPI schema

### Rate Limit Integration

- [ ] Register rate-limit plugin in Fastify app
- [ ] Apply rate limits to POST /api/v1/auth/login (5/min)
- [ ] Apply rate limits to POST /api/v1/auth/register (3/min)
- [ ] Apply rate limits to POST /api/v1/auth/refresh (10/min)
- [ ] Verify rate limit headers are included in all responses

## Events / Messaging

- [ ] No events required for this change

## Security

- [ ] Ensure InternalError does not expose exception messages
- [ ] Ensure error messages are sanitized for client consumption
- [ ] Verify X-Forwarded-For header is respected for IP detection
- [ ] No rate limit bypass mechanism — all requests subject to limits

## Testing

### Unit Tests

- [ ] Test each error class returns correct statusCode and code
- [ ] Test toJSON produces correct response format
- [ ] Test ValidationError includes details, others do not
- [ ] Test InternalError message is generic (not exception message)
- [ ] Test InMemoryStore increment/decrement/reset methods
- [ ] Test InMemoryStore window expiry resets counter

### Integration Tests

- [ ] Test error handler catches and formats BaseError instances
- [ ] Test error handler wraps unhandled exceptions as InternalError
- [ ] Test rate limit plugin enforces limits per endpoint
- [ ] Test rate limit headers are included in responses
- [ ] Test 429 response includes Retry-After header
- [ ] Test different IPs are tracked independently

### Contract Tests

- [ ] Test error response format matches OpenAPI schema
- [ ] Test rate limit headers match API contract

## Review

- [ ] Self-review against design-backend.md
- [ ] Verify all error types match the error contract spec
- [ ] Verify rate limiting configuration matches business spec
- [ ] Verify ADR decisions are reflected in implementation
- [ ] PR checklist: tests pass, no lint errors, types correct
