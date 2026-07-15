# Issue Watchers — Business Specification

## Behaviour

**Feature:** Issue Watchers

Team members SHALL be able to watch and unwatch issues to receive notifications about activity without being directly assigned. A user SHALL watch at most once per issue.

### Requirement: AddWatcher

#### Scenario: Team member starts watching an issue

- **GIVEN** an authenticated user who is a member of the issue's team
- **WHEN** the user sends a POST to `/issues/:id/watchers`
- **THEN** the user SHALL be added as a watcher and status 201 returned
- **AND** a `issue.watcher.added` event SHALL be published

#### Scenario: Non-team member tries to watch

- **GIVEN** an authenticated user who is NOT a member of the issue's team
- **WHEN** the user sends a POST to `/issues/:id/watchers`
- **THEN** the request SHALL be rejected with status 422

#### Scenario: User already watching tries again

- **GIVEN** the authenticated user is already watching the issue
- **WHEN** the user sends a POST to `/issues/:id/watchers`
- **THEN** the request SHALL be rejected with status 409

#### Scenario: Adding another user as watcher

- **GIVEN** an authenticated user
- **WHEN** the user sends a POST to `/issues/:id/watchers` with a `userId` targeting a different team member
- **THEN** the specified user SHALL be added as a watcher
- **AND** a `issue.watcher.added` event SHALL be published

### Requirement: RemoveWatcher

#### Scenario: User stops watching an issue

- **GIVEN** the authenticated user is currently watching the issue
- **WHEN** the user sends a DELETE to `/issues/:id/watchers/:userId`
- **THEN** the watcher SHALL be removed and status 204 returned
- **AND** a `issue.watcher.removed` event SHALL be published

#### Scenario: Removing a watcher that does not exist

- **GIVEN** a user who is NOT currently watching the issue
- **WHEN** the user sends a DELETE to `/issues/:id/watchers/:userId`
- **THEN** the request SHALL be rejected with status 404

### Requirement: ListWatchers

#### Scenario: Viewing watchers of an issue

- **GIVEN** an existing issue
- **WHEN** the user sends a GET to `/issues/:id/watchers`
- **THEN** the list of users watching the issue SHALL be returned with status 200

## Data Model

### IssueWatcher

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, default random | |
| issueId | UUID | NOT NULL, FK -> issues.id | Issue being watched |
| userId | UUID | NOT NULL, FK -> users.id | User watching |
| createdAt | timestamp | NOT NULL, default now | |

**Unique constraint**: (issueId, userId) — a user SHALL watch an issue at most once.

### Relationships

IssueWatcher --N:1--> Issue: A watcher record belongs to one issue.
IssueWatcher --N:1--> User: A watcher record belongs to one user.
Issue --1:N--> IssueWatcher: An issue can have many watchers.
User --1:N--> IssueWatcher: A user can watch many issues.

## Business Rules

- A user SHALL watch an issue at most once (unique constraint on issueId + userId).
- Any team member on the issue's team MAY add themselves as a watcher.
- Any authenticated user MAY add another team member as a watcher.
- A watcher SHALL NOT be deleted when an issue is soft-deleted (orphan rows are acceptable).
- The issue author and assignee SHOULD be auto-subscribed as watchers on issue creation.
- Mutation events SHALL be published for watcher add and remove.

## Security

- Authentication: JWT Bearer token REQUIRED for all endpoints.
- Authorization: To watch/unwatch an issue, the user (or the target user) MUST be a member of the issue's team.
- Input validation: `userId` body field SHALL be a valid UUID if provided.
