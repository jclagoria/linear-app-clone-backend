# Cycles — Business Specification

## Behaviour

**Feature:** Cycle Creation

Users SHALL be able to create cycles to time-box work for a team.

### Requirement: CreateCycle

#### Scenario: Create a cycle with valid dates

- **GIVEN** the user is a member of a team
- **WHEN** the user creates a cycle with name "Sprint 1", start date "2026-07-20", and end date "2026-08-03"
- **THEN** a cycle is created with status `draft`
- **AND** the cycle has the provided name, start date, and end date

#### Scenario: Reject past start date

- **GIVEN** the user is a member of a team
- **WHEN** the user creates a cycle with a start date in the past
- **THEN** the creation is rejected with an error
- **AND** no cycle is created

#### Scenario: Reject end date before start date

- **GIVEN** the user is a member of a team
- **WHEN** the user creates a cycle where end date is before start date
- **THEN** the creation is rejected with an error
- **AND** no cycle is created

#### Scenario: Reject empty name

- **GIVEN** the user is a member of a team
- **WHEN** the user creates a cycle with an empty name
- **THEN** the creation is rejected with a validation error
- **AND** no cycle is created

#### Scenario: Non-member cannot create cycle

- **GIVEN** the user is NOT a member of the team
- **WHEN** the user attempts to create a cycle for that team
- **THEN** a forbidden error is returned
- **AND** no cycle is created

---

**Feature:** Cycle Activation

Users SHALL be able to activate a cycle to begin a time-boxed work period.

### Requirement: ActivateCycle

#### Scenario: Activate a Draft cycle

- **GIVEN** a cycle exists in `draft` status for a team
- **WHEN** the user activates the cycle
- **THEN** the cycle status changes to `active`
- **AND** the start date is set to the activation date

#### Scenario: Only one active cycle per team

- **GIVEN** a team has an active cycle
- **WHEN** the user activates another Draft cycle for the same team
- **THEN** the previously active cycle is auto-completed
- **AND** the new cycle becomes active

#### Scenario: Cannot activate an already active cycle

- **GIVEN** a cycle is already in `active` status
- **WHEN** the user attempts to activate it again
- **THEN** the request is rejected with an error
- **AND** the cycle remains active

#### Scenario: Cannot activate a completed cycle

- **GIVEN** a cycle is in `completed` status
- **WHEN** the user attempts to activate it
- **THEN** the request is rejected with an error
- **AND** the cycle remains completed

#### Scenario: Issue assignment after activation

- **GIVEN** a cycle has been activated
- **WHEN** an issue is created or updated with this cycle's ID
- **THEN** the issue is successfully associated with the cycle

#### Scenario: Cannot assign issues to Draft cycles

- **GIVEN** a cycle is in `draft` status
- **WHEN** a user attempts to assign an issue to this cycle
- **THEN** the request is rejected with an error

---

**Feature:** Cycle Completion

Users SHALL be able to complete a cycle to mark the time-box as finished.

### Requirement: CompleteCycle

#### Scenario: Complete an active cycle

- **GIVEN** a cycle is in `active` status
- **WHEN** the user completes the cycle
- **THEN** the cycle status changes to `completed`
- **AND** `completedAt` timestamp is set

#### Scenario: Cannot complete a Draft cycle

- **GIVEN** a cycle is in `draft` status
- **WHEN** the user attempts to complete it
- **THEN** the request is rejected with an error
- **AND** the cycle remains in draft

#### Scenario: Cannot reactivate a completed cycle

- **GIVEN** a cycle is in `completed` status
- **WHEN** the user attempts to activate it
- **THEN** the request is rejected with an error
- **AND** the cycle remains completed

#### Scenario: Cannot complete an already completed cycle

- **GIVEN** a cycle is already in `completed` status
- **WHEN** the user attempts to complete it again
- **THEN** the request is rejected with an error

---

**Feature:** Cycle Update

Users SHALL be able to modify cycle details.

### Requirement: UpdateCycle

#### Scenario: Update cycle name and description in Draft

- **GIVEN** a cycle exists in `draft` status
- **WHEN** the user updates the name and description
- **THEN** the cycle is updated with the new values

#### Scenario: Update cycle dates in Draft

- **GIVEN** a cycle exists in `draft` status
- **WHEN** the user updates the start date or end date
- **THEN** the dates are updated

#### Scenario: Cannot update dates outside Draft

- **GIVEN** a cycle exists in `active` or `completed` status
- **WHEN** the user attempts to update the start date or end date
- **THEN** the request is rejected with an error
- **AND** the dates remain unchanged

#### Scenario: Partial update preserves omitted fields

- **GIVEN** a cycle exists in `draft` status with name "Sprint 1" and description "First sprint"
- **WHEN** the user updates only the name to "Sprint 2"
- **THEN** the name is updated
- **AND** the description remains unchanged

---

**Feature:** Cycle Deletion

Users SHALL be able to delete Draft cycles.

### Requirement: DeleteCycle

#### Scenario: Delete a Draft cycle

- **GIVEN** a cycle exists in `draft` status
- **WHEN** the user deletes the cycle
- **THEN** the cycle is permanently removed

#### Scenario: Cannot delete Active or Completed cycle

- **GIVEN** a cycle exists in `active` or `completed` status
- **WHEN** the user attempts to delete the cycle
- **THEN** the request is rejected with an error
- **AND** the cycle remains

---

**Feature:** Cycle Query

Users SHALL be able to view cycle details and list cycles.

### Requirement: GetCycle

#### Scenario: Get cycle by ID

- **GIVEN** a cycle exists
- **WHEN** the user requests the cycle by its ID
- **THEN** the full cycle details are returned

#### Scenario: Cycle not found

- **GIVEN** no cycle exists with the given ID
- **WHEN** the user requests the cycle by that ID
- **THEN** a 404 error is returned

#### Scenario: List cycles by team

- **GIVEN** a team has multiple cycles in different statuses
- **WHEN** the user lists cycles for the team
- **THEN** all cycles are returned sorted by start date descending

#### Scenario: Filter cycles by status

- **GIVEN** a team has Draft, Active, and Completed cycles
- **WHEN** the user lists cycles filtered by status `active`
- **THEN** only active cycles are returned

#### Scenario: Non-member cannot list cycles

- **GIVEN** the user is NOT a member of a team
- **WHEN** the user attempts to list cycles for that team
- **THEN** a forbidden error is returned

---

## Data Model

### Cycle

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | uuid | PK, default `gen_random_uuid()` | |
| `teamId` | uuid | NOT NULL, FK → `teams(id)` | Team that owns the cycle |
| `name` | varchar(255) | NOT NULL | |
| `description` | text | nullable | |
| `status` | cycle_status enum | NOT NULL, default `draft` | Values: `draft`, `active`, `completed` |
| `startDate` | date | NOT NULL | Must be today or future |
| `endDate` | date | NOT NULL | Must be after startDate |
| `createdAt` | timestamptz | NOT NULL, default `now()` | |
| `updatedAt` | timestamptz | NOT NULL, default `now()` | |
| `completedAt` | timestamptz | nullable | Set on completion |

### Relationships

- `Cycle` N:1 `Team` — Each cycle belongs to one team
- `Issue` N:1 `Cycle` — Each issue can be assigned to at most one active cycle (Section 6.4)

## Business Rules

| Rule | Description |
|------|-------------|
| No minimum/maximum duration | Cycles can span any valid date range. |
| No backdating | Start date MUST be today or future. |
| Overlap check | Overlap is only checked for active cycles. |
| Dates modifiable | Dates can only be modified when cycle is in `draft` status. |
| Unlimited Draft cycles | A team can have any number of Draft cycles. |
| Single active cycle | A team can have at most one Active cycle at any time. |
| Unlimited completed cycles | A team can have any number of Completed cycles. |
| Draft → Active | Transition sets start date to activation time if in Draft. |
| Auto-complete | Activating a new cycle auto-completes any currently active cycle for the same team. |
| No reactivation | Completed cycles MUST NOT be reactivated. |
| Delete only Draft | Only Draft cycles can be deleted. |
| Issue assignment | Issues can only be assigned to Active cycles. |

## Security

- **Authentication**: JWT Bearer token required on all endpoints via existing auth middleware.
- **Authorization**: Team membership (via `TeamMemberQuery` port) required for all cycle operations.
- **Input validation**: Zod schemas at controller boundary for all endpoints.
- **Rate limiting**: 30 req/min for mutations (create, update, activate, complete, delete), 60 req/min for reads.
