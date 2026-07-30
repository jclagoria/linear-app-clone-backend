# Tasks — Add GET /api/v1/me/teams Endpoint (Backend)

## Scaffold

- [x] Create `src/modules/identity/application/list-user-teams.ts`

## Data Layer

*(No changes — all required repositories and tables exist.)*

## Business Logic

- [x] Implement `ListUserTeams` use case:
  - `findByUserId(userId)` on team member repository
  - Filter out soft-deleted memberships
  - `findById(membership.teamId)` on team repository
  - Filter out soft-deleted teams
  - `findById(team.organizationId)` on organization repository
  - Return `{ id, name, key, orgId, orgName }[]`

## API Layer

- [x] Add `GET /me/teams` route to `identity-controller.ts`
  - Reuse existing `getUserIdFromToken` helper
  - Wire `ListUserTeams` use case
  - Rate limit: 30 req/min
  - Error format: existing `{ error: { code, message } }` pattern

## Events / Messaging

*(Not applicable — no events for this change.)*

## Security

*(No changes — uses existing JWT auth and implicit authorization.)*

## Testing

- [x] Unit test: `ListUserTeams.execute` with mocked repositories
  - Happy path: user with memberships → hydrated teams
  - Empty: user with no memberships → empty array
  - Filtering: soft-deleted memberships/teams excluded
- [x] Integration test: `GET /me/teams` via Fastify `inject()`
  - Valid token → 200 with teams
  - No token → 401
  - Valid token, no memberships → 200 with empty array

## Review

- [x] Self-review: verify error handling, null safety, soft-delete filtering
- [x] Verify existing `GET /organizations/:orgId/teams` is untouched
