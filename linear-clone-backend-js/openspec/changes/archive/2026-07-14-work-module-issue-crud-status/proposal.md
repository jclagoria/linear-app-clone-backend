# Work Module — Issue CRUD & Status

## Problem Statement

The backend currently has no issue management capability. Users cannot create, update, delete, or query issues — the core entity of the Linear workflow. The Identity module (teams, memberships, organizations) is in place, but the Work module that depends on it is entirely missing.

## Motivation

Issues are the central entity users interact with daily. Without issue CRUD, status transitions, assignment, and filtered queries, the application cannot support any project management workflow. This change delivers the foundational layer that all higher-level features (cycles, projects, comments, labels, notifications) will build upon.

## Scope

- **In scope**:
  - Issue creation with auto-generated identifiers (team key + sequence, e.g., `ENG-123`)
  - Issue update with partial field updates and title validation
  - Issue status changes following the default workflow (Todo → In Progress → In Review → Done, any → Cancelled)
  - Automatic `completedAt` timestamp management on status transitions
  - Issue assignment/unassignment with team membership validation
  - Soft-deletion of issues (`deletedAt` timestamp)
  - Cursor-based paginated issue queries with filters (team, status, assignee, project, cycle, labels)
  - Maximum 100 issues per request
  - Default priority "No Priority" (0) and default status "Todo" on creation

- **Out of scope**:
  - Issue comments (separate ticket)
  - Issue labels and label management (separate ticket)
  - Issue watchers / notifications (separate ticket)
  - Custom workflows beyond the default (separate ticket)
  - Sub-issue ordering and drag-and-drop reordering (separate ticket)
  - Cycle and project modules (separate tickets)

## Impact

- **New module**: `src/modules/work/` following hexagonal architecture (domain/application/adapters)
- **Database**: New `issues` table with Drizzle schema + migration
- **Identity dependency**: Validates team membership for assignee and project constraints — depends on Identity module interfaces
- **Auth**: Existing JWT auth middleware secures all issue endpoints
- **API surface**: ~7 new REST endpoints under `/api/issues`
- **Consumers**: Frontend will consume these endpoints for issue management
