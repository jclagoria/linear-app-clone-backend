# Workflow Module — Business Specification

## Behaviour

**Feature:** Custom Workflow Definition

Team administrators SHALL be able to define custom workflow states scoped to their team. Each state MUST have exactly one type from the set: `unstarted`, `in_progress`, `completed`, `canceled`. States of type `canceled` SHOULD be limited to one per team. Each team MUST have at least one state of type `unstarted` and one state of type `completed`.

### Requirement: CreateWorkflowState

#### Scenario: Team admin creates a valid state

- **GIVEN** the team has no custom workflow defined
- **WHEN** the team admin creates a state with name "In Review" and type "in_progress"
- **THEN** the state SHALL be persisted to `workflow_states`
- **AND** the response SHALL include the created state with a generated UUID and timestamps

#### Scenario: Team admin creates a state with duplicate name

- **GIVEN** the team already has a state named "In Review"
- **WHEN** the team admin creates another state with name "In Review"
- **THEN** the request SHALL be rejected with a conflict error

#### Scenario: Team admin creates a state with invalid type

- **GIVEN** the team admin provides type "paused"
- **WHEN** the create request is submitted
- **THEN** the request SHALL be rejected with a validation error

### Requirement: UpdateWorkflowState

#### Scenario: Team admin renames a state

- **GIVEN** a state "In Review" exists for the team
- **WHEN** the team admin updates the state name to "Code Review"
- **THEN** the state SHALL be renamed in `workflow_states`
- **AND** existing transitions referencing this state SHALL remain valid

#### Scenario: Team admin changes state type

- **GIVEN** a state of type "unstarted"
- **WHEN** the team admin changes its type to "in_progress"
- **THEN** the type SHALL be updated in `workflow_states`

### Requirement: DeleteWorkflowState

#### Scenario: Team admin deletes an unused state

- **GIVEN** a state exists with no transitions referencing it
- **WHEN** the team admin deletes the state
- **THEN** the state SHALL be removed from `workflow_states`

#### Scenario: Team admin deletes a state referenced by transitions

- **GIVEN** a state exists with at least one transition referencing it
- **WHEN** the team admin attempts to delete the state
- **THEN** the request SHALL be rejected with a conflict error

---

**Feature:** Transition Definition

Team administrators SHALL be able to define valid transitions between workflow states. Each transition SHALL define a source state and a destination state. Duplicate transitions (same fromStateId and toStateId) SHALL be rejected. Deleting a state SHALL cascade to its associated transitions.

### Requirement: CreateTransition

#### Scenario: Team admin defines a valid transition

- **GIVEN** states "Todo" and "In Progress" exist for the team
- **WHEN** the team admin creates a transition from "Todo" to "In Progress"
- **THEN** the transition SHALL be persisted to `workflow_transitions`

#### Scenario: Team admin creates a duplicate transition

- **GIVEN** a transition from "Todo" to "In Progress" already exists
- **WHEN** the team admin creates another transition from "Todo" to "In Progress"
- **THEN** the request SHALL be rejected with a conflict error

### Requirement: DeleteTransition

#### Scenario: Team admin removes a transition

- **GIVEN** a transition from "Todo" to "In Progress" exists
- **WHEN** the team admin deletes the transition
- **THEN** the transition SHALL be removed from `workflow_transitions`
- **AND** future validation SHALL reject transitions from "Todo" to "In Progress"

---

**Feature:** Transition Validation

Any status change on an issue SHALL be validated against the team's workflow rules. The validation SHALL check whether a transition from the current state to the target state is allowed. If no custom workflow is defined, the default workflow SHALL be used as the source of truth.

### Requirement: ValidateValidTransition

#### Scenario: Valid transition on custom workflow

- **GIVEN** team has custom workflow with transition "Todo" -> "In Progress"
- **AND** issue is currently in state "Todo"
- **WHEN** the system validates a transition to "In Progress"
- **THEN** the validation SHALL return `{ valid: true }`

#### Scenario: Invalid transition on custom workflow

- **GIVEN** team has custom workflow with transitions "Todo" -> "In Progress" and "In Progress" -> "Done"
- **AND** issue is currently in state "Todo"
- **WHEN** the system validates a transition to "Done"
- **THEN** the validation SHALL return `{ valid: false, reason: "transition_not_allowed" }`

#### Scenario: Transition to canceled always allowed

- **GIVEN** an issue is in any state
- **WHEN** the system validates a transition to a state of type "canceled"
- **THEN** the validation SHALL return `{ valid: true }`

### Requirement: ValidateWithDefaultWorkflow

#### Scenario: No custom workflow defined

- **GIVEN** the team has no custom workflow defined
- **AND** the issue is in state "Todo" (embedded default)
- **WHEN** the system validates a transition to "In Progress"
- **THEN** the validation SHALL return `{ valid: true }`
- **AND** the default workflow rules SHALL apply:
  - Todo -> In Progress (valid)
  - In Progress -> In Review (valid)
  - In Review -> Done (valid)
  - Any state -> Canceled (valid)
  - Any other transition (invalid)

---

**Feature:** Workflow Resolution

When performing transition validation, the system SHALL first check whether the team has a custom workflow defined. Custom workflow presence SHALL be determined by the existence of rows in `workflow_states` for the team. If no custom workflow exists, the system SHALL use the embedded default workflow. Workflow resolution SHALL be evaluated per-team.

### Requirement: ResolveCustomWorkflow

#### Scenario: Team has custom states

- **GIVEN** the team has at least one row in `workflow_states`
- **WHEN** the transition validation service is called
- **THEN** the system SHALL query `workflow_transitions` for allowed transitions

#### Scenario: Team has no custom states

- **GIVEN** the team has zero rows in `workflow_states`
- **WHEN** the transition validation service is called
- **THEN** the system SHALL use the embedded default workflow

---

**Feature:** State History Tracking

Every status change on an issue SHALL be recorded in an append-only history log. Each entry SHALL include the issue ID, source state, destination state, the user who performed the change, and a timestamp. History SHALL be immutable — once written, entries MUST NOT be updated or deleted.

### Requirement: RecordStatusChange

#### Scenario: Status change recorded

- **GIVEN** an issue is in state "Todo"
- **WHEN** a user changes the status to "In Progress"
- **THEN** a new entry SHALL be appended to `state_history`
- **AND** the entry SHALL contain: `issueId`, `fromStateId` (Todo), `toStateId` (In Progress), `userId`, and `createdAt`

#### Scenario: History is append-only

- **GIVEN** a status change entry exists for an issue
- **WHEN** any user attempts to delete or modify the entry
- **THEN** the operation SHALL be rejected

#### Scenario: First status change from null

- **GIVEN** an issue is newly created with no prior status
- **WHEN** the initial status is set
- **THEN** the history entry SHALL have `fromStateId` set to null

---

**Feature:** Default Workflow (Embedded)

The default workflow SHALL be embedded in the Work Module and SHALL NOT be persisted to the database. It SHALL be used when no custom workflow is defined for the team.

### Requirement: DefaultTransitions

#### Scenario: Default workflow structure

- **GIVEN** no custom workflow exists for the team
- **WHEN** the system resolves allowed transitions
- **THEN** the following transitions SHALL be allowed:
  - Todo (unstarted) -> In Progress (in_progress)
  - In Progress (in_progress) -> In Review (in_progress)
  - In Review (in_progress) -> Done (completed)
  - Any state -> Cancelled (canceled)

---

## Data Model

### WorkflowState

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| teamId | uuid | FK -> team.id, NOT NULL | Scopes states to a team |
| name | varchar(100) | NOT NULL, UNIQUE(teamId, name) | Display name |
| type | enum | NOT NULL | unstarted, in_progress, completed, canceled |
| position | integer | NOT NULL, DEFAULT 0 | Sort order within team |
| createdAt | timestamptz | NOT NULL, DEFAULT now() | |
| updatedAt | timestamptz | NOT NULL, DEFAULT now() | |

### WorkflowTransition

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| fromStateId | uuid | FK -> workflow_state.id, NOT NULL | Source state |
| toStateId | uuid | FK -> workflow_state.id, NOT NULL | Destination state |
| createdAt | timestamptz | NOT NULL, DEFAULT now() | |

### StateHistory

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | uuid | PK, default gen_random_uuid() | |
| issueId | uuid | FK -> issue.id, NOT NULL | |
| fromStateId | uuid | FK -> workflow_state.id, NULLABLE | null for initial creation |
| toStateId | uuid | FK -> workflow_state.id, NOT NULL | |
| userId | uuid | FK -> user.id, NOT NULL | Who performed the change |
| createdAt | timestamptz | NOT NULL, DEFAULT now() | |

### Relationships

- Team --1:N--> WorkflowState: A team has many workflow states
- WorkflowState --1:N--> WorkflowTransition (as fromState): A state can be the source of many transitions
- WorkflowState --1:N--> WorkflowTransition (as toState): A state can be the destination of many transitions
- Issue --1:N--> StateHistory: An issue has many status change entries
- WorkflowState --1:N--> StateHistory (as fromState): A workflow state can be referenced as the source in many history entries
- WorkflowState --1:N--> StateHistory (as toState): A workflow state can be referenced as the destination in many history entries
- User --1:N--> StateHistory: A user can perform many status changes

## Business Rules

1. Each team MUST have at most one `canceled` state.
2. Each team MUST have at least one `unstarted` and one `completed` state when custom workflow is defined.
3. A state SHALL be deletable only if no transitions reference it.
4. Transition from any state to a `canceled` type state SHALL always be valid.
5. Default workflow SHALL be embedded in the Work Module code and SHALL NOT be stored in the database.
6. State history SHALL be append-only: existing entries MUST NOT be updated or deleted.
7. Workflow resolution SHALL check `workflow_states` table for team-scoped rows; if none exist, default workflow applies.

## Security

1. Only team administrators SHALL be allowed to create, update, or delete workflow states and transitions.
2. Any authenticated user SHALL be allowed to read workflow states and transitions for their team.
3. Any authenticated user SHALL be allowed to read state history for issues they can access.
4. Transition validation SHALL require authentication but SHALL NOT require admin role.
5. Input SHALL be validated against the `type` enum — invalid values SHALL be rejected at the API boundary.
