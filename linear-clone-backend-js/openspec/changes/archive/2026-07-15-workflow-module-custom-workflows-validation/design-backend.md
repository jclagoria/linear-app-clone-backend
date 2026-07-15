# Workflow Module — Backend Design

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Module location | `src/modules/workflow/` | New standalone module following existing module pattern (auth, identity, work) |
| Architecture | Hexagonal (domain/application/adapters) | Consistent with project standard; domain isolated from infrastructure |
| Default workflow | Embedded in-memory object | No DB read needed for teams without custom workflow; resolves instantly |
| Workflow resolution | Check `workflow_states` table for team rows | Single EXISTS query — O(1) check before fallback to default |
| State history | Append-only table, no DELETE/UPDATE API | Immutability guarantee at DB level (no update/delete policies) |
| Cancel transition | Always-valid, bypasses transition lookup | Business rule: any state can always transition to canceled |
| Validation integration | Standalone service called by Work Module | Work module's change-issue-status use case calls workflow validation before persisting |

### Dependency Direction

```
Work Module (change-issue-status)
  └── calls ──> WorkflowModule.validateTransition()
                    └── queries ──> workflow_transitions / default workflow
                    └── records ──> state_history
```

The Workflow Module exposes a **use case interface** (`ValidateTransition` port). The Work Module depends on this port — not on the workflow adapters directly. This keeps the hexagonal boundary intact: Work Module's application layer declares a `WorkflowValidationService` port, and the adapter injects the real `ValidateTransition` use case at composition root.

## API Contracts

### GET List Workflow States

- **Method**: GET
- **Path**: `/api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/states`
- **Request**: Params (workspaceId, teamId)
- **Response**: 200 `{ "data": WorkflowState[], "total": number }`
- **Status Codes**: 200, 400, 401, 403, 404, 500

### POST Create Workflow State

- **Method**: POST
- **Path**: `/api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/states`
- **Request**: `{ name: string, type: enum, position?: number }`
- **Response**: 201 `{ "data": WorkflowState }`
- **Status Codes**: 201, 400, 401, 403, 409, 422, 500

### PUT Update Workflow State

- **Method**: PUT
- **Path**: `/api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/states/{stateId}`
- **Request**: `{ name?: string, type?: enum, position?: number }`
- **Response**: 200 `{ "data": WorkflowState }`
- **Status Codes**: 200, 400, 401, 403, 404, 409, 500

### DELETE Delete Workflow State

- **Method**: DELETE
- **Path**: `/api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/states/{stateId}`
- **Request**: Params (workspaceId, teamId, stateId)
- **Response**: 204 No content
- **Status Codes**: 204, 401, 403, 404, 409, 500

### GET List Workflow Transitions

- **Method**: GET
- **Path**: `/api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/transitions`
- **Request**: Query (fromStateId?: uuid)
- **Response**: 200 `{ "data": WorkflowTransition[] }`
- **Status Codes**: 200, 400, 401, 403, 404, 500

### POST Create Workflow Transition

- **Method**: POST
- **Path**: `/api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/transitions`
- **Request**: `{ fromStateId: uuid, toStateId: uuid }`
- **Response**: 201 `{ "data": WorkflowTransition }`
- **Status Codes**: 201, 400, 401, 403, 404, 409, 500

### DELETE Delete Workflow Transition

- **Method**: DELETE
- **Path**: `/api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/transitions/{transitionId}`
- **Request**: Params (workspaceId, teamId, transitionId)
- **Response**: 204 No content
- **Status Codes**: 204, 401, 403, 404, 500

### POST Validate Transition

- **Method**: POST
- **Path**: `/api/v1/workspaces/{workspaceId}/teams/{teamId}/workflow/validate-transition`
- **Request**: `{ issueId: uuid, toStateId: uuid }`
- **Response**: 200 `{ "data": { "valid": boolean, "fromState": WorkflowState, "toState": WorkflowState, "reason": string | null } }`
- **Status Codes**: 200, 400, 401, 404, 500

### GET Get State History

- **Method**: GET
- **Path**: `/api/v1/issues/{issueId}/workflow/history`
- **Request**: Params (issueId), Query (cursor?, limit?)
- **Response**: 200 `{ "data": StateHistoryEntry[], "nextCursor": string | null }`
- **Status Codes**: 200, 401, 404, 500

## Data Model

### workflow_states

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| team_id | uuid | FK -> teams.id, NOT NULL | Scoped to team |
| name | varchar(100) | NOT NULL, UNIQUE(team_id, name) | Display name |
| type | workflow_state_type | NOT NULL | Enum: unstarted, in_progress, completed, canceled |
| position | integer | NOT NULL, DEFAULT 0 | Sort order within team |
| created_at | timestamptz | NOT NULL, DEFAULT now() | |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | |

### workflow_transitions

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| from_state_id | uuid | FK -> workflow_states.id, NOT NULL | Source state |
| to_state_id | uuid | FK -> workflow_states.id, NOT NULL | Destination state |
| created_at | timestamptz | NOT NULL, DEFAULT now() | |

**Unique constraint**: UNIQUE(from_state_id, to_state_id)

### state_history

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| issue_id | uuid | FK -> issues.id, NOT NULL | |
| from_state_id | uuid | FK -> workflow_states.id, NULLABLE | Null for initial status set |
| to_state_id | uuid | FK -> workflow_states.id, NOT NULL | |
| user_id | uuid | FK -> users.id, NOT NULL | Who performed the change |
| created_at | timestamptz | NOT NULL, DEFAULT now() | |

### Custom PostgreSQL Enum

```sql
CREATE TYPE workflow_state_type AS ENUM ('unstarted', 'in_progress', 'completed', 'canceled');
```

### Indexes

| Table | Index | Type | Purpose |
|-------|-------|------|---------|
| workflow_states | (team_id) | B-tree | Team-scoped state queries |
| workflow_states | (team_id, name) | UNIQUE B-tree | Duplicate name prevention |
| workflow_states | (team_id, position) | B-tree | Ordered state listing |
| workflow_transitions | (from_state_id) | B-tree | Source-based lookup |
| workflow_transitions | (from_state_id, to_state_id) | UNIQUE B-tree | Duplicate prevention |
| state_history | (issue_id, created_at DESC) | B-tree | History listing newest first |
| state_history | (from_state_id) | B-tree | FK index |
| state_history | (to_state_id) | B-tree | FK index |

### Migrations

| Version | Description |
|---------|-------------|
| V1 | Create `workflow_state_type` enum type. Create `workflow_states`, `workflow_transitions`, `state_history` tables with all indexes. |

## Business Logic

### WorkflowStateService

- **Responsibility**: CRUD operations for workflow states scoped to a team
- **Rules**:
  - Each team must have at most one `canceled` type state
  - Each team must have at least one `unstarted` and one `completed` state when custom workflow defined
  - Deletion of a state is rejected if any transition references it (prevent orphan transitions)
- **Dependencies**: StateRepository

### WorkflowTransitionService

- **Responsibility**: CRUD operations for allowed transitions between states
- **Rules**:
  - Duplicate transitions (same from_state_id + to_state_id) are rejected
  - Deleting a state cascades deletion of its associated transitions
- **Dependencies**: TransitionRepository

### TransitionValidationService

- **Responsibility**: Validate whether a status change is allowed based on workflow rules
- **Rules**:
  - Resolve workflow: check if team has custom states in `workflow_states`; if not, use embedded default
  - Default workflow transitions: Todo -> In Progress, In Progress -> In Review, In Review -> Done
  - Any state -> Canceled is always valid (regardless of custom or default workflow)
  - For custom workflows: lookup valid transitions in `workflow_transitions` table
  - If custom workflow exists but no matching transition found: invalid
- **Dependencies**: StateRepository, TransitionRepository

### StateHistoryService

- **Responsibility**: Append-only recording of state changes
- **Rules**:
  - Immutable: no update or delete operations exposed
  - First status set records `fromStateId` as null
  - All entries include user who performed the change
- **Dependencies**: HistoryRepository

### WorkflowResolutionService

- **Responsibility**: Determine whether a team uses custom workflow or default
- **Rules**:
  - EXISTS query against `workflow_states` for the team
  - Result cached per-request (no cross-request caching for v1)
- **Dependencies**: StateRepository (count check)

## Module Structure

```
src/modules/workflow/
  domain/
    workflow-state.ts          # Drizzle schema + type exports
    workflow-transition.ts     # Drizzle schema + type exports
    state-history.ts           # Drizzle schema + type exports
    errors.ts                  # Domain error classes
    default-workflow.ts        # Embedded default workflow definition
  application/
    ports/
      state-repository.ts      # Repository port interface
      transition-repository.ts
      history-repository.ts
    create-workflow-state.ts   # Use case
    update-workflow-state.ts   # Use case
    delete-workflow-state.ts   # Use case
    list-workflow-states.ts    # Use case
    create-transition.ts       # Use case
    delete-transition.ts       # Use case
    list-transitions.ts        # Use case
    validate-transition.ts     # Use case (called by Work Module)
    get-state-history.ts       # Use case
  adapters/
    in/
      dto.ts                   # Zod request/response schemas
      controller.ts            # Fastify route registration
    out/
      drizzle-state-repository.ts
      drizzle-transition-repository.ts
      drizzle-history-repository.ts
  __tests__/
    unit/
      validate-transition.test.ts
    integration/
      workflow-api.test.ts
```

## Security

- **Authentication**: JWT access token required on all endpoints
- **Authorization**: CRUD for states and transitions restricted to team administrators (`team_members.role = 'admin'`). Read operations (list states, list transitions, get history) allowed for any authenticated team member. Transition validation allowed for any authenticated user.
- **Input Sanitization**: Zod schemas validate all inputs at API boundary — type enum values, string lengths, UUID formats, valid state types
- **Rate Limiting**: CRUD: 30 req/min, Read: 120 req/min, Validate: 60 req/min, History: 60 req/min

## Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit (domain) | Vitest | Workflow resolution logic, default workflow transitions, validation rules, domain invariants |
| Unit (application) | Vitest | Use case logic with mocked repositories, validation scenarios, error paths |
| Integration | Vitest + Testcontainers | Full API flow through Fastify with real PostgreSQL: CRUD endpoints, transition validation, history recording |
| Contract | Vitest | Ensure API responses match OpenAPI contract shapes |

### Test Scenarios

- Default workflow resolution when no custom states exist
- Custom workflow resolution when states are present
- Valid and invalid transitions in both default and custom workflows
- Cancel transition always valid from any state
- Duplicate state name rejection
- Duplicate transition rejection
- Delete state referenced by transitions (rejected)
- Delete state not referenced by transitions (allowed)
- Append-only history immutability
- First status change records null fromStateId
- Admin-only mutation enforcement
