# Review — Work Module Issue CRUD & Status

## Spec Compliance

- **Proposal** aligns with LAG-13 acceptance criteria — scope covers creation, update, status changes, assignment, soft-delete, and filtered queries
- **Specs-api** defines all 7 endpoints with request/response schemas matching the LAG-13 requirements
- **Specs-business** covers all 6 feature areas with BDD scenarios — each acceptance criterion maps to at least one scenario
- **Design-backend** maps every endpoint to concrete route patterns, request validation schemas, and error handling consistent with the Identity module patterns
- **ADR** records capture the 4 significant architectural decisions with rationale and tradeoffs

## Edge Cases

| Case | Covered | Notes |
|------|---------|-------|
| Empty title on create | ✅ specs-business, design-backend | Rejected with 400 |
| Empty title on update | ✅ specs-business, design-backend | Rejected with 400 |
| Parent issue team mismatch | ✅ specs-business, design-backend | Rejected with 422 |
| Project team mismatch on change | ✅ specs-business, design-backend | Rejected with 422 |
| Assignee not team member | ✅ specs-business, design-backend | Rejected with 422 |
| Invalid status transition | ✅ specs-business, design-backend | Rejected with 422 |
| completedAt set/clear logic | ✅ specs-business, design-backend | Set on completed/canceled, cleared on reopen |
| Soft-deleted excluded by default | ✅ specs-business, design-backend | Default query filters deletedAt IS NULL |
| Cursor limit exceeds 100 | ✅ specs-business | Either capped or rejected |
| Unassign issue (set null) | ✅ specs-business | Always permitted |

## Leakage Check

- Specs-api uses normative language (SHALL, MUST) and avoids implementation details
- Specs-business uses BDD/Gherkin format with observable outcomes
- Design-backend contains implementation detail at the appropriate level (module structure, route patterns, index design)
- No technical implementation details leaked into specs

## Performance Bounds

| Bound | Specification | Notes |
|-------|---------------|-------|
| Max page size | 100 items per request | Enforced in list-issues query validation |
| Rate limits | 30-120 req/min per endpoint | Defined in design-backend per endpoint |
| Cursor pagination | O(1) per page regardless of depth | Composite index on (priority, created_at, id) |
| Soft-delete impact | Accumulates over time | Periodic cleanup job not yet planned (TBD) |

## Migration Rollback

- All migrations are additive (CREATE TABLE, CREATE INDEX) — no destructive operations
- Rollback: drop `issues`, `issue_labels`, `issue_statuses` tables and their indexes
- Per-team sequences can be dropped if rollback is needed
- No data loss risk — soft-delete means data is preserved

## Backward Compatibility

- This is a new module — no existing consumers to break
- All endpoints are new under `/api/v1/issues`
- No changes to existing Identity or Auth module contracts
- Fully backward compatible

## Checklist

- [x] All requirements covered
- [x] Scenarios pass
- [x] Error states handled
- [x] No technical detail in specs
- [ ] Performance bounds defined (cleanup job strategy deferred)
- [x] Migration rollback strategy documented
- [x] Backward compatibility verified
