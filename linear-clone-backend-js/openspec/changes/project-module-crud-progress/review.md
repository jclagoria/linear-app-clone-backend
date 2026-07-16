# Review — Project Module CRUD & Progress

## Spec Compliance

Design covers all 5 atomic parts from spec:
- [x] 5.1 Project Creation — default "Planned" status, date validation, team membership check
- [x] 5.2 Project Update — partial updates, non-empty name, lifecycle rules
- [x] 5.3 Project Status Management — Planned → In Progress → Completed/Canceled
- [x] 5.4 Progress Calculation — completed/total issues, 0 if no issues
- [x] 5.5 Issue-Project Association — link/unlink, same team constraint

All acceptance criteria from LAG-16 mapped to BDD scenarios in specs-business.

## Edge Cases

| Edge Case | Covered In | Status |
|-----------|-----------|--------|
| Target date before start date | `CreateProject`, `UpdateProject` | Covered |
| Empty project name | `CreateProject`, `UpdateProject` | Covered |
| Non-member operations | All endpoints | Covered |
| Non-admin cancel | `ChangeProjectStatus` | Covered |
| Reopen completed project | `ChangeProjectStatus` | Covered |
| Issue already in another project | `AddIssueToProject` | Covered |
| Different team association | `AddIssueToProject` | Covered |
| Canceled project disassociates issues | `ChangeProjectStatus` (onCancel) | Covered |
| Progress with no issues | `GetProjectProgress` | Covered |
| Non-existent project/issue | All endpoints returning 404 | Covered |

## Leakage Check

- Proposal focuses on motivation and scope — no technical detail
- Specs-api defines endpoints abstractly (method, path, schemas) — no implementation
- Specs-business uses BDD/Gherkin with observable outcomes — no internals
- Design-backend contains architecture decisions and concrete implementation plan — appropriate for its role
- ADRs capture tradeoffs — no implementation details

## Performance Bounds

| Metric | Target | Validation |
|--------|--------|-----------|
| Project list (100 items) | < 200ms | Verify with integration test |
| Progress calculation (1000 issues) | < 100ms | COUNT query with index on `project_id` |
| Create/Update | < 200ms | Single-row insert/update |
| Rate limiting | 30/min mutations, 60/min reads | Configured per route |

## Migration Rollback

1. Run `pnpm db:generate` to create migration file
2. Review the generated SQL before applying
3. Rollback: `pnpm db:drop && pnpm db:migrate` (or revert specific migration)
4. If migration adds FK constraint on `issues.project_id`, ensure rollback script removes it

## Backward Compatibility

- **New module** — no existing consumers to break
- `issues.project_id` column already exists; no schema changes to issues table
- **No breaking changes** to existing API endpoints
- The stub `projectQuery` in issue controller returns `null` currently — replacing with real query is transparent (same contract)

## Checklist

- [x] All requirements covered
- [x] Scenarios cover positive and negative cases
- [x] Error states handled (400, 401, 403, 404, 409, 422)
- [x] No technical detail in specs (proposal, specs-api, specs-business)
- [x] Performance bounds defined
- [x] Migration rollback strategy documented
- [x] Backward compatibility verified
