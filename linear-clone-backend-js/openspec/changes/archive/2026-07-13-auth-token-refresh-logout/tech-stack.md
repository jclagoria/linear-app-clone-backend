# Tech Selection — Linear App Clone Backend (Auth Token Refresh & Logout)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Backend Runtime | Node.js 24 LTS | LTS support, ESM-native, TypeScript-first | Single-threaded (sufficient for I/O-bound) |
| Backend Framework | Fastify 5 | High performance, schema validation, plugin system | Smaller ecosystem than Express |
| Database | PostgreSQL 16 | Relational, ACID, JSON support | Overhead vs NoSQL for simple key-value |
| ORM | Drizzle ORM | Type-safe, lightweight, SQL-like API | Less abstraction than Prisma |
| Cache | Redis 7 | Fast, TTL support, session store | Additional infrastructure dependency |
| Auth | JWT (jose) + bcrypt | Stateless tokens, secure password hashing | Token revocation requires refresh rotation |
| Session Store | Redis | TTL-based expiry, fast read/write | Single point of failure for auth |

## Generated Files

| File | Status |
|------|--------|
| `docs/stack-backend.md` | existing (no changes needed) |
| `docs/architecture-backend.md` | existing (no changes needed) |
| `docs/deployment.md` | existing (no changes needed) |

> The existing docs already define the complete tech stack. This change uses the same technologies — no new selections required.

## Technology Considerations for This Change

### JWT (jose library)

- Access tokens: 15-minute expiry, signed with HS256, claims include `sub`, `iat`, `exp`, `type: "access"`
- Refresh tokens: 7-day expiry, signed with HS256, claims include `sub`, `jti`, `iat`, `exp`, `type: "refresh"`
- The `jti` claim provides a unique identifier for refresh token rotation detection

### Redis (ioredis client)

- Session store: Hash key `session:{userId}` with refresh token hash and metadata
- TTL: 7 days to match refresh token expiry
- Operations: `GET`, `SET`, `DEL` — no complex queries needed

### bcrypt (token hashing)

- Refresh tokens stored as bcrypt hashes, not raw values
- Supports constant-time comparison for security

### Fastify Plugins

- `@fastify/jwt`: JWT signing and verification
- `@fastify/rate-limit`: Rate limiting on auth endpoints (separate ticket)

## ADR References

No new ADRs required — all decisions follow existing architecture patterns.

## Next Steps

1. Proceed to design phase with tech stack confirmed
2. No new technology selections needed for this change
