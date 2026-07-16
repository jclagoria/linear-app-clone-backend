# Project Module — Business Specification

## Behaviour

**Feature:** Project Creation

A user who is a team member SHALL be able to create a project. A project SHALL belong to exactly one team. On creation, the project SHALL have status `Planned`. If both start date and target date are provided, the target date MUST be after the start date.

### Requirement: CreateProject

#### Scenario: Team member creates a project with valid data

- **GIVEN** the user is a member of team `team-1`
- **WHEN** they send a POST request to `/api/v1/projects` with `teamId: "team-1"`, `name: "Sprint 24"`, `description: "Q3 planning"`, `startDate: "2026-01-01"`, `targetDate: "2026-02-01"`
- **THEN** a project is created with status `Planned`
- **AND** the response status is 201

#### Scenario: Non-member tries to create a project

- **GIVEN** the user is NOT a member of team `team-1`
- **WHEN** they send a POST request to `/api/v1/projects` with `teamId: "team-1"`
- **THEN** the response status is 403

#### Scenario: Create project with target date before start date

- **GIVEN** the user is a member of team `team-1`
- **WHEN** they send a POST request to `/api/v1/projects` with `startDate: "2026-02-01"`, `targetDate: "2026-01-01"`
- **THEN** the response status is 422

#### Scenario: Create project with empty name

- **GIVEN** the user is a member of team `team-1`
- **WHEN** they send a POST request to `/api/v1/projects` with `name: ""`
- **THEN** the response status is 400

---

**Feature:** Project Update

A user who is a team member SHALL be able to update project metadata. The name MUST NOT be set to an empty string. Target date SHALL remain after start date if both are present after update.

### Requirement: UpdateProject

#### Scenario: Team member updates project name

- **GIVEN** a project `project-A` exists and the user is a member of its team
- **WHEN** they send a PATCH request to `/api/v1/projects/{projectId}` with `name: "Updated Name"`
- **THEN** the project name is updated
- **AND** the response status is 200

#### Scenario: Team member updates project dates

- **GIVEN** a project `project-A` with `startDate: "2026-01-01"` and the user is a member of its team
- **WHEN** they send a PATCH request with `targetDate: "2026-03-01"`
- **THEN** the target date is updated
- **AND** the response status is 200

#### Scenario: Update project to empty name

- **GIVEN** a project `project-A` exists
- **WHEN** they send a PATCH request with `name: ""`
- **THEN** the response status is 400

#### Scenario: Non-member tries to update project

- **GIVEN** the user is NOT a member of the project's team
- **WHEN** they send a PATCH request to `/api/v1/projects/{projectId}`
- **THEN** the response status is 403

#### Scenario: Update project that doesn't exist

- **GIVEN** no project with ID `non-existent` exists
- **WHEN** they send a PATCH request to `/api/v1/projects/non-existent`
- **THEN** the response status is 404

---

**Feature:** Project Status Lifecycle

Project statuses SHALL follow a lifecycle: `Planned` → `In Progress` → `Completed` or `Canceled`. A `Completed` project MUST NOT be reopened. Only team admins SHALL be able to cancel a project. Canceled projects SHALL not be hard-deleted.

### Requirement: ChangeProjectStatus

#### Scenario: Move from Planned to In Progress

- **GIVEN** a project with status `Planned` and the user is a team member
- **WHEN** they send a PATCH request to `/api/v1/projects/{projectId}/status` with `status: "in_progress"`
- **THEN** the project status is changed to `In Progress`
- **AND** the response status is 200

#### Scenario: Move from In Progress to Completed

- **GIVEN** a project with status `In Progress` and the user is a team member
- **WHEN** they send a PATCH request with `status: "completed"`
- **THEN** the project status is changed to `Completed`
- **AND** the response status is 200

#### Scenario: Admin cancels a project

- **GIVEN** a project with status `In Progress` and the user is a team admin
- **WHEN** they send a PATCH request with `status: "canceled"`
- **THEN** the project status is changed to `Canceled`
- **AND** issues associated with the project have their `projectId` set to null
- **AND** the response status is 200

#### Scenario: Non-admin tries to cancel a project

- **GIVEN** a project with status `In Progress` and the user is a team member (not admin)
- **WHEN** they send a PATCH request with `status: "canceled"`
- **THEN** the response status is 403

#### Scenario: Reopen a completed project

- **GIVEN** a project with status `Completed`
- **WHEN** they send a PATCH request with `status: "in_progress"`
- **THEN** the response status is 422

#### Scenario: Invalid status transition

- **GIVEN** a project with status `Planned`
- **WHEN** they send a PATCH request with `status: "completed"`
- **THEN** the response status is 403

---

**Feature:** Project Progress Calculation

Project progress SHALL be calculated as `(completed issues / total issues) * 100`. Only direct issues SHALL count (not sub-issues). If the project has no issues, progress SHALL be 0.

### Requirement: GetProjectProgress

#### Scenario: Project with some completed issues

- **GIVEN** a project with 10 total issues and 4 completed issues
- **WHEN** they send a GET request to `/api/v1/projects/{projectId}/progress`
- **THEN** the response includes `progress: 40`, `totalIssues: 10`, `completedIssues: 4`

#### Scenario: Project with no issues

- **GIVEN** a project with 0 issues
- **WHEN** they send a GET request to `/api/v1/projects/{projectId}/progress`
- **THEN** the response includes `progress: 0`, `totalIssues: 0`

#### Scenario: Project with all issues completed

- **GIVEN** a project where all issues are completed
- **WHEN** they send a GET request to `/api/v1/projects/{projectId}/progress`
- **THEN** the response includes `progress: 100`

---

**Feature:** Issue-Project Association

An issue SHALL be associated with at most one project. The issue and project MUST belong to the same team. Removing an issue from a project SHALL set `projectId` to null but SHALL NOT delete the issue.

### Requirement: AddIssueToProject

#### Scenario: Link issue to project (same team)

- **GIVEN** issue `issue-A` and project `project-A` both belong to team `team-1`, and `issue-A` has no project
- **WHEN** they send a POST request to `/api/v1/projects/{projectId}/issues` with `issueId: "issue-A"`
- **THEN** `issue-A.projectId` is set to `project-A.id`
- **AND** the response status is 200

#### Scenario: Link issue from different team

- **GIVEN** issue `issue-A` belongs to `team-1` and project `project-A` belongs to `team-2`
- **WHEN** they send a POST request to `/api/v1/projects/{projectId}/issues` with `issueId: "issue-A"`
- **THEN** the response status is 403

#### Scenario: Link issue already associated with another project

- **GIVEN** issue `issue-A` is already associated with project `project-B`
- **WHEN** they send a POST request to `/api/v1/projects/{projectId}/issues` with `issueId: "issue-A"`
- **THEN** the response status is 409

### Requirement: RemoveIssueFromProject

#### Scenario: Unlink issue from project

- **GIVEN** issue `issue-A` is associated with project `project-A`
- **WHEN** they send a DELETE request to `/api/v1/projects/{projectId}/issues/{issueId}`
- **THEN** `issue-A.projectId` is set to null
- **AND** the issue itself is NOT deleted
- **AND** the response status is 200

---

## Data Model

### Project

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `id` | uuid | PK, default gen_random_uuid() | |
| `teamId` | uuid | NOT NULL, FK → teams.id | Immutable after creation |
| `name` | varchar(255) | NOT NULL | |
| `description` | text | NULLABLE | |
| `status` | project_status | NOT NULL, DEFAULT 'planned' | Enum: planned, in_progress, completed, canceled |
| `startDate` | timestamp | NULLABLE | |
| `targetDate` | timestamp | NULLABLE | |
| `createdAt` | timestamp | NOT NULL, DEFAULT now() | |
| `updatedAt` | timestamp | NOT NULL, DEFAULT now() | Auto-updated on change |
| `deletedAt` | timestamp | NULLABLE | Soft delete sentinel |

### Relationships

`Project` *--1--> `Team`: A project belongs to exactly one team.
`Issue` *--0..1--> `Project`: An issue can be associated with at most one project.

## Business Rules

| Rule ID | Description |
|---------|-------------|
| PRJ-S1 | On creation, project status SHALL be `Planned` |
| PRJ-S2 | Status transitions SHALL follow: Planned → In Progress → Completed \| Canceled |
| PRJ-S3 | Completed projects MUST NOT be reopened |
| PRJ-S4 | Only team admins SHALL cancel a project |
| PRJ-D1 | Target date MUST be after start date if both are provided |
| PRJ-D2 | Project name MUST NOT be empty |
| PRJ-P1 | Progress SHALL be `(completedIssues / totalIssues) * 100` |
| PRJ-P2 | Only direct issues count (not sub-issues) |
| PRJ-P3 | Progress SHALL be 0 if no issues exist |
| PRJ-A1 | Issue and project MUST belong to same team for association |
| PRJ-A2 | An issue SHALL belong to at most one project |
| PRJ-A3 | Removing issue-project association SHALL set `projectId` to null |
| PRJ-A4 | Canceled projects SHALL disassociate all issues |
| PRJ-DEL | No hard delete — use `canceled` status |

## Security

- **Authentication**: All endpoints require a valid JWT Bearer token
- **Authorization**:
  - Create/List/Get/Update/GetProgress: Team membership required
  - Cancel project: Team admin role required
  - Issue association: Membership in both the issue's team and project's team (same team constraint)
- **Input validation**: All string inputs trimmed and validated server-side; dates validated for logical consistency
