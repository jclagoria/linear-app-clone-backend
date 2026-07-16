# Review — Cycle Module CRUD & Lifecycle

## Spec Compliance

*To be completed after implementation.*

## Edge Cases

- Cycle activation with no previous active cycle (single-cycle team)
- Cycle activation when many Draft cycles exist for a team
- Auto-completing a cycle that already has `completedAt` set
- Parallel activation requests for the same team (race condition)
- Deleting a cycle that issues reference (should be Draft-only, so issues should not reference Draft cycles)
- Issues created with `cycleId` referencing a non-existent cycle
- Issues created with `cycleId` referencing a Draft cycle

## Leakage Check

*To be verified after implementation.*

## Performance Bounds

- Cycle queries are scoped to a team (indexed on `team_id` and `team_id + status`)
- No nested queries expected
- Activation is a single-write transaction (update current active cycle + update new cycle)

## Migration Rollback

- V1 migration adds `cycle_status` enum and `cycles` table.
- Rollback: `DROP TABLE IF EXISTS cycles; DROP TYPE IF EXISTS cycle_status;`
- No data loss from rollback (cycles are new, no existing data references them)

## Backward Compatibility

- New module — no existing consumers to break.
- Issue CRUD gains optional `cycleId` validation (previously stored but unvalidated).
- No existing API contracts are modified.

## Checklist

- [ ] All requirements covered
- [ ] Scenarios pass
- [ ] Error states handled
- [ ] No technical detail in specs
- [ ] Performance bounds defined and validated
- [ ] Migration rollback strategy documented
- [ ] Backward compatibility verified or breaking change justified
