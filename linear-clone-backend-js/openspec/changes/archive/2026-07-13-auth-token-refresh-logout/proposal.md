# Auth Module — Token Refresh & Logout

## Problem Statement

Users cannot maintain long-lived sessions without re-authenticating. Access tokens expire after 15 minutes, but there is no mechanism to refresh them or gracefully terminate sessions. This forces users to log in repeatedly, degrading the experience and increasing unnecessary auth traffic.

## Motivation

Implementing token refresh with rotation and logout completes the auth lifecycle. Refresh tokens allow seamless session continuation without exposing long-lived access tokens. Token rotation ensures compromised refresh tokens are invalidated on use. Logout provides explicit session termination for security and user control.

This is Ticket 02 in the Backend Technologies milestone, building on Ticket 01 (Auth Registration & Login).

## Scope

- **In scope**:
  - Token refresh endpoint with single-use refresh token rotation
  - New access token (15min) and refresh token (7 days) issuance on refresh
  - Expired/revoked refresh token rejection with appropriate error responses
  - Logout endpoint that deletes session and invalidates refresh token
  - Idempotent logout behavior (calling twice is safe)
  - Token claims structure: `sub`, `iat`, `exp`, `type` ("access"/"refresh")
  - Session storage in Redis with TTL
- **Out of scope**:
  - Token refresh via sliding window or absolute expiry (7-day fixed window only)
  - Multi-device session management or session listing
  - Refresh token family tracking for bulk invalidation
  - Token blacklist for access tokens (stateless JWT validation only)
  - Rate limiting on refresh/logout endpoints (covered by separate ticket)

## Impact

- **Auth module**: New use cases (`RefreshToken`, `LogoutUser`), new endpoints (`POST /auth/refresh`, `POST /auth/logout`), domain entities (`Session`, `RefreshToken`)
- **Redis**: Session store schema changes — refresh tokens stored with 7-day TTL, removed on logout
- **JWT utility**: Token signing/validation needs to support `type` claim and different expiry per type
- **Auth middleware**: No changes — continues to validate access tokens only
- **Frontend consumers**: Must call refresh endpoint before access token expiry; must call logout on sign-out
- **API contract**: New endpoints in OpenAPI spec under `/auth` paths
