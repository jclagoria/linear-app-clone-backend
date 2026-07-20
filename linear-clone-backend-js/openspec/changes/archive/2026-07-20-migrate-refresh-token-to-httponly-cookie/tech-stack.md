# Tech Selection — Refresh Token Cookie Migration (Backend)

## Decision Summary

No new technology choices are required for this change. The existing stack is fully capable of implementing HttpOnly cookie support. The following additions are confirmed:

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Backend Runtime | Node.js 24 LTS (unchanged) | Already in use | None |
| Backend Framework | Fastify 5 (unchanged) | Already in use | None |
| Cookie Management | `@fastify/cookie` plugin | Native Fastify plugin, integrates with request/response lifecycle, supports signed cookies if needed | Additional dependency |
| Auth | JWT (jose) + HttpOnly cookie (unchanged) | Token generation remains the same; only transport changes | None |
| CORS | `@fastify/cors` with `credentials: true` (unchanged) | Already configured | Must ensure origin is not wildcard |

## Dependency Addition

```
@fastify/cookie ^11.0.0
```

This plugin provides:
- `reply.setCookie(name, value, options)` — set cookies on responses
- `request.cookies` — parsed cookie object on requests
- `reply.clearCookie(name, options)` — clear cookies

## Existing Stack References

The existing stack and architecture documented in `docs/stack-backend.md` and `docs/architecture-backend.md` remain valid. No changes to database, caching, or deployment are needed.

## Next Steps

1. Install `@fastify/cookie` package
2. Register the cookie plugin in `src/app.ts`
3. Proceed to design phase
