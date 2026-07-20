# Auth — Business Specification (Cookie Migration)

## Behaviour

**Feature:** HttpOnly Cookie Token Storage

The refresh token MUST be stored in an HttpOnly cookie instead of the response body. JavaScript MUST NOT have programmatic access to the refresh token. The system SHALL accept the refresh token from the cookie on the refresh endpoint. During the transition period, the system SHALL also accept the refresh token from the request body as a fallback.

### Requirement: LoginSetsHttpOnlyCookie

#### Scenario: Successful login sets HttpOnly cookie

- **GIVEN** a user with valid credentials
- **WHEN** they POST to `/api/v1/auth/login`
- **THEN** the response SHALL NOT include `refreshToken` in the body
- **AND** the response SHALL include a `Set-Cookie` header for `refreshToken`
- **AND** the cookie SHALL have `HttpOnly`, `Secure`, `SameSite=Strict` flags
- **AND** the cookie path SHALL be `/api/v1/auth/refresh`
- **AND** the cookie SHALL have `Max-Age` of 604800 (7 days)

#### Scenario: Login with rememberMe extends cookie lifetime

- **GIVEN** a user with valid credentials
- **WHEN** they POST to `/api/v1/auth/login` with `rememberMe: true`
- **THEN** the cookie SHALL have `Max-Age` of 2592000 (30 days)

#### Scenario: Login with invalid credentials

- **GIVEN** a user with invalid credentials
- **WHEN** they POST to `/api/v1/auth/login`
- **THEN** the response SHALL be 401
- **AND** no `Set-Cookie` header SHALL be set

### Requirement: RefreshReadsFromCookie

#### Scenario: Token refresh reads from cookie

- **GIVEN** a valid refresh token stored in the `refreshToken` cookie
- **WHEN** they POST to `/api/v1/auth/refresh`
- **THEN** the server SHALL read the token from the cookie
- **AND** the response SHALL return a new `accessToken` in the body
- **AND** the response SHALL include a `Set-Cookie` header with a rotated refresh token

#### Scenario: Token refresh falls back to body

- **GIVEN** no `refreshToken` cookie is present
- **WHEN** they POST to `/api/v1/auth/refresh` with `refreshToken` in the body
- **THEN** the server SHALL read the token from the body
- **AND** return a new `accessToken` and set a new cookie

#### Scenario: Token refresh with invalid token

- **GIVEN** an expired or revoked refresh token in the cookie
- **WHEN** they POST to `/api/v1/auth/refresh`
- **THEN** the response SHALL be 401
- **AND** the cookie SHALL be cleared

### Requirement: LogoutClearsCookie

#### Scenario: Logout clears refresh token cookie

- **GIVEN** an authenticated session
- **WHEN** they POST to `/api/v1/auth/logout` with a valid access token
- **THEN** the response SHALL include `Set-Cookie` with `Max-Age=0` to clear the cookie
- **AND** the session SHALL be revoked server-side

## Data Model

### CookieConfig

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| name | string | `"refreshToken"` | Cookie name |
| httpOnly | boolean | `true` | JS inaccessible |
| secure | boolean | `true` in production | HTTPS only |
| sameSite | string | `"Strict"` | CSRF protection |
| path | string | `"/api/v1/auth/refresh"` | Scoped to refresh endpoint |
| maxAge | number | 604800 (default), 2592000 (rememberMe) | Seconds |

No new database entities are introduced. The existing `Session` model in Redis is unchanged.

## Business Rules

- **Token rotation**: On every refresh, the old refresh token SHALL be revoked and a new one issued. The old session SHALL be deleted and a new session SHALL be created.
- **Session eviction**: If the user exceeds the session limit, the oldest session SHALL be evicted. This is unchanged from existing behaviour.
- **Cookie precedence**: When both a cookie and a body `refreshToken` are present, the cookie SHALL take precedence. This prevents body-based token injection if a client sends both.
- **Production only**: The `Secure` flag SHALL be conditional — enabled in production, disabled in development for local testing over HTTP.
- **Backward compatibility**: The body fallback SHALL remain active for at least one release cycle after both backend and frontend changes are deployed.

## Security

- **XSS mitigation**: HttpOnly flag prevents JavaScript from reading the cookie via `document.cookie`.
- **CSRF mitigation**: `SameSite=Strict` prevents the cookie from being sent on cross-site requests. No additional CSRF token is required.
- **Token exfiltration**: The refresh token is never in the response body, so no XSS can steal it.
- **Path scoping**: The cookie path `/api/v1/auth/refresh` limits which endpoints receive the cookie, reducing unnecessary exposure.
- **CORS**: The server MUST set `Access-Control-Allow-Credentials: true` and the client MUST use `credentials: 'include'` for cross-origin requests.
