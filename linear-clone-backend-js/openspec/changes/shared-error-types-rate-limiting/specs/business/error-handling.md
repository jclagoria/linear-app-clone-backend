# Shared Module — Business Specification

## Behaviour

**Feature:** Standardized Error Handling

All API endpoints SHALL return errors using the standardized error response format defined in the error contract. The system SHALL map domain exceptions to appropriate HTTP status codes and error codes.

### Requirement: Error Response Consistency

#### Scenario: ValidationError with field-level details

- **GIVEN** a client submits a request with invalid input fields
- **WHEN** the server processes the request
- **THEN** the server returns HTTP 400 with error code `VALIDATION_ERROR`
- **AND** the response includes a `details` array containing field-level error messages

#### Scenario: NotFoundError for missing entity

- **GIVEN** a client requests an entity that does not exist
- **WHEN** the server cannot locate the resource
- **THEN** the server returns HTTP 404 with error code `NOT_FOUND`
- **AND** the response `details` array is omitted

#### Scenario: ConflictError for duplicate resource

- **GIVEN** a client attempts to create a resource that already exists
- **WHEN** the server detects a unique constraint violation
- **THEN** the server returns HTTP 409 with error code `CONFLICT`

#### Scenario: UnauthorizedError for missing authentication

- **GIVEN** a client accesses a protected endpoint without valid credentials
- **WHEN** the server cannot authenticate the request
- **THEN** the server returns HTTP 401 with error code `UNAUTHORIZED`

#### Scenario: ForbiddenError for insufficient permissions

- **GIVEN** an authenticated client accesses a resource they lack permission for
- **WHEN** the server checks authorization rules
- **THEN** the server returns HTTP 403 with error code `FORBIDDEN`

#### Scenario: BusinessRuleError for domain violations

- **GIVEN** a client action violates a business rule
- **WHEN** the server evaluates domain constraints
- **THEN** the server returns HTTP 422 with error code `BUSINESS_RULE_ERROR`

#### Scenario: InternalError for unexpected failures

- **GIVEN** an unexpected error occurs during request processing
- **WHEN** the server encounters an unhandled exception
- **THEN** the server returns HTTP 500 with error code `SERVER_ERROR`
- **AND** the response does NOT expose internal implementation details

---

**Feature:** Rate Limiting

The system SHALL enforce per-endpoint rate limits on authentication endpoints to prevent abuse. Rate limiting SHALL be applied per client IP address within a rolling time window.

### Requirement: Login Endpoint Rate Limiting

#### Scenario: Login within rate limit

- **GIVEN** a client has made fewer than 5 login requests in the past minute
- **WHEN** the client sends a login request
- **THEN** the request is processed normally
- **AND** the response includes `X-RateLimit-Limit: 5` header
- **AND** the response includes `X-RateLimit-Remaining` header with count of remaining requests

#### Scenario: Login exceeds rate limit

- **GIVEN** a client has made 5 or more login requests in the past minute
- **WHEN** the client sends a login request
- **THEN** the server returns HTTP 429 with error code `RATE_LIMITED`
- **AND** the response includes `Retry-After` header with seconds until next allowed request

### Requirement: Register Endpoint Rate Limiting

#### Scenario: Register within rate limit

- **GIVEN** a client has made fewer than 3 register requests in the past minute
- **WHEN** the client sends a register request
- **THEN** the request is processed normally
- **AND** the response includes `X-RateLimit-Limit: 3` header

#### Scenario: Register exceeds rate limit

- **GIVEN** a client has made 3 or more register requests in the past minute
- **WHEN** the client sends a register request
- **THEN** the server returns HTTP 429 with error code `RATE_LIMITED`

### Requirement: Refresh Endpoint Rate Limiting

#### Scenario: Refresh within rate limit

- **GIVEN** a client has made fewer than 10 refresh requests in the past minute
- **WHEN** the client sends a token refresh request
- **THEN** the request is processed normally
- **AND** the response includes `X-RateLimit-Limit: 10` header

#### Scenario: Refresh exceeds rate limit

- **GIVEN** a client has made 10 or more refresh requests in the past minute
- **WHEN** the client sends a token refresh request
- **THEN** the server returns HTTP 429 with error code `RATE_LIMITED`

---

## Data Model

### ErrorLog (Internal — not exposed)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | System-generated |
| timestamp | DateTime | NOT NULL | When error occurred |
| errorCode | String | NOT NULL | Error code from taxonomy |
| endpoint | String | NOT NULL | Request path |
| clientId | String | IP address | Client identifier |

### RateLimitEntry (Internal — not exposed)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK | System-generated |
| clientId | String | NOT NULL, INDEXED | IP address |
| endpoint | String | NOT NULL | Rate-limited path |
| windowStart | DateTime | NOT NULL | Start of time window |
| requestCount | Integer | NOT NULL, DEFAULT 0 | Requests in current window |

### Relationships

RateLimitEntry --per--> IP Address: Tracks request counts per client per endpoint

---

## Business Rules

- Error messages SHALL be safe for client consumption (no stack traces, no internal paths)
- ValidationError details array SHALL contain exactly one entry per invalid field
- Rate limit windows SHALL be calculated as rolling windows from the first request
- Rate limit state SHALL be persisted in shared storage (Redis or similar) for multi-instance deployments
- Once a rate limit window expires, the request count SHALL reset to zero

---

## Security

- Rate limiting SHALL use client IP address as the identifier
- X-Forwarded-For header SHALL be respected when behind a reverse proxy
- InternalError responses SHALL NOT leak exception messages or stack traces
- Rate limit state storage SHALL have appropriate TTL to prevent memory exhaustion
