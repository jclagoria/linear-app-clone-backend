# Tech Selection — Shared Error Types & Rate Limiting

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Error Handling | Custom error classes | Full control over HTTP mappings and response format | Requires manual maintenance of error taxonomy |
| Rate Limiting | @fastify/rate-limit | Native Fastify integration, supports per-route config | Single-instance only without Redis adapter |
| Rate Limit Storage | In-memory (Map) | Simple, no external dependency for MVP | Not distributed across instances |
| Validation | Zod | Already in stack, strong TypeScript inference | Learning curve for complex schemas |

## Technology Rationale

### Error Classes

Custom error classes provide:
- Type-safe error throwing with TypeScript
- Direct HTTP status code mapping
- Consistent response format across all endpoints
- Extensibility for future error types

### Rate Limiting

@fastify/rate-limit is selected because:
- Native Fastify plugin with minimal configuration
- Supports per-route configuration via route options
- Custom error handler support for standardized error responses
- Can be upgraded to Redis store for distributed deployments

### Rate Limit Storage

In-memory storage chosen for:
- MVP simplicity — single-instance deployment
- No Redis dependency for initial implementation
- Easy upgrade path to Redis store when scaling

## Implementation Notes

- Error classes will be in `src/shared/errors/`
- Rate limit plugin will be in `src/shared/rate-limiting/`
- Both modules export types for use across the backend
- Error handler registered as Fastify onError hook
