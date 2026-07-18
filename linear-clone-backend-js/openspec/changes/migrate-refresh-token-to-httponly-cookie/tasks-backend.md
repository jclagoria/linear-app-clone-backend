# Tasks — Refresh Token Cookie Migration (Backend)

## Scaffold

- [x] Install `@fastify/cookie` dependency
- [x] Register `@fastify/cookie` plugin in `src/app.ts`
- [x] Create `src/shared/cookie.ts` with `setRefreshTokenCookie`, `clearRefreshTokenCookie`, `getRefreshTokenCookie` helpers

## Data Layer

- [x] Add `REFRESH_COOKIE_SECURE` to `src/shared/config/env.ts` (default: `true` in production, `false` in development)

## Business Logic

- [x] `login-user.ts`: No changes needed — still returns refreshToken in output (controller strips it)
- [x] `refresh-token.ts`: No changes needed — still accepts refreshToken string (controller resolves source)
- [x] `logout-user.ts`: No changes needed — still revokes sessions (controller clears cookie)

## API Layer

- [x] Update `src/modules/auth/adapters/in/dto.ts`:
  - [x] Remove `refreshToken` from `AuthResponseSchema`
  - [x] Add `RefreshResponseSchema` with only `accessToken`
- [x] Update `POST /login` handler in `auth-controller.ts`:
  - [x] After `loginUser.execute()`, call `setRefreshTokenCookie(reply, result.refreshToken, body.rememberMe)`
  - [x] Strip `refreshToken` from response body
- [x] Update `POST /refresh` handler in `auth-controller.ts`:
  - [x] Read `refreshToken` from `request.cookies.refreshToken` (preferred) or body (fallback)
  - [x] After `refreshToken.execute()`, call `setRefreshTokenCookie(reply, result.refreshToken)`
  - [x] Return only `{ data: { accessToken: result.accessToken } }`
- [x] Update `POST /logout` handler in `auth-controller.ts`:
  - [x] After `logoutUser.execute()`, call `clearRefreshTokenCookie(reply)`

## Security

- [x] Verify CORS config allows credentials (`Access-Control-Allow-Credentials: true`) — already set in `app.ts`
- [x] Ensure CORS origin is not wildcard when credentials are enabled (already handled — `CORS_ORIGINS` env var)
- [x] Add `RefreshRequestSchema` to accept optional `refreshToken` in body (for fallback)

## Testing

- [x] Unit tests for `cookie.ts` helpers (17 tests covering all functions and options)
- [ ] Integration tests (need Fastify `inject()` — requires bootstrapping the app):
  - [ ] Login response has no `refreshToken` in body, sets cookie
  - [ ] Refresh reads from cookie, rotates token
  - [ ] Refresh falls back to body when cookie absent
  - [ ] Refresh with expired token clears cookie
  - [ ] Logout clears cookie
- [x] Run existing auth test suite to verify backward compatibility (61/61 pass)

## Review

- [x] Verify no `refreshToken` leaks in any response body (removed from AuthResponseSchema and login/refresh handlers)
- [x] Verify cookie flags are correct (HttpOnly, Secure, SameSite=Strict, Path=/api/v1/auth/refresh)
- [x] Verify body fallback works for existing clients (refresh handler checks cookie first, then body)
- [x] Run full test suite (61/61 auth tests pass)
- [x] Self-review diff before PR
- [x] Update `docs/api/openapi.yaml` to reflect new cookie-based auth flow
