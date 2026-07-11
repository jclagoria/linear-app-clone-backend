# Backend Modules - Technology Agnostic Specification

> Each module is described by its **responsibility**, **behavior**, and **atomic parts** without referencing specific technologies.

---

## Module Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND SYSTEM                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │    Auth     │  │   Identity  │  │    Work     │           │
│  │   Module    │  │   Module    │  │   Module    │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │  Workflow   │  │   Project   │  │    Cycle    │           │
│  │   Module    │  │   Module    │  │   Module    │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │
│  │ Notification│  │   Gateway   │  │   Shared    │           │
│  │   Module    │  │   Module    │  │   Module    │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

# 1. Auth Module

## Purpose
Manage user authentication, session lifecycle, and token-based access control.

## Responsibility
- Validate user credentials
- Issue and refresh access tokens
- Terminate sessions securely
- Manage active sessions (list, revoke, evict)
- Enforce authentication policies

---

## Storage Model

Auth Module owns the `sessions` table for tracking active user sessions.

**`sessions` — Active user sessions:**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → users(id) |
| `refresh_token_hash` | VARCHAR(255) | Hashed refresh token |
| `ip_address` | VARCHAR(45) | Client IP (IPv4 or IPv6) |
| `user_agent` | TEXT | Client device/browser info |
| `remember_me` | BOOLEAN | Whether "Remember Me" was used |
| `created_at` | TIMESTAMP | Session creation time |
| `last_activity_at` | TIMESTAMP | Last token refresh time |
| `expires_at` | TIMESTAMP | Session expiration time |

---

## Atomic Parts

### 1.1 Registration

**Behavior:** Create a new user account from provided credentials.

| Aspect | Description |
|--------|-------------|
| Input | Email, name, password |
| Validation | Email format, email uniqueness, password strength |
| Side Effects | Password hashed, user record created, tokens issued |
| Output | User object, access token, refresh token |
| Errors | Invalid email, duplicate email, weak password |

**Rules:**
- Email must be unique across the system
- Password must meet minimum complexity requirements
- Password is never stored in plain text
- Tokens are issued upon successful registration

---

### 1.2 Login

**Behavior:** Authenticate an existing user and issue session tokens.

| Aspect | Description |
|--------|-------------|
| Input | Email, password, remember_me (optional, default: false) |
| Validation | Email exists, password matches hash |
| Side Effects | Session record created, login event emitted, session limit enforced |
| Output | User object, access token, refresh token |
| Errors | Invalid credentials, account not found |

**Rules:**
- Failed attempts are tracked for rate limiting
- Successful login creates a session record with device info (IP, user agent)
- If `remember_me` is true, refresh token expires in 30 days; otherwise 7 days
- Access token always expires in 15 minutes regardless of remember_me
- If session limit (10) would be exceeded, oldest session by `last_activity_at` is evicted
- Login event is emitted for audit logging

---

### 1.3 Token Refresh

**Behavior:** Exchange a valid refresh token for a new token pair.

| Aspect | Description |
|--------|-------------|
| Input | Refresh token |
| Validation | Token exists, not expired, not revoked |
| Side Effects | Old refresh token invalidated, new tokens issued |
| Output | New access token, new refresh token |
| Errors | Invalid token, expired token, revoked token |

**Rules:**
- Refresh tokens are single-use (rotation)
- Old token is invalidated when new one is issued
- Token expiry is enforced

---

### 1.4 Logout

**Behavior:** Terminate the current session and invalidate tokens.

| Aspect | Description |
|--------|-------------|
| Input | Session identifier (from token) |
| Validation | Session exists |
| Side Effects | Session deleted, refresh token invalidated |
| Output | Confirmation |
| Errors | Session not found |

**Rules:**
- Logout is idempotent (calling twice is safe)
- Refresh token cannot be used after logout

---

### 1.5 Token Validation

**Behavior:** Verify that an access token is valid and extract claims.

| Aspect | Description |
|--------|-------------|
| Input | Access token |
| Validation | Token signature, expiry |
| Side Effects | None |
| Output | User ID, expiration time |
| Errors | Invalid signature, expired token, malformed token |

**Rules:**
- Token signature is cryptographically verified
- Expired tokens are rejected
- Token claims are trusted after verification

---

### 1.6 Session List

**Behavior:** Return all active sessions for the authenticated user.

| Aspect | Description |
|--------|-------------|
| Input | User ID (from token) |
| Validation | User exists |
| Side Effects | None |
| Output | List of session objects (id, ip_address, user_agent, created_at, last_activity_at, is_current) |
| Errors | None |

**Rules:**
- Current session is marked with `is_current: true`
- Sessions sorted by `last_activity_at` descending (most recent first)
- Only non-expired sessions are returned
- Includes device info for user to identify sessions

---

### 1.7 Session Revoke

**Behavior:** Revoke a specific session (remove a device).

| Aspect | Description |
|--------|-------------|
| Input | Session ID, User ID (from token) |
| Validation | Session exists, belongs to user |
| Side Effects | Session deleted, refresh token invalidated |
| Output | Confirmation |
| Errors | Session not found, not your session |

**Rules:**
- Users can only revoke their own sessions
- Revoking the current session is equivalent to logout
- Revoked session's refresh token cannot be used
- Session revocation event emitted for audit

---

### 1.8 Revoke All Sessions

**Behavior:** Revoke all sessions except the current one (logout-all / sign out everywhere).

| Aspect | Description |
|--------|-------------|
| Input | User ID (from token) |
| Validation | User exists |
| Side Effects | All other sessions deleted, refresh tokens invalidated |
| Output | Count of revoked sessions |
| Errors | None |

**Rules:**
- Current session is preserved (user stays logged in)
- All other sessions for this user are revoked
- Revocation event emitted for audit
- Idempotent — calling again revokes nothing (only current session remains)

---

## Token Structure

```
Access Token Claims:
  - sub: User ID
  - iat: Issued at
  - exp: Expiration (15 minutes)
  - type: "access"

Refresh Token Claims:
  - sub: User ID
  - jti: Unique token ID
  - iat: Issued at
  - exp: Expiration (7 days)
  - type: "refresh"
```

---

## Security Policies

| Policy | Rule |
|--------|------|
| Password Hashing | One-way hash with salt, never reversible |
| Token Expiry | Access: 15min, Refresh: 7 days (30 days with Remember Me) |
| Rate Limiting | Login: 5/min per IP, Register: 3/min per IP, Refresh: 10/min per user (see Shared Module 9.2) |
| Token Rotation | Refresh token is single-use |
| Session Limit | Maximum 10 active sessions per user |
| Session Eviction | When limit exceeded, evict session with oldest `last_activity_at` |
| Remember Me | Extends refresh token to 30 days; access token stays 15min |

---

## User Entity Ownership

The Auth Module owns the `users` table and is responsible for user creation (registration) and credential management. The Identity Module manages user profile fields (name, avatar) and organizational/team membership. Both modules operate on the same `users` record — Auth writes at creation; Identity writes on profile updates.

- Auth controls: `email`, `password_hash`, `created_at`
- Identity controls: `name`, `avatar_url`
- Auth publishes `UserRegistered` and `UserLoggedIn` events; Identity consumes these to initialize profile defaults and provide user data to downstream modules (Work, Project, Cycle, Notification).

---
---

# 2. Identity Module

## Purpose
Manage user profiles, organizational structure, and team membership.

## Responsibility
- Store and retrieve user profiles
- Create and manage organizations
- Create and manage teams
- Handle team membership

---

## Atomic Parts

### 2.1 User Profile Management

**Behavior:** Create, read, update user profile information.

| Aspect | Description |
|--------|-------------|
| Operations | Get profile, Update profile |
| Input | User ID, profile fields (name, avatar) |
| Validation | Name length, avatar URL format |
| Side Effects | Profile updated, update event emitted |
| Output | Updated user object |
| Errors | User not found, invalid fields |

**Rules:**
- Users can only update their own profile
- Email changes require verification (future)
- Avatar URL must be valid format

---

### 2.2 Organization Management

**Behavior:** Create and manage organizational units.

| Aspect | Description |
|--------|-------------|
| Operations | Create org, Get org, List user's orgs |
| Input | Organization name |
| Validation | Name uniqueness per user context |
| Side Effects | Organization created, creator becomes admin |
| Output | Organization object |
| Errors | Invalid name, duplicate name |

**Rules:**
- Organization name must be unique
- Creator is automatically an admin member
- Organizations are containers for teams
- Deletion is soft (deletedAt) — only org owner can delete
- Child teams are soft-deleted cascade
- Members are removed on deletion

---

### 2.3 Team Management

**Behavior:** Create and manage teams within organizations.

| Aspect | Description |
|--------|-------------|
| Operations | Create team, Get team, List org teams |
| Input | Organization ID, team name, team key |
| Validation | Key uniqueness within org, name format |
| Side Effects | Team created, creator becomes member |
| Output | Team object |
| Errors | Invalid key, duplicate key, org not found |

**Rules:**
- Team key must be unique within organization
- Key is used as issue prefix (e.g., ENG-123)
- Creator is automatically a team member
- Deletion is soft (deletedAt) — only team admin can delete
- Issues are reassigned to no team (teamId = null)
- Members are removed on deletion

---

### 2.4 Team Membership

**Behavior:** Add and remove users from teams.

| Aspect | Description |
|--------|-------------|
| Operations | Add member, Remove member, List members |
| Input | Team ID, User ID |
| Validation | User exists, team exists, not already member |
| Side Effects | Membership record created/deleted |
| Output | Membership confirmation |
| Errors | User not found, team not found, already member |

**Rules:**
- Users can belong to multiple teams
- Removing a member does not delete their issues
- Only team admins can manage membership

---

## Entity Relationships

```
Organization
  ├── has many Teams
  └── has many Members (Users)

Team
  ├── belongs to Organization
  ├── has many Members (Users)
  └── has many Issues

User (owned by Auth Module, profile managed by Identity Module)
  ├── has many Organization Memberships
  └── has many Team Memberships
```

---
---

# 3. Work Module

## Purpose
Manage the core work items: issues, comments, and labels.

## Responsibility
- Create, update, delete issues
- Manage issue metadata (priority, assignee, labels)
- Manage issue watchers
- Handle comments on issues
- Manage label definitions

---

## Storage Model

Work Module owns the following tables for issue-related data.

**`issue_watchers` — Users watching an issue for updates:**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `issue_id` | UUID | FK → issues(id) |
| `user_id` | UUID | FK → users(id) |
| `created_at` | TIMESTAMP | When user started watching |

Unique constraint: `(issue_id, user_id)`

**Watcher Rules:**
- Issue creator is auto-added as watcher on creation
- Assignee is auto-added as watcher on assignment
- Assignee is auto-removed on unassign (unless they manually watched)
- Users can manually watch/unwatch any issue they have team access to
- Watching is per-issue only — no project-wide or cycle-wide watching

---

## Atomic Parts

### 3.1 Issue Creation

**Behavior:** Create a new work item within a team.

| Aspect | Description |
|--------|-------------|
| Input | Team ID, title, optional: description, project, assignee, priority, labels |
| Validation | Team exists, title not empty, assignee is team member |
| Side Effects | Issue created with auto-generated identifier, creation event emitted |
| Output | Issue object with identifier (e.g., ENG-123) |
| Errors | Team not found, invalid assignee, empty title |

**Rules:**
- Identifier is auto-generated from team key + sequence number
- Default status is "Todo"
- Default priority is "No Priority"
- Parent issue must belong to same team (for sub-issues)

**Priority Model (system-wide):**
| Integer | Label | Description |
|---------|-------|-------------|
| 0 | No Priority | Default |
| 1 | Urgent | Must be resolved immediately |
| 2 | High | High importance |
| 3 | Medium | Normal priority |
| 4 | Low | Low importance |

---

### 3.2 Issue Update

**Behavior:** Modify issue metadata.

| Aspect | Description |
|--------|-------------|
| Input | Issue ID, fields to update (title, description, project, priority) |
| Validation | Issue exists, field values valid |
| Side Effects | Fields updated, update event emitted |
| Output | Updated issue object |
| Errors | Issue not found, invalid field values |

**Rules:**
- Only provided fields are updated
- Title cannot be set to empty
- Project change must be valid (project belongs to same team)

---

### 3.3 Issue Status Change

**Behavior:** Transition an issue to a new workflow state.

| Aspect | Description |
|--------|-------------|
| Input | Issue ID, target status |
| Validation | Issue exists, transition is valid per workflow |
| Side Effects | Status updated, `completedAt` set/cleared, status change event emitted |
| Output | Updated issue object |
| Errors | Issue not found, invalid transition |

**Rules:**
- Transitions must follow workflow state machine
- Moving to a `completed` state sets `completedAt` timestamp
- Moving from a `completed` state clears `completedAt`
- Moving to a `canceled` state sets `completedAt`
- For teams using the default workflow, transitions are validated inline (see default map below)
- For teams with custom workflows, Work queries Workflow Module's storage and calls validation service (Section 4.2)
- `completedAt` management uses the Workflow Module's state type to determine which states are `completed`

**Workflow Resolution (how Work determines which transitions are valid):**
1. Query: does team have custom workflow? (`SELECT COUNT(*) FROM workflow_states WHERE team_id = ?`)
2. If no custom workflow → use embedded default transitions (below)
3. If custom workflow exists → query `workflow_transitions` for allowed transitions from current status, then call Workflow Module 4.2 to validate

**Default Workflow (embedded in Work Module, not stored):**
```
Todo (unstarted) → In Progress (in_progress) → In Review (in_progress) → Done (completed)

Any state → Cancelled (canceled)
```

**Boundary:** Work owns the issue entity and the `status`/`completedAt` fields. Workflow owns custom workflow definitions, transition validation for custom workflows, and state history. Work emits `IssueStatusChanged` events; Workflow consumes them for history tracking.

---

### 3.4 Issue Assignment

**Behavior:** Assign or unassign a user to an issue.

| Aspect | Description |
|--------|-------------|
| Input | Issue ID, User ID (or null for unassign) |
| Validation | Issue exists, user is team member (if assigning) |
| Side Effects | Assignee updated, assignment event emitted |
| Output | Updated issue object |
| Errors | Issue not found, user not team member |

**Rules:**
- Assignee must be a member of the issue's team
- Setting assignee to null unassigns the issue
- Assignment change is tracked for notifications

---

### 3.5 Issue Label Management

**Behavior:** Add or remove labels from an issue.

| Aspect | Description |
|--------|-------------|
| Operations | Add label, Remove label, Set labels |
| Input | Issue ID, Label ID |
| Validation | Issue exists, label exists, label belongs to team or org |
| Side Effects | Label association created/deleted |
| Output | Confirmation |
| Errors | Issue not found, label not found |

**Rules:**
- Labels must belong to the same team or be organization-wide
- Duplicate label additions are ignored
- Removing a non-existent label is a no-op

---

### 3.6 Issue Deletion

**Behavior:** Soft-delete an issue.

| Aspect | Description |
|--------|-------------|
| Input | Issue ID |
| Validation | Issue exists |
| Side Effects | `deletedAt` set, deletion event emitted |
| Output | Confirmation |
| Errors | Issue not found |

**Rules:**
- Deletion is soft (record preserved)
- Sub-issues are not automatically deleted
- Deleted issues are excluded from default queries

---

### 3.7 Issue Query

**Behavior:** Retrieve issues with filtering and pagination.

| Aspect | Description |
|--------|-------------|
| Input | Filters (team, status, assignee, project, cycle, labels), pagination cursor, limit |
| Validation | Filter values valid |
| Side Effects | None |
| Output | List of issues, pagination info (hasMore, nextCursor) |
| Errors | Invalid filters |

**Rules:**
- Default sort is by creation date descending
- Cursor-based pagination for consistency
- Maximum 100 issues per request

**Ordering:**
- `sort_order` is per-project — same issue can have different positions in different project views
- Drag-and-drop reordering via PATCH endpoint (update `sort_order`)
- Default sort when no explicit sort: priority desc, then creation date desc
- Sub-issues are ordered after their parent

---

### 3.8 Issue Watch

**Behavior:** Subscribe to real-time updates and notifications for an issue.

| Aspect | Description |
|--------|-------------|
| Input | Issue ID, User ID |
| Validation | Issue exists, user is team member |
| Side Effects | Watcher record created, user subscribed to issue channel |
| Output | Confirmation |
| Errors | Issue not found, user not team member, already watching |

**Rules:**
- User must be a member of the issue's team
- Duplicate watch requests are idempotent (no error, no duplicate record)
- Watching grants: `comment_added` and `statusChanged` notifications
- Watching grants: automatic subscription to `issue:{issueId}` Gateway channel

---

### 3.9 Issue Unwatch

**Behavior:** Unsubscribe from real-time updates and notifications for an issue.

| Aspect | Description |
|--------|-------------|
| Input | Issue ID, User ID |
| Validation | Issue exists, user is watching |
| Side Effects | Watcher record deleted, user unsubscribed from issue channel |
| Output | Confirmation |
| Errors | Issue not found, not watching |

**Rules:**
- Unwatching removes `comment_added` and `statusChanged` notifications for this issue
- Unwatching removes automatic subscription to `issue:{issueId}` Gateway channel
- Does not affect assignment — unassigning removes watcher only if user didn't manually watch

---

### 3.10 Issue Watchers Query

**Behavior:** List all watchers of an issue.

| Aspect | Description |
|--------|-------------|
| Input | Issue ID |
| Validation | Issue exists |
| Side Effects | None |
| Output | List of user IDs watching the issue |
| Errors | Issue not found |

---

## Comment Sub-Module

### 3.11 Comment Creation

**Behavior:** Add a comment to an issue.

| Aspect | Description |
|--------|-------------|
| Input | Issue ID, User ID, body text |
| Validation | Issue exists, body not empty |
| Side Effects | Comment created, comment event emitted |
| Output | Comment object |
| Errors | Issue not found, empty body |

**Rules:**
- Comment body supports Markdown
- Author is automatically set from authenticated user
- Comment is timestamped on creation

---

### 3.12 Comment Update

**Behavior:** Edit an existing comment.

| Aspect | Description |
|--------|-------------|
| Input | Comment ID, User ID, new body |
| Validation | Comment exists, user is author |
| Side Effects | Comment updated |
| Output | Updated comment object |
| Errors | Comment not found, not author |

**Rules:**
- Only the author can edit their comment
- Update timestamp is refreshed
- Comments are append-only — no delete operation
- Author can edit but not delete

---

### 3.13 Comment Query

**Behavior:** List comments for an issue.

| Aspect | Description |
|--------|-------------|
| Input | Issue ID |
| Validation | Issue exists |
| Side Effects | None |
| Output | List of comments, ordered by creation date |
| Errors | Issue not found |

**Rules:**
- Comments are returned in chronological order
- Includes author information

---

## Label Sub-Module

### 3.14 Label Creation

**Behavior:** Create a new label for categorization.

| Aspect | Description |
|--------|-------------|
| Input | Team ID, name, color |
| Validation | Name uniqueness within team, color format |
| Side Effects | Label created |
| Output | Label object |
| Errors | Duplicate name, invalid color |

**Rules:**
- Label names are unique per team
- Color is stored as hex code
- Labels can be team-scoped or organization-scoped

---

### 3.15 Label Query

**Behavior:** List available labels.

| Aspect | Description |
|--------|-------------|
| Input | Team ID |
| Validation | Team exists |
| Side Effects | None |
| Output | List of labels |
| Errors | Team not found |

**Rules:**
- Returns both team labels and organization labels
- Sorted by name

---
---

# 4. Workflow Module

## Purpose
Define and enforce issue status workflows and state transitions.

## Responsibility
- Define workflow states for teams (CRUD API)
- Enforce valid state transitions (called by Work Module)
- Track state history (consumes Work events)

**Boundary:** Workflow is a standalone module with its own API and storage. Work Module embeds the default workflow inline; teams with custom workflows configure them via Workflow's API. Work calls Workflow synchronously for validation; Workflow consumes Work events asynchronously for history tracking.

---

## Storage Model

Workflow Module owns two tables for custom workflow configuration. The default workflow is not stored — it lives in Work Module's application code.

**`workflow_states` — Custom workflow states per team:**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `team_id` | UUID | FK → teams(id) |
| `name` | VARCHAR(50) | State name (e.g., "In Review", "Code Review") |
| `state_type` | VARCHAR(20) | `unstarted`, `in_progress`, `completed`, `canceled` |
| `position` | INTEGER | Ordering within team's workflow |
| `created_at` | TIMESTAMP | Creation time |

Unique constraint: `(team_id, name)`

**`workflow_transitions` — Allowed transitions per team:**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `team_id` | UUID | FK → teams(id) |
| `from_state` | VARCHAR(50) | Source state name, or `*` for "any state" |
| `to_state` | VARCHAR(50) | Target state name, or `*` for "any target" |
| `created_at` | TIMESTAMP | Creation time |

Unique constraint: `(team_id, from_state, to_state)`

**State Lifecycle Rules:**
- States can only be removed if no issues currently reference them (use `state_type` to filter active issues by status)
- If an issue references a removed state, it retains its `status` value but is considered "orphaned" — it cannot transition until reassigned to a valid state
- States can be reordered (position updated) without affecting issues
- Renaming a state is not supported — create a new state and reassign issues

**Work Module Query Path:**
1. On status change, Work checks if team has custom workflow: `SELECT COUNT(*) FROM workflow_states WHERE team_id = ?`
2. If count = 0 → use embedded default transitions
3. If count > 0 → query `workflow_transitions` for valid transitions, call Workflow Module 4.2 for validation

---

## Atomic Parts

### 4.1 Workflow Definition

**Behavior:** Define the set of available states for a team. This is the CRUD API for custom workflow configuration.

| Aspect | Description |
|--------|-------------|
| Input | Team ID, list of states with names and types |
| Validation | Team exists, states have valid types |
| Side Effects | Workflow states created/updated |
| Output | Workflow configuration |
| Errors | Team not found, invalid state types |

**State Types:**
- `unstarted` — Not yet begun (e.g., Todo)
- `in_progress` — Currently being worked on
- `completed` — Finished work
- `canceled` — Abandoned work

**Default Workflow (embedded in Work Module, not stored in Workflow):**
```
Todo (unstarted) → In Progress (in_progress) → In Review (in_progress) → Done (completed)

Any state → Cancelled (canceled)
```

**Custom Workflow:** Teams that need custom states or transitions configure them via this API. When a custom workflow exists for a team, Work Module queries this configuration for validation instead of using the embedded default.

---

### 4.2 State Transition Validation

**Behavior:** Determine if a status change is allowed. Called by Work Module as a synchronous service during status changes.

| Aspect | Description |
|--------|-------------|
| Input | Team ID, current status, target status |
| Validation | Transition exists in workflow definition (custom or default) |
| Side Effects | None |
| Output | Boolean (allowed or not), state type of target status |
| Errors | None (returns false) |

**Rules:**
- Each state defines its allowed next states
- Invalid transitions are rejected
- Returns the target state's type (unstarted/in_progress/completed/canceled) so Work can manage `completedAt`
- Transitions are logged for audit

---

### 4.3 State History Tracking

**Behavior:** Record when status changes occur. Written asynchronously by consuming `IssueStatusChanged` events from Work Module.

| Aspect | Description |
|--------|-------------|
| Input | Issue ID, old status, new status, user ID, timestamp (from event) |
| Validation | Issue exists |
| Side Effects | History record created |
| Output | None |
| Errors | None |

**Rules:**
- Every status change is recorded
- History includes timestamp and user who made change
- History is append-only
- Written asynchronously via event consumption, not synchronously during the status change
- **Scope:** Status changes only — title, description, assignee, priority, and label changes are NOT tracked (out of scope for v1)

---
---

# 5. Project Module

## Purpose
Manage projects as containers for related issues.

## Responsibility
- Create and manage projects
- Track project progress
- Associate issues with projects

---

## Atomic Parts

### 5.1 Project Creation

**Behavior:** Create a new project.

| Aspect | Description |
|--------|-------------|
| Input | Team ID, name, description, start date, target date |
| Validation | Team exists, name not empty, dates valid |
| Side Effects | Project created with "Planned" status |
| Output | Project object |
| Errors | Team not found, invalid dates |

**Rules:**
- Project belongs to one team
- Default status is "Planned"
- Target date must be after start date (if both provided)
- No hard delete — use status "Canceled" only
- Issues remain but project association is set to null

---

### 5.2 Project Update

**Behavior:** Modify project metadata.

| Aspect | Description |
|--------|-------------|
| Input | Project ID, fields to update |
| Validation | Project exists, field values valid |
| Side Effects | Fields updated |
| Output | Updated project object |
| Errors | Project not found, invalid values |

**Rules:**
- Status changes follow project lifecycle
- Name cannot be set to empty

---

### 5.3 Project Status Management

**Behavior:** Transition project through its lifecycle.

| Aspect | Description |
|--------|-------------|
| Input | Project ID, target status |
| Validation | Project exists, transition valid |
| Side Effects | Status updated |
| Output | Updated project object |
| Errors | Project not found, invalid transition |

**Project Lifecycle:**
```
Planned → In Progress → Completed
                    ↓
                Canceled
```

**Rules:**
- Can move from Planned to In Progress
- Can move from In Progress to Completed or Canceled
- Cannot reopen Completed projects

---

### 5.4 Project Progress Calculation

**Behavior:** Calculate completion percentage based on issues.

| Aspect | Description |
|--------|-------------|
| Input | Project ID |
| Validation | Project exists |
| Side Effects | None |
| Output | Progress percentage (0-100) |
| Errors | Project not found |

**Rules:**
- Progress = (completed issues / total issues) * 100
- Only counts issues directly in the project (not sub-issues)
- Returns 0 if no issues exist

---

### 5.5 Issue-Project Association

**Behavior:** Link or unlink issues to a project.

| Aspect | Description |
|--------|-------------|
| Operations | Add issue, Remove issue |
| Input | Project ID, Issue ID |
| Validation | Both exist, belong to same team |
| Side Effects | Issue's projectId updated |
| Output | Confirmation |
| Errors | Not found, team mismatch |

**Rules:**
- Issue and project must belong to same team
- Issue can belong to at most one project
- Removing association sets issue's projectId to null

---
---

# 6. Cycle Module

## Purpose
Manage time-boxed iterations (sprints) for planning work.

## Responsibility
- Create and manage cycles
- Activate and complete cycles
- Assign issues to cycles

---

## Atomic Parts

### 6.1 Cycle Creation

**Behavior:** Create a new cycle for a team.

| Aspect | Description |
|--------|-------------|
| Input | Team ID, name, description, start date, end date |
| Validation | Team exists, dates valid, no overlapping active cycles |
| Side Effects | Cycle created with "Draft" status |
| Output | Cycle object |
| Errors | Team not found, invalid dates, active cycle exists |

**Rules:**
- Only one cycle can be active at a time per team
- End date must be after start date
- Default status is "Draft"
- No minimum or maximum duration
- No backdating — start date must be today or future
- Overlap checked only for active cycles
- Dates modifiable in Draft only
- Unlimited Draft cycles per team — only one Active at a time
- Completed cycles unlimited
- Draft cycles can be deleted or canceled before activation

---

### 6.2 Cycle Activation

**Behavior:** Start a cycle and make it active.

| Aspect | Description |
|--------|-------------|
| Input | Cycle ID |
| Validation | Cycle exists, status is "Draft", no other active cycle |
| Side Effects | Status changed to "Active", previous active cycle auto-completed |
| Output | Updated cycle object |
| Errors | Cycle not found, not draft, another cycle active |

**Rules:**
- Activating a cycle auto-completes any currently active cycle
- Issues can now be assigned to this cycle
- Start date is set to activation time if in Draft

---

### 6.3 Cycle Completion

**Behavior:** Mark a cycle as completed.

| Aspect | Description |
|--------|-------------|
| Input | Cycle ID |
| Validation | Cycle exists, status is "Active" |
| Side Effects | Status changed to "Completed" |
| Output | Updated cycle object |
| Errors | Cycle not found, not active |

**Rules:**
- Completed cycles cannot be reactivated
- Issues remain in their current status
- Completion event is emitted

---

### 6.4 Cycle Issue Assignment

**Behavior:** Add or remove issues from a cycle.

| Aspect | Description |
|--------|-------------|
| Operations | Add issue, Remove issue |
| Input | Cycle ID, Issue ID |
| Validation | Cycle exists, issue exists, same team |
| Side Effects | Issue's cycleId updated |
| Output | Confirmation |
| Errors | Not found, team mismatch |

**Rules:**
- Only active cycles accept new issues
- Removing an issue does not change its status
- Issues can only be in one cycle at a time

---

### 6.5 Cycle Metrics

**Behavior:** Calculate statistics for a cycle.

| Aspect | Description |
|--------|-------------|
| Input | Cycle ID |
| Validation | Cycle exists |
| Side Effects | None |
| Output | Metrics object (total issues, completed, in progress, etc.) |
| Errors | Cycle not found |

**Metrics:**
- Total issues in cycle
- Completed issues
- In progress issues
- Completion percentage
- Velocity (completed / total)

---
---

# 7. Notification Module

## Purpose
Manage user notifications and real-time alerts.

## Responsibility
- Create notifications for relevant events
- Deliver notifications to users based on watcher/assignment status
- Track notification read status

---

## Notification Recipients by Event

| Event | Recipients | Source |
|-------|-----------|--------|
| `issue_assigned` | Assignee only | Issue assignment |
| `issue_mentioned` | Mentioned users only | Comment @mention |
| `comment_added` | All issue watchers | `issue_watchers` table |
| `statusChanged` | All issue watchers | `issue_watchers` table |
| `cycle_started` | All team members | Team membership |
| `cycle_completed` | All team members | Team membership |

---

## Atomic Parts

### 7.1 Notification Creation

**Behavior:** Create a notification for a user.

| Aspect | Description |
|--------|-------------|
| Input | User ID, type, title, body, link |
| Validation | User exists, type valid |
| Side Effects | Notification created |
| Output | Notification object |
| Errors | User not found, invalid type |

**Notification Types:**
- `issue_assigned` — User assigned to issue
- `issue_mentioned` — User mentioned in comment
- `comment_added` — New comment on issue
- `cycle_started` — Cycle activated
- `cycle_completed` — Cycle completed

**Delivery Semantics:**
- **In-app notifications:** Store-and-forward — stored in database, delivered via WebSocket when user is online
- **WebSocket delivery:** Best-effort — if connection drops, notification is still stored and available on next connection
- **No email/push notifications** in v1 — in-app only
- **Perishable:** Notifications expire after 90 days
- **No retry mechanism** — notifications are stored and available for polling regardless of WebSocket status

---

### 7.2 Notification Retrieval

**Behavior:** Get notifications for a user.

| Aspect | Description |
|--------|-------------|
| Input | User ID, filter (read/unread), pagination |
| Validation | User exists |
| Side Effects | None |
| Output | List of notifications, unread count |
| Errors | User not found |

**Rules:**
- Default sort is by creation date descending
- Unread count is included in response

---

### 7.3 Notification Read Status

**Behavior:** Mark notifications as read.

| Aspect | Description |
|--------|-------------|
| Operations | Mark as read, Mark all as read |
| Input | Notification ID or User ID |
| Validation | Notification/user exists |
| Side Effects | `readAt` timestamp set |
| Output | Confirmation |
| Errors | Not found |

**Rules:**
- Marking as read is idempotent
- "Mark all" sets readAt for all unread notifications

---

### 7.4 Notification Preferences

**Behavior:** Manage user notification preferences.

| Aspect | Description |
|--------|-------------|
| Input | User ID, preferences object |
| Validation | User exists, preferences valid |
| Side Effects | Preferences updated |
| Output | Updated preferences |
| Errors | User not found, invalid preferences |

**Preferences:**
- Email notifications enabled/disabled
- In-app notifications enabled/disabled
- Notification types to receive

---
---

# 8. Gateway Module

## Purpose
Handle real-time communication and WebSocket connections.

## Responsibility
- Manage WebSocket connections
- Broadcast events to connected clients
- Handle connection lifecycle

---

## Atomic Parts

### 8.1 Connection Management

**Behavior:** Handle client connection and disconnection.

| Aspect | Description |
|--------|-------------|
| Operations | Connect, Disconnect, Authenticate |
| Input | Connection request, authentication token |
| Validation | Token valid, user exists |
| Side Effects | Connection registered, user marked online |
| Output | Connection ID |
| Errors | Invalid token, user not found |

**Rules:**
- Connections must authenticate within 5 seconds (configurable per deployment)
- Unauthenticated connections are dropped
- Server sends `{ type: "error", message: "..." }` before closing connection
- Multiple connections per user are allowed

---

### 8.2 Event Broadcasting

**Behavior:** Send events to relevant connected clients.

| Aspect | Description |
|--------|-------------|
| Input | Event type, payload, target (user, team, issue) |
| Validation | Event type valid |
| Side Effects | Message sent to matching connections |
| Output | Number of recipients |
| Errors | None |

**Broadcasting Rules:**
- Team events → All team members
- Issue events → Users watching or assigned (looked up from `issue_watchers` table + issue assignee)
- User events → Specific user only

---

### 8.3 Channel Subscription

**Behavior:** Subscribe/unsubscribe to specific channels.

| Aspect | Description |
|--------|-------------|
| Operations | Subscribe, Unsubscribe |
| Input | Connection ID, channel name |
| Validation | Connection exists, channel valid |
| Side Effects | Subscription record updated |
| Output | Confirmation |
| Errors | Connection not found, invalid channel |

**Channel Types:**
- `team:{teamId}` — Team-wide events (auto-subscribed for all team members on connection)
- `issue:{issueId}` — Issue-specific events (auto-subscribed for watchers and assignees via `issue_watchers` table)
- `user:{userId}` — User-specific events (auto-subscribed for the authenticated user)

**Auto-Subscription:** When a user connects, the Gateway automatically subscribes their connection to:
- All `team:{teamId}` channels for teams they belong to
- All `issue:{issueId}` channels for issues they're watching or assigned to (via `issue_watchers` + issue assignee lookup)
- Their own `user:{userId}` channel

---
---

# 9. Shared Module

## Purpose
Provide cross-cutting concerns and shared utilities.

## Responsibility
- Handle common validation patterns
- Provide base error types
- Offer utility functions
- Enforce rate limiting across all endpoints

---

## Atomic Parts

### 9.1 Validation Helpers

**Behavior:** Common validation patterns.

| Helper | Description |
|--------|-------------|
| `isValidEmail` | Validates email format |
| `isValidUUID` | Validates UUID format |
| `isValidHexColor` | Validates hex color code |
| `isValidDate` | Validates date string |
| `isValidUrl` | Validates URL format |

---

### 9.2 Rate Limiting

**Behavior:** Enforce per-endpoint request limits to prevent abuse.

| Aspect | Description |
|--------|-------------|
| Input | Request context (IP, user ID, endpoint) |
| Validation | Counter check against limit |
| Side Effects | Counter incremented, headers added to response |
| Output | Allowed (request proceeds) or Rejected (429) |
| Errors | `RateLimitError` (HTTP 429) |

**Rate Limit Configuration:**

| Endpoint | Limit | Window | Key |
|----------|-------|--------|-----|
| `POST /auth/login` | 5 attempts | 1 minute | Per IP |
| `POST /auth/register` | 3 attempts | 1 minute | Per IP |
| `POST /auth/refresh` | 10 attempts | 1 minute | Per user |
| `POST /issues` (create) | 30 requests | 1 minute | Per user |
| `PATCH /issues/:id` (update) | 60 requests | 1 minute | Per user |
| `POST /issues/:id/comments` | 20 requests | 1 minute | Per user |
| General API | 100 requests | 1 minute | Per user |

**Response Headers (every response):**
- `X-RateLimit-Limit` — Maximum requests allowed in window
- `X-RateLimit-Remaining` — Requests remaining in current window
- `X-RateLimit-Reset` — Unix timestamp when window resets

**On Rate Limit Hit:**
- HTTP status: 429
- `Retry-After` header: seconds until window resets
- Error body: `{ "error": { "code": "RATE_LIMITED", "message": "Rate limit exceeded" } }`

**Keying Rules:**
- Auth endpoints (login, register): keyed by client IP (pre-authentication)
- All other endpoints: keyed by authenticated user ID
- Rate limits are per-endpoint, not global — hitting login limit doesn't affect issue creation

**Implementation:** Technology-agnostic — could be Redis, in-memory, or database. Spec defines behavior, not implementation.

---

### 9.2 Error Types

**Behavior:** Standardized error classes.

| Error Type | HTTP Code | Contracts Code | Description |
|------------|-----------|----------------|-------------|
| `NotFoundError` | 404 | `NOT_FOUND` | Entity not found |
| `ValidationError` | 400 | `VALIDATION_ERROR` | Input validation failed |
| `ConflictError` | 409 | `CONFLICT` | Duplicate resource |
| `UnauthorizedError` | 401 | `UNAUTHORIZED` | Authentication required |
| `ForbiddenError` | 403 | `FORBIDDEN` | Insufficient permissions |
| `BusinessRuleError` | 422 | `BUSINESS_RULE_ERROR` | Domain rule violation |
| `RateLimitError` | 429 | `RATE_LIMITED` | Too many requests |
| `InternalError` | 500 | `SERVER_ERROR` | Unexpected server error |

**Error Response Format:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [
      { "field": "title", "message": "Title is required" }
    ]
  }
}
```

**Notes:**
- `InternalError` is a catch-all for unexpected failures — not thrown explicitly by application code
- `BusinessRuleError` (422) is for valid requests that violate domain rules (e.g., invalid workflow transition, state with active issues)
- `details` array is optional — only included for `ValidationError`

---

### 9.3 Pagination Helpers

**Behavior:** Cursor-based pagination utilities.

| Helper | Description |
|--------|-------------|
| `encodeCursor` | Encode pagination cursor |
| `decodeCursor` | Decode pagination cursor |
| `buildPaginationMeta` | Build pagination response |

---

### 9.4 Identifier Generation

**Behavior:** Generate unique identifiers.

| Helper | Description |
|--------|-------------|
| `generateUUID` | Generate version 4 UUID |
| `generateIssueIdentifier` | Generate team-prefixed ID (ENG-123) |
| `generateSlug` | Generate URL-friendly slug |

---
---

# Module Interaction Map

```
┌─────────────────────────────────────────────────────────────────┐
│                         AUTH MODULE                             │
│  Registers users, issues tokens, manages sessions               │
└──────────────────────────┬──────────────────────────────────────┘
                           │ publishes
                           │ UserRegistered, UserLoggedIn
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                       IDENTITY MODULE                           │
│  Manages users, organizations, teams                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │ provides
                           │ User, Team data
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                        WORK MODULE                              │
│  Manages issues, comments, labels                               │
└───────┬──────────────────┬──────────────────┬───────────────────┘
        │                  │                  │
        │ publishes        │ consumes         │ consumes
        │ IssueCreated     │ Team data        │ User data
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   WORKFLOW    │  │    PROJECT    │  │    CYCLE      │
│   MODULE      │  │    MODULE     │  │    MODULE     │
│               │  │               │  │               │
│ Enforces      │  │ Groups issues │  │ Time-boxes    │
│ state changes │  │ into projects │  │ work periods  │
└───────────────┘  └───────────────┘  └───────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │ emits events
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NOTIFICATION MODULE                         │
│  Creates and delivers notifications                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │ sends via
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      GATEWAY MODULE                             │
│  Broadcasts real-time events to clients                         │
└─────────────────────────────────────────────────────────────────┘
```

---
---

# Appendix: Data Flow Examples

## Example 1: Creating an Issue

```
1. Client sends: POST /issues { teamId, title, assigneeId }
2. Auth Module: Validates token, extracts userId
3. Work Module: 
   a. Validates team exists
   b. Validates assignee is team member
   c. Generates identifier (ENG-123)
   d. Creates issue record
   e. Emits IssueCreated event
4. Notification Module:
   a. Receives IssueCreated event
   b. Creates notification for assignee
5. Gateway Module:
   a. Receives notification event
   b. Broadcasts to assignee's connection
6. Response: 201 Created { issue }
```

## Example 2: Changing Issue Status

```
1. Client sends: PATCH /issues/{id}/status { status: "done" }
2. Auth Module: Validates token
3. Work Module:
   a. Fetches issue
   b. Calls Workflow Module to validate transition
   c. Updates status
   d. Sets completedAt timestamp
   e. Emits IssueStatusChanged event
4. Workflow Module:
   a. Validates: In Review → Done is allowed
   b. Returns true
5. Notification Module:
   a. Notifies issue creator
   b. Notifies previously assigned users
6. Gateway Module:
   a. Broadcasts status change to issue watchers
7. Response: 200 OK { issue }
```

## Example 3: Activating a Cycle

```
1. Client sends: POST /cycles/{id}/activate
2. Auth Module: Validates token
3. Cycle Module:
   a. Fetches cycle
   b. Checks no other active cycle for team
   c. If another active cycle exists, completes it
   d. Sets this cycle to Active
   e. Emits CycleActivated event
4. Notification Module:
   a. Notifies all team members
5. Gateway Module:
   a. Broadcasts to team channel
6. Response: 200 OK { cycle }
```
