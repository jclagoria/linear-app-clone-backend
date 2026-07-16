# Cycle Module — CRUD & Lifecycle

## Problem Statement

The application currently lacks a Cycle module. Issues have a `cycleId` column in the database but there is no `cycles` table, no API endpoints, and no business logic to manage cycles. Users cannot time-box their work into sprints/cycles, activate cycles, or track work across cycle boundaries. The issue CRUD spec references `cycleId` but there is no cycle module to back it.

## Motivation

Cycles are a core time-boxing primitive in task management (analogous to sprints). They allow teams to plan and track work in fixed intervals. This change enables:

- Users to create cycles with defined start/end dates
- Activating a cycle to make it the active time-box for a team
- Completing a cycle when the time-box ends
- Associating issues with cycles for planning and tracking
- Only one active cycle per team to maintain focus
- Foundation for future cycle metrics (velocity, completion rate)

## Scope

- **In scope**:
  - Cycle CRUD (Create, Read, Update, Delete — Draft only)
  - Cycle activation (with auto-complete of previous active cycle)
  - Cycle completion (terminal state, no reactivation)
  - Database schema for the `cycles` table
  - Migration generation for the new table
  - Date validation (no backdating, end after start)
  - Single-active-cycle enforcement per team
  - Integration of cycle queries into existing work module (`cycleId` in issue CRUD)
  - Full test coverage for all use cases

- **Out of scope**:
  - Cycle metrics/velocity (future: Section 6.5)
  - Cycle progress calculation
  - Cycle templates
  - Automated cycle completion (e.g., cron-based)
  - Bulk operations on cycles
  - Cycle-level permissions beyond team membership

## Impact

- **New module**: `src/modules/cycle/` following hexagonal architecture patterns
- **Database**: New `cycles` table with migration; no schema changes to existing tables
- **Work module**: Integrate `cycleId` support in issue CRUD (already spec'd with `cycleId` field)
- **API**: New endpoints under `/api/v1/cycles` and `/api/v1/teams/:teamId/cycles`
- **Authorization**: Team membership checks for all cycle operations
