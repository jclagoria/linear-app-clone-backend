# Issues — Business Specification

## Behaviour

**Feature:** Issue Creation

The system SHALL auto-generate a unique identifier for each issue using the team key and a sequential number (e.g., `ENG-123`). The sequence SHALL be monotonically increasing per team. New issues MUST start with default status "Todo" and default priority "No Priority" (0).

### Requirement: CreateIssue

#### Scenario: Create issue with minimal fields

- **GIVEN** a team with key `ENG` exists in the system
- **WHEN** a user creates an issue with title "Fix login bug" and team `ENG`
- **THEN** the issue SHALL be created with identifier `ENG-1`
- **AND** the status SHALL be "Todo"
- **AND** the priority SHALL be "No Priority" (0)

#### Scenario: Create issue with all optional fields

- **GIVEN** a team with key `ENG` exists
- **AND** a project `Sprint 23` belongs to team `ENG`
- **AND** a user `Alice` is a member of team `ENG`
- **WHEN** a user creates an issue with title, description, project, assignee, priority, and labels
- **THEN** all provided fields SHALL be set on the created issue

#### Scenario: Create issue with empty title

- **WHEN** a user attempts to create an issue with an empty title
- **THEN** the request SHALL be rejected with a validation error

#### Scenario: Create issue with parent from different team

- **GIVEN** parent issue belongs to team `DESIGN`
- **WHEN** a user attempts to create a sub-issue under parent with team `ENG`
- **THEN** the request SHALL be rejected with an error

---

**Feature:** Issue Update

The system SHALL support partial updates — only the fields provided in the request body SHALL be modified. The title field MUST NOT be set to empty.

### Requirement: UpdateIssue

#### Scenario: Update issue title and priority

- **GIVEN** an existing issue with title "Old title" and priority 3
- **WHEN** a user updates the issue with title "New title" and priority 1
- **THEN** the title SHALL be "New title"
- **AND** the priority SHALL be 1 (Urgent)

#### Scenario: Partial update leaves unprovided fields unchanged

- **GIVEN** an existing issue with title "Bug", description "Fix it", priority 2
- **WHEN** a user updates only the description to "Fixed it now"
- **THEN** the description SHALL be "Fixed it now"
- **AND** the title SHALL remain "Bug"
- **AND** the priority SHALL remain 2

#### Scenario: Update title to empty string

- **WHEN** a user attempts to set an issue title to an empty string
- **THEN** the request SHALL be rejected with a validation error

#### Scenario: Update project to project from different team

- **GIVEN** the issue belongs to team `ENG`
- **AND** a project belongs to team `DESIGN`
- **WHEN** a user attempts to assign the issue to the `DESIGN` project
- **THEN** the request SHALL be rejected with an error

---

**Feature:** Issue Status Change

The system SHALL enforce workflow transition rules. The default workflow is: Todo → In Progress → In Review → Done. Issues SHALL transition to "Canceled" from any state. Moving to a completed or canceled state SHALL set `completedAt`. Moving from a completed state SHALL clear `completedAt`.

### Requirement: ChangeIssueStatus

#### Scenario: Transition issue through default workflow

- **GIVEN** an issue in status "Todo"
- **WHEN** a user changes status to "In Progress"
- **THEN** the status SHALL be "In Progress"
- **WHEN** a user changes status to "In Review"
- **THEN** the status SHALL be "In Review"
- **WHEN** a user changes status to "Done"
- **THEN** the status SHALL be "Done"
- **AND** `completedAt` SHALL be set

#### Scenario: Cancel issue from any state

- **GIVEN** an issue in status "In Progress"
- **WHEN** a user changes status to "Canceled"
- **THEN** the status SHALL be "Canceled"
- **AND** `completedAt` SHALL be set

#### Scenario: Reopen a completed issue

- **GIVEN** an issue in status "Done" with a non-null `completedAt`
- **WHEN** a user changes status to "In Progress"
- **THEN** `completedAt` SHALL be cleared

#### Scenario: Transition to invalid status

- **GIVEN** an issue in status "Todo"
- **WHEN** a user attempts to change status directly to "Done"
- **THEN** the request SHALL be rejected with a transition error

---

**Feature:** Issue Assignment

Users SHALL be assignable to issues only if they are members of the issue's team. Unassigning (setting assignee to null) SHALL always be permitted.

### Requirement: AssignIssue

#### Scenario: Assign issue to team member

- **GIVEN** an issue belongs to team `ENG`
- **AND** user `Alice` is a member of team `ENG`
- **WHEN** a user assigns the issue to `Alice`
- **THEN** the assignee SHALL be `Alice`

#### Scenario: Assign issue to non-member

- **GIVEN** an issue belongs to team `ENG`
- **AND** user `Bob` is NOT a member of team `ENG`
- **WHEN** a user attempts to assign the issue to `Bob`
- **THEN** the request SHALL be rejected with an error

#### Scenario: Unassign issue

- **GIVEN** an issue assigned to `Alice`
- **WHEN** a user sets assignee to null
- **THEN** the issue SHALL have no assignee

---

**Feature:** Issue Deletion

Issues SHALL be soft-deleted by setting a `deletedAt` timestamp. Soft-deleted issues MUST be excluded from default list queries.

### Requirement: DeleteIssue

#### Scenario: Soft-delete an issue

- **GIVEN** an existing issue
- **WHEN** a user deletes the issue
- **THEN** the issue SHALL have a non-null `deletedAt` timestamp
- **AND** the issue SHALL NOT appear in default list queries

#### Scenario: Query including deleted issues

- **GIVEN** a soft-deleted issue
- **WHEN** a user queries issues with `includeDeleted=true`
- **THEN** the deleted issue SHALL appear in results

---

**Feature:** Issue Query

Issues SHALL be queryable with filters for team, status, assignee, project, cycle, and labels. Results SHALL use cursor-based pagination with a maximum of 100 items per page. Default sort SHALL be priority descending, then creation date descending. Sub-issues SHALL be ordered after their parent.

### Requirement: ListIssues

#### Scenario: List issues filtered by team

- **GIVEN** 5 issues exist in team `ENG` and 3 issues exist in team `DESIGN`
- **WHEN** a user queries issues with `teamId=ENG`
- **THEN** only the 5 `ENG` issues SHALL be returned

#### Scenario: List issues with cursor pagination

- **GIVEN** 150 issues exist
- **WHEN** a user queries issues with `limit=100`
- **THEN** 100 issues SHALL be returned with a `nextCursor`
- **WHEN** a user queries issues with `cursor=<nextCursor>`
- **THEN** the remaining 50 issues SHALL be returned with `hasMore=false`

#### Scenario: Limit exceeds maximum

- **WHEN** a user queries issues with `limit=200`
- **THEN** the request SHALL be rejected or capped to the maximum of 100

#### Scenario: Default sort order

- **GIVEN** issues with varying priorities and creation dates
- **WHEN** a user lists issues without specifying sort
- **THEN** results SHALL be ordered by priority descending, then creation date descending

---

## Data Model

### Issue

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | UUID | PK, default random | Primary identifier |
| `identifier` | varchar(20) | NOT NULL, unique per team | Auto-generated from team key + sequence (e.g., `ENG-123`) |
| `title` | varchar(255) | NOT NULL | Issue title |
| `description` | text | Nullable | Markdown content |
| `teamId` | UUID | NOT NULL, FK -> teams.id | Owning team |
| `projectId` | UUID | Nullable, FK -> projects.id | Parent project |
| `assigneeId` | UUID | Nullable, FK -> users.id | Assigned user |
| `priority` | integer | NOT NULL, default 0 | 0=No Priority, 1=Urgent, 2=High, 3=Medium, 4=Low |
| `statusId` | UUID | NOT NULL, FK -> issue_statuses.id | Current workflow status |
| `parentId` | UUID | Nullable, FK -> issues.id | Parent issue (sub-issue support) |
| `cycleId` | UUID | Nullable, FK -> cycles.id | Associated cycle |
| `sortOrder` | integer | NOT NULL, default 0 | Per-project ordering |
| `sequence` | integer | NOT NULL | Per-team auto-increment for identifier generation |
| `createdAt` | timestamp | NOT NULL, default now | |
| `updatedAt` | timestamp | NOT NULL, default now | |
| `completedAt` | timestamp | Nullable | Set on completed/canceled transitions |
| `canceledAt` | timestamp | Nullable | Set on cancel transition |
| `deletedAt` | timestamp | Nullable | Soft-delete timestamp |

### Issue Label (junction)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `issueId` | UUID | FK -> issues.id | |
| `labelId` | UUID | FK -> issue_labels.id | |

### Relationships

- `Issue` N:1 `Team` — an issue belongs to exactly one team
- `Issue` N:1 `User` (assignee) — an issue may be assigned to a team member
- `Issue` N:1 `Issue` (parent) — an issue may have a parent issue from the same team
- `Issue` N:1 `Project` — an issue may belong to a project
- `Issue` N:1 `Cycle` — an issue may belong to a cycle
- `Issue` N:M `IssueLabel` — an issue may have many labels

## Business Rules

1. Issue identifier SHALL be auto-generated from `{team.key}-{sequence}` where sequence is a per-team monotonically increasing integer.
2. Default status on creation SHALL be "Todo" (unstarted).
3. Default priority on creation SHALL be 0 (No Priority).
4. Title MUST NOT be empty on create or update.
5. Only provided fields SHALL be updated (partial update).
6. Parent issue MUST belong to the same team as the sub-issue.
7. Project changes MUST reference a project belonging to the same team.
8. Status transitions MUST follow the default workflow: Todo → In Progress → In Review → Done, with any state → Canceled.
9. Moving to a completed or canceled state SHALL set `completedAt`.
10. Moving from a completed state SHALL clear `completedAt`.
11. Assignee MUST be a member of the issue's team.
12. Soft-deleted issues SHALL NOT appear in default queries.
13. Cursor-based pagination SHALL be used for list queries (no offset-based).
14. Maximum 100 issues per page.
15. Default sort: priority descending, then creation date descending.
16. Sub-issues SHALL be ordered after their parent.

## Security

- All issue endpoints SHALL require JWT authentication.
- Users SHALL only be able to assign issues to members of the issue's team.
- Soft-deleted issues SHALL be excluded from unauthorized access checks.
- Input validation SHALL use Zod schemas at the API boundary.
