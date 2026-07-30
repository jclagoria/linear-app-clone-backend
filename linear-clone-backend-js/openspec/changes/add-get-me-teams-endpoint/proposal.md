# Add GET /api/v1/me/teams Endpoint

## Problem Statement

`GET /api/v1/organizations/:id/teams` returns **all** teams in an organization, unfiltered by user membership. The frontend needs to display only the teams the authenticated user belongs to, but currently has no way to fetch this without either over-fetching all teams or making multiple N+1 queries.

## Motivation

The frontend needs a single, efficient endpoint to retrieve the authenticated user's team memberships with org context. This eliminates unnecessary data transfer (all teams vs. user's teams), reduces frontend complexity (no client-side filtering), and provides a clean API contract for the user's team list. The endpoint aligns with REST conventions for resource scoped to the current user (`/me/teams`).

## Scope

- **In scope**:
  - New use case `ListUserTeams` in the identity module
  - New route `GET /me/teams` returning `{ data: { teams: [...] } }`
  - Team response includes `{ id, name, key, orgId, orgName }`
  - Use existing `teamMemberRepository.findByUserId`, `teamRepository.findById`, and org hydration
  - Unit test for the use case
  - Integration test for the endpoint
- **Out of scope**:
  - Changes to `GET /api/v1/organizations/:id/teams` (existing endpoint untouched)
  - Pagination (user's teams are typically few)
  - Caching layer for team data
  - WebSocket real-time updates for team membership changes

## Impact

- **Module affected**: `identity` — new use case and controller route
- **Files to create**: `src/modules/identity/application/list-user-teams.ts`
- **Files to modify**: `src/modules/identity/adapters/in/identity-controller.ts`
- **Existing ports/repos reused**: `teamMemberRepository.findByUserId`, `teamRepository.findById`
- **API contract**: New endpoint under `/me/teams` namespace
- **Frontend**: Gains a focused endpoint for user team listing
