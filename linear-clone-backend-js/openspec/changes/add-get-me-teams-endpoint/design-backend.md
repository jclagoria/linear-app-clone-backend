# Identity — Backend Design

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Endpoint prefix | `/me/teams` | Follows REST convention for user-scoped resources (matching `/users/me`, `/organizations`) |
| Hydration strategy | Sequential Promise.all | Same pattern as `ListUserOrganizations` — N+1 acceptable for user's typical team count |
| No new repositories | Reuse `DrizzleTeamMemberRepository.findByUserId`, `DrizzleTeamRepository.findById`, `DrizzleOrganizationRepository.findById` | All three already exist with the required methods |
| Error response format | Match existing `identity-controller.ts` pattern | `{ error: { code, message } }` with uppercase snake_case codes |
| No pagination | Not required | Users typically belong to few teams (< 20) |

## API Contracts

### GET /api/v1/me/teams

- **Method**: GET
- **Path**: `/api/v1/me/teams`
- **Request**: No body or query params. Auth via `Authorization: Bearer <token>`
- **Response**: `{ data: { teams: Team[] } }`
- **Status Codes**: 200, 401, 500

**Team response shape**:
```ts
{
  id: string;       // UUID
  name: string;
  key: string;      // e.g., "ENG"
  orgId: string;    // organization UUID
  orgName: string;  // organization display name
}
```

## Data Model

No new tables or migrations required. The existing `team_members`, `teams`, and `organizations` tables cover all data.

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
| `role` | varchar(50) | NOT NULL, default 'member' | |
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

### Migrations

No new migrations — all required tables exist.

## Business Logic

### ListUserTeams

- **Responsibility**: Return teams the authenticated user belongs to, with org context
- **Flow**:
  1. Extract `userId` from JWT access token
  2. `teamMemberRepository.findByUserId(userId)` → get memberships
  3. Filter out soft-deleted memberships (`deletedAt IS NOT NULL`)
  4. For each membership: `teamRepository.findById(membership.teamId)` → hydrate team
  5. Filter out soft-deleted teams (`deletedAt IS NOT NULL`)
  6. For each team: `organizationRepository.findById(team.organizationId)` → hydrate org name
  7. Return `{ id, name, key, orgId, orgName }[]`
- **Dependencies**: `TeamMemberRepository`, `TeamRepository`, `OrganizationRepository`
- **Edge cases**: User with no memberships → empty array; membership without a team (orphaned) → skip

### Route handler

- **Path**: `GET /me/teams` registered in `identity-controller.ts`
- **Auth**: Uses existing `getUserIdFromToken` helper
- **Rate limit**: 30 req/min (same as `GET /users/me`)
- **Response format**: `{ data: { teams: [...] } }`
- **Error handling**: 401 if no/invalid token; 500 on unexpected errors

## Security

- **Authentication**: Bearer JWT access token via existing `getUserIdFromToken` helper
- **Authorization**: Implicit — `findByUserId` scopes results to the authenticated user. No role check needed since team membership is the access criterion
- **Input Sanitization**: No user-supplied input. `userId` extracted from server-verified JWT

## Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | `ListUserTeams.execute` — mock repositories, verify hydration + filtering |
| Integration | Vitest + Testcontainers | Full HTTP request → DB → response via Fastify `inject()` |
