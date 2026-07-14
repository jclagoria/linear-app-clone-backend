# Work Module — Backend Design

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | Hexagonal (Ports & Adapters) | Follows project convention from Identity module — domain isolation, testability |
| Module structure | `src/modules/work/{domain,application,adapters}` | Mirrors existing module layout |
| Identifier generation | Database sequence per team | Atomic, no race conditions; PostgreSQL sequences guarantee monotonic increment |
| Status workflow | Hardcoded default workflow | Ticket 09 will add custom workflows; default is embedded for now |
| Soft-delete | `deletedAt` timestamp column | Consistent with Identity module pattern |
| Pagination | Cursor-based (UUID + createdAt composite) | Consistent with spec; avoids offset drift issues |
| Event publishing | In-memory EventPublisher | Same pattern as Identity module; can be swapped for Redis/Kafka later |

## API Contracts

### Create Issue

- **Method**: POST
- **Path**: `/api/v1/issues`
- **Request**:
  ```typescript
  z.object({
    title: z.string().min(1).max(255),
    description: z.string().optional(),
    teamId: z.string().uuid(),
    projectId: z.string().uuid().optional(),
    assigneeId: z.string().uuid().optional(),
    priority: z.number().int().min(0).max(4).default(0),
    labelIds: z.array(z.string().uuid()).optional(),
    parentId: z.string().uuid().optional(),
    cycleId: z.string().uuid().optional(),
  })
  ```
- **Response**: 201 — `IssueResponse`
- **Status Codes**: 201, 400, 401, 403, 404, 422, 429, 500

### Get Issue

- **Method**: GET
- **Path**: `/api/v1/issues/:id`
- **Request**: `id` — UUID or identifier (e.g., `ENG-123`)
- **Response**: 200 — `IssueResponse`
- **Status Codes**: 200, 401, 404, 429, 500

### Update Issue

- **Method**: PATCH
- **Path**: `/api/v1/issues/:id`
- **Request**:
  ```typescript
  z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().nullable().optional(),
    projectId: z.string().uuid().nullable().optional(),
    priority: z.number().int().min(0).max(4).optional(),
    labelIds: z.array(z.string().uuid()).optional(),
    cycleId: z.string().uuid().nullable().optional(),
  })
  ```
- **Response**: 200 — `IssueResponse`
- **Status Codes**: 200, 400, 401, 403, 404, 422, 429, 500

### Change Issue Status

- **Method**: PATCH
- **Path**: `/api/v1/issues/:id/status`
- **Request**:
  ```typescript
  z.object({
    statusId: z.string().uuid(),
  })
  ```
- **Response**: 200 — `IssueResponse`
- **Status Codes**: 200, 400, 401, 403, 404, 422, 429, 500

### Assign Issue

- **Method**: PATCH
- **Path**: `/api/v1/issues/:id/assignee`
- **Request**:
  ```typescript
  z.object({
    assigneeId: z.string().uuid().nullable(),
  })
  ```
- **Response**: 200 — `IssueResponse`
- **Status Codes**: 200, 400, 401, 403, 404, 422, 429, 500

### Delete Issue

- **Method**: DELETE
- **Path**: `/api/v1/issues/:id`
- **Response**: 204 — No content
- **Status Codes**: 204, 401, 403, 404, 429, 500

### List Issues

- **Method**: GET
- **Path**: `/api/v1/issues`
- **Query Parameters**:
  ```typescript
  z.object({
    teamId: z.string().uuid().optional(),
    statusId: z.string().uuid().optional(),
    assigneeId: z.string().uuid().optional(),
    projectId: z.string().uuid().optional(),
    cycleId: z.string().uuid().optional(),
    labelIds: z.string().optional(),  // comma-separated
    cursor: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(50),
    includeDeleted: z.coerce.boolean().default(false),
  })
  ```
- **Response**: 200
  ```typescript
  {
    data: IssueResponse[],
    pagination: { nextCursor: string | null, hasMore: boolean }
  }
  ```
- **Status Codes**: 200, 400, 401, 429, 500

## Data Model

### Issue

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `identifier` | `varchar(20)` | NOT NULL | Auto-generated: `{teamKey}-{sequence}` |
| `title` | `varchar(255)` | NOT NULL | |
| `description` | `text` | Nullable | |
| `team_id` | `uuid` | NOT NULL, FK -> teams.id | |
| `project_id` | `uuid` | Nullable, FK -> projects.id | |
| `assignee_id` | `uuid` | Nullable, FK -> users.id | |
| `priority` | `integer` | NOT NULL, default 0 | 0-4 |
| `status_id` | `uuid` | NOT NULL, FK -> issue_statuses.id | Default to Todo status ID |
| `parent_id` | `uuid` | Nullable, FK -> issues.id | |
| `cycle_id` | `uuid` | Nullable, FK -> cycles.id | |
| `sort_order` | `integer` | NOT NULL, default 0 | |
| `sequence` | `integer` | NOT NULL | Per-team auto-increment |
| `created_at` | `timestamp` | NOT NULL, default `now()` | |
| `updated_at` | `timestamp` | NOT NULL, default `now()` | |
| `completed_at` | `timestamp` | Nullable | |
| `canceled_at` | `timestamp` | Nullable | |
| `deleted_at` | `timestamp` | Nullable | |

### Issue Label (junction)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `issue_id` | `uuid` | NOT NULL, FK -> issues.id | |
| `label_id` | `uuid` | NOT NULL, FK -> issue_labels.id | |

### Indexes

- `idx_issues_team_id` on `team_id` (for team filtering)
- `idx_issues_assignee_id` on `assignee_id` (for assignee filtering)
- `idx_issues_status_id` on `status_id` (for status filtering)
- `idx_issues_project_id` on `project_id` (for project filtering)
- `idx_issues_cycle_id` on `cycle_id` (for cycle filtering)
- `idx_issues_identifier_team` unique on `(team_id, identifier)` where `deleted_at IS NULL`
- `idx_issues_sequence_team` unique on `(team_id, sequence)` (sequence generation)
- `idx_issues_parent_id` on `parent_id` (sub-issue ordering)
- `idx_issue_labels_issue` on `issue_id` (label junction lookups)
- `idx_issue_labels_label` on `label_id` (label junction lookups)

### Migrations

| Version | Description |
|---------|-------------|
| V1 | Create `issues` table with all fields, indexes, and constraints |
| V1.1 | Create `issue_labels` junction table |

### Issue Statuses (seed data)

The default workflow statuses are embedded in the system:

| Name | Type | Position |
|------|------|----------|
| Backlog | `backlog` | 0 |
| Todo | `unstarted` | 1 |
| In Progress | `started` | 2 |
| In Review | `started` | 3 |
| Done | `completed` | 4 |
| Canceled | `canceled` | 5 |

Valid transitions:
- `backlog` → `unstarted`
- `unstarted` → `started` (In Progress)
- `started` (In Progress) → `started` (In Review)
- `started` (In Review) → `completed`
- Any → `canceled`

## Business Logic

### CreateIssueUseCase

- **Responsibility**: Create a new issue with auto-generated identifier
- **Rules**:
  - Validate title is non-empty
  - Validate parent issue (if provided) belongs to same team
  - Validate project (if provided) belongs to same team
  - Validate assignee (if provided) is a team member
  - Generate next sequence number for team atomically
  - Build identifier: `{team.key}-{sequence}`
  - Set default status to "Todo" and default priority to 0
  - Publish `IssueCreated` event
- **Dependencies**: `IssueRepository`, `TeamRepository`, `TeamMemberRepository`, `EventPublisher`

### UpdateIssueUseCase

- **Responsibility**: Partially update issue fields
- **Rules**:
  - Only update provided fields (partial update semantics)
  - Reject empty title
  - Validate project change belongs to same team
  - Set `updatedAt` timestamp
- **Dependencies**: `IssueRepository`, `TeamRepository`

### ChangeIssueStatusUseCase

- **Responsibility**: Change issue status following workflow rules
- **Rules**:
  - Validate transition is allowed per workflow
  - Set `completedAt` when transitioning to `completed` or `canceled` type
  - Clear `completedAt` when transitioning from `completed` type
  - Publish `IssueStatusChanged` event
- **Dependencies**: `IssueRepository`, `IssueStatusRepository`

### AssignIssueUseCase

- **Responsibility**: Set or unset issue assignee
- **Rules**:
  - Validate assignee (if provided) is a member of the issue's team
  - Allow null to unassign
- **Dependencies**: `IssueRepository`, `TeamMemberRepository`

### DeleteIssueUseCase

- **Responsibility**: Soft-delete an issue
- **Rules**:
  - Set `deletedAt` timestamp
  - Publish `IssueDeleted` event
- **Dependencies**: `IssueRepository`, `EventPublisher`

### ListIssuesUseCase

- **Responsibility**: Query issues with filters and cursor pagination
- **Rules**:
  - Apply filters: team, status, assignee, project, cycle, labels
  - Exclude soft-deleted issues unless `includeDeleted=true`
  - Default sort: priority desc, createdAt desc
  - Sub-issues ordered after parent
  - Cursor-based pagination with max 100 items
- **Dependencies**: `IssueRepository`

## Module Structure

```
src/modules/work/
├── domain/
│   ├── index.ts
│   ├── errors.ts              # InvalidTransitionError, TeamMismatchError, etc.
│   ├── issue.ts               # Drizzle schema + types
│   ├── issue-status.ts        # Issue status entity
│   └── issue-label.ts         # Issue-label junction schema
├── application/
│   ├── create-issue.ts
│   ├── update-issue.ts
│   ├── change-issue-status.ts
│   ├── assign-issue.ts
│   ├── delete-issue.ts
│   ├── list-issues.ts
│   └── ports/
│       ├── issue-repository.ts
│       └── event-publisher.ts
├── adapters/
│   ├── in/
│   │   ├── issue-controller.ts
│   │   └── dto.ts
│   └── out/
│       ├── drizzle-issue-repository.ts
│       └── in-memory-event-publisher.ts
└── __tests__/
    ├── create-issue.test.ts
    ├── update-issue.test.ts
    ├── change-issue-status.test.ts
    ├── assign-issue.test.ts
    ├── delete-issue.test.ts
    ├── list-issues.test.ts
    └── integration/
        ├── issue-api.test.ts
        └── contract/
            └── issue-contracts.test.ts
```

## Security

- **Authentication**: JWT access token required for all endpoints (reuse existing `getUserIdFromToken` helper pattern)
- **Authorization**: Team scope — users can only access issues from teams they are members of
- **Input Sanitization**: Zod schemas validate all inputs at the API boundary
- **Rate Limiting**:
  - Create/Update/Status/Assignee: 60/min
  - Delete: 30/min
  - Get/List: 120/min and 60/min respectively

## Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | Use cases, validation, workflow rules, identifier generation |
| Integration | Vitest + Testcontainers | Repository operations, full API flows against real PostgreSQL |
| Contract | Vitest | API request/response contract verification matching specs-api |
