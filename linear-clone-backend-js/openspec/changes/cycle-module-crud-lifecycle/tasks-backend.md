# Tasks — Cycle Module CRUD & Lifecycle (Backend)

## Scaffold

- [x] Create `src/modules/cycle/` directory structure: `domain/`, `application/`, `application/ports/`, `adapters/in/`, `adapters/out/`, `__tests__/`
- [x] Create `src/modules/cycle/domain/cycle.ts` with Drizzle `pgTable` and `pgEnum`
- [x] Create `src/modules/cycle/domain/errors.ts` (`CycleNotFoundError`, `InvalidCycleStatusTransitionError`, `CycleDateValidationError`, `EmptyCycleNameError`, `NotCycleTeamMemberError`, `CyclePastStartDateError`, `DraftCycleCannotBeCompletedError`, `CompletedCycleCannotBeActivatedError`, `ActiveCycleCannotBeDeletedError`, `CycleNotActiveForIssueAssignmentError`)
- [x] Create `src/modules/cycle/domain/index.ts` re-exporting all schema types and errors
- [x] Add cycle module exports to `src/shared/database/index.ts`
- [ ] Generate initial migration: `pnpm db:generate` (requires running database)

## Data Layer

- [x] Create `src/modules/cycle/application/ports/cycle-repository.ts` (interface: `findById`, `findMany`, `create`, `update`, `delete`, `findActiveByTeam`, `findByTeam`)
- [x] Create `src/modules/cycle/adapters/out/drizzle-cycle-repository.ts` implementing the repository with Drizzle
- [x] Implement `findByTeam` with cursor-based pagination and optional status filter
- [x] Implement `findById` returning `Cycle | null`
- [x] Implement `findActiveByTeam` returning the currently active cycle for a team (or null)
- [x] Implement `create` returning the created `Cycle`
- [x] Implement `update` with partial update support and `updatedAt` auto-set
- [x] Implement `delete` for hard-deleting Draft cycles

## Business Logic: Cycle CRUD

- [x] Create `src/modules/cycle/application/ports/team-member-query.ts` (port: `isTeamMember(teamId, userId)`)
- [x] Create `src/modules/cycle/application/create-cycle.ts`
  - Validate: team membership, non-empty name, no backdating (start date >= today), end date after start date
  - Default status: `draft`
  - Publish `CycleCreated` event
- [x] Create `src/modules/cycle/application/update-cycle.ts`
  - Validate: team membership, non-empty name (if provided), date ordering, dates only modifiable in Draft
  - Only update provided fields (partial update)
  - Publish `CycleUpdated` event
- [x] Create `src/modules/cycle/application/get-cycle.ts`
  - Validate: team membership
  - Return cycle or throw `CycleNotFoundError`
- [x] Create `src/modules/cycle/application/list-cycles.ts`
  - Validate: team membership
  - Cursor-based pagination with optional status filter
  - Sort by start date descending

## Business Logic: Cycle Lifecycle Management

- [x] Create `src/modules/cycle/application/activate-cycle.ts`
  - Validate: team membership
  - Validate: cycle is in `draft` status (not already active or completed)
  - Find any currently `active` cycle for the same team and auto-complete it (set status to `completed`, set `completedAt`)
  - Set cycle start date to activation time if in Draft
  - Set cycle status to `active`
  - Publish `CycleActivated` event for new cycle
  - Publish `CycleCompleted` event for auto-completed cycle (if any)
- [x] Create `src/modules/cycle/application/complete-cycle.ts`
  - Validate: team membership
  - Validate: cycle is in `active` status (Draft cannot be completed directly)
  - Set status to `completed`, set `completedAt`
  - Publish `CycleCompleted` event
- [x] Create `src/modules/cycle/application/delete-cycle.ts`
  - Validate: team membership
  - Validate: cycle is in `draft` status (Active/Completed cannot be deleted)
  - Hard delete from database

## Business Logic: Cycle-Issue Integration

- [x] Create `src/modules/cycle/application/ports/cycle-query.ts` (port: `findById`, `isActive`)
- [ ] Integrate cycle validation in work module issue CRUD:
  - When creating/updating an issue with `cycleId`, verify cycle exists and is `active`
  - Verify cycle belongs to same team as the issue

## API Layer

- [x] Create `src/modules/cycle/adapters/in/dto.ts` with Zod schemas and response types:
  - `CreateCycleInput`, `UpdateCycleInput`
  - `CycleResponse`, `PaginatedCyclesResponse`
- [x] Create `src/modules/cycle/adapters/in/cycle-controller.ts` with routes:
  - `POST /api/v1/cycles` → `CreateCycle`
  - `GET /api/v1/cycles/:cycleId` → `GetCycle`
  - `GET /api/v1/teams/:teamId/cycles` → `ListCycles`
  - `PATCH /api/v1/cycles/:cycleId` → `UpdateCycle`
  - `POST /api/v1/cycles/:cycleId/activate` → `ActivateCycle`
  - `POST /api/v1/cycles/:cycleId/complete` → `CompleteCycle`
  - `DELETE /api/v1/cycles/:cycleId` → `DeleteCycle`
- [x] Register `cycleRoutes` in `src/app.ts` with prefix `/api/v1`
- [x] Add rate limiting config: 30/min for mutations, 60/min for reads

## Events / Messaging

- [x] Define event types in cycle module: `CycleCreated`, `CycleActivated`, `CycleCompleted`, `CycleUpdated`
- [x] Publish events from each use case via `EventPublisher` port

## Security

- [x] Add `getUserIdFromToken` helper in cycle controller (same pattern as other modules)
- [x] Add team membership check to all endpoints
- [x] Input validation via Zod schemas at controller boundary

## Testing

- [x] Unit tests: `create-cycle.test.ts` — happy path, empty name, past start date, end before start, non-member
- [x] Unit tests: `update-cycle.test.ts` — happy path, dates in Draft, dates outside Draft, partial update, non-member
- [x] Unit tests: `activate-cycle.test.ts` — happy path Draft→Active, auto-complete previous active, already active, completed, non-member
- [x] Unit tests: `complete-cycle.test.ts` — happy path Active→Completed, Draft cannot complete, already completed, non-member
- [x] Unit tests: `delete-cycle.test.ts` — happy path Draft deleted, Active cannot delete, Completed cannot delete, non-member
- [x] Unit tests: `get-cycle.test.ts` — happy path, not found, non-member
- [x] Unit tests: `list-cycles.test.ts` — happy path, status filter, pagination, non-member
- [x] Verify all tests pass: `pnpm test -- src/modules/cycle/__tests__/` (41/41 pass)

## Review

- [x] Self-review: verify all acceptance criteria from LAG-17 are covered
- [x] Verify response schemas match API contract
- [x] Verify error status codes match spec
- [ ] Verify migration runs cleanly: `pnpm db:migrate` (requires running database)
- [x] Verify build: `pnpm typecheck` (0 cycle module errors)
