# Ticket 06: Identity Module — Team & Membership

## Problem Statement

Organizations currently lack the ability to create teams — the fundamental organizational unit for grouping users and scoping work. Users cannot form sub-groups within an organization, assign issue prefixes, or manage team-level membership. This prevents the system from supporting multi-team collaboration where issues are scoped to teams with distinct identifiers (e.g., ENG-123, DES-456).

Without teams, the downstream Work Module (LAG-13) has no team context to assign issues to, generate prefix-based identifiers, or enforce membership-based access control.

## Motivation

Teams are the core grouping mechanism in any project management tool. They enable:

- **Issue scoping**: Issues belong to teams and use team keys as prefixes (e.g., `ENG-123`)
- **Membership management**: Users collaborate within teams, with admin-controlled access
- **Organizational structure**: Organizations contain multiple teams, each with its own focus
- **Foundation for downstream modules**: Work (issues), Workflow (custom states), Projects, and Cycles all depend on teams

Delivering this unlocks the next ticket (LAG-13) and is a prerequisite for all team-scoped functionality.

## Scope

- **In scope**:
  - Team entity with unique key within an organization
  - CRUD operations: create, list, get, soft-delete teams
  - Team membership: add/remove members, list members
  - Auto-enrollment of creator as team member
  - Cascade behavior on team deletion (soft-delete members, orphan issues)
  - Authorization: only team admins manage membership; only team admins delete
  - Multi-team membership for users
  - Issues retain their data when a member is removed or team is deleted

- **Out of scope**:
  - Custom workflow states per team (deferred to Workflow Module)
  - Team-level role hierarchy beyond admin/member (deferred)
  - Team invite flows or email notifications (future)
  - Team settings or configuration pages (UI scope)
  - Issue-prefix generation logic itself (handled by Work Module)

## Impact

**Affected modules:**
- **Identity Module** (new): Team management and membership live here
- **Work Module** (downstream, LAG-13): Consumes team data for issue scoping and identifier generation
- **Auth Module**: Identity depends on authenticated user context for all team operations
- **Database**: New `teams` and `team_members` tables required

**Entity relationships added:**
```
Team
  ├── belongs to Organization
  ├── has many Members (Users)
  └── has many Issues (via Work Module, future)
```

**Backward compatibility**: No breaking changes — teams are additive. Existing organizations remain valid with zero teams.
