# ADR-0001: HttpOnly Cookie for Refresh Token Storage

**Status:** Accepted

**Date:** 2026-07-18

## Context

The refresh token is currently returned in the response body of `POST /auth/login` and stored in `localStorage` by the frontend. This exposes the token to XSS attacks — any JavaScript executing on the same origin can read it via `localStorage.getItem('refreshToken')` and maintain a persistent authenticated session indefinitely.

The project's security directive requires "HttpOnly cookies or token in memory — XSS-safe token storage."

## Decision

Store the refresh token exclusively in an HttpOnly cookie. The cookie uses `Secure`, `SameSite=Strict`, and a scoped `Path` to limit exposure.

Key aspects of the decision:
- **HttpOnly=true**: JavaScript cannot read the cookie
- **Path=/api/v1/auth/refresh**: Cookie is only sent to the refresh endpoint
- **SameSite=Strict**: Prevents CSRF — cookie is never sent cross-site
- **Secure in production**: Only transmitted over HTTPS
- **No CSRF token needed**: SameSite=Strict provides sufficient protection since the cookie is only consumed by a POST endpoint with no side effects beyond token rotation

The `@fastify/cookie` plugin handles cookie parsing and serialization, integrating natively with Fastify's request/response lifecycle.

## Consequences

**Positive:**
- Eliminates XSS exfiltration of refresh tokens
- Aligns with industry best practice for SPA token storage
- Requires no architectural changes to the application or domain layers

**Negative:**
- Frontend must use `credentials: 'include'` on all API requests
- CORS origin cannot be `*` (must be explicit) when using credentials
- Local development over HTTP requires disabling `Secure` flag

**Neutral:**
- Body `refreshToken` fallback is maintained during transition, creating a temporary dual-path flow
- The cookie is scoped to `/api/v1/auth/refresh` only — other endpoints do not receive it

## Alternatives Considered

| Alternative | Why Rejected |
|-------------|--------------|
| Keep in `localStorage` | Direct XSS exfiltration vector |
| In-memory storage only | Non-durable — lost on page refresh, poor UX |
| `sessionStorage` | Not shared across tabs, same XSS risk as localStorage |
| Encrypted localStorage | Key in JS = no real security gain |

## Technical Notes

- `@fastify/cookie` v11.x is compatible with Fastify 5
- Cookie `path` scoping is advisory (browser-enforced) — the server validates the token regardless of how it arrives
- The refresh token in the cookie is the same JWT format — no changes to token generation, verification, or session management
