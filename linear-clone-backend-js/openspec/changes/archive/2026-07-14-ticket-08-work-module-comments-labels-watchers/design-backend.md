# Work Module — Backend Design

## Architecture Decisions

### 1. Extend Existing Module Pattern

Each new entity (comments, labels, watchers) SHALL be implemented as a subdomain within the existing `src/modules/work/` module, following the established hexagonal architecture:
- `domain/` — Drizzle pgTable schemas + domain errors
- `application/` — Use case classes + port interfaces
- `adapters/in/` — Fastify route handlers + Zod DTOs
- `adapters/out/` — Drizzle repository implementations

Labels are a workspace-level resource; comments and watchers are issue-scoped resources.

### 2. Reuse Existing Infrastructure

All new endpoints reuse existing:
- Auth middleware (JWT Bearer token via `getUserIdFromToken`)
- Team membership query (`teamMemberQuery` in issue-controller.ts)
- Event publisher (`InMemoryEventPublisher`)
- Error handling patterns (domain errors → status code mapping)

### 3. Soft-Delete for Comments and Labels

Comments and labels follow the same soft-delete pattern as issues (`deletedAt` column). This preserves referential integrity for historical data.

### 4. Unique Constraints

- Labels: unique name across the workspace
- Issue watchers: unique `(issueId, userId)` to prevent duplicate watches
- Issue-labels: the existing `issue_labels` junction table already enforces no duplicate via PK; unique constraint on `(issueId, labelId)` is added

## API Contracts

### Comments

#### List Comments on Issue

- **Method**: GET
- **Path**: `/issues/:id/comments`
- **Request**: Path param `id` (issue ID)
- **Response**: `{ data: CommentResponse[] }`
- **Status Codes**: 200, 401, 404

#### Create Comment

- **Method**: POST
- **Path**: `/issues/:id/comments`
- **Request**: `{ body: string }`
- **Response**: `{ data: CommentResponse }`
- **Status Codes**: 201, 400, 401, 404, 422

#### Update Comment

- **Method**: PATCH
- **Path**: `/issues/:id/comments/:commentId`
- **Request**: `{ body: string }`
- **Response**: `{ data: CommentResponse }`
- **Status Codes**: 200, 400, 401, 403, 404

#### Delete Comment

- **Method**: DELETE
- **Path**: `/issues/:id/comments/:commentId`
- **Request**: Path params `id` (issue), `commentId` (comment)
- **Response**: No content
- **Status Codes**: 204, 401, 403, 404

### Labels

#### List Labels

- **Method**: GET
- **Path**: `/labels`
- **Request**: None
- **Response**: `{ data: LabelResponse[] }`
- **Status Codes**: 200, 401

#### Create Label

- **Method**: POST
- **Path**: `/labels`
- **Request**: `{ name: string, description?: string, color?: string }`
- **Response**: `{ data: LabelResponse }`
- **Status Codes**: 201, 400, 401, 409

#### Update Label

- **Method**: PATCH
- **Path**: `/labels/:id`
- **Request**: `{ name?: string, description?: string, color?: string }`
- **Response**: `{ data: LabelResponse }`
- **Status Codes**: 200, 400, 401, 404, 409

#### Delete Label

- **Method**: DELETE
- **Path**: `/labels/:id`
- **Request**: Path param `id` (label ID)
- **Response**: No content
- **Status Codes**: 204, 401, 404

### Label Assignment

#### Get Issue Labels

- **Method**: GET
- **Path**: `/issues/:id/labels`
- **Request**: Path param `id` (issue ID)
- **Response**: `{ data: LabelResponse[] }`
- **Status Codes**: 200, 401, 404

#### Attach Label to Issue

- **Method**: POST
- **Path**: `/issues/:id/labels`
- **Request**: `{ labelId: string }`
- **Response**: `{ data: IssueLabelResponse }`
- **Status Codes**: 201, 400, 401, 404, 409

#### Detach Label from Issue

- **Method**: DELETE
- **Path**: `/issues/:id/labels/:labelId`
- **Request**: Path params `id` (issue), `labelId` (label)
- **Response**: No content
- **Status Codes**: 204, 401, 404

### Issue Watchers

#### List Issue Watchers

- **Method**: GET
- **Path**: `/issues/:id/watchers`
- **Request**: Path param `id` (issue ID)
- **Response**: `{ data: WatcherResponse[] }`
- **Status Codes**: 200, 401, 404

#### Add Watcher

- **Method**: POST
- **Path**: `/issues/:id/watchers`
- **Request**: `{ userId?: string }` (defaults to authenticated user)
- **Response**: `{ data: WatcherResponse }`
- **Status Codes**: 201, 400, 401, 404, 409, 422

#### Remove Watcher

- **Method**: DELETE
- **Path**: `/issues/:id/watchers/:userId`
- **Request**: Path params `id` (issue), `userId` (user to remove)
- **Response**: No content
- **Status Codes**: 204, 401, 404

## Data Model

### issue_comments

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, default random | |
| issue_id | UUID | NOT NULL, FK -> issues.id | Indexed |
| user_id | UUID | NOT NULL, FK -> users.id | |
| body | text | NOT NULL | Markdown content |
| created_at | timestamp | NOT NULL, default now | |
| updated_at | timestamp | NOT NULL, default now | |
| deleted_at | timestamp | NULLABLE | Soft-delete |

**Indexes**: `idx_issue_comments_issue_id` on `issue_id`

### labels

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, default random | |
| name | varchar(100) | NOT NULL, UNIQUE | Workspace-unique |
| description | varchar(500) | NULLABLE | |
| color | varchar(7) | NULLABLE | Hex color |
| created_at | timestamp | NOT NULL, default now | |
| updated_at | timestamp | NOT NULL, default now | |
| deleted_at | timestamp | NULLABLE | Soft-delete |

**Indexes**: `idx_labels_name` on `name` (unique)

### issue_watchers

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, default random | |
| issue_id | UUID | NOT NULL, FK -> issues.id | Indexed |
| user_id | UUID | NOT NULL, FK -> users.id | Indexed |
| created_at | timestamp | NOT NULL, default now | |

**Indexes**: `idx_issue_watchers_issue_user` unique on `(issue_id, user_id)`, `idx_issue_watchers_issue_id` on `issue_id`

### issue_labels (existing, enhanced)

The existing `issue_labels` junction table is reused. A unique constraint on `(issue_id, label_id)` is added to prevent duplicates.

### Migrations

| Version | Description |
|---------|-------------|
| V1 | Create `issue_comments`, `labels`, `issue_watchers` tables + add unique constraint to `issue_labels` |

## Business Logic

### Labels

- **CreateLabel**: Validates name uniqueness. Publishes `label.created` event on success.
- **UpdateLabel**: Validates name uniqueness if changed. Publishes `label.updated` event.
- **DeleteLabel**: Soft-deletes the label and cascades soft-delete to all `issue_labels` junction rows. Publishes `label.deleted` event.
- **ListLabels**: Returns all non-deleted labels ordered by name.

### Comments

- **CreateComment**: Validates team membership. Creates comment with authenticated user as author. Publishes `comment.created` event.
- **UpdateComment**: Ownership check (only author may edit). Publishes `comment.updated` event.
- **DeleteComment**: Ownership check (only author may delete). Soft-deletes. Publishes `comment.deleted` event.
- **ListComments**: Returns non-deleted comments for an issue, ordered by `createdAt` ascending.

### Label Assignment

- **AttachLabel**: Validates team membership. Creates junction row. Ensures no duplicate. Publishes `issue.label.attached` event.
- **DetachLabel**: Removes junction row (hard delete). Publishes `issue.label.detached` event.
- **GetIssueLabels**: Returns labels attached to the issue via the junction table.

### Watchers

- **AddWatcher**: Defaults `userId` to authenticated user if omitted. Validates user exists and is a team member. Enforces unique `(issueId, userId)`. Publishes `issue.watcher.added` event.
- **RemoveWatcher**: Removes the watcher row. Publishes `issue.watcher.removed` event.
- **ListWatchers**: Returns users watching the issue.

## Security

- **Authentication**: JWT Bearer token REQUIRED for all endpoints (reuses existing `getUserIdFromToken` pattern).
- **Authorization**:
  - Comment mutation: create requires team membership; update/delete requires ownership.
  - Label CRUD: any authenticated user.
  - Label assignment: team membership on the issue's team.
  - Watchers: team membership on the issue's team.
- **Input Validation**: Zod schemas at controller boundary for all endpoints.
- **Rate Limiting**: 60 req/min for mutations, 120 req/min for reads (matches existing patterns).

## Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | Use case services, domain validation, error cases |
| Integration | Vitest + Testcontainers | Repository operations, full API request/response flows |
| Contract | Vitest | API contract verification (status codes, response shapes) |

### Unit Tests

- Each use case tested in isolation with mocked repository and event publisher
- Cover: success paths, validation errors, authorization checks (ownership, team membership)
- Domain error classes tested for each failure mode

### Integration Tests

- Repository tests: CRUD operations, soft-delete, unique constraints, cascade deletes
- API tests: full request/response via Fastify `inject()`, auth header, error serialization

### Key Test Cases

- Comment: create by team member, create by non-member (422), edit by non-author (403), delete by author, soft-delete filtering
- Label: create with duplicate name (409), label delete cascades to junction rows
- Watcher: duplicate watch (409), self-watch default, add other user as watcher
