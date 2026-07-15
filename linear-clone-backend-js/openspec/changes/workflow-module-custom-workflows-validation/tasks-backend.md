# Tasks — Workflow Module: Custom Workflows & Validation (Backend)

## Scaffold

- [ ] Create `src/modules/workflow/` directory structure with `domain/`, `application/`, `application/ports/`, `adapters/in/`, `adapters/out/`, `__tests__/unit/`, `__tests__/integration/`
- [ ] Register workflow module routes in `src/app.ts`
- [ ] Add rate limit presets for workflow endpoints in config

## Data Layer

- [ ] Create custom PostgreSQL enum type migration: `workflow_state_type` with values `unstarted`, `in_progress`, `completed`, `canceled`
- [ ] Create `workflow_states` table migration (fields: id, team_id, name, type, position, created_at, updated_at; indexes on team_id, unique on team_id+name)
- [ ] Create `workflow_transitions` table migration (fields: id, from_state_id, to_state_id, created_at; FK to workflow_states, unique on from_state_id+to_state_id)
- [ ] Create `state_history` table migration (fields: id, issue_id, from_state_id nullable, to_state_id, user_id, created_at; FK to issues, workflow_states, users; index on issue_id+created_at DESC)
- [ ] Define Drizzle schemas: `workflowState`, `workflowTransition`, `stateHistory` in `domain/`
- [ ] Implement `DrizzleStateRepository` in `adapters/out/` with methods: `findByTeam`, `findById`, `create`, `update`, `delete`, `existsByName`, `countByTeamAndType`
- [ ] Implement `DrizzleTransitionRepository` in `adapters/out/` with methods: `findByTeam`, `findById`, `create`, `delete`, `existsByFromAndTo`, `countByStateId`
- [ ] Implement `DrizzleHistoryRepository` in `adapters/out/` with methods: `create`, `findByIssuePaginated`

## Business Logic

- [ ] Create `DefaultWorkflow` constant in `domain/default-workflow.ts` with embedded transitions: Todo → In Progress, In Progress → In Review, In Review → Done, Any → Canceled
- [ ] Implement `WorkflowResolutionService`: EXISTS check on `workflow_states` for team; returns default if none found
- [ ] Implement `TransitionValidationService`: resolve workflow, check cancel override, lookup transitions, return valid/invalid with reason
- [ ] Implement `CreateWorkflowState` use case: validate admin role, validate type enum, enforce at-most-one-canceled rule, persist state
- [ ] Implement `UpdateWorkflowState` use case: validate admin role, prevent name collision, update
- [ ] Implement `DeleteWorkflowState` use case: validate admin role, check no transitions reference it, delete with cascade
- [ ] Implement `ListWorkflowStates` use case: query by team, ordered by position
- [ ] Implement `CreateTransition` use case: validate admin role, validate both states exist and belong to same team, check duplicate, persist
- [ ] Implement `DeleteTransition` use case: validate admin role, delete by id
- [ ] Implement `ListTransitions` use case: query by team, optional fromStateId filter
- [ ] Implement `ValidateTransition` use case: resolve workflow, check cancel override, validate transition, return result
- [ ] Implement `GetStateHistory` use case: paginated query by issue, newest first

## API Layer

- [ ] Create Zod DTOs in `adapters/in/dto.ts`: `CreateWorkflowStateSchema`, `UpdateWorkflowStateSchema`, `CreateTransitionSchema`, `ValidateTransitionSchema`, `ListHistoryQuerySchema`, `WorkflowParamsSchema`, `WorkflowStateParamsSchema`, `TransitionParamsSchema`, `IssueHistoryParamsSchema`
- [ ] Implement workflow controller with routes:
  - `GET /api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/states`
  - `POST /api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/states`
  - `PUT /api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/states/{stateId}`
  - `DELETE /api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/states/{stateId}`
  - `GET /api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/transitions`
  - `POST /api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/transitions`
  - `DELETE /api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/transitions/{transitionId}`
  - `POST /api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/validate-transition`
  - `GET /api/v1/issues/{issueId}/workflow/history`
- [ ] Implement error handling for domain errors: `StateNotFoundError`, `TransitionNotFoundError`, `DuplicateStateNameError`, `DuplicateTransitionError`, `StateInUseError`, `MissingUnstartedStateError`, `MissingCompletedStateError`, `MultipleCanceledStatesError`
- [ ] Apply rate limiting per endpoint (CRUD: 30/min, Read: 120/min, Validate: 60/min, History: 60/min)

## Security

- [ ] Model admin role check: add `isTeamAdmin` query that checks `team_members.role = 'admin'`
- [ ] Guard CRUD endpoints: require admin role for create/update/delete states and transitions
- [ ] Guard read endpoints: require any authenticated team member
- [ ] Guard validate-transition and history: require authentication only
- [ ] Validate workflow state `type` enum at API boundary via Zod enum schema

## Integration

- [ ] Expose `ValidateTransition` use case port so Work Module's `change-issue-status` can call it
- [ ] Inject workflow validation into `change-issue-status` use case: query workflow before persisting status change
- [ ] Record state history entry on every successful status change via `change-issue-status`

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

- [ ] Verify all endpoints return correct status codes per OpenAPI contract
- [ ] Verify rate limiting is applied per endpoint
- [ ] Verify domain errors return correct HTTP codes
- [ ] Verify default workflow does not require DB reads
- [ ] Verify state history is truly append-only (no update/delete paths)
- [ ] Verify cancel override works for both default and custom workflows
- [ ] Self-review: hexagonal layer boundaries respected (domain imports nothing, application imports domain only, adapters import domain + application)
