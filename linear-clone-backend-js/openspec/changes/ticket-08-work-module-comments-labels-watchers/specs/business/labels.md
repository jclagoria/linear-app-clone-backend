# Labels — Business Specification

## Behaviour

**Feature:** Label Management

Workspace labels SHALL provide flexible categorical tagging for issues. Any team member SHALL be able to create, update, and delete labels. Labels SHALL have unique names within the workspace.

### Requirement: CreateLabel

#### Scenario: Team member creates a label

- **GIVEN** an authenticated user
- **WHEN** the user sends a POST to `/labels` with a unique name
- **THEN** the label SHALL be created and returned with status 201

#### Scenario: User creates a label with a duplicate name

- **GIVEN** an existing label with name "bug"
- **WHEN** the user sends a POST to `/labels` with name "bug"
- **THEN** the request SHALL be rejected with status 409

### Requirement: UpdateLabel

#### Scenario: Team member updates a label

- **GIVEN** an existing label
- **WHEN** the user sends a PATCH to `/labels/:id` with a new name or color
- **THEN** the label SHALL be updated and returned with status 200

### Requirement: DeleteLabel

#### Scenario: Team member deletes a label

- **GIVEN** an existing label that may be attached to issues
- **WHEN** the user sends a DELETE to `/labels/:id`
- **THEN** the label SHALL be soft-deleted and status 204 returned
- **AND** all issue-label junction rows for this label SHALL also be soft-deleted

**Feature:** Label Assignment

Labels SHALL be attachable to and detachable from issues. An issue MAY have zero or more labels. A label SHALL NOT be attached to the same issue more than once.

### Requirement: AttachLabel

#### Scenario: Team member attaches a label to an issue

- **GIVEN** an existing issue and label, and the user is a team member
- **WHEN** the user sends a POST to `/issues/:id/labels` with a `labelId`
- **THEN** the label SHALL be attached and status 201 returned
- **AND** a `issue.label.attached` event SHALL be published

#### Scenario: Duplicate label attachment

- **GIVEN** a label already attached to an issue
- **WHEN** the user sends a POST to `/issues/:id/labels` with the same `labelId`
- **THEN** the request SHALL be rejected with status 409

### Requirement: DetachLabel

#### Scenario: Team member detaches a label from an issue

- **GIVEN** an existing issue-label attachment
- **WHEN** the user sends a DELETE to `/issues/:id/labels/:labelId`
- **THEN** the label SHALL be detached and status 204 returned
- **AND** a `issue.label.detached` event SHALL be published

## Data Model

### Label

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, default random | |
| name | varchar(100) | NOT NULL, UNIQUE | Display name |
| description | varchar(500) | NULLABLE | Optional description |
| color | varchar(7) | NULLABLE | Hex color (e.g. #ff0000) |
| createdAt | timestamp | NOT NULL, default now | |
| updatedAt | timestamp | NOT NULL, default now | |
| deletedAt | timestamp | NULLABLE | Soft-delete flag |

### IssueLabel (existing junction)

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | UUID | PK, default random | |
| issueId | UUID | NOT NULL, FK -> issues.id | |
| labelId | UUID | NOT NULL, FK -> labels.id | |
| createdAt | timestamp | NOT NULL, default now | |

### Relationships

Issue --N:M--> Label via IssueLabel: An issue can have many labels; a label can be on many issues.
Label (parent) --1:N--> Label (child): Labels MAY support parent-child grouping (future).

## Business Rules

- Label names SHALL be unique across the workspace (case-insensitive).
- Deleting a label SHALL cascade soft-delete all IssueLabel junction rows referencing it.
- An issue SHALL NOT have duplicate label attachments.
- The existing `issue_labels` junction table SHALL be reused for the label assignment feature.
- Mutation events SHALL be published for label create, update, delete, attach, and detach.

## Security

- Authentication: JWT Bearer token REQUIRED for all endpoints.
- Authorization: Any authenticated user MAY create, update, and delete labels.
- Authorization: To attach/detach labels to/from an issue, the user MUST be a member of the issue's team.
- Input validation: Label name MUST be between 1-100 characters.
