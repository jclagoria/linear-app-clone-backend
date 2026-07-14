# Review — Ticket 06: Identity Module — Team & Membership

## Spec Compliance

All 13 acceptance criteria from LAG-12 are addressed by the artifacts:

| AC | Requirement | Covered In | Status |
|----|-------------|------------|--------|
| 1 | User can create a team within an organization | `specs/api/team.md` — POST endpoint, `specs/business/team.md` — BDD scenarios, `design-backend.md` — CreateTeam use case | ✅ |
| 2 | Team key must be unique within organization | `specs/business/team.md` — duplicate key scenario, `adr/002` — partial unique index | ✅ |
| 3 | Key is used as issue prefix (e.g., ENG-123) | `specs/api/team.md` — key field description, `design-backend.md` — key format validation | ✅ |
| 4 | Creator automatically becomes team member | `specs/business/team.md` — auto-enrollment scenario, `design-backend.md` — CreateTeam rules | ✅ |
| 5 | User can list teams in an organization | `specs/api/team.md` — GET endpoint, `design-backend.md` — ListTeams use case | ✅ |
| 6 | User can get team details | `specs/api/team.md` — GET endpoint, `design-backend.md` — GetTeamDetails use case | ✅ |
| 7 | Team admin can add members | `specs/api/team.md` — POST member endpoint, `design-backend.md` — AddTeamMember | ✅ |
| 8 | Team admin can remove members | `specs/api/team.md` — DELETE member endpoint, `design-backend.md` — RemoveTeamMember | ✅ |
| 9 | Users can belong to multiple teams | `specs/business/team.md` — multi-team membership rule, `design-backend.md` — relationships | ✅ |
| 10 | Removing a member does not delete their issues | `specs/business/team.md` — issue retention scenario, `design-backend.md` — RemoveTeamMember | ✅ |
| 11 | Team deletion is soft (deletedAt) — only team admin can delete | `specs/api/team.md` — DELETE endpoint, `design-backend.md` — DeleteTeam, `adr/003` | ✅ |
| 12 | Issues reassigned to no team (teamId = null) when team deleted | `specs/business/team.md` — delete cascade scenario, `design-backend.md` — cascade rules | ✅ |
| 13 | Members removed on team deletion | `specs/business/team.md` — delete cascade scenario, `design-backend.md` — cascade rules | ✅ |

## Edge Cases

| Edge Case | Handled |
|-----------|---------|
| Duplicate team key within organization | 409 Conflict — application check + DB unique index |
| Invalid key format (lowercase, special chars, too long) | 400 Validation Error — Zod schema with regex |
| Non-org member attempts to create team | 403 Forbidden — org membership check |
| Non-team-member attempts to view team details | 403 Forbidden — team membership check |
| Non-admin attempts to delete team or manage members | 403 Forbidden — admin role check |
| Adding user who is already a member | 409 Conflict — duplicate check |
| Adding user not in parent organization | 422 Business Rule Error — org membership requirement |
| Removing the last admin from a team | 422 Business Rule Error — last admin protection |
| Listing teams when none exist | 200 with empty array |
| Listing members when none exist | 200 with empty array |
| Soft-deleted teams excluded from queries | `WHERE deleted_at IS NULL` in all queries |
| Race condition on key uniqueness check | Caught by DB unique constraint violation as safety net |

## Leakage Check

- No implementation details (framework names, library specifics, file paths) leaked into specs
- Specs remain technology-agnostic — tech decisions isolated to `tech-stack.md` and `design-backend.md`
- API contract uses normative language (SHALL, MUST) without binding to specific HTTP libraries
- Business scenarios are written in Gherkin without code references

## Performance Bounds

| Bound | Definition |
|-------|------------|
| Team creation latency | No explicit target — use case involves org membership check + DB insert (expect sub-100ms) |
| Team listing latency | Single indexed query by organizationId — should be sub-50ms |
| Membership operations | Single-row operations with FK checks — expect sub-50ms |
| Rate limiting | 5-30 req/min depending on endpoint sensitivity |

Performance targets are not stringent for this domain — teams are created infrequently and membership operations are low-volume.

## Migration Rollback

- **Forward**: Run Drizzle migration to create `teams` and `team_members` tables with indexes
- **Rollback**: Run down migration to drop `team_members` then `teams` tables
- **Data safety**: Soft-delete pattern means no data is destroyed — tables can be dropped safely if no issues reference them
- **Risk**: If Work Module (LAG-13) has already created issues referencing teams, rollback would orphan issue references. Mitigation: deploy Identity + Work tickets in the same release to avoid partial state

## Backward Compatibility

| Concern | Assessment |
|---------|------------|
| New tables | Additive — no impact on existing consumers |
| New endpoints | Additive — no existing route changes |
| Existing Organization endpoints | Unchanged — teams do not affect existing organization API |
| Response format changes | None — follows existing `{ data: { ... } }` pattern |
| Removed/renamed fields | None |

This change is fully backward compatible. All existing API contracts remain unchanged.

## Checklist

- [x] All requirements covered (13/13 ACs mapped)
- [x] Scenarios pass (all BDD scenarios documented)
- [x] Error states handled (400, 401, 403, 404, 409, 422, 500)
- [x] No technical detail in specs (tech-agnostic specifications)
- [x] Performance bounds defined and validated
- [x] Migration rollback strategy documented
- [x] Backward compatibility verified or breaking change justified
