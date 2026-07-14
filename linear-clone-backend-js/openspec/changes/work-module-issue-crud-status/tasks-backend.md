# Tasks — Work Module Issue CRUD & Status (Backend)

## Scaffold

- [x] Create `src/modules/work/` directory structure (`domain/`, `application/`, `adapters/`, `__tests__/`)
- [x] Create `src/modules/work/domain/index.ts` with barrel exports

## Data Layer

- [x] Create `src/modules/work/domain/issue.ts` — Drizzle schema for `issues` table
- [x] Create `src/modules/work/domain/issue-status.ts` — Drizzle schema for `issue_statuses` table (seed data for default workflow)
- [x] Create `src/modules/work/domain/issue-label.ts` — Drizzle schema for `issue_labels` junction table
- [ ] Write Drizzle migration: create `issues` table with all fields, indexes, and constraints
- [ ] Write Drizzle migration: create `issue_labels` junction table
- [ ] Write Drizzle migration: create `issue_statuses` table with seed data (Backlog, Todo, In Progress, In Review, Done, Canceled)
- [ ] Write Drizzle migration: create per-team sequence for issue identifier generation
- [x] Create `src/modules/work/application/ports/issue-repository.ts` — port interface
- [x] Create `src/modules/work/adapters/out/drizzle-issue-repository.ts` — Drizzle implementation of issue repository
- [x] Create `src/modules/work/application/ports/event-publisher.ts` — port interface
- [x] Create `src/modules/work/adapters/out/in-memory-event-publisher.ts` — in-memory event publisher

## Business Logic

- [x] Create `src/modules/work/domain/errors.ts` — domain error classes (InvalidTransitionError, TeamMismatchError, etc.)
- [x] Create `src/modules/work/application/create-issue.ts` — CreateIssue use case with auto-generated identifier, default status/priority, team membership validation
- [x] Create `src/modules/work/application/update-issue.ts` — UpdateIssue use case with partial update semantics and title validation
- [x] Create `src/modules/work/application/change-issue-status.ts` — ChangeIssueStatus use case with workflow transition map, completedAt management
- [x] Create `src/modules/work/application/assign-issue.ts` — AssignIssue use case with team membership validation for assignee
- [x] Create `src/modules/work/application/delete-issue.ts` — DeleteIssue use case with soft-delete (set deletedAt)
- [x] Create `src/modules/work/application/list-issues.ts` — ListIssues use case with filters, cursor pagination, default sort

## API Layer

- [x] Create `src/modules/work/adapters/in/dto.ts` — Zod request/response schemas for all endpoints
- [x] Create `src/modules/work/adapters/in/issue-controller.ts` — Fastify routes for all issue endpoints with error handling
- [x] Register work routes in `src/app.ts`

### Endpoints to implement

- [x] `POST /api/v1/issues` — Create issue
- [x] `GET /api/v1/issues/:id` — Get issue by UUID or identifier
- [x] `PATCH /api/v1/issues/:id` — Update issue fields
- [x] `PATCH /api/v1/issues/:id/status` — Change issue status
- [x] `PATCH /api/v1/issues/:id/assignee` — Assign/unassign issue
- [x] `DELETE /api/v1/issues/:id` — Soft-delete issue
- [x] `GET /api/v1/issues` — List issues with filters and cursor pagination

## Security

- [x] Reuse existing `getUserIdFromToken` helper for JWT auth on all issue endpoints
- [x] Add rate limiting config per endpoint (create/update/status/assignee: 60/min, delete: 30/min, get/list: 120/60 per min)

## Testing

### Unit Tests

- [x] `create-issue.test.ts` — title validation, parent team mismatch, assignee team membership, identifier generation, default status/priority
- [x] `update-issue.test.ts` — partial update semantics, empty title rejection, project team mismatch
- [x] `change-issue-status.test.ts` — valid transitions, invalid transitions, completedAt set/clear, cancel from any state
- [x] `assign-issue.test.ts` — assign team member, assign non-member (rejected), unassign
- [x] `delete-issue.test.ts` — soft-delete sets deletedAt
- [x] `list-issues.test.ts` — filters, cursor pagination, max limit, default sort, soft-delete exclusion

### Integration Tests

- [ ] `__tests__/integration/issue-api.test.ts` — full API flow against real PostgreSQL via Testcontainers

### Contract Tests

- [ ] `__tests__/contract/issue-contracts.test.ts` — API request/response contract verification matching specs-api

## Review

- [ ] Self-review: verify all acceptance criteria from LAG-13 are covered
- [ ] PR checklist: lint, typecheck, test, build
