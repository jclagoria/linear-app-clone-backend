# Issue Comments — Business Specification

## Behaviour

**Feature:** Issue Comments

Team members SHALL be able to add, edit, and delete comments on issues to facilitate asynchronous discussion. Only the comment author SHALL be able to edit or delete their own comments.

### Requirement: CreateComment

#### Scenario: Team member adds a comment to an issue

- **GIVEN** an authenticated user who is a member of the issue's team
- **WHEN** the user sends a POST to `/issues/:id/comments` with a non-empty body
- **THEN** the comment SHALL be created and returned with status 201
- **AND** a `comment.created` event SHALL be published

#### Scenario: Non-team member tries to comment

- **GIVEN** an authenticated user who is NOT a member of the issue's team
- **WHEN** the user sends a POST to `/issues/:id/comments`
- **THEN** the request SHALL be rejected with status 422

#### Scenario: User tries to comment with empty body

- **GIVEN** an authenticated user
- **WHEN** the user sends a POST to `/issues/:id/comments` with an empty body
- **THEN** the request SHALL be rejected with status 400

### Requirement: UpdateComment

#### Scenario: Author updates their comment

- **GIVEN** an existing comment authored by the authenticated user
- **WHEN** the user sends a PATCH to `/issues/:id/comments/:commentId` with a new body
- **THEN** the comment SHALL be updated and returned with status 200
- **AND** a `comment.updated` event SHALL be published

#### Scenario: Non-author tries to update a comment

- **GIVEN** an existing comment authored by a different user
- **WHEN** the authenticated user sends a PATCH to `/issues/:id/comments/:commentId`
- **THEN** the request SHALL be rejected with status 403

### Requirement: DeleteComment

#### Scenario: Author deletes their comment

- **GIVEN** an existing comment authored by the authenticated user
- **WHEN** the user sends a DELETE to `/issues/:id/comments/:commentId`
- **THEN** the comment SHALL be soft-deleted and status 204 returned
- **AND** a `comment.deleted` event SHALL be published

#### Scenario: Non-author tries to delete a comment

- **GIVEN** an existing comment authored by a different user
- **WHEN** the authenticated user sends a DELETE to `/issues/:id/comments/:commentId`
- **THEN** the request SHALL be rejected with status 403

## Data Model

### IssueComment

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, default random | |
| issueId | UUID | NOT NULL, FK -> issues.id | Parent issue |
| userId | UUID | NOT NULL, FK -> users.id | Comment author |
| body | text | NOT NULL | Markdown content |
| createdAt | timestamp | NOT NULL, default now | |
| updatedAt | timestamp | NOT NULL, default now | |
| deletedAt | timestamp | NULLABLE | Soft-delete flag |

### Relationships

IssueComment --N:1--> Issue: Every comment belongs to exactly one issue.
IssueComment --N:1--> User: Every comment has exactly one author.

## Business Rules

- Comments SHALL be soft-deleted (deletedAt set, row retained).
- Only the comment author MAY edit their own comment body.
- Only the comment author MAY delete their own comment.
- The comment body SHALL NOT be empty or whitespace-only.
- The comment body SHALL NOT exceed 65535 characters.
- Deleting an issue SHOULD cascade soft-delete its comments.
- Mutation events SHALL be published for create, update, and delete.

## Security

- Authentication: JWT Bearer token REQUIRED for all endpoints.
- Authorization: The user MUST be a member of the issue's team to create a comment.
- Authorization: Only the comment author MAY update or delete (ownership check).
- Input validation: Body length and non-empty checks at controller boundary.
