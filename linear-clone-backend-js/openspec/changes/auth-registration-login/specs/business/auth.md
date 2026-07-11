# Auth — Business Specification

## Behaviour

**Feature:** User Registration

The system SHALL allow new users to create an account using email, name, and password. Registration creates a user record, hashes the password, and issues authentication tokens.

### Requirement: Email Validation

The system SHALL validate email format and enforce uniqueness across all users.

#### Scenario: Valid email format

- **GIVEN** a user provides a valid email address
- **WHEN** the registration request is processed
- **THEN** the email is accepted for format validation
- **AND** uniqueness is checked against existing users

#### Scenario: Invalid email format

- **GIVEN** a user provides an email without "@" symbol
- **WHEN** the registration request is processed
- **THEN** the system returns a VALIDATION_ERROR (400)
- **AND** the error details specify "Invalid email format"

#### Scenario: Duplicate email

- **GIVEN** a user with email "existing@example.com" already exists
- **WHEN** a new user attempts to register with "existing@example.com"
- **THEN** the system returns a CONFLICT (409)
- **AND** the error message states "Email already registered"

### Requirement: Password Security

The system SHALL hash passwords using a one-way hashing algorithm with salt. Plain text passwords SHALL never be stored.

#### Scenario: Password hashing on registration

- **GIVEN** a user provides a password "mySecurePass123"
- **WHEN** the registration request is processed
- **THEN** the password is hashed with a unique salt
- **AND** the stored password_hash is not equal to the original password
- **AND** the original password is not stored in any form

### Requirement: Token Issuance on Registration

The system SHALL issue an access token (15 minutes) and refresh token (7 days) upon successful registration.

#### Scenario: Successful registration returns tokens

- **GIVEN** a user provides valid registration details
- **WHEN** the registration is processed successfully
- **THEN** a 201 response is returned
- **AND** the response contains an accessToken with 15-minute expiry
- **AND** the response contains a refreshToken with 7-day expiry
- **AND** the response contains the created user object

### Requirement: User Record Creation

The system SHALL create a user record with id, email, password_hash, name, and created_at.

#### Scenario: User record fields

- **GIVEN** a user registers with email "user@example.com" and name "John Doe"
- **WHEN** the user record is created
- **THEN** the record has a UUID as id
- **AND** the email is stored as provided
- **AND** the password is stored as a hash (not plain text)
- **AND** the name is stored as provided
- **AND** created_at is set to the current timestamp

---

**Feature:** User Login

The system SHALL authenticate existing users with email and password, create a session record, and issue tokens.

### Requirement: Credential Validation

The system SHALL validate that the provided email exists and the password matches the stored hash.

#### Scenario: Successful login

- **GIVEN** a registered user with email "user@example.com" and password "myPass123"
- **WHEN** the user submits correct credentials
- **THEN** a 200 response is returned
- **AND** the response contains the user object, accessToken, and refreshToken

#### Scenario: Invalid credentials

- **GIVEN** a registered user with email "user@example.com"
- **WHEN** the user submits an incorrect password
- **THEN** the system returns an UNAUTHORIZED (401)
- **AND** the error message states "Invalid email or password"
- **AND** the specific failure reason is not disclosed (no "wrong password" vs "user not found")

### Requirement: Session Management

The system SHALL create a session record on successful login with IP address and user agent.

#### Scenario: Session creation on login

- **GIVEN** a user logs in from IP "192.168.1.1" with user-agent "Mozilla/5.0"
- **WHEN** the login is successful
- **THEN** a session record is created
- **AND** the session contains the user_id
- **AND** the session contains the refresh_token_hash
- **AND** the session contains ip_address "192.168.1.1"
- **AND** the session contains user_agent "Mozilla/5.0"
- **AND** the session contains remember_me flag
- **AND** the session contains created_at, last_activity_at, and expires_at

### Requirement: Session Limit Enforcement

The system SHALL enforce a maximum of 10 active sessions per user. When the limit is exceeded, the oldest session by last_activity_at SHALL be evicted.

#### Scenario: Session limit not exceeded

- **GIVEN** a user has 9 active sessions
- **WHEN** the user logs in from a new device
- **THEN** a new session is created
- **AND** the user now has 10 active sessions

#### Scenario: Session limit exceeded

- **GIVEN** a user has 10 active sessions
- **WHEN** the user logs in from a new device
- **THEN** the session with the oldest last_activity_at is evicted
- **AND** a new session is created
- **AND** the user has 10 active sessions

### Requirement: Remember Me

The system SHALL extend refresh token expiry to 30 days when rememberMe is true. Access token expiry remains 15 minutes.

#### Scenario: Remember Me enabled

- **GIVEN** a user logs in with rememberMe = true
- **WHEN** tokens are issued
- **THEN** the refresh token expires in 30 days
- **AND** the access token expires in 15 minutes

#### Scenario: Remember Me disabled (default)

- **GIVEN** a user logs in with rememberMe = false
- **WHEN** tokens are issued
- **THEN** the refresh token expires in 7 days
- **AND** the access token expires in 15 minutes

### Requirement: Login Event Emission

The system SHALL emit a login event for audit logging on successful authentication.

#### Scenario: Login event emitted

- **GIVEN** a user successfully logs in
- **WHEN** the login is processed
- **THEN** a UserLoggedIn event is emitted
- **AND** the event contains the user_id and timestamp

---

**Feature:** Token Validation

The system SHALL validate access tokens by verifying signature and expiry. This is an internal service used by other modules.

### Requirement: Signature Verification

The system SHALL cryptographically verify the token signature.

#### Scenario: Valid token

- **GIVEN** a valid access token with correct signature
- **WHEN** the token is validated
- **THEN** validation returns valid = true
- **AND** the userId is extracted from the token claims

#### Scenario: Invalid signature

- **GIVEN** a token with a tampered signature
- **WHEN** the token is validated
- **THEN** validation returns valid = false

### Requirement: Expiry Check

The system SHALL reject expired tokens.

#### Scenario: Expired token

- **GIVEN** an access token that expired 5 minutes ago
- **WHEN** the token is validated
- **THEN** validation returns valid = false

#### Scenario: Token not yet expired

- **GIVEN** an access token with 10 minutes remaining
- **WHEN** the token is validated
- **THEN** validation returns valid = true
- **AND** the expiresAt timestamp is returned

---

## Data Model

### User

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | UUID | PK, not null | Auto-generated |
| `email` | VARCHAR(255) | unique, not null | Login identifier |
| `password_hash` | VARCHAR(255) | not null | One-way hash with salt |
| `name` | VARCHAR(255) | not null | Display name |
| `created_at` | TIMESTAMP | not null | Account creation time |

### Session

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | UUID | PK, not null | Auto-generated |
| `user_id` | UUID | FK → users(id), not null | Session owner |
| `refresh_token_hash` | VARCHAR(255) | not null | Hashed refresh token |
| `ip_address` | VARCHAR(45) | not null | IPv4 or IPv6 |
| `user_agent` | TEXT | not null | Client device info |
| `remember_me` | BOOLEAN | not null, default false | Token expiry flag |
| `created_at` | TIMESTAMP | not null | Session creation time |
| `last_activity_at` | TIMESTAMP | not null | Last token refresh |
| `expires_at` | TIMESTAMP | not null | Session expiration |

### Relationships

User --1:N--> Session: A user can have multiple active sessions (max 10).

---

## Business Rules

1. **Password Requirements**: Minimum 8 characters. System SHOULD enforce complexity (uppercase, lowercase, number, special character).
2. **Session Eviction**: When a new session is created and limit (10) is exceeded, the session with the oldest `last_activity_at` is evicted first.
3. **Token Expiry**: Access tokens expire in 15 minutes regardless of rememberMe. Refresh tokens expire in 7 days (default) or 30 days (rememberMe).
4. **Error Message Consistency**: Login failures always return "Invalid email or password" regardless of whether the email exists or password is wrong.
5. **Rate Limiting**: Registration is limited to 3 attempts/min per IP. Login is limited to 5 attempts/min per IP.

---

## Security

1. **Password Storage**: Passwords SHALL be hashed using a one-way algorithm with unique salt per user. Plain text passwords SHALL never be stored or logged.
2. **Token Security**: Access tokens SHALL be signed with a secret key. Refresh tokens SHALL be stored as hashes in the sessions table.
3. **Rate Limiting**: Auth endpoints SHALL enforce per-IP rate limiting to prevent brute force attacks.
4. **Error Disclosure**: Login error messages SHALL not reveal whether an email exists in the system.
5. **Session Isolation**: Each session SHALL be independent. Revoking one session does not affect others.
