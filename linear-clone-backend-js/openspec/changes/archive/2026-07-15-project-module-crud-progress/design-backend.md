# Project Module — Backend Design

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Module structure | New `src/modules/project/` | Follows existing hexagonal architecture pattern (cf. `work`, `identity`, `auth`) |
| Table schema | `projects` with enum status | Simple, type-safe; no status join table needed (project lifecycle is simpler than issue workflow) |
| Repository pattern | Drizzle + interface | Same as `drizzle-issue-repository.ts`; testable via mock |
| Cross-module queries | Port interfaces (inline adapters in controller) | Same as `projectQuery` stub pattern already in issue controller |
| Event publishing | Existing `EventPublisher` port | Publish `ProjectCreated`, `ProjectStatusChanged`, `IssueProjectAssociated` events |
| Soft delete | No `deletedAt` — use `canceled` status | Per spec: no hard delete, `canceled` is terminal |
| Progress calculation | Computed on read (COUNT query) | Always accurate; no stale cache; simple implementation |

## API Contracts

### POST /api/v1/projects

- **Method**: POST
- **Path**: `/api/v1/projects`
- **Request**: `{ teamId: string (uuid), name: string (1-255), description?: string, startDate?: string (ISO date), targetDate?: string (ISO date) }`
- **Response** (201): `ProjectResponse`
- **Status Codes**: 201, 400, 401, 403, 422

### GET /api/v1/projects

- **Method**: GET
- **Path**: `/api/v1/projects?teamId={teamId}&status={status}&cursor={cursor}&limit={limit}`
- **Response** (200): `{ data: ProjectResponse[], nextCursor: string | null, hasMore: boolean }`
- **Status Codes**: 200, 401, 403

### GET /api/v1/projects/:projectId

- **Method**: GET
- **Path**: `/api/v1/projects/:projectId`
- **Response** (200): `ProjectResponse`
- **Status Codes**: 200, 401, 403, 404

### PATCH /api/v1/projects/:projectId

- **Method**: PATCH
- **Path**: `/api/v1/projects/:projectId`
- **Request**: `{ name?: string, description?: string, startDate?: string, targetDate?: string }`
- **Response** (200): `ProjectResponse`
- **Status Codes**: 200, 400, 401, 403, 404, 422

### PATCH /api/v1/projects/:projectId/status

- **Method**: PATCH
- **Path**: `/api/v1/projects/:projectId/status`
- **Request**: `{ status: "planned" | "in_progress" | "completed" | "canceled" }`
- **Response** (200): `ProjectResponse`
- **Status Codes**: 200, 400, 401, 403, 404, 422

### GET /api/v1/projects/:projectId/progress

- **Method**: GET
- **Path**: `/api/v1/projects/:projectId/progress`
- **Response** (200): `{ projectId: string, totalIssues: number, completedIssues: number, progress: number }`
- **Status Codes**: 200, 401, 403, 404

### POST /api/v1/projects/:projectId/issues

- **Method**: POST
- **Path**: `/api/v1/projects/:projectId/issues`
- **Request**: `{ issueId: string (uuid) }`
- **Response** (200): `ProjectResponse`
- **Status Codes**: 200, 400, 401, 403, 404, 409

### DELETE /api/v1/projects/:projectId/issues/:issueId

- **Method**: DELETE
- **Path**: `/api/v1/projects/:projectId/issues/:issueId`
- **Response** (200): `ProjectResponse`
- **Status Codes**: 200, 401, 403, 404

## Data Model

### Entity: Project

```sql
CREATE TYPE project_status AS ENUM ('planned', 'in_progress', 'completed', 'canceled');

CREATE TABLE projects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id     uuid NOT NULL REFERENCES teams(id),
  name        varchar(255) NOT NULL,
  description text,
  status      project_status NOT NULL DEFAULT 'planned',
  start_date  date,
  target_date date,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
```

### Drizzle Schema (`src/modules/project/domain/project.ts`)

```typescript
import { pgTable, uuid, varchar, text, date, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const projectStatusEnum = pgEnum('project_status', ['planned', 'in_progress', 'completed', 'canceled']);

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  teamId: uuid('team_id').notNull().references(() => teams.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: projectStatusEnum('status').notNull().default('planned'),
  startDate: date('start_date'),
  targetDate: date('target_date'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
```

Note: The `teams` import will come from the identity module's domain exports. The existing `drizzle.config.ts` pattern uses `src/shared/database/index.ts` to re-export all tables — the project schema will be added there.

### Indexes

| Column(s) | Type | Purpose |
|-----------|------|---------|
| `team_id` | B-tree | Filter projects by team |
| `status` | B-tree | Filter/group by status |

### Migration Plan

| Version | Description |
|---------|-------------|
| V1 | Create `project_status` enum, `projects` table, and indexes |

No existing tables are modified. The `issues.project_id` column already exists without FK — optionally add FK constraint in a separate migration.

### Response Schema (ProjectResponse)

```typescript
interface ProjectResponse {
  id: string;
  teamId: string;
  name: string;
  description: string | null;
  status: 'planned' | 'in_progress' | 'completed' | 'canceled';
  startDate: string | null;
  targetDate: string | null;
  progress: number;
  issueCount: number;
  completedIssueCount: number;
  createdAt: string;
  updatedAt: string;
}
```

## Business Logic

### Use Cases

#### CreateProject

- **File**: `src/modules/project/application/create-project.ts`
- **Responsibility**: Create a new project with status `Planned`
- **Rules**:
  - User MUST be a team member
  - Name MUST NOT be empty
  - Target date MUST be after start date (if both provided)
- **Dependencies**: `ProjectRepository`, `TeamMemberQuery` (port)
- **Events**: `ProjectCreated { projectId, teamId, userId }`

#### UpdateProject

- **File**: `src/modules/project/application/update-project.ts`
- **Responsibility**: Partial update of project metadata
- **Rules**:
  - User MUST be a team member
  - Name MUST NOT be empty if provided
  - Target date MUST be after start date (if both provided after update)
  - Only non-status fields can be updated here
- **Dependencies**: `ProjectRepository`, `TeamMemberQuery` (port)
- **Events**: `ProjectUpdated { projectId, teamId, userId }`

#### ChangeProjectStatus

- **File**: `src/modules/project/application/change-project-status.ts`
- **Responsibility**: Transition project through lifecycle
- **Rules**:
  - Valid transitions: `planned → in_progress`, `in_progress → completed`, `in_progress → canceled`
  - Completed MUST NOT be reopened
  - Cancel requires team admin role
  - On cancel, all associated issues get `projectId = null`
- **Dependencies**: `ProjectRepository`, `TeamMemberQuery`, `TeamAdminQuery` (port), `IssueRepository` (port)
- **Events**: `ProjectStatusChanged { projectId, oldStatus, newStatus, userId }`

#### GetProjectProgress

- **File**: `src/modules/project/application/get-project-progress.ts`
- **Responsibility**: Calculate project progress
- **Rules**:
  - `progress = (completedIssues / totalIssues) * 100`
  - Only direct issues (not sub-issues)
  - Returns 0 if no issues
- **Dependencies**: `ProjectRepository`, `ProjectIssueQuery` (port for counting issues)
- **Events**: None (read-only)

#### AddIssueToProject

- **File**: `src/modules/project/application/add-issue-to-project.ts`
- **Responsibility**: Associate an issue with a project
- **Rules**:
  - Issue and project MUST belong to same team
  - Issue MUST NOT already be associated with another project
- **Dependencies**: `ProjectRepository`, `IssueQuery` (port)
- **Events**: `IssueProjectAssociated { issueId, projectId, userId }`

#### RemoveIssueFromProject

- **File**: `src/modules/project/application/remove-issue-from-project.ts`
- **Responsibility**: Disassociate an issue from a project
- **Rules**:
  - Sets `issue.projectId = null`
  - Issue itself is NOT deleted
- **Dependencies**: `ProjectRepository`, `IssueRepository` (port)
- **Events**: `IssueProjectRemoved { issueId, projectId, userId }`

### Cross-Module Integration

The existing `ProjectQuery` port in the work module (`getProjectTeamId`) will be implemented by a new inline adapter in the project controller that queries the project repository:

```typescript
// In project-controller.ts
const projectQuery: ProjectQuery = {
  async getProjectTeamId(projectId: string): Promise<string | null> {
    const project = await projectRepo.findById(projectId);
    return project ? project.teamId : null;
  },
};
```

## Module Structure

```
src/modules/project/
├── domain/
│   ├── project.ts          # Drizzle schema + types
│   ├── errors.ts           # Domain error classes
│   └── index.ts            # Re-exports
├── application/
│   ├── ports/
│   │   ├── project-repository.ts    # Repository interface
│   │   └── ...                      # Query port interfaces
│   ├── create-project.ts
│   ├── update-project.ts
│   ├── change-project-status.ts
│   ├── get-project-progress.ts
│   ├── add-issue-to-project.ts
│   └── remove-issue-from-project.ts
├── adapters/
│   ├── in/
│   │   ├── project-controller.ts    # Fastify routes
│   │   └── dto.ts                   # Zod schemas + response types
│   └── out/
│       └── drizzle-project-repository.ts  # Drizzle implementation
└── __tests__/
    ├── create-project.test.ts
    ├── update-project.test.ts
    ├── change-project-status.test.ts
    ├── get-project-progress.test.ts
    ├── add-issue-to-project.test.ts
    └── remove-issue-from-project.test.ts
```

## Security

- **Authentication**: JWT Bearer token required on all endpoints (via same `getUserIdFromToken` helper pattern)
- **Authorization**:
  - Team membership required for all project operations
  - Team admin role required for cancellation
  - Same-team validation for issue-project association
- **Input validation**: Zod schemas at controller boundary (DPI)
- **Rate limiting**: 30 req/min for mutating endpoints, 60 req/min for read endpoints
- **Error handling**: Domain-specific errors mapped to HTTP status codes in controller

## Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest + mocks | Use case classes: business rules, validation, error cases |
| Integration | Vitest | Repository layer with test database |
| Contract | Vitest | API endpoints via Fastify `inject()` |

Unit tests will mock all port interfaces. Integration/contract tests are optional for initial delivery.

### Test coverage per use case

| Use Case | Test Scenarios |
|----------|---------------|
| CreateProject | Happy path, empty name, non-member, target date before start date |
| UpdateProject | Happy path, empty name, non-member, project not found |
| ChangeProjectStatus | All valid transitions, invalid transitions, non-admin cancel, reopen completed |
| GetProjectProgress | Mixed issues, no issues, all completed, non-member |
| AddIssueToProject | Happy path, different teams, already associated, issue not found |
| RemoveIssueFromProject | Happy path, not associated, non-member |
