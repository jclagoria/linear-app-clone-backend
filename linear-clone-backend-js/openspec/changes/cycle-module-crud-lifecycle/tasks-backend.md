# Tasks — Cycle Module CRUD & Lifecycle (Backend)

## Scaffold

- [ ] Create `src/modules/cycle/` directory structure: `domain/`, `application/`, `application/ports/`, `adapters/in/`, `adapters/out/`, `__tests__/`
- [ ] Create `src/modules/cycle/domain/cycle.ts` with Drizzle `pgTable` and `pgEnum`
- [ ] Create `src/modules/cycle/domain/errors.ts` (`CycleNotFoundError`, `InvalidCycleStatusTransitionError`, `CycleDateValidationError`, `EmptyCycleNameError`, `NotCycleTeamMemberError`, `CyclePastStartDateError`, `DraftCycleCannotBeCompletedError`, `CompletedCycleCannotBeActivatedError`, `ActiveCycleCannotBeDeletedError`, `CycleNotActiveForIssueAssignmentError`)
- [ ] Create `src/modules/cycle/domain/index.ts` re-exporting all schema types and errors
- [ ] Add cycle module exports to `src/shared/database/index.ts`
- [ ] Generate initial migration: `pnpm db:generate`

## Data Layer

- [ ] Create `src/modules/cycle/application/ports/cycle-repository.ts` (interface: `findById`, `findMany`, `create`, `update`, `delete`, `findActiveByTeam`, `findByTeam`)
- [ ] Create `src/modules/cycle/adapters/out/drizzle-cycle-repository.ts` implementing the repository with Drizzle
- [ ] Implement `findByTeam` with cursor-based pagination and optional status filter
- [ ] Implement `findById` returning `Cycle | null`
- [ ] Implement `findActiveByTeam` returning the currently active cycle for a team (or null)
- [ ] Implement `create` returning the created `Cycle`
- [ ] Implement `update` with partial update support and `updatedAt` auto-set
- [ ] Implement `delete` for hard-deleting Draft cycles

## Business Logic: Cycle CRUD

- [ ] Create `src/modules/cycle/application/ports/team-member-query.ts` (port: `isTeamMember(teamId, userId)`)
- [ ] Create `src/modules/cycle/application/create-cycle.ts`
  - Validate: team membership, non-empty name, no backdating (start date >= today), end date after start date
  - Default status: `draft`
  - Publish `CycleCreated` event
- [ ] Create `src/modules/cycle/application/update-cycle.ts`
  - Validate: team membership, non-empty name (if provided), date ordering, dates only modifiable in Draft
  - Only update provided fields (partial update)
  - Publish `CycleUpdated` event
- [ ] Create `src/modules/cycle/application/get-cycle.ts`
  - Validate: team membership
  - Return cycle or throw `CycleNotFoundError`
- [ ] Create `src/modules/cycle/application/list-cycles.ts`
  - Validate: team membership
  - Cursor-based pagination with optional status filter
  - Sort by start date descending

## Business Logic: Cycle Lifecycle Management

- [ ] Create `src/modules/cycle/application/activate-cycle.ts`
  - Validate: team membership
  - Validate: cycle is in `draft` status (not already active or completed)
  - Find any currently `active` cycle for the same team and auto-complete it (set status to `completed`, set `completedAt`)
  - Set cycle start date to activation time if in Draft
  - Set cycle status to `active`
  - Publish `CycleActivated` event for new cycle
  - Publish `CycleCompleted` event for auto-completed cycle (if any)
- [ ] Create `src/modules/cycle/application/complete-cycle.ts`
  - Validate: team membership
  - Validate: cycle is in `active` status (Draft cannot be completed directly)
  - Set status to `completed`, set `completedAt`
  - Publish `CycleCompleted` event
- [ ] Create `src/modules/cycle/application/delete-cycle.ts`
  - Validate: team membership
  - Validate: cycle is in `draft` status (Active/Completed cannot be deleted)
  - Hard delete from database

## Business Logic: Cycle-Issue Integration

- [ ] Create `src/modules/cycle/application/ports/cycle-query.ts` (port: `findById`, `isActive`)
- [ ] Integrate cycle validation in work module issue CRUD:
  - When creating/updating an issue with `cycleId`, verify cycle exists and is `active`
  - Verify cycle belongs to same team as the issue

## API Layer

- [ ] Create `src/modules/cycle/adapters/in/dto.ts` with Zod schemas and response types:
  - `CreateCycleInput`, `UpdateCycleInput`
  - `CycleResponse`, `PaginatedCyclesResponse`
- [ ] Create `src/modules/cycle/adapters/in/cycle-controller.ts` with routes:
  - `POST /api/v1/cycles` → `CreateCycle`
  - `GET /api/v1/cycles/:cycleId` → `GetCycle`
  - `GET /api/v1/teams/:teamId/cycles` → `ListCycles`
  - `PATCH /api/v1/cycles/:cycleId` → `UpdateCycle`
  - `POST /api/v1/cycles/:cycleId/activate` → `ActivateCycle`
  - `POST /api/v1/cycles/:cycleId/complete` → `CompleteCycle`
  - `DELETE /api/v1/cycles/:cycleId` → `DeleteCycle`
- [ ] Register `cycleRoutes` in `src/app.ts` with prefix `/api/v1`
- [ ] Add rate limiting config: 30/min for mutations, 60/min for reads

## Events / Messaging

- [ ] Define event types in cycle module: `CycleCreated`, `CycleActivated`, `CycleCompleted`, `CycleUpdated`
- [ ] Publish events from each use case via `EventPublisher` port

## Security

- [ ] Add `getUserIdFromToken` helper in cycle controller (same pattern as other modules)
- [ ] Add team membership check to all endpoints
- [ ] Input validation via Zod schemas at controller boundary

## Testing

- [ ] Unit tests: `create-cycle.test.ts` — happy path, empty name, past start date, end before start, non-member
- [ ] Unit tests: `update-cycle.test.ts` — happy path, dates in Draft, dates outside Draft, partial update, non-member
- [ ] Unit tests: `activate-cycle.test.ts` — happy path Draft→Active, auto-complete previous active, already active, completed, non-member
- [ ] Unit tests: `complete-cycle.test.ts` — happy path Active→Completed, Draft cannot complete, already completed, non-member
- [ ] Unit tests: `delete-cycle.test.ts` — happy path Draft deleted, Active cannot delete, Completed cannot delete, non-member
- [ ] Unit tests: `get-cycle.test.ts` — happy path, not found, non-member
- [ ] Unit tests: `list-cycles.test.ts` — happy path, status filter, pagination, non-member
- [ ] Verify all tests pass: `pnpm test -- src/modules/cycle/__tests__/`

## Review

- [ ] Self-review: verify all acceptance criteria from LAG-17 are covered
- [ ] Verify response schemas match API contract
- [ ] Verify error status codes match spec
- [ ] Verify migration runs cleanly: `pnpm db:migrate`
- [ ] Verify build: `pnpm typecheck`
