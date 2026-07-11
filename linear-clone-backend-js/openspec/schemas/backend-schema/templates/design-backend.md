# {Domain} — Backend Design

## Architecture Decisions

{Key decisions, rationale, and trade-offs.}

## API Contracts

### {Endpoint}

- **Method**: GET/POST/PUT/DELETE
- **Path**: `/api/v1/{resource}`
- **Request**: {payload schema}
- **Response**: {response schema}
- **Status Codes**: {200, 201, 204, 400, 401, 403, 404, 409, 422, 429, 500}

## Data Model

### {Entity}

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| {field} | {type} | {nullable, unique, FK} | {notes} |

### Migrations

| Version | Description |
|---------|-------------|
| V1 | {initial tables} |
| V2 | {alterations} |

## Business Logic

### {Service}

- **Responsibility**: {what it does}
- **Rules**: {business validations, edge cases}
- **Dependencies**: {repositories, other services}

## Security

- **Authentication**: {JWT, session, API key}
- **Authorization**: {roles, permissions, guards}
- **Input Sanitization**: {validation, escaping, rate limiting}

## Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | {JUnit, Mockito} | Services, mappers, validators |
| Integration | {Testcontainers} | Repository, full API flow |
| Contract | {Spring Cloud Contract} | API contract verification |
