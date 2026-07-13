# Identity — Business Specification

## Behaviour

**Feature:** User Profile Management

Users SHALL be able to view and update their profile information. Profile updates SHALL be restricted to the owner of the profile.

### Requirement: Get User Profile

#### Scenario: User retrieves own profile

- **GIVEN** a user is authenticated with a valid JWT
- **WHEN** the user requests their profile via `GET /api/v1/users/me`
- **THEN** the system returns the user's profile with id, email, name, avatarUrl, createdAt, and updatedAt
- **AND** the email field is read-only

#### Scenario: Unauthenticated user attempts to retrieve profile

- **GIVEN** no authentication token is provided
- **WHEN** the user requests their profile via `GET /api/v1/users/me`
- **THEN** the system returns a 401 Unauthorized error

### Requirement: Update User Profile

#### Scenario: User updates name

- **GIVEN** a user is authenticated with a valid JWT
- **WHEN** the user updates their name via `PATCH /api/v1/users/me` with a valid name (1-255 chars)
- **THEN** the system updates the name field
- **AND** the system updates the updatedAt timestamp
- **AND** the system returns the updated profile

#### Scenario: User updates avatar URL

- **GIVEN** a user is authenticated with a valid JWT
- **WHEN** the user updates their avatarUrl via `PATCH /api/v1/users/me` with a valid URL
- **THEN** the system updates the avatarUrl field
- **AND** the system updates the updatedAt timestamp
- **AND** the system returns the updated profile

#### Scenario: User clears avatar URL

- **GIVEN** a user is authenticated with a valid JWT
- **WHEN** the user updates their avatarUrl via `PATCH /api/v1/users/me` with null
- **THEN** the system sets avatarUrl to null
- **AND** the system returns the updated profile

#### Scenario: User provides invalid avatar URL

- **GIVEN** a user is authenticated with a valid JWT
- **WHEN** the user updates their avatarUrl via `PATCH /api/v1/users/me` with an invalid URL format
- **THEN** the system returns a 400 Validation Error
- **AND** the error details specify the avatarUrl field is invalid

#### Scenario: User provides empty name

- **GIVEN** a user is authenticated with a valid JWT
- **WHEN** the user updates their name via `PATCH /api/v1/users/me` with an empty string
- **THEN** the system returns a 400 Validation Error
- **AND** the error details specify the name field is required

#### Scenario: User provides name exceeding max length

- **GIVEN** a user is authenticated with a valid JWT
- **WHEN** the user updates their name via `PATCH /api/v1/users/me` with more than 255 characters
- **THEN** the system returns a 400 Validation Error
- **AND** the error details specify the name field exceeds maximum length

---

**Feature:** Organization Management

Users SHALL be able to create, list, view, and delete organizations. Organizations SHALL enforce unique names and ownership-based deletion.

### Requirement: Create Organization

#### Scenario: User creates organization

- **GIVEN** a user is authenticated with a valid JWT
- **WHEN** the user creates an organization via `POST /api/v1/organizations` with a valid name
- **THEN** the system creates the organization
- **AND** the user is added as the organization owner
- **AND** the system returns the organization with id, name, createdAt, and updatedAt

#### Scenario: User creates organization with duplicate name

- **GIVEN** a user is authenticated with a valid JWT
- **AND** an organization with the same name already exists
- **WHEN** the user creates an organization via `POST /api/v1/organizations`
- **THEN** the system returns a 409 Conflict error
- **AND** the error message indicates the name already exists

#### Scenario: User creates organization with invalid name

- **GIVEN** a user is authenticated with a valid JWT
- **WHEN** the user creates an organization via `POST /api/v1/organizations` with an empty name
- **THEN** the system returns a 400 Validation Error
- **AND** the error details specify the name field is required

### Requirement: List User Organizations

#### Scenario: User lists own organizations

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is a member of one or more organizations
- **WHEN** the user requests their organizations via `GET /api/v1/organizations`
- **THEN** the system returns a list of organizations the user belongs to
- **AND** each organization includes id, name, createdAt, and updatedAt

#### Scenario: User lists organizations when none exist

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is not a member of any organizations
- **WHEN** the user requests their organizations via `GET /api/v1/organizations`
- **THEN** the system returns an empty list

### Requirement: Get Organization Details

#### Scenario: Member retrieves organization details

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is a member of the organization
- **WHEN** the user requests organization details via `GET /api/v1/organizations/:organizationId`
- **THEN** the system returns the organization with id, name, createdAt, and updatedAt

#### Scenario: Non-member attempts to retrieve organization details

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is not a member of the organization
- **WHEN** the user requests organization details via `GET /api/v1/organizations/:organizationId`
- **THEN** the system returns a 403 Forbidden error

#### Scenario: User requests non-existent organization

- **GIVEN** a user is authenticated with a valid JWT
- **WHEN** the user requests organization details via `GET /api/v1/organizations/:organizationId` with a non-existent ID
- **THEN** the system returns a 404 Not Found error

### Requirement: Delete Organization

#### Scenario: Owner deletes organization

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is the owner of the organization
- **WHEN** the user deletes the organization via `DELETE /api/v1/organizations/:organizationId`
- **THEN** the system soft-deletes the organization (sets deletedAt timestamp)
- **AND** the system soft-deletes all teams in the organization
- **AND** the system removes all members from the organization
- **AND** the system returns a 204 No Content response

#### Scenario: Non-owner attempts to delete organization

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is not the owner of the organization
- **WHEN** the user deletes the organization via `DELETE /api/v1/organizations/:organizationId`
- **THEN** the system returns a 403 Forbidden error

#### Scenario: User attempts to delete non-existent organization

- **GIVEN** a user is authenticated with a valid JWT
- **WHEN** the user deletes an organization via `DELETE /api/v1/organizations/:organizationId` with a non-existent ID
- **THEN** the system returns a 404 Not Found error

## Data Model

### User

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, NOT NULL | User identifier |
| email | string | UNIQUE, NOT NULL | User email (managed by Auth module) |
| passwordHash | string | NOT NULL | Password hash (managed by Auth module) |
| name | string | NOT NULL, max 255 | User display name (managed by Identity module) |
| avatarUrl | string \| null | NULL, valid URL format | User avatar URL (managed by Identity module) |
| createdAt | timestamp | NOT NULL | Account creation timestamp |
| updatedAt | timestamp | NOT NULL | Last profile update timestamp |
| deletedAt | timestamp \| null | NULL | Soft deletion timestamp |

### Organization

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, NOT NULL | Organization identifier |
| name | string | UNIQUE, NOT NULL, max 255 | Organization name |
| ownerId | UUID | FK → User.id, NOT NULL | Organization owner |
| createdAt | timestamp | NOT NULL | Creation timestamp |
| updatedAt | timestamp | NOT NULL | Last update timestamp |
| deletedAt | timestamp \| null | NULL | Soft deletion timestamp |

### OrganizationMember

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, NOT NULL | Membership identifier |
| organizationId | UUID | FK → Organization.id, NOT NULL | Organization reference |
| userId | UUID | FK → User.id, NOT NULL | User reference |
| role | string | NOT NULL | Member role (owner, admin, member) |
| createdAt | timestamp | NOT NULL | Membership creation timestamp |
| deletedAt | timestamp \| null | NULL | Soft deletion timestamp |

### Relationships

User --1:N--> OrganizationMember: User can be a member of multiple organizations
Organization --1:N--> OrganizationMember: Organization has multiple members
Organization --1:N--> Team: Organization contains multiple teams (cascade soft-delete)
User --1--> Organization: User can own one organization

## Business Rules

1. **Profile Ownership**: Users SHALL only update their own profile. The system MUST enforce this by comparing the authenticated user ID with the target user ID.

2. **Avatar URL Validation**: The avatarUrl field MUST be a valid URL format (RFC 3986) or null.

3. **Organization Name Uniqueness**: Organization names MUST be unique across all non-deleted organizations.

4. **Organization Ownership**: The user who creates an organization SHALL become the owner. Ownership CANNOT be transferred.

5. **Organization Deletion**: Only the organization owner SHALL be able to delete an organization. Deletion SHALL be soft (setting deletedAt timestamp).

6. **Cascade Soft-Delete**: When an organization is soft-deleted, all teams and members SHALL be soft-deleted as well.

7. **Member Removal on Deletion**: When an organization is soft-deleted, all member records SHALL be soft-deleted (not deleted).

## Security

1. **Authentication**: All endpoints SHALL require JWT authentication except where explicitly noted.

2. **Authorization**: 
   - Profile updates SHALL be restricted to the profile owner.
   - Organization details SHALL be restricted to organization members.
   - Organization deletion SHALL be restricted to the organization owner.

3. **Input Validation**: All input SHALL be validated at the API boundary using Zod schemas.

4. **Rate Limiting**: All endpoints SHALL be rate-limited to prevent abuse.

5. **Soft Deletion**: Deleted data SHALL be retained in the database with a deletedAt timestamp for audit and recovery purposes.
