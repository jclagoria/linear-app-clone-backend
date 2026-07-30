# Review — Add GET /api/v1/me/teams Endpoint

## Spec Compliance

- The API spec (`specs/api/list-user-teams.md`) defines a single endpoint `GET /me/teams` returning `{ data: { teams: [...] } }` with the required fields (`id`, `name`, `key`, `orgId`, `orgName`)
- The business spec (`specs/business/user-teams.md`) covers all three scenarios: authenticated with teams, unauthenticated, and authenticated with no memberships — all in GIVEN/WHEN/THEN format
- The design (`design-backend.md`) traces every requirement to an implementation approach that reuses existing patterns and repositories

## Edge Cases

- **User with no memberships**: returns `200` with empty `teams` array — covered in business spec Scenario 3
- **Soft-deleted memberships/teams**: filtered out — documented in design and business rules
- **Orphaned memberships** (team deleted): design skips them via null check on `teamRepository.findById`
- **Token-less request**: returns `401` — covered in Scenario 2
- **Expired/invalid token**: same `401` path via existing `getUserIdFromToken` helper

## Leakage Check

No implementation details (file paths, variable names, framework internals) appear in specs. The API spec uses REST-level terminology; the business spec uses domain language.

## Performance Bounds

No performance requirements defined. The endpoint follows the same hydration pattern as `ListUserOrganizations` (N+1 via `Promise.all`). This is acceptable given:
- Users typically belong to < 20 teams
- No pagination needed for that volume
- Each hydration step is a primary-key lookup (fast path)

## Migration Rollback

No schema or data migrations — all tables already exist. Rollback is a code revert.

## Backward Compatibility

- **New endpoint**: no existing consumers to break
- **Existing endpoints untouched**: `GET /organizations/:orgId/teams` remains unchanged
- **Response format**: matches existing `{ data: { ... } }` envelope pattern

## Checklist

- [x] All requirements covered
- [x] Scenarios pass
- [x] Error states handled
- [x] No technical detail in specs
- [x] Performance bounds defined and validated (N+1 acceptable)
- [x] Migration rollback strategy documented (no migration)
- [x] Backward compatibility verified
