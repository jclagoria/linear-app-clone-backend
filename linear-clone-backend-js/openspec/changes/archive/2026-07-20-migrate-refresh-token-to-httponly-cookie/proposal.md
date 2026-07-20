# Backend: Migrate Refresh Token from Response Body to HttpOnly Cookie

## Problem Statement

The refresh token is currently returned in the response body and stored in `localStorage` by the frontend. `localStorage` is accessible to any JavaScript executing on the same origin. If an XSS vulnerability exists, an attacker can steal the token and maintain a persistent authenticated session indefinitely. This is a critical security gap per the project's security requirement: *"HttpOnly cookies or token in memory — XSS-safe token storage"*.

## Motivation

Closing this vulnerability is the highest-priority security item for the backend. Moving the refresh token to an HttpOnly cookie ensures JavaScript never has programmatic access to it, eliminating the XSS exfiltration vector while keeping the existing 7-day refresh token TTL. This change:

- Blocks the most common post-XSS attack path (persistent session theft)
- Aligns with industry best practice for token storage in SPAs
- Unblocks the frontend work (LAG-39) to remove `localStorage` token handling
- Requires no architectural changes — only cookie configuration and controller logic

## Scope

- **In scope**:
  - Remove `refreshToken` from `POST /auth/login` response body
  - Set `refreshToken` as HttpOnly cookie on login
  - Read `refreshToken` from cookie instead of body in `POST /auth/refresh`
  - Rotate refresh token on refresh (new cookie issued)
  - Clear cookie on `POST /auth/logout`
  - Backward-compatible fallback: accept `refreshToken` from body if cookie absent
  - New shared cookie helper module
  - Cookie configuration constants
  - CORS credentials support (`Access-Control-Allow-Credentials: true`)

- **Out of scope**:
  - Access token storage strategy (remains in-memory/MemoryStore on frontend)
  - Frontend `localStorage` removal (tracked in LAG-39)
  - Other cookie-based auth flows (e.g., session cookies)
  - CSRF token implementation (SameSite=Strict provides sufficient protection for this pattern)

## Impact

- **Auth controller** (`src/auth/auth-controller.ts`): Login, refresh, and logout handlers modified to manage cookies
- **Auth service** (`src/auth/auth-service.ts`): Refresh token resolution updated to check cookie before body
- **New module** (`src/shared/cookie.ts`): Cookie helper utilities
- **Config** (`src/shared/config.ts`): Cookie configuration constants
- **CORS config**: Must allow credentials and expose required headers
- **API consumers**: Login response no longer contains `refreshToken` field; frontend must rely on cookie (handled in LAG-39)
- **Backward compatibility**: Existing clients sending `refreshToken` in request body continue to work during transition
