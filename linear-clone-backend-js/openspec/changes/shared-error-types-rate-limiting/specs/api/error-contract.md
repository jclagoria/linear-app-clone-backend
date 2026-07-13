# Shared Module — Error Contract

## Error Response Format

All error responses SHALL conform to the following JSON structure:

```json
{
  "error": {
    "code": "<string>",
    "message": "<string>",
    "details": []
  }
}
```

- **code**: Machine-readable error identifier (string)
- **message**: Human-readable description (string)
- **details**: Optional array, populated ONLY for ValidationError

## Error Types

| Error Class | HTTP Status | Code | Description |
|-------------|-------------|------|-------------|
| NotFoundError | 404 | `NOT_FOUND` | Entity not found |
| ValidationError | 400 | `VALIDATION_ERROR` | Input validation failed |
| ConflictError | 409 | `CONFLICT` | Duplicate resource |
| UnauthorizedError | 401 | `UNAUTHORIZED` | Authentication required |
| ForbiddenError | 403 | `FORBIDDEN` | Insufficient permissions |
| BusinessRuleError | 422 | `BUSINESS_RULE_ERROR` | Domain rule violation |
| RateLimitError | 429 | `RATE_LIMITED` | Too many requests |
| InternalError | 500 | `SERVER_ERROR` | Unexpected server error |

## Error Response Examples

### ValidationError (with details)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  }
}
```

### NotFoundError

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### RateLimitError

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Rate limit exceeded. Try again later."
  }
}
```

## Rate Limiting Headers

Rate-limited endpoints MUST include the following response headers:

| Header | Description | Example |
|--------|-------------|---------|
| `X-RateLimit-Limit` | Maximum requests allowed per window | `5` |
| `X-RateLimit-Remaining` | Requests remaining in current window | `3` |
| `Retry-After` | Seconds until next request is allowed (429 response only) | `45` |

## Rate Limit Configuration

Rate limits are applied per IP address per endpoint:

| Endpoint | Limit | Window |
|----------|-------|--------|
| Login | 5 requests | 1 minute |
| Register | 3 requests | 1 minute |
| Refresh | 10 requests | 1 minute |

## Error Behavior

- All endpoints SHALL return the standardized error format
- ValidationError details array SHALL contain field-level validation messages
- RateLimitError SHALL include Retry-After header indicating when to retry
- InternalError SHALL NOT expose internal implementation details
