# Team — Business Specification

## Behaviour

**Feature:** Team Management

Users SHALL be able to create teams within an organization, list them, view details, and soft-delete them. Teams SHALL have a unique key within the organization used as an issue prefix (e.g., ENG-123).

### Requirement: Create Team

#### Scenario: Organization member creates a team

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is a member of the organization
- **WHEN** the user creates a team via `POST /api/v1/organizations/:organizationId/teams` with a valid name and a unique key
- **THEN** the system creates the team
- **AND** the creator is automatically added as a team member with role `admin`
- **AND** the system returns the team with id, organizationId, name, key, memberCount, createdAt, and updatedAt

#### Scenario: User creates team with duplicate key

- **GIVEN** a user is authenticated with a valid JWT
- **AND** a team with the same key already exists in the organization
- **WHEN** the user creates a team with that key via `POST /api/v1/organizations/:organizationId/teams`
- **THEN** the system returns a 409 Conflict error
- **AND** the error message indicates the key already exists in the organization

#### Scenario: User creates team with invalid key format

- **GIVEN** a user is authenticated with a valid JWT
- **WHEN** the user creates a team via `POST /api/v1/organizations/:organizationId/teams` with a key containing lowercase letters or special characters
- **THEN** the system returns a 400 Validation Error
- **AND** the error details specify the key format is invalid

#### Scenario: Non-member attempts to create team

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is not a member of the organization
- **WHEN** the user creates a team via `POST /api/v1/organizations/:organizationId/teams`
- **THEN** the system returns a 403 Forbidden error

### Requirement: List Teams

#### Scenario: Member lists teams in organization

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is a member of the organization
- **AND** the organization has one or more teams
- **WHEN** the user lists teams via `GET /api/v1/organizations/:organizationId/teams`
- **THEN** the system returns a list of teams in the organization
- **AND** each team includes id, organizationId, name, key, memberCount, createdAt, and updatedAt
- **AND** soft-deleted teams are excluded from the list

#### Scenario: Member lists teams when organization has no teams

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is a member of the organization
- **AND** the organization has no teams
- **WHEN** the user lists teams via `GET /api/v1/organizations/:organizationId/teams`
- **THEN** the system returns an empty list

### Requirement: Get Team Details

#### Scenario: Team member retrieves team details

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is a member of the team
- **WHEN** the user requests team details via `GET /api/v1/teams/:teamId`
- **THEN** the system returns the team with id, organizationId, name, key, memberCount, createdAt, and updatedAt

#### Scenario: Non-member attempts to retrieve team details

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is not a member of the team
- **WHEN** the user requests team details via `GET /api/v1/teams/:teamId`
- **THEN** the system returns a 403 Forbidden error

#### Scenario: User requests non-existent team

- **GIVEN** a user is authenticated with a valid JWT
- **WHEN** the user requests team details via `GET /api/v1/teams/:teamId` with a non-existent ID
- **THEN** the system returns a 404 Not Found error

### Requirement: Delete Team

#### Scenario: Team admin deletes team

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is a team admin
- **WHEN** the user deletes the team via `DELETE /api/v1/teams/:teamId`
- **THEN** the system soft-deletes the team (sets deletedAt timestamp)
- **AND** all team memberships are soft-deleted
- **AND** all issues belonging to the team have their teamId set to null
- **AND** the system returns a 204 No Content response

#### Scenario: Non-admin attempts to delete team

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is a team member but not a team admin
- **WHEN** the user deletes the team via `DELETE /api/v1/teams/:teamId`
- **THEN** the system returns a 403 Forbidden error

#### Scenario: User attempts to delete non-existent team

- **GIVEN** a user is authenticated with a valid JWT
- **WHEN** the user deletes a team via `DELETE /api/v1/teams/:teamId` with a non-existent ID
- **THEN** the system returns a 404 Not Found error

---

**Feature:** Team Membership

Team admins SHALL be able to add and remove members. Users SHALL be able to belong to multiple teams. Removing a member SHALL NOT delete their issues.

### Requirement: Add Team Member

#### Scenario: Team admin adds a member

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is a team admin
- **AND** the target user exists and is a member of the parent organization
- **WHEN** the admin adds the user via `POST /api/v1/teams/:teamId/members` with a valid userId
- **THEN** the system creates a team membership record
- **AND** the new member has the default role `member`
- **AND** the system returns the membership with id, userId, name, email, role, and joinedAt

#### Scenario: Team admin adds a member with admin role

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is a team admin
- **AND** the target user exists and is a member of the parent organization
- **WHEN** the admin adds the user via `POST /api/v1/teams/:teamId/members` with role `admin`
- **THEN** the system creates a team membership record with role `admin`

#### Scenario: Non-admin attempts to add a member

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is a team member but not a team admin
- **WHEN** the user attempts to add a member via `POST /api/v1/teams/:teamId/members`
- **THEN** the system returns a 403 Forbidden error

#### Scenario: Admin attempts to add user who is already a member

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is a team admin
- **AND** the target user is already a team member
- **WHEN** the admin attempts to add the user via `POST /api/v1/teams/:teamId/members`
- **THEN** the system returns a 409 Conflict error
- **AND** the error message indicates the user is already a member

#### Scenario: Admin attempts to add user not in the parent organization

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is a team admin
- **AND** the target user is not a member of the parent organization
- **WHEN** the admin attempts to add the user via `POST /api/v1/teams/:teamId/members`
- **THEN** the system returns a 422 Business Rule Error
- **AND** the error message indicates the user is not an organization member

### Requirement: Remove Team Member

#### Scenario: Team admin removes a member

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is a team admin
- **AND** the target user is a team member
- **WHEN** the admin removes the user via `DELETE /api/v1/teams/:teamId/members/:userId`
- **THEN** the system soft-deletes the membership record
- **AND** the user's issues remain intact (teamId SHALL NOT be changed)
- **AND** the system returns a 204 No Content response

#### Scenario: Non-admin attempts to remove a member

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is a team member but not a team admin
- **WHEN** the user attempts to remove a member via `DELETE /api/v1/teams/:teamId/members/:userId`
- **THEN** the system returns a 403 Forbidden error

#### Scenario: Admin attempts to remove the last admin

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is a team admin
- **AND** the target user is the only admin in the team
- **WHEN** the admin attempts to remove the last admin via `DELETE /api/v1/teams/:teamId/members/:userId`
- **THEN** the system returns a 422 Business Rule Error
- **AND** the error message indicates the last admin cannot be removed

### Requirement: List Team Members

#### Scenario: Team member lists members

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is a team member
- **AND** the team has one or more members
- **WHEN** the user lists members via `GET /api/v1/teams/:teamId/members`
- **THEN** the system returns a list of team members
- **AND** each member includes id, userId, name, email, role, and joinedAt
- **AND** soft-deleted memberships are excluded

#### Scenario: Team member lists members when team has no members

- **GIVEN** a user is authenticated with a valid JWT
- **AND** the user is a team member
- **AND** the team has no active members
- **WHEN** the user lists members via `GET /api/v1/teams/:teamId/members`
- **THEN** the system returns an empty list

---

## Data Model

### Team

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, NOT NULL | Team identifier |
| organizationId | UUID | FK → Organization.id, NOT NULL | Parent organization |
| name | string | NOT NULL, max 255 | Team display name |
| key | string | NOT NULL, max 10 | Uppercase alpha issue prefix (e.g., "ENG") |
| createdAt | timestamp | NOT NULL | Creation timestamp |
| updatedAt | timestamp | NOT NULL | Last update timestamp |
| deletedAt | timestamp \| null | NULL | Soft deletion timestamp |

Unique constraint: `(organizationId, key)` — team key MUST be unique within an organization.

### TeamMember

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, NOT NULL | Membership identifier |
| teamId | UUID | FK → Team.id, NOT NULL | Team reference |
| userId | UUID | FK → User.id, NOT NULL | User reference |
| role | string | NOT NULL | Member role (`admin` or `member`) |
| createdAt | timestamp | NOT NULL | Membership creation timestamp |
| deletedAt | timestamp \| null | NULL | Soft deletion timestamp |

Unique constraint: `(teamId, userId)` — a user SHALL only have one membership per team.

### Relationships

```
Organization --1:N--> Team: Organization has many teams (cascade soft-delete)
Team --1:N--> TeamMember: Team has many members
User --1:N--> TeamMember: User can be member of multiple teams
Team --1:N--> Issue: Team has many issues (issues orphaned on team delete)
```

## Business Rules

1. **Key Uniqueness**: Team keys SHALL be unique within an organization. The system MUST enforce a composite unique constraint on `(organizationId, key)`.

2. **Key Format**: Team keys SHALL be uppercase alphabetic characters only (A-Z), with a minimum length of 1 and maximum of 10 characters. Keys are used as issue prefixes (e.g., `ENG-123`).

3. **Auto-Enrollment**: The user who creates a team SHALL automatically become a team member with role `admin`.

4. **Organization Membership Requirement**: Only users who are members of the parent organization SHALL be added to a team.

5. **Admin Membership Management**: Only team members with role `admin` SHALL be able to add or remove team members.

6. **Admin Deletion Authority**: Only team members with role `admin` SHALL be able to delete the team.

7. **Last Admin Protection**: The last remaining admin of a team SHALL NOT be removable. At least one admin MUST remain in the team.

8. **Multi-Team Membership**: Users SHALL be able to belong to multiple teams.

9. **Issue Retention on Member Removal**: When a member is removed from a team, their issues SHALL NOT be deleted or reassigned. The `teamId` on those issues SHALL remain unchanged.

10. **Soft Delete**: Team deletion SHALL be soft (setting `deletedAt` timestamp). Deleted teams SHALL be excluded from default queries.

11. **Cascade on Team Delete**: When a team is soft-deleted:
    - All `TeamMember` records for that team SHALL be soft-deleted.
    - All issues with `teamId` pointing to the deleted team SHALL have `teamId` set to `null`.

## Security

1. **Authentication**: All team and membership endpoints SHALL require JWT authentication.

2. **Authorization**:
   - Team creation: SHALL require organization membership.
   - Team details: SHALL require team membership.
   - Team listing: SHALL require organization membership.
   - Team deletion: SHALL require team admin role.
   - Add/remove members: SHALL require team admin role.
   - List members: SHALL require team membership.

3. **Input Validation**: All input SHALL be validated at the API boundary using Zod schemas. Team keys SHALL be uppercased and trimmed before validation.

4. **Rate Limiting**: All endpoints SHALL be rate-limited as defined in the API contract.

5. **Soft Deletion**: Deleted team data SHALL be retained in the database with a `deletedAt` timestamp for audit and recovery purposes.
