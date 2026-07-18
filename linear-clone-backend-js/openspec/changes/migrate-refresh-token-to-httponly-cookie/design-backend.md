# Auth — Backend Design (Cookie Migration)

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Cookie library | `@fastify/cookie` | Native Fastify plugin, lifecycle-aware, supports signed/unsigned cookies |
| Cookie name | `refreshToken` | Consistent with existing frontend usage |
| Cookie path | `/api/v1/auth/refresh` | Scoped to the only endpoint that needs it — limits exposure |
| Secure flag | Conditional on `NODE_ENV === 'production'` | Allows local development over HTTP |
| SameSite | `Strict` | Prevents CSRF without additional tokens |
| Body fallback | Temporary, deprecated after 1 cycle | Maintains backward compatibility during rollout |
| Response body | `refreshToken` removed | Token no longer exposed to JavaScript |

No architectural pattern changes. The cookie is managed at the controller (adapter) layer — the application use cases remain unchanged.

## Module Structure

```
src/modules/auth/adapters/in/auth-controller.ts  ← Modified: set/clear cookies
src/modules/auth/application/login-user.ts       ← Unchanged
src/modules/auth/application/refresh-token.ts    ← Unchanged
src/modules/auth/application/logout-user.ts      ← Unchanged
src/modules/auth/adapters/in/dto.ts              ← Modified: remove refreshToken from AuthResponseSchema
src/modules/auth/adapters/in/session-controller.ts ← Unchanged
src/shared/cookie.ts                             ← New: cookie configuration helpers
src/shared/config/env.ts                         ← Modified: add COOKIE_SECURE, COOKIE_SAME_SITE
src/app.ts                                       ← Modified: register @fastify/cookie plugin
```

## API Contracts

### POST /api/v1/auth/login

- **Request**: `{ email: string, password: string, rememberMe?: boolean }`
- **Response 200**: `{ data: { user: UserObject, accessToken: string } }`
- **Set-Cookie**: `refreshToken=<token>; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth/refresh; Max-Age=604800`
- **Status Codes**: 200, 400, 401, 429

### POST /api/v1/auth/refresh

- **Request**: Cookie `refreshToken` (preferred) or body `{ refreshToken: string }` (fallback)
- **Response 200**: `{ data: { accessToken: string } }`
- **Set-Cookie**: `refreshToken=<new-token>; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth/refresh; Max-Age=604800`
- **Status Codes**: 200, 401, 422, 429

### POST /api/v1/auth/logout

- **Request**: Bearer access token (Authorization header)
- **Response 200**: `{ data: { success: true } }`
- **Set-Cookie**: `refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth/refresh; Max-Age=0`
- **Status Codes**: 200, 401

## Data Model

No new database entities. The existing `Session` model in Redis is unchanged:

### Session (Redis — unchanged)

| Field | Type | Notes |
|-------|------|-------|
| id | string (uuid) | Session identifier |
| userId | string (uuid) | FK to User |
| refreshTokenHash | string | SHA-256 of refresh token |
| ipAddress | string | Client IP |
| userAgent | string | Client user agent |
| rememberMe | boolean | Extends TTL |
| expiresAt | timestamp | Session expiry |
| createdAt | timestamp | Creation time |

## Business Logic

### Cookie Helper (New: `src/shared/cookie.ts`)

- **Responsibility**: Creates and clears the refresh token cookie with consistent configuration
- **Configuration**: Reads from env for Secure flag, uses constants for SameSite and Path
- **Functions**:
  - `setRefreshTokenCookie(reply, token, rememberMe)` — Sets HttpOnly cookie
  - `clearRefreshTokenCookie(reply)` — Clears cookie by setting Max-Age=0
  - `getRefreshTokenCookie(request)` — Reads token from cookie

### Auth Controller Changes (`src/modules/auth/adapters/in/auth-controller.ts`)

#### Login handler
1. Execute `loginUser.execute()` (unchanged)
2. Call `setRefreshTokenCookie(reply, result.refreshToken, body.rememberMe)` to set cookie
3. Return response without `refreshToken` — strip it from the output

#### Refresh handler
1. Read `refreshToken` from cookie via `request.cookies.refreshToken`
2. If absent, fall back to reading from `request.body.refreshToken`
3. Execute `refreshToken.execute({ refreshToken })` (unchanged)
4. Call `setRefreshTokenCookie(reply, result.refreshToken)` to set rotated cookie
5. Return response with only `accessToken`

#### Logout handler
1. Verify access token (unchanged)
2. Execute `logoutUser.execute()` (unchanged)
3. Call `clearRefreshTokenCookie(reply)` to clear cookie
4. Return response (unchanged)

### DTO Changes (`src/modules/auth/adapters/in/dto.ts`)

- `AuthResponseSchema`: Remove `refreshToken` field from the response schema
- Add `RefreshResponseSchema`: `{ data: { accessToken: string } }`

### App Setup (`src/app.ts`)

- Register `@fastify/cookie` plugin before route registration

## Cookie Configuration

```typescript
export const cookieConfig = {
  name: 'refreshToken' as const,
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/api/v1/auth/refresh',
  maxAge: {
    default: 604800,        // 7 days
    rememberMe: 2592000,    // 30 days
  },
};
```

## Security

- **Authentication**: JWT (jose) dual token — unchanged
- **Authorization**: Unchanged
- **Input Sanitization**: Cookie value is validated by the token service — untrusted cookie values that fail verification are rejected
- **CSRF**: `SameSite=Strict` prevents cross-site cookie sending
- **XSS**: HttpOnly flag blocks JavaScript access

## Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | `cookie.ts` helper functions |
| Integration | Vitest + Testcontainers | Login sets cookie, refresh reads from cookie, logout clears cookie |
| Contract | Vitest | All three endpoints with body fallback scenarios |

Key test cases:
- Login response has no `refreshToken` body field
- Login sets `Set-Cookie` header with correct flags
- Refresh reads token from cookie when present
- Refresh falls back to body when cookie absent
- Refresh rotates token (cookie value changes)
- Logout clears cookie (`Max-Age=0`)
- Refresh with expired/revoked token clears cookie
