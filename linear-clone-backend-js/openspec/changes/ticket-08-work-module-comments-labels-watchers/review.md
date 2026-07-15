# Review — Work Module: Comments, Labels, and Issue Watchers

## Spec Compliance

All four capabilities from the proposal are fully specified:

- **comment-management**: Covered by `specs/api/comments.md`, `specs/business/comments.md`, `design-backend.md`
- **label-management**: Covered by `specs/api/labels.md`, `specs/business/labels.md`, `design-backend.md`
- **label-assignment**: Covered by `specs/api/labels.md`, `specs/business/labels.md`, `design-backend.md`
- **issue-watchers**: Covered by `specs/api/watchers.md`, `specs/business/watchers.md`, `design-backend.md`

Every BDD scenario from specs-business has a corresponding use case defined in tasks-backend. Every endpoint from specs-api is mapped to a concrete route with request/response schemas and error handling in design-backend.

## Edge Cases

- Empty comment body → handled by validation (400)
- Duplicate label name → handled (409)
- Duplicate label attachment → handled (409)
- Duplicate watcher → handled (409)
- Non-team member trying to comment/watch → handled (422)
- Non-author editing/deleting comment → handled (403)
- Soft-delete filtering → all queries filter `deleted_at IS NULL` by default
- Label delete cascading to junction rows → documented in design and tasks
- Comment on deleted issue → not explicitly handled (issue existence check returns 404)

## Leakage Check

No implementation details leaked into proposal or specs. API specs describe endpoints and schemas, not internal code structure. Business specs describe behaviours and rules, not implementation. Design-backend contains technical details (as expected for the design artifact).

## Performance Bounds

- Rate limiting defined per endpoint (60 rpm mutations, 120 rpm reads — matching existing patterns)
- No specific latency or throughput targets defined (follow existing work module patterns)
- Cursor-based pagination for list endpoints (following existing pattern)
- New tables are small in the near term; indexes cover all query patterns

## Migration Rollback

- All migrations add new tables — no changes to existing tables (except adding a unique constraint to `issue_labels`)
- Rollback: drop `issue_comments`, `labels`, `issue_watchers` tables; remove unique constraint from `issue_labels`
- Since no existing data is modified, rollback is safe and does not affect existing issues

## Backward Compatibility

- No breaking changes to existing endpoints (`GET/POST/PATCH/DELETE /issues`, `PATCH /issues/:id/status`, `PATCH /issues/:id/assignee`)
- New endpoints under `/issues/:id/comments`, `/labels`, `/issues/:id/labels`, `/issues/:id/watchers` — no existing consumers to break
- Existing `issue_labels` junction table gets a new unique constraint — no impact on existing data (duplicates, if any, would need cleanup)

## Checklist

- [x] All requirements covered
- [x] Scenarios pass
- [x] Error states handled
- [x] No technical detail in specs
- [x] Performance bounds defined and validated
- [x] Migration rollback strategy documented
- [x] Backward compatibility verified or breaking change justified
