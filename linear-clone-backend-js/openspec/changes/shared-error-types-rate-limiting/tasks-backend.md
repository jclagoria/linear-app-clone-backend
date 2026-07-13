# Tasks — Shared Error Types & Rate Limiting (Backend)

## Scaffold

- [x] Create `src/shared/errors/` directory structure
- [x] Create `src/shared/rate-limiting/` directory structure
- [x] Add TypeScript interfaces for error types in `src/shared/errors/types.ts`

## Data Layer

- [x] No database migrations required (in-memory storage for MVP)

## Business Logic

### Error Classes

- [x] Create `BaseError` abstract class with statusCode, code, details, toJSON()
- [x] Create `NotFoundError` (404, NOT_FOUND)
- [x] Create `ValidationError` (400, VALIDATION_ERROR) with details array support
- [x] Create `ConflictError` (409, CONFLICT)
- [x] Create `UnauthorizedError` (401, UNAUTHORIZED)
- [x] Create `ForbiddenError` (403, FORBIDDEN)
- [x] Create `BusinessRuleError` (422, BUSINESS_RULE_ERROR)
- [x] Create `RateLimitError` (429, RATE_LIMITED)
- [x] Create `InternalError` (500, SERVER_ERROR) with sanitized message
- [x] Create barrel export in `src/shared/errors/index.ts`

### Rate Limiting

- [x] Create `InMemoryStore` class with increment/decrement/reset methods
- [x] Create `rateLimitPlugin` Fastify plugin with default configuration
- [x] Configure per-route overrides for auth endpoints (login: 5/min, register: 3/min, refresh: 10/min)
- [x] Add error response builder for standardized 429 responses
- [x] Configure rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After)
- [x] Create barrel export in `src/shared/rate-limiting/index.ts`

## API Layer

### Error Handler

- [x] Register Fastify onError hook for error handling
- [x] Implement BaseError detection and serialization
- [x] Implement fallback to InternalError for unhandled exceptions
- [x] Add error logging for unexpected exceptions
- [x] Ensure error response format matches OpenAPI schema

### Rate Limit Integration

- [x] Register rate-limit plugin in Fastify app
- [x] Apply rate limits to POST /api/v1/auth/login (5/min)
- [x] Apply rate limits to POST /api/v1/auth/register (3/min)
- [x] Apply rate limits to POST /api/v1/auth/refresh (10/min)
- [x] Verify rate limit headers are included in all responses

## Events / Messaging

- [x] No events required for this change

## Security

- [x] Ensure InternalError does not expose exception messages
- [x] Ensure error messages are sanitized for client consumption
- [x] Verify X-Forwarded-For header is respected for IP detection
- [x] No rate limit bypass mechanism — all requests subject to limits

## Testing

### Unit Tests

- [x] Test each error class returns correct statusCode and code
- [x] Test toJSON produces correct response format
- [x] Test ValidationError includes details, others do not
- [x] Test InternalError message is generic (not exception message)
- [x] Test InMemoryStore increment/decrement/reset methods
- [x] Test InMemoryStore window expiry resets counter

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

- [x] Self-review against design-backend.md
- [x] Verify all error types match the error contract spec
- [x] Verify rate limiting configuration matches business spec
- [x] Verify ADR decisions are reflected in implementation
- [x] PR checklist: tests pass, no lint errors, types correct
