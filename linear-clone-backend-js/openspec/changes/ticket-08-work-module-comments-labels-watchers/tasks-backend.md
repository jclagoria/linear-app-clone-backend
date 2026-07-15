# Tasks — Work Module: Comments, Labels, and Issue Watchers (Backend)

## Data Layer

### Migrations

- [ ] Create migration: `issue_comments` table (id, issue_id, user_id, body, created_at, updated_at, deleted_at)
- [ ] Create migration: `labels` table (id, name, description, color, created_at, updated_at, deleted_at) with unique index on name
- [ ] Create migration: `issue_watchers` table (id, issue_id, user_id, created_at) with unique constraint on (issue_id, user_id)
- [ ] Create migration: Add unique constraint on (issue_id, label_id) to existing `issue_labels` table

### Domain Entities

- [ ] Define `issueComment` pgTable schema in `src/modules/work/domain/issue-comment.ts`
- [ ] Define `label` pgTable schema in `src/modules/work/domain/label.ts`
- [ ] Define `issueWatcher` pgTable schema in `src/modules/work/domain/issue-watcher.ts`
- [ ] Export new entities from `src/modules/work/domain/index.ts`
- [ ] Add domain error classes to `src/modules/work/domain/errors.ts`: `CommentNotFoundError`, `CommentNotOwnedByUserError`, `LabelNotFoundError`, `LabelNameConflictError`, `LabelAlreadyAttachedError`, `AlreadyWatchingError`, `WatcherNotFoundError`, `EmptyBodyError`

### Repository Ports

- [ ] Define `CommentRepository` port interface in `src/modules/work/application/ports/comment-repository.ts`
- [ ] Define `LabelRepository` port interface in `src/modules/work/application/ports/label-repository.ts`
- [ ] Define `WatcherRepository` port interface in `src/modules/work/application/ports/watcher-repository.ts`

### Repository Implementations

- [ ] Implement `DrizzleCommentRepository` in `src/modules/work/adapters/out/drizzle-comment-repository.ts`
- [ ] Implement `DrizzleLabelRepository` in `src/modules/work/adapters/out/drizzle-label-repository.ts`
- [ ] Implement `DrizzleWatcherRepository` in `src/modules/work/adapters/out/drizzle-watcher-repository.ts`

## Business Logic

### Comment Use Cases

- [ ] Implement `CreateComment` use case in `src/modules/work/application/create-comment.ts`
- [ ] Implement `UpdateComment` use case in `src/modules/work/application/update-comment.ts`
- [ ] Implement `DeleteComment` use case in `src/modules/work/application/delete-comment.ts`
- [ ] Implement `ListIssueComments` use case in `src/modules/work/application/list-issue-comments.ts`

### Label Use Cases

- [ ] Implement `CreateLabel` use case in `src/modules/work/application/create-label.ts`
- [ ] Implement `UpdateLabel` use case in `src/modules/work/application/update-label.ts`
- [ ] Implement `DeleteLabel` use case in `src/modules/work/application/delete-label.ts`
- [ ] Implement `ListLabels` use case in `src/modules/work/application/list-labels.ts`

### Label Assignment Use Cases

- [ ] Implement `AttachLabel` use case in `src/modules/work/application/attach-label.ts`
- [ ] Implement `DetachLabel` use case in `src/modules/work/application/detach-label.ts`
- [ ] Implement `GetIssueLabels` use case in `src/modules/work/application/get-issue-labels.ts`

### Watcher Use Cases

- [ ] Implement `AddWatcher` use case in `src/modules/work/application/add-watcher.ts`
- [ ] Implement `RemoveWatcher` use case in `src/modules/work/application/remove-watcher.ts`
- [ ] Implement `ListWatchers` use case in `src/modules/work/application/list-watchers.ts`

## API Layer

### DTOs

- [ ] Add comment request/response schemas to `src/modules/work/adapters/in/dto.ts` (CreateComment, UpdateComment, CommentResponse, CommentIdParams)
- [ ] Add label request/response schemas to `src/modules/work/adapters/in/dto.ts` (CreateLabel, UpdateLabel, LabelResponse, LabelIdParams)
- [ ] Add watcher request/response schemas to `src/modules/work/adapters/in/dto.ts` (AddWatcher, WatcherResponse, WatcherParams)

### Controllers

- [ ] Implement `commentRoutes` in `src/modules/work/adapters/in/comment-controller.ts`
  - GET `/issues/:id/comments` — List comments
  - POST `/issues/:id/comments` — Create comment
  - PATCH `/issues/:id/comments/:commentId` — Update comment
  - DELETE `/issues/:id/comments/:commentId` — Delete comment
- [ ] Implement `labelRoutes` in `src/modules/work/adapters/in/label-controller.ts`
  - GET `/labels` — List labels
  - POST `/labels` — Create label
  - PATCH `/labels/:id` — Update label
  - DELETE `/labels/:id` — Delete label
  - GET `/issues/:id/labels` — Get issue labels
  - POST `/issues/:id/labels` — Attach label
  - DELETE `/issues/:id/labels/:labelId` — Detach label
- [ ] Implement `watcherRoutes` in `src/modules/work/adapters/in/watcher-controller.ts`
  - GET `/issues/:id/watchers` — List watchers
  - POST `/issues/:id/watchers` — Add watcher
  - DELETE `/issues/:id/watchers/:userId` — Remove watcher
- [ ] Register all new route functions in `src/modules/work/adapters/in/issue-controller.ts` or main app router

## Events / Messaging

- [ ] Add event types to `InMemoryEventPublisher` or create extended publisher
- [ ] Publish `comment.created` event on comment creation
- [ ] Publish `comment.updated` event on comment update
- [ ] Publish `comment.deleted` event on comment deletion
- [ ] Publish `label.created` event on label creation
- [ ] Publish `label.updated` event on label update
- [ ] Publish `label.deleted` event on label deletion
- [ ] Publish `issue.label.attached` event on label attachment
- [ ] Publish `issue.label.detached` event on label detachment
- [ ] Publish `issue.watcher.added` event on watcher addition
- [ ] Publish `issue.watcher.removed` event on watcher removal

## Security

- [ ] Ensure all new endpoints require JWT auth via `getUserIdFromToken`
- [ ] Add team membership checks for comment creation and watcher/watcher-add operations
- [ ] Add ownership check for comment update/delete (only author may edit/delete)
- [ ] Add rate limiting to all new endpoints (60 req/min mutations, 120 req/min reads)

## Testing

- [ ] Unit test `CreateComment` use case (success, empty body, non-team-member)
- [ ] Unit test `UpdateComment` use case (success, non-author, not-found)
- [ ] Unit test `DeleteComment` use case (success, non-author, not-found)
- [ ] Unit test `ListIssueComments` use case (success, empty list, soft-delete filtering)
- [ ] Unit test `CreateLabel` use case (success, duplicate name)
- [ ] Unit test `UpdateLabel` use case (success, name conflict)
- [ ] Unit test `DeleteLabel` use case (success, cascade to junction rows)
- [ ] Unit test `AttachLabel` use case (success, duplicate attachment)
- [ ] Unit test `DetachLabel` use case (success, not found)
- [ ] Unit test `AddWatcher` use case (success, self-watch, duplicate, non-team-member)
- [ ] Unit test `RemoveWatcher` use case (success, not found)
- [ ] Integration test comment repository (CRUD, soft-delete)
- [ ] Integration test label repository (CRUD, soft-delete, cascade)
- [ ] Integration test watcher repository (CRUD, unique constraint)
- [ ] Integration test comment API endpoints via Fastify inject
- [ ] Integration test label API endpoints via Fastify inject
- [ ] Integration test watcher API endpoints via Fastify inject

## Review

- [ ] Verify all new tables have correct indexes and unique constraints
- [ ] Verify error responses match existing format (consistent code, message, details)
- [ ] Verify all domain errors are caught and mapped to correct HTTP status codes in controllers
- [ ] Verify no breaking changes to existing issue endpoints
