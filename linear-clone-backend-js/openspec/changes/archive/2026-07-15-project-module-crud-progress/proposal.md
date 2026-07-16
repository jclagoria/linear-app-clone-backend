# Project Module — CRUD & Progress

## Problem Statement

The application currently lacks a Project module. Issues have a `projectId` column in the database but there is no `projects` table, no API endpoints, and no business logic to manage projects. The work module contains a stub `projectQuery` that always returns `null`. Users cannot group related issues into projects, track project progress, or manage project lifecycles.

## Motivation

Projects are a core organizational primitive in task management. They allow users to group related issues, track overall progress, and manage work at a higher level of abstraction. This change enables:

- Users to create and manage projects within a team
- Visual progress tracking (completed vs. total issues)
- Associating issues with projects for organization
- A proper project lifecycle (Planned → In Progress → Completed / Canceled)
- Foundation for future features like project milestones and roadmaps

## Scope

- **In scope**:
  - Project CRUD (Create, Update, Cancel — no hard delete)
  - Project status lifecycle management
  - Project progress calculation (completed / total issues)
  - Issue-Project association (link/unlink within same team)
  - Database schema for the `projects` table
  - Migration generation for the new table
  - Integration of project queries into existing work module (`projectQuery` replacement)
  - Full test coverage for all use cases

- **Out of scope**:
  - Project milestones
  - Project roadmaps / timelines visualization
  - Project templates
  - Project sharing or guest access
  - Bulk operations on projects
  - Project-level permissions beyond team membership
  - Project archiving (use Canceled status instead)

## Impact

- **New module**: `src/modules/project/` following hexagonal architecture patterns
- **Database**: New `projects` table with migration; no schema changes to existing tables
- **Work module**: Replace stub `projectQuery` with real adapter in issue controller
- **API**: New endpoints under `/api/v1/projects` and `/api/v1/projects/:projectId/issues`
- **Authorization**: Team membership checks for all project operations; admin-only for cancellation
