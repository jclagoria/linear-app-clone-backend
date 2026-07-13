# Shared Module — Error Types & Rate Limiting

## Problem Statement

The backend currently lacks standardized error handling and request throttling. Without consistent error types, each endpoint implements its own ad-hoc error responses, making it difficult for clients to handle errors uniformly. Additionally, critical authentication endpoints (login, register, refresh) have no rate limiting, exposing them to abuse and brute-force attacks.

## Motivation

This change establishes the foundational error taxonomy and rate limiting infrastructure for the entire backend. By standardizing errors and throttling sensitive endpoints, we deliver:

- **Consistent API contract**: Clients can rely on uniform error shapes across all endpoints
- **Security hardening**: Auth endpoints are protected against credential stuffing and abuse
- **Developer experience**: Clear, typed errors reduce debugging time and improve DX
- **API documentation accuracy**: OpenAPI spec can reference well-defined error schemas

## Scope

- **In scope**:
  - 8 standardized error types (NotFound, Validation, Conflict, Unauthorized, Forbidden, BusinessRule, RateLimit, Internal)
  - HTTP status code mappings for each error type
  - Uniform error response format: `{ error: { code, message, details[] } }`
  - `details[]` array (only populated for ValidationError)
  - Per-endpoint rate limiting with configurable limits
  - Rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`
  - Rate limiting configuration: Login (5/min), Register (3/min), Refresh (10/min) per IP

- **Out of scope**:
  - Client-side error handling implementation
  - Rate limiting for non-auth endpoints (future work)
  - Error logging/monitoring infrastructure (separate concern)
  - Validation helpers (separate atomic part in spec)

## Impact

- **Shared module**: New `errors` and `rate-limiting` modules in the shared layer
- **All API consumers**: Clients must handle the standardized error response format
- **Auth endpoints**: Login, Register, Refresh will enforce rate limits
- **API documentation**: OpenAPI spec will reference the error schemas defined here
