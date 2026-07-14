# Team & Membership — Backend Design

## Architecture Decisions

This design follows the existing hexagonal architecture patterns established in the Identity Module. The team and membership domain will be added to the same module, alongside the existing user profile and organization entities.

### Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Module placement | Identity Module (`src/modules/identity/`) | Teams belong to organizations, which are already in Identity. Adding a new module would introduce unnecessary circular dependencies |
| Route prefix | `/api/v1` | Matches existing identity routes pattern — teams are scoped under organizations |
| Soft delete pattern | `deletedAt` timestamp | Consistent with existing `Organization` and `OrganizationMember` entities |
| Key validation | Uppercase transform + Zod regex | Keys are normalized to uppercase on input for consistency |
| Authorization | Middleware-level checks in use cases | Reuses existing authorization patterns from organization use cases |
| Cascade on delete | Soft-delete members + nullify issue references in use case | Consistent with organization deletion cascade pattern |

## API Contracts

### Create Team

- **Method**: POST
- **Path**: `/api/v1/organizations/:organizationId/teams`
- **Request**: `{ name: string, key: string }`
- **Response** (201): `{ data: { team: TeamObject } }`
- **Status Codes**: 201, 400, 401, 403, 404, 409, 500

### List Teams

- **Method**: GET
- **Path**: `/api/v1/organizations/:organizationId/teams`
- **Request**: (path param only)
- **Response** (200): `{ data: { teams: TeamObject[] } }`
- **Status Codes**: 200, 401, 403, 404, 500

### Get Team Details

- **Method**: GET
- **Path**: `/api/v1/teams/:teamId`
- **Request**: (path param only)
- **Response** (200): `{ data: { team: TeamObject } }`
- **Status Codes**: 200, 401, 403, 404, 500

### Delete Team

- **Method**: DELETE
- **Path**: `/api/v1/teams/:teamId`
- **Request**: (path param only)
- **Response** (204): (no body)
- **Status Codes**: 204, 401, 403, 404, 500

### List Team Members

- **Method**: GET
- **Path**: `/api/v1/teams/:teamId/members`
- **Request**: (path param only)
- **Response** (200): `{ data: { members: TeamMemberObject[] } }`
- **Status Codes**: 200, 401, 403, 404, 500

### Add Team Member

- **Method**: POST
- **Path**: `/api/v1/teams/:teamId/members`
- **Request**: `{ userId: string, role?: "member" | "admin" }`
- **Response** (201): `{ data: { member: TeamMemberObject } }`
- **Status Codes**: 201, 400, 401, 403, 404, 409, 422, 500

### Remove Team Member

- **Method**: DELETE
- **Path**: `/api/v1/teams/:teamId/members/:userId`
- **Request**: (path params only)
- **Response** (204): (no body)
- **Status Codes**: 204, 401, 403, 404, 422, 500

## Data Model

### Team

```typescript
// src/modules/identity/domain/team.ts
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizationId: uuid('organization_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  key: varchar('key', { length: 10 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
// Unique constraint: (organizationId, key) — enforced via unique index
```

### TeamMember

```typescript
// src/modules/identity/domain/team-member.ts
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const teamMembers = pgTable('team_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').notNull(),
  userId: uuid('user_id').notNull(),
  role: varchar('role', { length: 50 }).notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
// Unique constraint: (teamId, userId) — a user belongs to a team once
```

### Entity Relationships

```
Organization (existing)
  └── Team (new) — 1:N via organizationId FK
        ├── TeamMember (new) — 1:N via teamId FK (cascade soft-delete)
        └── Issue (future, Work Module) — 1:N via teamId FK (nullified on delete)

User (existing)
  └── TeamMember (new) — 1:N via userId FK
```

### Migrations

| Version | Description |
|---------|-------------|
| V1 | `CREATE TABLE teams` with composite unique index on `(organization_id, key)` where `deleted_at IS NULL` |
| V1 | `CREATE TABLE team_members` with unique index on `(team_id, user_id)` where `deleted_at IS NULL` |

## Business Logic

### CreateTeam

- **Responsibility**: Create a team within an organization
- **Rules**:
  - Validates organization exists and user is a member
  - Normalizes key to uppercase, validates format (A-Z, 1-10 chars)
  - Checks key uniqueness within organization (excluding soft-deleted)
  - Auto-enrolls creator as team admin
  - Publishes `TeamCreated` event
- **Dependencies**: `TeamRepository`, `TeamMemberRepository`, `OrganizationMemberRepository`, `EventPublisher`

### ListTeams

- **Responsibility**: Return all non-deleted teams in an organization
- **Rules**:
  - Validates organization exists and user is a member
  - Excludes soft-deleted teams
  - Returns empty list if no teams exist
- **Dependencies**: `TeamRepository`, `OrganizationMemberRepository`

### GetTeamDetails

- **Responsibility**: Return a single team by ID
- **Rules**:
  - Validates team exists and user is a team member
  - Excludes soft-deleted teams
- **Dependencies**: `TeamRepository`, `TeamMemberRepository`

### DeleteTeam

- **Responsibility**: Soft-delete a team and cascade
- **Rules**:
  - Validates team exists and user is a team admin
  - Soft-deletes all `TeamMember` records for this team
  - Sets `teamId = null` on all issues referencing this team (via event or direct call)
  - Sets `deletedAt` on the team record
  - Publishes `TeamDeleted` event
- **Dependencies**: `TeamRepository`, `TeamMemberRepository`, `EventPublisher`, (future: `IssueRepository`)

### AddTeamMember

- **Responsibility**: Add a user to a team
- **Rules**:
  - Validates team exists and requesting user is team admin
  - Validates target user is a member of the parent organization
  - Validates target user is not already a team member
  - Default role is `member` unless `admin` is explicitly requested
  - Publishes `TeamMemberAdded` event
- **Dependencies**: `TeamMemberRepository`, `OrganizationMemberRepository`, `EventPublisher`

### RemoveTeamMember

- **Responsibility**: Remove a user from a team
- **Rules**:
  - Validates team exists and requesting user is team admin
  - Validates target user is a team member
  - Prevents removing the last admin (at least one admin must remain)
  - Soft-deletes the membership record
  - Does NOT modify user's issues
  - Publishes `TeamMemberRemoved` event
- **Dependencies**: `TeamMemberRepository`, `EventPublisher`

### ListTeamMembers

- **Responsibility**: Return all active members of a team
- **Rules**:
  - Validates team exists and user is a team member
  - Excludes soft-deleted memberships
  - Joins with user profile for name and email
- **Dependencies**: `TeamMemberRepository`, `UserProfileRepository`

## Port Interfaces

### TeamRepository

```typescript
export interface TeamRepository {
  findById(id: string): Promise<Team | null>;
  findByOrganizationId(organizationId: string): Promise<Team[]>;
  findByKey(organizationId: string, key: string): Promise<Team | null>;
  create(team: NewTeam): Promise<Team>;
  delete(id: string): Promise<void>;
}
```

### TeamMemberRepository

```typescript
export interface TeamMemberRepository {
  findById(id: string): Promise<TeamMember | null>;
  findByTeamId(teamId: string): Promise<TeamMember[]>;
  findByUserId(userId: string): Promise<TeamMember[]>;
  findByTeamAndUser(teamId: string, userId: string): Promise<TeamMember | null>;
  create(member: NewTeamMember): Promise<TeamMember>;
  deleteByTeamId(teamId: string): Promise<void>;
  deleteByTeamAndUser(teamId: string, userId: string): Promise<void>;
}
```

## Error Types

New domain errors to add to `src/modules/identity/domain/errors.ts`:

```typescript
export class TeamNotFoundError extends Error {
  constructor(message: string = 'Team not found') {
    super(message);
    this.name = 'TeamNotFoundError';
  }
}

export class TeamKeyConflictError extends Error {
  constructor(message: string = 'Team key already exists in this organization') {
    super(message);
    this.name = 'TeamKeyConflictError';
  }
}

export class NotTeamMemberError extends Error {
  constructor(message: string = 'Not a team member') {
    super(message);
    this.name = 'NotTeamMemberError';
  }
}

export class NotTeamAdminError extends Error {
  constructor(message: string = 'Only team admins can perform this action') {
    super(message);
    this.name = 'NotTeamAdminError';
  }
}

export class AlreadyTeamMemberError extends Error {
  constructor(message: string = 'User is already a team member') {
    super(message);
    this.name = 'AlreadyTeamMemberError';
  }
}

export class LastAdminRemovalError extends Error {
  constructor(message: string = 'Cannot remove the last team admin') {
    super(message);
    this.name = 'LastAdminRemovalError';
  }
}
```

## Security

- **Authentication**: JWT access token extracted from `Authorization: Bearer` header — reuses existing `getUserIdFromToken` helper
- **Authorization**:
  - Organization-scoped operations (create team, list teams): check organization membership via `OrganizationMemberRepository`
  - Team-scoped operations (get details, list members): check team membership via `TeamMemberRepository`
  - Admin operations (delete team, add/remove members): check team admin role via `TeamMemberRepository`
- **Input Validation**: Zod schemas at controller boundary — consistent with existing `dto.ts` pattern
- **Key Normalization**: Team keys are uppercased and trimmed before storage

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /organizations/:orgId/teams | 10/min | 1 minute |
| GET /organizations/:orgId/teams | 30/min | 1 minute |
| GET /teams/:teamId | 30/min | 1 minute |
| DELETE /teams/:teamId | 5/min | 1 minute |
| GET /teams/:teamId/members | 30/min | 1 minute |
| POST /teams/:teamId/members | 10/min | 1 minute |
| DELETE /teams/:teamId/members/:userId | 10/min | 1 minute |

## Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | Use cases, validators, domain errors |
| Integration | Vitest + Testcontainers | Repository operations, full API flow |
| Contract | Vitest | API contract verification per endpoint |

### Unit Tests

- `CreateTeam` — validates key uniqueness, auto-enrollment, organization membership check
- `DeleteTeam` — validates admin-only, cascade soft-delete, issues orphaned
- `AddTeamMember` — validates duplicate prevention, org membership requirement, admin-only
- `RemoveTeamMember` — validates last admin protection, issue retention
- Key format validator — valid/invalid key patterns, uppercase normalization

### Integration Tests

- POST + GET team flow — create team and retrieve it
- List teams in organization — with and without teams
- Add + list members — verify membership creation
- Remove member — verify soft-delete and issue retention
- Delete team — verify cascade (memberships soft-deleted, teams excluded from queries)
- Authorization — non-member 403, non-admin 403 on admin operations

### Contract Tests

- One contract test per endpoint — verifies request/response shape matches API spec
- Error contract tests — validates error response format for each error code
