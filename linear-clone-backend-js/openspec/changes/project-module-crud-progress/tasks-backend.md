# Tasks — Project Module CRUD & Progress (Backend)

## Scaffold

- [x] Create `src/modules/project/` directory structure: `domain/`, `application/`, `application/ports/`, `adapters/in/`, `adapters/out/`, `__tests__/`
- [x] Create `src/modules/project/domain/project.ts` with Drizzle `pgTable` and `pgEnum`
- [x] Create `src/modules/project/domain/errors.ts` (`ProjectNotFoundError`, `InvalidProjectStatusTransitionError`, `ProjectDateValidationError`, `EmptyProjectNameError`, `NotProjectTeamMemberError`, `IssueAlreadyInProjectError`, `ProjectCancelNotAdminError`, `CannotReopenCompletedProjectError`)
- [x] Create `src/modules/project/domain/index.ts` re-exporting all schema types and errors
- [x] Add project module exports to `src/shared/database/index.ts`
- [x] Register project schema in `drizzle.config.ts` if needed (glob pattern covers it automatically)
- [ ] Generate initial migration: `pnpm db:generate` (requires running database)

## Data Layer

- [x] Create `src/modules/project/application/ports/project-repository.ts` (interface: `findById`, `findMany`, `create`, `update`, `findByTeam`)
- [x] Create `src/modules/project/adapters/out/drizzle-project-repository.ts` implementing the repository with Drizzle
- [x] Implement `findByTeam` with cursor-based pagination and optional status filter
- [x] Implement `findById` returning `Project | null`
- [x] Implement `create` returning the created `Project`
- [x] Implement `update` with partial update support and `updatedAt` auto-set

## Business Logic: Project CRUD

- [x] Create `src/modules/project/application/ports/team-member-query.ts` (port: `isTeamMember(teamId, userId)`)
- [x] Create `src/modules/project/application/ports/team-admin-query.ts` (port: `isTeamAdmin(teamId, userId)`)
- [x] Create `src/modules/project/application/create-project.ts`
  - Validate: team membership, non-empty name, date ordering
  - Default status: `planned`
  - Publish `ProjectCreated` event
- [x] Create `src/modules/project/application/update-project.ts`
  - Validate: team membership, non-empty name (if provided), date ordering
  - Only update provided fields (partial update)
  - Publish `ProjectUpdated` event
- [x] Create `src/modules/project/application/delete-project.ts` — reject with error (no hard delete per spec)

## Business Logic: Project Status Management

- [x] Create `src/modules/project/application/change-project-status.ts`
  - Validate: team membership (any member for non-cancel transitions)
  - Validate: team admin for cancel transition
  - Enforce lifecycle: `planned → in_progress`, `in_progress → completed | canceled`
  - Reject: `completed → any`
  - On cancel: set all associated issues' `projectId = null` (via `IssueProjectQuery`)
  - Publish `ProjectStatusChanged` event
- [x] Create `src/modules/project/application/ports/issue-query.ts` (port: `getIssuesByProject(projectId)`, `countProjectIssues(projectId)`, `countCompletedProjectIssues(projectId)`)
- [x] Create `src/modules/project/application/ports/issue-update-query.ts` (port: `updateIssueProjectId(issueId, projectId | null)`)

## Business Logic: Progress Calculation

- [x] Create `src/modules/project/application/get-project-progress.ts`
  - Count total issues for project
  - Count completed issues (status type = 'completed')
  - Calculate percentage, handle division by zero
  - No events (read-only)

## Business Logic: Issue-Project Association

- [x] Create `src/modules/project/application/add-issue-to-project.ts`
  - Validate: project exists, issue exists
  - Validate: issue and project belong to same team
  - Validate: issue not already in another project
  - Update `issue.projectId`
  - Publish `IssueProjectAssociated` event
- [x] Create `src/modules/project/application/remove-issue-from-project.ts`
  - Validate: project exists, issue exists, issue belongs to this project
  - Set `issue.projectId = null`
  - Publish `IssueProjectRemoved` event

## API Layer

- [x] Create `src/modules/project/adapters/in/dto.ts` with Zod schemas and response types:
  - `CreateProjectInput`, `UpdateProjectInput`, `ChangeProjectStatusInput`, `AddIssueInput`
  - `ProjectResponse`, `PaginatedProjectsResponse`, `ProjectProgressResponse`
- [x] Create `src/modules/project/adapters/in/project-controller.ts` with routes:
  - `POST /api/v1/projects` → `CreateProject`
  - `GET /api/v1/projects` → list with pagination
  - `GET /api/v1/projects/:projectId` → get by ID (includes progress)
  - `PATCH /api/v1/projects/:projectId` → `UpdateProject`
  - `PATCH /api/v1/projects/:projectId/status` → `ChangeProjectStatus`
  - `GET /api/v1/projects/:projectId/progress` → `GetProjectProgress`
  - `POST /api/v1/projects/:projectId/issues` → `AddIssueToProject`
  - `DELETE /api/v1/projects/:projectId/issues/:issueId` → `RemoveIssueFromProject`
- [x] Register `projectRoutes` in `src/app.ts` with prefix `/api/v1`
- [x] Add rate limiting config: 30/min for mutations, 60/min for reads

## Cross-Module Integration

- [x] Remove stub `projectQuery` from `src/modules/work/adapters/in/issue-controller.ts`
- [x] Create real inline `projectQuery` adapter (or import from project module) that calls `projectRepository.findById`
- [x] Verify issue creation still works with real project validation (project must belong to same team)

## Events / Messaging

- [x] Define event types in project module: `ProjectCreated`, `ProjectUpdated`, `ProjectStatusChanged`, `IssueProjectAssociated`, `IssueProjectRemoved`
- [x] Publish events from each use case via `EventPublisher` port

## Security

- [x] Add `getUserIdFromToken` helper in project controller (same pattern as other modules)
- [x] Add team membership check to all endpoints
- [x] Add team admin check for cancel endpoint
- [x] Add same-team validation for issue-project association
- [x] Input validation via Zod schemas at controller boundary

## Testing

- [x] Unit tests: `create-project.test.ts` — happy path, empty name, non-member, invalid dates
- [x] Unit tests: `update-project.test.ts` — happy path, empty name, non-member, not found
- [x] Unit tests: `change-project-status.test.ts` — all valid transitions, all invalid transitions, non-admin cancel, reopen completed
- [x] Unit tests: `get-project-progress.test.ts` — mixed issues, no issues, all completed
- [x] Unit tests: `add-issue-to-project.test.ts` — happy path, different teams, already associated
- [x] Unit tests: `remove-issue-from-project.test.ts` — happy path, not associated, not found
- [x] Verify all tests pass: `pnpm test -- src/modules/project/__tests__/` (44/44 pass)

## Review

- [x] Self-review: verify all acceptance criteria from LAG-16 are covered
- [x] Verify response schemas match API contract
- [x] Verify error status codes match spec
- [ ] Verify migration runs cleanly: `pnpm db:migrate` (requires running database)
- [x] Verify build: `pnpm typecheck` (project module — 0 errors)
