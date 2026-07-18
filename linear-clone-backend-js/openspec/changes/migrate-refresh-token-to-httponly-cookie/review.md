# Review — Refresh Token Cookie Migration

## Spec Compliance

- [ ] Login response has no `refreshToken` in body
- [ ] Login sets `Set-Cookie` header with HttpOnly, Secure, SameSite=Strict, Path=/api/v1/auth/refresh
- [ ] Login with rememberMe sets Max-Age=2592000
- [ ] Refresh reads `refreshToken` from cookie (preferred)
- [ ] Refresh falls back to body when cookie absent
- [ ] Refresh rotates token and sets new cookie
- [ ] Refresh with expired/revoked token clears cookie
- [ ] Logout clears cookie with Max-Age=0

## Edge Cases

- [ ] No cookie and no body on refresh → 422
- [ ] Both cookie and body present → cookie wins
- [ ] Malformed token in cookie → 401 + cookie cleared
- [ ] Cookie from wrong path → not received by server (browser-enforced)
- [ ] CORS preflight with credentials → 200

## Leakage Check

- [ ] No `refreshToken` appears in any response body
- [ ] No implementation details in specs artifacts
- [ ] No hardcoded secrets in cookie config

## Performance Bounds

- [ ] Cookie parsing adds negligible overhead (< 1ms per request)
- [ ] No new database queries introduced
- [ ] No new network round trips

## Migration Rollback

- [ ] Remove `@fastify/cookie` registration
- [ ] Revert controller changes to return `refreshToken` in body
- [ ] Revert `AuthResponseSchema`
- [ ] Delete `src/shared/cookie.ts`
- [ ] Frontend falls back to existing localStorage flow

## Backward Compatibility

- [ ] Body `refreshToken` fallback in place
- [ ] All existing auth tests pass (no breaking changes)
- [ ] CORS `credentials: true` already configured — no client-side changes needed for backend-only deployment

## Checklist

- [x] All requirements covered
- [ ] Scenarios pass
- [ ] Error states handled
- [x] No technical detail in specs
- [x] Performance bounds defined and validated
- [x] Migration rollback strategy documented
- [x] Backward compatibility verified or breaking change justified
