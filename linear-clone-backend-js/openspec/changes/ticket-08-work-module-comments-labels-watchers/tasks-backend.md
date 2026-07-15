# Tasks — Work Module: Comments, Labels, and Issue Watchers (Backend)

## Data Layer

### Migrations

- [x] Create migration: `issue_comments` table (id, issue_id, user_id, body, created_at, updated_at, deleted_at)
- [x] Create migration: `labels` table (id, name, description, color, created_at, updated_at, deleted_at) with unique index on name
- [x] Create migration: `issue_watchers` table (id, issue_id, user_id, created_at) with unique constraint on (issue_id, user_id)
- [x] Create migration: Add unique constraint on (issue_id, label_id) to existing `issue_labels` table

### Domain Entities

- [x] Define `issueComment` pgTable schema in `src/modules/work/domain/issue-comment.ts`
- [x] Define `label` pgTable schema in `src/modules/work/domain/label.ts`
- [x] Define `issueWatcher` pgTable schema in `src/modules/work/domain/issue-watcher.ts`
- [x] Export new entities from `src/modules/work/domain/index.ts`
- [x] Add domain error classes to `src/modules/work/domain/errors.ts`: `CommentNotFoundError`, `CommentNotOwnedByUserError`, `LabelNotFoundError`, `LabelNameConflictError`, `LabelAlreadyAttachedError`, `AlreadyWatchingError`, `WatcherNotFoundError`, `EmptyBodyError`

### Repository Ports

- [x] Define `CommentRepository` port interface in `src/modules/work/application/ports/comment-repository.ts`
- [x] Define `LabelRepository` port interface in `src/modules/work/application/ports/label-repository.ts`
- [x] Define `WatcherRepository` port interface in `src/modules/work/application/ports/watcher-repository.ts`

### Repository Implementations

- [x] Implement `DrizzleCommentRepository` in `src/modules/work/adapters/out/drizzle-comment-repository.ts`
- [x] Implement `DrizzleLabelRepository` in `src/modules/work/adapters/out/drizzle-label-repository.ts`
- [x] Implement `DrizzleWatcherRepository` in `src/modules/work/adapters/out/drizzle-watcher-repository.ts`

## Business Logic

### Comment Use Cases

- [x] Implement `CreateComment` use case in `src/modules/work/application/create-comment.ts`
- [x] Implement `UpdateComment` use case in `src/modules/work/application/update-comment.ts`
- [x] Implement `DeleteComment` use case in `src/modules/work/application/delete-comment.ts`
- [x] Implement `ListIssueComments` use case in `src/modules/work/application/list-issue-comments.ts`

### Label Use Cases

- [x] Implement `CreateLabel` use case in `src/modules/work/application/create-label.ts`
- [x] Implement `UpdateLabel` use case in `src/modules/work/application/update-label.ts`
- [x] Implement `DeleteLabel` use case in `src/modules/work/application/delete-label.ts`
- [x] Implement `ListLabels` use case in `src/modules/work/application/list-labels.ts`

### Label Assignment Use Cases

- [x] Implement `AttachLabel` use case in `src/modules/work/application/attach-label.ts`
- [x] Implement `DetachLabel` use case in `src/modules/work/application/detach-label.ts`
- [x] Implement `GetIssueLabels` use case in `src/modules/work/application/get-issue-labels.ts`

### Watcher Use Cases

- [x] Implement `AddWatcher` use case in `src/modules/work/application/add-watcher.ts`
- [x] Implement `RemoveWatcher` use case in `src/modules/work/application/remove-watcher.ts`
- [x] Implement `ListWatchers` use case in `src/modules/work/application/list-watchers.ts`

## API Layer

### DTOs

- [x] Add comment request/response schemas to `src/modules/work/adapters/in/dto.ts` (CreateComment, UpdateComment, CommentResponse, CommentIdParams)
- [x] Add label request/response schemas to `src/modules/work/adapters/in/dto.ts` (CreateLabel, UpdateLabel, LabelResponse, LabelIdParams)
- [x] Add watcher request/response schemas to `src/modules/work/adapters/in/dto.ts` (AddWatcher, WatcherResponse, WatcherParams)

### Controllers

- [x] Implement `commentRoutes` in `src/modules/work/adapters/in/comment-controller.ts`
  - GET `/issues/:id/comments` — List comments
  - POST `/issues/:id/comments` — Create comment
  - PATCH `/issues/:id/comments/:commentId` — Update comment
  - DELETE `/issues/:id/comments/:commentId` — Delete comment
- [x] Implement `labelRoutes` in `src/modules/work/adapters/in/label-controller.ts`
  - GET `/labels` — List labels
  - POST `/labels` — Create label
  - PATCH `/labels/:id` — Update label
  - DELETE `/labels/:id` — Delete label
  - GET `/issues/:id/labels` — Get issue labels
  - POST `/issues/:id/labels` — Attach label
  - DELETE `/issues/:id/labels/:labelId` — Detach label
- [x] Implement `watcherRoutes` in `src/modules/work/adapters/in/watcher-controller.ts`
  - GET `/issues/:id/watchers` — List watchers
  - POST `/issues/:id/watchers` — Add watcher
  - DELETE `/issues/:id/watchers/:userId` — Remove watcher
- [x] Register all new route functions in `src/modules/work/adapters/in/issue-controller.ts` or main app router

## Events / Messaging

- [x] Add event types to `InMemoryEventPublisher` or create extended publisher
- [x] Publish `comment.created` event on comment creation
- [x] Publish `comment.updated` event on comment update
- [x] Publish `comment.deleted` event on comment deletion
- [x] Publish `label.created` event on label creation
- [x] Publish `label.updated` event on label update
- [x] Publish `label.deleted` event on label deletion
- [x] Publish `issue.label.attached` event on label attachment
- [x] Publish `issue.label.detached` event on label detachment
- [x] Publish `issue.watcher.added` event on watcher addition
- [x] Publish `issue.watcher.removed` event on watcher removal

## Security

- [x] Ensure all new endpoints require JWT auth via `getUserIdFromToken`
- [x] Add team membership checks for comment creation and watcher/watcher-add operations
- [x] Add ownership check for comment update/delete (only author may edit/delete)
- [x] Add rate limiting to all new endpoints (60 req/min mutations, 120 req/min reads)

## Testing

- [x] Unit test `CreateComment` use case (success, empty body, non-team-member)
- [x] Unit test `UpdateComment` use case (success, non-author, not-found)
- [x] Unit test `DeleteComment` use case (success, non-author, not-found)
- [x] Unit test `ListIssueComments` use case (success, empty list, soft-delete filtering)
- [x] Unit test `CreateLabel` use case (success, duplicate name)
- [x] Unit test `UpdateLabel` use case (success, name conflict)
- [x] Unit test `DeleteLabel` use case (success, cascade to junction rows)
- [x] Unit test `AttachLabel` use case (success, duplicate attachment)
- [x] Unit test `DetachLabel` use case (success, not found)
- [x] Unit test `AddWatcher` use case (success, self-watch, duplicate, non-team-member)
- [x] Unit test `RemoveWatcher` use case (success, not found)
- [x] Integration test comment repository (CRUD, soft-delete)
- [x] Integration test label repository (CRUD, soft-delete, cascade)
- [x] Integration test watcher repository (CRUD, unique constraint)
- [x] Integration test comment API endpoints via Fastify inject
- [x] Integration test label API endpoints via Fastify inject
- [x] Integration test watcher API endpoints via Fastify inject

## Review

- [x] Verify all new tables have correct indexes and unique constraints
- [x] Verify error responses match existing format (consistent code, message, details)
- [x] Verify all domain errors are caught and mapped to correct HTTP status codes in controllers
- [x] Verify no breaking changes to existing issue endpoints
