# Identity — Business Specification

## Behaviour

**Feature:** List User Teams

The system SHALL return only the teams the authenticated user is a member of. Each team SHALL include its parent organization identifier and name.

### Requirement: AuthenticatedAccess

#### Scenario: User requests their teams

- **GIVEN** the user is authenticated with a valid JWT access token
- **AND** the user belongs to 2 teams across 2 organizations
- **WHEN** they send `GET /api/v1/me/teams`
- **THEN** the response SHALL contain both teams
- **AND** each team SHALL include `id`, `name`, `key`, `orgId`, and `orgName`

#### Scenario: Unauthenticated request

- **GIVEN** the request has no `Authorization` header
- **WHEN** they send `GET /api/v1/me/teams`
- **THEN** the response SHALL be `401 Unauthorized`

#### Scenario: User with no team memberships

- **GIVEN** the user is authenticated
- **AND** the user has no team memberships
- **WHEN** they send `GET /api/v1/me/teams`
- **THEN** the response SHALL contain an empty `teams` array

## Data Model

### Team

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | UUID | PK, default random | |
| `organizationId` | UUID | FK → organizations.id, NOT NULL | |
| `name` | varchar(255) | NOT NULL | |
| `key` | varchar(10) | NOT NULL | Uppercase, unique per org |
| `createdAt` | timestamp | NOT NULL, default now | |
| `updatedAt` | timestamp | NOT NULL, default now | |
| `deletedAt` | timestamp | nullable | Soft-delete |

### TeamMember

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | UUID | PK, default random | |
| `teamId` | UUID | FK → teams.id, NOT NULL | |
| `userId` | UUID | FK → users.id, NOT NULL | |
| `role` | varchar(50) | NOT NULL, default 'member' | `member` or `admin` |
| `createdAt` | timestamp | NOT NULL, default now | |
| `deletedAt` | timestamp | nullable | Soft-delete |

### Organization

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | UUID | PK, default random | |
| `name` | varchar(255) | NOT NULL, UNIQUE | |
| `ownerId` | UUID | FK → users.id, NOT NULL | |
| `createdAt` | timestamp | NOT NULL, default now | |
| `updatedAt` | timestamp | NOT NULL, default now | |
| `deletedAt` | timestamp | nullable | Soft-delete |

### Relationships

```
User --1:N--> TeamMember --N:1--> Team --N:1--> Organization
```

A `User` has many `TeamMember` records. Each `TeamMember` belongs to one `Team`. Each `Team` belongs to one `Organization`. The `ListUserTeams` use case traverses: User → TeamMember → Team → Organization.

## Business Rules

1. A team membership SHALL be required to view a team.
2. Soft-deleted team memberships (`deletedAt IS NOT NULL`) MUST be excluded from results.
3. Soft-deleted teams (`deletedAt IS NOT NULL`) MUST be excluded from results.
4. The team-org unique constraint SHALL prevent duplicate team keys within the same organization.

## Security

1. **Authentication**: Bearer JWT access token REQUIRED. Requests without a valid token SHALL receive `401 Unauthorized`.
2. **Authorization**: The query scopes results to the authenticated user's `userId` — no explicit role check needed since membership is the access criterion.
3. **Input sanitization**: No user-supplied input. The `userId` is extracted from the JWT payload, which is server-verified.
