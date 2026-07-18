# Tasks — Refresh Token Cookie Migration (Backend)

## Scaffold

- [ ] Install `@fastify/cookie` dependency
- [ ] Register `@fastify/cookie` plugin in `src/app.ts`
- [ ] Create `src/shared/cookie.ts` with `setRefreshTokenCookie`, `clearRefreshTokenCookie`, `getRefreshTokenCookie` helpers

## Data Layer

- [ ] Add `REFRESH_COOKIE_SECURE` to `src/shared/config/env.ts` (default: `true` in production, `false` in development)

## Business Logic

- [ ] `login-user.ts`: No changes needed — still returns refreshToken in output (controller strips it)
- [ ] `refresh-token.ts`: No changes needed — still accepts refreshToken string (controller resolves source)
- [ ] `logout-user.ts`: No changes needed — still revokes sessions (controller clears cookie)

## API Layer

- [ ] Update `src/modules/auth/adapters/in/dto.ts`:
  - [ ] Remove `refreshToken` from `AuthResponseSchema`
  - [ ] Add `RefreshResponseSchema` with only `accessToken`
- [ ] Update `POST /login` handler in `auth-controller.ts`:
  - [ ] After `loginUser.execute()`, call `setRefreshTokenCookie(reply, result.refreshToken, body.rememberMe)`
  - [ ] Strip `refreshToken` from response body
- [ ] Update `POST /refresh` handler in `auth-controller.ts`:
  - [ ] Read `refreshToken` from `request.cookies.refreshToken` (preferred) or body (fallback)
  - [ ] After `refreshToken.execute()`, call `setRefreshTokenCookie(reply, result.refreshToken)`
  - [ ] Return only `{ data: { accessToken: result.accessToken } }`
- [ ] Update `POST /logout` handler in `auth-controller.ts`:
  - [ ] After `logoutUser.execute()`, call `clearRefreshTokenCookie(reply)`

## Security

- [ ] Verify CORS config allows credentials (`Access-Control-Allow-Credentials: true`) — already set in `app.ts`
- [ ] Ensure CORS origin is not wildcard when credentials are enabled (already handled — `CORS_ORIGINS` env var)
- [ ] Add `RefreshRequestSchema` to accept optional `refreshToken` in body (for fallback)

## Testing

- [ ] Unit tests for `cookie.ts` helpers
- [ ] Integration tests:
  - [ ] Login response has no `refreshToken` in body, sets cookie
  - [ ] Refresh reads from cookie, rotates token
  - [ ] Refresh falls back to body when cookie absent
  - [ ] Refresh with expired token clears cookie
  - [ ] Logout clears cookie
- [ ] Run existing auth test suite to verify backward compatibility

## Review

- [ ] Verify no `refreshToken` leaks in any response body
- [ ] Verify cookie flags are correct (HttpOnly, Secure, SameSite, Path, Max-Age)
- [ ] Verify body fallback works for existing clients
- [ ] Run full test suite
- [ ] Self-review diff before PR
