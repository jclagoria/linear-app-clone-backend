# Tasks — Ticket 06: Identity Module — Team & Membership (Backend)

## Scaffold

- [x] Create `src/modules/identity/domain/team.ts` — Drizzle `pgTable` for `teams` with composite unique index
- [x] Create `src/modules/identity/domain/team-member.ts` — Drizzle `pgTable` for `team_members` with unique constraint on `(teamId, userId)`
- [x] Create Drizzle migration files for `teams` and `team_members` tables
- [x] Add domain error classes: `TeamNotFoundError`, `TeamKeyConflictError`, `NotTeamMemberError`, `NotTeamAdminError`, `AlreadyTeamMemberError`, `LastAdminRemovalError`

## Data Layer

- [x] Create `TeamRepository` port interface in `application/ports/team-repository.ts`
- [x] Create `TeamMemberRepository` port interface in `application/ports/team-member-repository.ts`
- [x] Implement `DrizzleTeamRepository` adapter in `adapters/out/drizzle-team-repository.ts`
- [x] Implement `DrizzleTeamMemberRepository` adapter in `adapters/out/drizzle-team-member-repository.ts`

## Business Logic

- [x] Create `CreateTeam` use case — validates org membership, key uniqueness, auto-enrolls creator as admin
- [x] Create `ListTeams` use case — returns non-deleted teams in an organization
- [x] Create `GetTeamDetails` use case — returns team by ID with membership check
- [x] Create `DeleteTeam` use case — soft-deletes team, cascades memberships, publishes event
- [x] Create `AddTeamMember` use case — validates admin role, org membership, duplicate prevention
- [x] Create `RemoveTeamMember` use case — validates admin role, last admin protection, soft-deletes membership
- [x] Create `ListTeamMembers` use case — returns active members with user profile data

## API Layer

- [x] Add request DTOs to `adapters/in/dto.ts`: `CreateTeamRequestSchema`, `TeamIdParamsSchema`, `TeamMemberIdParamsSchema`, `AddTeamMemberRequestSchema`
- [x] Add response interfaces to `adapters/in/dto.ts`: `TeamResponse`, `TeamMemberResponse`
- [x] Add route `POST /organizations/:organizationId/teams` — Create Team
- [x] Add route `GET /organizations/:organizationId/teams` — List Teams
- [x] Add route `GET /teams/:teamId` — Get Team Details
- [x] Add route `DELETE /teams/:teamId` — Delete Team
- [x] Add route `GET /teams/:teamId/members` — List Team Members
- [x] Add route `POST /teams/:teamId/members` — Add Team Member
- [x] Add route `DELETE /teams/:teamId/members/:userId` — Remove Team Member
- [x] Wire error handling in controller for all new error types
- [x] Apply rate limiting config per endpoint

## Events / Messaging

- [x] Publish `TeamCreated` event from `CreateTeam` use case
- [x] Publish `TeamDeleted` event from `DeleteTeam` use case (for downstream issue nullification)
- [x] Publish `TeamMemberAdded` event from `AddTeamMember` use case
- [x] Publish `TeamMemberRemoved` event from `RemoveTeamMember` use case

## Security

- [x] Verify JWT authentication on all new routes
- [x] Add organization membership check for org-scoped operations (create, list teams)
- [x] Add team membership check for team-scoped operations (get details, list members)
- [x] Add team admin role check for admin operations (delete team, add/remove members)
- [x] Validate team key format (uppercase A-Z, 1-10 chars) with normalization

## Testing

### Unit Tests

- [x] Test `CreateTeam` — input validation tests (uuid, name, key format)
- [x] Test `AddTeamMember` — input validation tests (uuid, role enum, default role)
- [ ] Test `CreateTeam` use case — successful creation, duplicate key, non-org member
- [ ] Test `DeleteTeam` use case — admin access, cascade memberships, event published
- [ ] Test `AddTeamMember` use case — success, duplicate member, non-org member, non-admin
- [ ] Test `RemoveTeamMember` use case — success, last admin protection, issue retention
- [ ] Test `ListTeams` — with teams, empty, soft-deleted excluded
- [ ] Test `GetTeamDetails` — success, not found, non-member
- [ ] Test `ListTeamMembers` — with members, empty, soft-deleted excluded
- [ ] Test key format validator — valid/invalid patterns, uppercase normalization

### Integration Tests

- [x] Integration test placeholders created for all team endpoints
- [x] Integration test placeholders created for authorization scenarios
- [ ] Test create + get team flow
- [ ] Test list teams with multiple teams
- [ ] Test add + list members flow
- [ ] Test remove member and verify soft-delete
- [ ] Test delete team cascade (memberships soft-deleted, team excluded from queries)
- [ ] Test authorization — non-member 403 on team access
- [ ] Test authorization — non-admin 403 on admin operations

### Contract Tests

- [x] Contract test for each team management endpoint (create, list, get, delete)
- [x] Contract test for each membership endpoint (add, remove, list)
- [x] Contract test for error responses (400, 401, 403, 404, 409, 422)

## Review

- [ ] Self-review: verify all acceptance criteria from LAG-12 are addressed
- [ ] Verify error handling covers all error types
- [ ] Verify rate limiting is configured on all new routes
- [ ] Verify test coverage includes happy path, error cases, and authorization
