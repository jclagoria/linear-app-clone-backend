# Tasks — Workflow Module: Custom Workflows & Validation (Backend)

## Scaffold

- [x] Create `src/modules/workflow/` directory structure with `domain/`, `application/`, `application/ports/`, `adapters/in/`, `adapters/out/`, `__tests__/unit/`, `__tests__/integration/`
- [x] Register workflow module routes in `src/app.ts`
- [x] Add rate limit presets for workflow endpoints in config

## Data Layer

- [x] Create Drizzle schema with varchar type + $type cast for workflow state type enum: `workflow_state_type` with values `unstarted`, `in_progress`, `completed`, `canceled`
- [x] Create `workflow_states` table schema (fields: id, team_id, name, type, position, created_at, updated_at; indexes on team_id+name unique, team_id+position unique)
- [x] Create `workflow_transitions` table schema (fields: id, from_state_id, to_state_id, created_at; unique on from_state_id+to_state_id)
- [x] Create `state_history` table schema (fields: id, issue_id, from_state_id nullable, to_state_id, user_id, created_at; index on issue_id+created_at DESC)
- [x] Define Drizzle schemas: `workflowStates`, `workflowTransitions`, `stateHistory` in `domain/`
- [x] Implement `DrizzleStateRepository` in `adapters/out/` with methods: `findByTeam`, `findById`, `create`, `update`, `delete`, `existsByName`, `countByTeamAndType`
- [x] Implement `DrizzleTransitionRepository` in `adapters/out/` with methods: `findByTeam`, `findById`, `create`, `delete`, `existsByFromAndTo`, `countByStateId`
- [x] Implement `DrizzleHistoryRepository` in `adapters/out/` with methods: `create`, `findByIssuePaginated`

## Business Logic

- [x] Create `DefaultWorkflow` constant in `domain/default-workflow.ts` with embedded transitions: Todo → In Progress, In Progress → In Review, In Review → Done, Any → Canceled
- [x] Implement `WorkflowResolutionService`: EXISTS check on `workflow_states` for team; returns default if none found
- [x] Implement `TransitionValidationService`: resolve workflow, check cancel override, lookup transitions, return valid/invalid with reason
- [x] Implement `CreateWorkflowState` use case: validate admin role, validate type enum, enforce at-most-one-canceled rule, persist state
- [x] Implement `UpdateWorkflowState` use case: validate admin role, prevent name collision, update
- [x] Implement `DeleteWorkflowState` use case: validate admin role, check no transitions reference it, delete
- [x] Implement `ListWorkflowStates` use case: query by team, ordered by position
- [x] Implement `CreateTransition` use case: validate admin role, validate both states exist, check duplicate, persist
- [x] Implement `DeleteTransition` use case: validate admin role, delete by id
- [x] Implement `ListTransitions` use case: query by team, optional fromStateId filter
- [x] Implement `ValidateTransition` use case: resolve workflow, check cancel override, validate transition, return result
- [x] Implement `GetStateHistory` use case: paginated query by issue, newest first

## API Layer

- [x] Create Zod DTOs in `adapters/in/dto.ts`
- [x] Implement workflow controller with all 9 routes:
  - `GET /api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/states`
  - `POST /api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/states`
  - `PUT /api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/states/{stateId}`
  - `DELETE /api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/states/{stateId}`
  - `GET /api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/transitions`
  - `POST /api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/transitions`
  - `DELETE /api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/transitions/{transitionId}`
  - `POST /api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/validate-transition`
  - `GET /api/v1/issues/{issueId}/workflow/history`
- [x] Implement error handling for domain errors
- [x] Apply rate limiting per endpoint (CRUD: 30/min, Read: 120/min, Validate: 60/min, History: 60/min)

## Security

- [x] Model admin role check: add `isTeamAdmin` query that checks `team_members.role = 'admin'`
- [x] Guard CRUD endpoints: require admin role for create/update/delete states and transitions
- [x] Guard read endpoints: require any authenticated team member
- [x] Guard validate-transition and history: require authentication only
- [x] Validate workflow state `type` enum at API boundary via Zod enum schema

## Integration

- [x] Expose `ValidateTransition` use case port so Work Module's `change-issue-status` can call it
- [x] Inject workflow validation into `change-issue-status` use case: query workflow before persisting status change
- [x] Record state history entry on every successful status change via `change-issue-status`

## Testing

- [ ] Unit test: `defaultWorkflow` constant defines correct transitions
- [ ] Unit test: `WorkflowResolutionService` returns default when no custom states, returns custom when states exist
- [ ] Unit test: `TransitionValidationService` validates valid/invalid transitions for custom workflows
- [ ] Unit test: `TransitionValidationService` cancel override always returns valid
- [ ] Unit test: `TransitionValidationService` default workflow transitions
- [ ] Unit test: `CreateWorkflowState` rejects duplicate names
- [ ] Unit test: `CreateWorkflowState` rejects invalid type enum
- [ ] Unit test: `DeleteWorkflowState` rejects when transitions reference it
- [ ] Unit test: `CreateTransition` rejects duplicates
- [ ] Unit test: `StateHistoryService` records entry with null fromStateId for first status
- [ ] Integration test: full workflow CRUD API flow with real PostgreSQL
- [ ] Integration test: transition validation with custom workflow
- [ ] Integration test: transition validation with default workflow (no custom states)
- [ ] Integration test: cancel state bypasses validation
- [ ] Integration test: state history recorded on status change
- [ ] Integration test: admin-only mutation enforcement

## Review

- [x] Verify all endpoints return correct status codes per OpenAPI contract
- [x] Verify rate limiting is applied per endpoint
- [x] Verify domain errors return correct HTTP codes
- [x] Verify default workflow does not require DB reads
- [x] Verify state history is truly append-only (no update/delete paths)
- [x] Verify cancel override works for both default and custom workflows
- [x] Self-review: hexagonal layer boundaries respected (domain imports nothing, application imports domain only, adapters import domain + application)
