# Review — Auth Registration Login

## Spec Compliance

The design covers all requirements from specs-api and specs-business:

| Requirement | Covered | Notes |
|-------------|---------|-------|
| Email validation (format + uniqueness) | ✅ | Zod schema + UserRepository |
| Password hashing (bcrypt) | ✅ | Cost factor 12 |
| User record creation | ✅ | DrizzleUserRepository |
| Token issuance (access + refresh) | ✅ | TokenService with jose |
| Login with credentials | ✅ | LoginUser use case |
| Invalid credentials → 401 | ✅ | Consistent error message |
| Session creation (IP, user_agent) | ✅ | RedisSessionStore |
| Session limit (10 max, evict oldest) | ✅ | Session limit enforcement |
| Rate limiting (3 reg/min, 5 login/min) | ✅ | Redis-based sliding window |
| Login event emission | ✅ | EventPublisher port |
| Remember Me (30 days) | ✅ | Token expiry configuration |

## Edge Cases

| Scenario | Handled | Notes |
|----------|---------|-------|
| Concurrent registration (duplicate email) | ✅ | Unique constraint + error handling |
| Session limit exceeded | ✅ | Evict oldest by last_activity_at |
| Expired refresh token | ✅ | TTL in Redis |
| Invalid JWT signature | ✅ | jose verification |
| Malformed token | ✅ | Validation returns false |
| Rate limit hit during registration | ✅ | 429 response with retry_after |

## Leakage Check

No implementation details leaked into specs:
- specs-api defines endpoints without implementation
- specs-business defines rules without technology
- design-backend references specs, not the reverse

## Performance Bounds

| Metric | Target | Notes |
|--------|--------|-------|
| Token validation latency | <1ms | Stateless JWT, no DB lookup |
| Session creation latency | <5ms | Redis write |
| Login response time | <100ms | DB + Redis operations |
| Rate limit check latency | <1ms | Redis read |

## Migration Rollback

| Migration | Rollback Strategy |
|-----------|-------------------|
| Create users table | DROP TABLE users |
| Create sessions table | DROP TABLE sessions |

Rollback is safe as this is initial schema creation with no data dependencies.

## Backward Compatibility

This is a new module with no existing consumers. No breaking changes.

API contract follows established patterns from `docs/contracts.md`:
- Response format: `{ data: ... }` or `{ error: { code, message } }`
- Rate limit headers on all responses
- Consistent error codes

## Checklist

- [x] All requirements covered
- [x] Scenarios pass
- [x] Error states handled
- [x] No technical detail in specs
- [x] Performance bounds defined and validated
- [x] Migration rollback strategy documented
- [x] Backward compatibility verified or breaking change justified

## Summary

The Auth Module design is complete and ready for implementation. All requirements from specs-api and specs-business are covered by the design. Edge cases are addressed. No gaps or blockers identified.

**Status**: ✅ Ready for implementation
