# Review — Workflow Module: Custom Workflows & Validation

## Spec Compliance

- **API specs** (specs/api/workflow.md): 9 endpoints defined with full request/response schemas, status codes, error conditions, and auth requirements. All mapped to concrete routes in design-backend.md.
- **Business specs** (specs/business/workflow.md): All 5 features (Custom Workflow Definition, Transition Definition, Transition Validation, Workflow Resolution, State History Tracking) covered with BDD scenarios. All business rules and security constraints carried through to design and tasks.
- **Default workflow** scenarios: Todo→In Progress→In Review→Done + Any→Canceled — captured in default-workflow.md design and tasks.
- No gaps found between specs and design.

## Edge Cases

- Duplicate state name rejection covered (409 Conflict)
- Duplicate transition rejection covered (409 Conflict)
- Delete state referenced by transitions covered (409 Conflict)
- First status change with null fromStateId covered
- Cancel override always-valid rule covered as first-class design decision (ADR-0003)
- At-most-one-canceled-state invariant covered
- Admin-only mutation enforcement covered
- Missing unstarted/completed invariant covered (business rule)

## Leakage Check

- No implementation details leaked into specs. API specs define interface contracts without referencing framework or database internals. Business specs describe behavior in GIVEN/WHEN/THEN format without technical implementation references.

## Performance Bounds

- Default workflow resolution: O(1) in-memory lookup (no DB read)
- Custom workflow resolution: EXISTS query against `workflow_states` — single index seek on team_id
- Transition validation: single query against `workflow_transitions` with index on (from_state_id, to_state_id)
- Rate limits defined per endpoint (CRUD: 30/min, Read: 120/min, Validate: 60/min, History: 60/min)
- No caching layer for v1 (acceptable — history queries are simple indexed reads)

## Migration Rollback

- V1 migration adds 3 tables and 1 PostgreSQL enum type. Rollback strategy: run migration DOWN to drop tables and enum type. Custom enum type requires `ALTER TYPE ... RENAME TO` or dropping dependent columns first. This must be tested in staging before production deployment.

## Backward Compatibility

- This is a new module (no existing consumers). The Work Module's `change-issue-status` will be extended to call transition validation — backward compatible because the existing endpoint contract remains unchanged. Users of the current status change endpoint will experience additional validation (rejection of illegal transitions) which is a behavioral change but contract-compatible.

## Checklist

- [x] All requirements covered
- [x] Scenarios pass
- [x] Error states handled
- [x] No technical detail in specs
- [x] Performance bounds defined and validated
- [x] Migration rollback strategy documented
- [x] Backward compatibility verified or breaking change justified
