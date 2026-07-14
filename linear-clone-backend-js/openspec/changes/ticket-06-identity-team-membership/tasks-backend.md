# Tasks — Ticket 06: Identity Module — Team & Membership (Backend)

## Scaffold

- [ ] Create `src/modules/identity/domain/team.ts` — Drizzle `pgTable` for `teams` with composite unique index
- [ ] Create `src/modules/identity/domain/team-member.ts` — Drizzle `pgTable` for `team_members` with unique constraint on `(teamId, userId)`
- [ ] Create Drizzle migration files for `teams` and `team_members` tables
- [ ] Add domain error classes: `TeamNotFoundError`, `TeamKeyConflictError`, `NotTeamMemberError`, `NotTeamAdminError`, `AlreadyTeamMemberError`, `LastAdminRemovalError`

## Data Layer

- [ ] Create `TeamRepository` port interface in `application/ports/team-repository.ts`
- [ ] Create `TeamMemberRepository` port interface in `application/ports/team-member-repository.ts`
- [ ] Implement `DrizzleTeamRepository` adapter in `adapters/out/drizzle-team-repository.ts`
- [ ] Implement `DrizzleTeamMemberRepository` adapter in `adapters/out/drizzle-team-member-repository.ts`

## Business Logic

- [ ] Create `CreateTeam` use case — validates org membership, key uniqueness, auto-enrolls creator as admin
- [ ] Create `ListTeams` use case — returns non-deleted teams in an organization
- [ ] Create `GetTeamDetails` use case — returns team by ID with membership check
- [ ] Create `DeleteTeam` use case — soft-deletes team, cascades memberships, publishes event
- [ ] Create `AddTeamMember` use case — validates admin role, org membership, duplicate prevention
- [ ] Create `RemoveTeamMember` use case — validates admin role, last admin protection, soft-deletes membership
- [ ] Create `ListTeamMembers` use case — returns active members with user profile data

## API Layer

- [ ] Add request DTOs to `adapters/in/dto.ts`: `CreateTeamRequestSchema`, `TeamIdParamsSchema`, `TeamMemberIdParamsSchema`, `AddTeamMemberRequestSchema`
- [ ] Add response interfaces to `adapters/in/dto.ts`: `TeamResponse`, `TeamMemberResponse`
- [ ] Add route `POST /organizations/:organizationId/teams` — Create Team
- [ ] Add route `GET /organizations/:organizationId/teams` — List Teams
- [ ] Add route `GET /teams/:teamId` — Get Team Details
- [ ] Add route `DELETE /teams/:teamId` — Delete Team
- [ ] Add route `GET /teams/:teamId/members` — List Team Members
- [ ] Add route `POST /teams/:teamId/members` — Add Team Member
- [ ] Add route `DELETE /teams/:teamId/members/:userId` — Remove Team Member
- [ ] Wire error handling in controller for all new error types
- [ ] Apply rate limiting config per endpoint

## Events / Messaging

- [ ] Publish `TeamCreated` event from `CreateTeam` use case
- [ ] Publish `TeamDeleted` event from `DeleteTeam` use case (for downstream issue nullification)
- [ ] Publish `TeamMemberAdded` event from `AddTeamMember` use case
- [ ] Publish `TeamMemberRemoved` event from `RemoveTeamMember` use case

## Security

- [ ] Verify JWT authentication on all new routes
- [ ] Add organization membership check for org-scoped operations (create, list teams)
- [ ] Add team membership check for team-scoped operations (get details, list members)
- [ ] Add team admin role check for admin operations (delete team, add/remove members)
- [ ] Validate team key format (uppercase A-Z, 1-10 chars) with normalization

## Testing

### Unit Tests

- [ ] Test `CreateTeam` — successful creation, duplicate key, non-org member
- [ ] Test `DeleteTeam` — admin access, cascade memberships, event published
- [ ] Test `AddTeamMember` — success, duplicate member, non-org member, non-admin
- [ ] Test `RemoveTeamMember` — success, last admin protection, issue retention
- [ ] Test `ListTeams` — with teams, empty, soft-deleted excluded
- [ ] Test `GetTeamDetails` — success, not found, non-member
- [ ] Test `ListTeamMembers` — with members, empty, soft-deleted excluded
- [ ] Test key format validator — valid/invalid patterns, uppercase normalization

### Integration Tests

- [ ] Test create + get team flow
- [ ] Test list teams with multiple teams
- [ ] Test add + list members flow
- [ ] Test remove member and verify soft-delete
- [ ] Test delete team cascade (memberships soft-deleted, team excluded from queries)
- [ ] Test authorization — non-member 403 on team access
- [ ] Test authorization — non-admin 403 on admin operations

### Contract Tests

- [ ] Contract test for each team management endpoint (create, list, get, delete)
- [ ] Contract test for each membership endpoint (add, remove, list)
- [ ] Contract test for error responses (400, 401, 403, 404, 409, 422)

## Review

- [ ] Self-review: verify all acceptance criteria from LAG-12 are addressed
- [ ] Verify error handling covers all error types
- [ ] Verify rate limiting is configured on all new routes
- [ ] Verify test coverage includes happy path, error cases, and authorization
