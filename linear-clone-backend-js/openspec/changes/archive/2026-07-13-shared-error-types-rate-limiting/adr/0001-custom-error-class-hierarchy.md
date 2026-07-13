---
status: "accepted"
date: 2026-07-13
decision-makers: [Engineering Team]
consulted: []
informed: []
---

# Use Custom Error Class Hierarchy for Standardized Error Responses

## Context and Problem Statement

The backend lacks a consistent error handling pattern. Each endpoint implements its own ad-hoc error responses, making it difficult for clients to handle errors uniformly and for the API documentation to reference well-defined error schemas. We need a standardized error taxonomy that maps domain exceptions to appropriate HTTP status codes and response formats.

## Decision Drivers

- Need for consistent API contract across all endpoints
- Requirement for typed, extensible error classes
- Direct mapping between error types and HTTP status codes
- Support for field-level validation error details
- Future extensibility for new error types

## Considered Options

- Custom error class hierarchy with abstract base class
- Use existing Fastify error handling with string codes
- Use a third-party error handling library (e.g., http-errors)

## Decision Outcome

Chosen option: "Custom error class hierarchy", because it provides type-safe error throwing, direct HTTP status code mapping, and a consistent response format across all endpoints.

### Consequences

- Good, because each error class is self-documenting with its HTTP status code and error code
- Good, because TypeScript provides compile-time checking of error types
- Good, because the base class enforces a consistent toJSON() format
- Bad, because new error types require creating a new class file
- Bad, because the error taxonomy must be manually maintained

### Confirmation

Verify by checking that:
1. All error classes extend BaseError
2. Each error class has statusCode and code properties
3. The error handler correctly serializes all error types
4. Response format matches the OpenAPI schema

## Pros and Cons of the Options

### Custom error class hierarchy

Extensible, type-safe, maps directly to HTTP codes.

- Good, because full control over error response format
- Good, because TypeScript provides type safety
- Good, because easy to add new error types
- Neutral, because requires manual class creation for new errors
- Bad, because more code to maintain than string codes

### Use existing Fastify error handling with string codes

Use Fastify's built-in error handling with string error codes.

- Good, because minimal code, uses framework defaults
- Bad, because limited control over response format
- Bad, because harder to enforce consistent structure
- Bad, because no type safety for error codes

### Use a third-party error handling library

Use a library like http-errors that provides pre-built error classes.

- Good, because battle-tested, well-documented
- Bad, because adds dependency, less control over format
- Bad, because may not match our exact response format requirements

## More Information

This decision aligns with the API contract defined in `specs/api/error-contract.md` and supports the business rules in `specs/business/error-handling.md`.
