# Graph Report - linear-app-clone-backend  (2026-07-20)

## Corpus Check
- 495 files · ~210,063 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 4974 nodes · 6401 edges · 317 communities (294 shown, 23 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5b51891a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AGENTS.md
- index.ts
- errors.ts
- comment-controller.ts
- index.ts
- watcher-controller.ts
- issue-controller.ts
- LabelRepository
- identity-controller.ts
- Work Module — Backend Design
- controller.ts
- Workflow Module — API Contract
- Behaviour
- Behaviour
- Workflow Module — API Contract
- Behaviour
- Behaviour
- Behaviour
- Behaviour
- OrganizationMemberRepository
- Behaviour
- Behaviour
- Behaviour
- project-controller.ts
- Project Module — API Contract
- Project Module — API Contract
- Behaviour
- Behaviour
- Behaviour
- Behaviour
- Behaviour
- Team & Membership — Backend Design
- TransitionRepository
- Module Contracts & Interactions
- Identity — Backend Design
- Behaviour
- Behaviour
- errors.ts
- Labels — API Contract
- Issues — API Contract
- Cycles — API Contract
- Cycles — API Contract
- Issues — API Contract
- Labels — API Contract
- auth-controller.ts
- create-issue.ts
- Team — API Contract
- API Contracts
- API Contracts
- API Contracts
- Notifications — Backend Design
- Team — API Contract
- devDependencies
- cycle-controller.ts
- TeamMemberQuery
- index.ts
- dependencies
- Identity — API Contract
- API Contracts
- change-project-status.ts
- Requirement: Error Response Consistency
- notification-controller.ts
- Auth Module — Backend Design
- Auth — Session Management Business Specification
- Auth — Session Management Business Specification
- session-controller.ts
- Notifications — API Contract
- Notifications — API Contract
- SessionRepository
- update-notification-preferences.ts
- add-team-member.ts
- errors.ts
- create-project.ts
- IssueRepository
- API Endpoints
- TokenService
- index.ts
- compilerOptions
- Auth — Session Management Backend Design
- Behaviour
- Auth — Backend Design (Cookie Migration)
- Behaviour
- EventPublisher
- StateRepository
- Gateway — WebSocket Protocol Contract
- Gateway — WebSocket Protocol Contract
- change-issue-status.ts
- Endpoint: List Sessions
- Auth Token Refresh & Logout — Backend Design
- Issue Comments — API Contract
- Tasks — Work Module: Comments, Labels, and Issue Watchers (Backend)
- Gateway — Backend Design
- Issue Comments — API Contract
- Endpoint: List Sessions
- EventPublisher
- errors.ts
- CycleRepository
- TeamRepository
- Auth — API Contract
- Shared Module — Backend Design
- Issue Comments — Business Specification
- Issue Watchers — Business Specification
- Auth — API Contract (Cookie Migration)
- Issue Comments — Business Specification
- Issue Watchers — Business Specification
- Auth — Business Specification
- Tasks — Shared Error Types & Rate Limiting (Backend)
- Auth — Business Specification (Cookie Migration)
- Auth — Business Specification
- errors.ts
- index.ts
- Issue Watchers — API Contract
- Issue Identifier Generation — Database Sequence per Team
- Issue Watchers — API Contract
- dto.ts
- Hexagonal Architecture for Identity Module
- Shared Entity Ownership Between Auth and Identity Modules
- Soft Deletion Strategy for All Entities
- Soft-Delete Pattern — `deletedAt` Timestamp
- Cursor-based Pagination — Composite Cursor
- Tasks — Project Module CRUD & Progress (Backend)
- Architecture
- scripts
- refresh-token.ts
- ProjectRepository
- Deployment — Linear App Clone Backend
- Use Hexagonal Architecture
- Use JWT Dual Token Strategy
- Use PostgreSQL with Drizzle ORM
- Use Redis for Session Storage
- Use bcrypt for Password Hashing
- Tasks — Auth Registration Login (Backend)
- Tasks — Identity User Profile & Organization (Backend)
- Tech Selection — Linear App Clone (Backend)
- Use Custom Error Class Hierarchy for Standardized Error Responses
- Use In-Memory Rate Limit Store for MVP
- Team Entity Placement in Identity Module
- Team Key Uniqueness and Validation Strategy
- Soft-Delete Cascade Strategy for Team Deletion
- Tasks — Ticket 06: Identity Module — Team & Membership (Backend)
- Default Workflow Embedding — Hardcoded Status Transitions
- Tasks — Work Module Issue CRUD & Status (Backend)
- ADR-0001: Use Enum for Project Status Instead of Workflow Join Table
- ADR-0002: Compute Project Progress on Read Instead of Storing
- ADR-0003: Canceled as Terminal Status Instead of Hard Delete
- ADR-0001: Embed Default Workflow in Code Rather Than Database
- ADR-0002: Append-Only State History for Audit Trail
- ADR-0003: Cancel State Transitions Bypass All Validation
- Tasks — Gateway WebSocket & Broadcasting (Backend)
- Tasks — Notification Module (Backend)
- index.ts
- NotCycleTeamMemberError
- NotificationRepository
- Architecture — Linear App Clone Backend
- Review — Auth Session Management
- Extend existing work module with subdomains for comments, labels, and watchers
- Soft-delete for comments and labels
- Flat comment threading (no nested replies)
- Tasks — Cycle Module CRUD & Lifecycle (Backend)
- Use `ws` Library for WebSocket Server
- Store Connection and Subscription State In-Memory
- Use In-Process EventEmitter for Event Broadcasting
- Track Online Status in Redis with TTL
- {Domain} — Backend Design
- Linear Clone Backend
- create-notification.ts
- mark-all-notifications-read.ts
- validate-transition.ts
- Atomic Parts
- 3. Work Module
- ADR-0001: Refresh Token Storage in Redis
- Review — Auth Token Refresh & Logout
- Endpoint: Logout
- Tech Selection — Linear App Clone Backend (Auth Token Refresh & Logout)
- Shared Module — Error Contract
- {Domain} — Business Specification
- Deployment
- Endpoint: Logout
- list-notifications.ts
- Review — Auth Registration Login
- Tasks — Auth Session Management (Backend)
- Review — Identity User Profile & Organization
- Review — Shared Error Types & Rate Limiting
- Tasks — Workflow Module: Custom Workflows & Validation (Backend)
- OpenSpec Schema Collection
- Tasks — {Change Title} (Backend)
- package.json
- Projects API
- Workflow API
- login-user.ts
- create-organization.ts
- create-team.ts
- get-project-progress.ts
- get-state-history.ts
- Atomic Parts
- 2. Identity Module
- Atomic Parts
- Atomic Parts
- 7. Notification Module
- Atomic Parts
- Tasks — Auth Token Refresh & Logout (Backend)
- Review — Ticket 06: Identity Module — Team & Membership
- Review — Work Module: Comments, Labels, and Issue Watchers
- Tech Selection — Linear App Clone (Backend)
- Review — Work Module Issue CRUD & Status
- Review — Project Module CRUD & Progress
- Review — Workflow Module: Custom Workflows & Validation
- Review — Cycle Module CRUD & Lifecycle
- Review — Gateway WebSocket & Broadcasting
- Review — Notification Module: Creation & Delivery
- Review — Refresh Token Cookie Migration
- Tasks — Refresh Token Cookie Migration (Backend)
- Review — {Change Title}
- Issues API
- create-cycle.ts
- README.md
- 4. Workflow Module
- Tech Selection — Auth Session Management (Backend)
- Tech Selection — Shared Error Types & Rate Limiting
- Cycles API
- Labels API
- Getting Started
- NotOrganizationMemberError
- validators.ts
- 1. Auth Module
- 8. Gateway Module
- Stack — Linear App Clone Backend
- Tech Selection — Linear App Clone Backend
- Work Module — Comments, Labels, and Issue Watchers
- Tech Selection — Linear App Clone (Backend)
- Project Module — Technology Stack
- Tech Selection — Linear App Clone (Backend)
- Tech Selection — Gateway WebSocket Module (Backend)
- ADR-0002: Synchronous Event Ingestion from Emitting Modules
- Tech Selection — Notification Module (Backend)
- Tech Selection — {Project Name} (Backend)
- Stack
- ADR Manifest — Auth Registration Login
- Auth Module — Registration & Login
- Tech Selection — Linear App Clone Backend
- ADR-0006: Current Session Identification via Refresh Token Hash
- ADR-0007: Session Listing from PostgreSQL Directly
- ADR-0008: Session Limit Enforcement in Use Case Layer
- ADR Manifest — Auth Session Management
- Auth Module — Session Management
- ADR Manifest — Auth Token Refresh & Logout
- Auth Module — Token Refresh & Logout
- ADR Manifest — Identity User Profile & Organization
- Identity Module — User Profile & Organization
- ADR Manifest — Shared Error Types & Rate Limiting
- Shared Module — Error Types & Rate Limiting
- ADR Manifest — Ticket 06: Identity Module — Team & Membership
- Ticket 06: Identity Module — Team & Membership
- ADR Manifest — Work Module: Comments, Labels, and Issue Watchers
- Work Module — Issue CRUD & Status
- ADR Manifest — Project Module CRUD & Progress
- Project Module — CRUD & Progress
- ADR Manifest — Workflow Module: Custom Workflows & Validation
- Workflow Module — Custom Workflows & Validation
- Tech Selection — Workflow Module (Backend)
- ADR-0001: Cycle Auto-Complete on Activation
- ADR-0002: Cycle Status as Database Enum
- ADR Manifest — Cycle Module CRUD & Lifecycle
- Cycle Module — CRUD & Lifecycle
- ADR Manifest — Gateway WebSocket & Broadcasting
- Gateway Module — WebSocket & Broadcasting
- ADR-0001: Store-and-Forward Notification Model
- ADR Manifest — Notification Module: Creation & Delivery
- Notification Module — Creation & Delivery
- ADR Manifest — Refresh Token Cookie Migration
- Backend: Migrate Refresh Token from Response Body to HttpOnly Cookie
- Tech Selection — Refresh Token Cookie Migration (Backend)
- ADR Manifest — {Change Title}
- {Change Title}
- Endpoint: {Name}
- Notifications API
- activate-cycle.test.ts
- Linear App Backend Repository
- ADR Manifest — Work Module Issue CRUD & Status
- Comments API
- ProjectHardDeleteNotAllowedError
- events.ts
- Technology Templates — Backend Schema
- Error Handling
- contract-refresh.test.ts
- CycleQuery
- contract-logout.test.ts
- auth-middleware.ts
- eslint-config-prettier
- @eslint/js
- eslint-plugin-prettier
- eslint.config.js
- README.md
- @types/node
- @types/ws
- typescript
- add-team-member.contract.test.ts
- create-organization.contract.test.ts
- create-team.contract.test.ts
- get-organization.contract.test.ts
- get-profile.contract.test.ts
- get-team-details.contract.test.ts
- list-organizations.contract.test.ts
- list-team-members.contract.test.ts
- list-teams.contract.test.ts
- update-profile.contract.test.ts

## God Nodes (most connected - your core abstractions)
1. `EventPublisher` - 32 edges
2. `SessionRepository` - 29 edges
3. `LabelRepository` - 25 edges
4. `BaseError` - 23 edges
5. `CycleRepository` - 22 edges
6. `API Endpoints` - 22 edges
7. `TeamMemberRepository` - 21 edges
8. `StateRepository` - 21 edges
9. `OrganizationMemberRepository` - 20 edges
10. `TeamRepository` - 20 edges

## Surprising Connections (you probably didn't know these)
- `autoSubscribeUserChannels()` --calls--> `formatChannel()`  [EXTRACTED]
  linear-clone-backend-js/src/modules/gateway/application/auto-subscription.ts → linear-clone-backend-js/src/modules/gateway/domain/channel.ts
- `CreateWorkflowStateInput` --references--> `WorkflowStateType`  [EXTRACTED]
  linear-clone-backend-js/src/modules/workflow/application/create-workflow-state.ts → linear-clone-backend-js/src/modules/workflow/domain/default-workflow.ts
- `UpdateWorkflowStateInput` --references--> `WorkflowStateType`  [EXTRACTED]
  linear-clone-backend-js/src/modules/workflow/application/update-workflow-state.ts → linear-clone-backend-js/src/modules/workflow/domain/default-workflow.ts
- `authRoutes()` --calls--> `clearRefreshTokenCookie()`  [EXTRACTED]
  linear-clone-backend-js/src/modules/auth/adapters/in/auth-controller.ts → linear-clone-backend-js/src/shared/cookie.ts
- `authRoutes()` --calls--> `getRefreshTokenCookie()`  [EXTRACTED]
  linear-clone-backend-js/src/modules/auth/adapters/in/auth-controller.ts → linear-clone-backend-js/src/shared/cookie.ts

## Import Cycles
- None detected.

## Communities (317 total, 23 thin omitted)

### Community 0 - "AGENTS.md"
Cohesion: 0.50
Nodes (3): CodeGraph, graphify, Mandatory Project Rules

### Community 1 - "index.ts"
Cohesion: 0.06
Nodes (41): app, MessageHandler, GatewayWebSocketServer, AuthenticateConnection, autoSubscribeUserChannels(), BroadcastEvent, HandleDisconnect, ManageSubscription (+33 more)

### Community 2 - "errors.ts"
Cohesion: 0.06
Nodes (39): CreateLabelRequestSchema, IssueLabelParamsSchema, LabelIdParamsSchema, UpdateLabelRequestSchema, attachLabel, createLabel, deleteLabel, detachLabel (+31 more)

### Community 3 - "comment-controller.ts"
Cohesion: 0.05
Nodes (33): commentRepository, commentRoutes(), createComment, deleteComment, eventPublisher, getUserIdFromToken(), issueRepository, issueTeamQuery (+25 more)

### Community 4 - "index.ts"
Cohesion: 0.09
Nodes (18): BaseError, BusinessRuleError, ConflictError, errorHandler(), ForbiddenError, InternalError, NotFoundError, RateLimitError (+10 more)

### Community 5 - "watcher-controller.ts"
Cohesion: 0.06
Nodes (28): AddWatcherRequestSchema, WatcherIdParamsSchema, addWatcher, eventPublisher, getUserIdFromToken(), issueTeamQuery, listWatchers, removeWatcher (+20 more)

### Community 6 - "issue-controller.ts"
Cohesion: 0.05
Nodes (47): AddWatcherRequest, AssignIssueRequest, AssignIssueRequestSchema, ChangeIssueStatusRequest, ChangeIssueStatusRequestSchema, CommentIdParams, CommentResponse, CreateCommentRequest (+39 more)

### Community 7 - "LabelRepository"
Cohesion: 0.08
Nodes (17): GetIssueLabels, ListLabels, LabelRepository, issueComments, IssueLabel, issueLabels, NewIssueLabel, DEFAULT_STATUSES (+9 more)

### Community 8 - "identity-controller.ts"
Cohesion: 0.06
Nodes (41): AddTeamMemberRequest, AddTeamMemberRequestSchema, CreateOrganizationRequest, CreateOrganizationRequestSchema, CreateTeamRequest, CreateTeamRequestSchema, ErrorResponse, OrganizationIdParams (+33 more)

### Community 9 - "Work Module — Backend Design"
Cohesion: 0.05
Nodes (41): 1. Extend Existing Module Pattern, 2. Reuse Existing Infrastructure, 3. Soft-Delete for Comments and Labels, 4. Unique Constraints, Add Watcher, API Contracts, Architecture Decisions, Attach Label to Issue (+33 more)

### Community 10 - "controller.ts"
Cohesion: 0.08
Nodes (40): createTransition, createWorkflowState, deleteTransition, deleteWorkflowState, getStateHistory, getUserIdFromToken(), historyRepository, listTransitions (+32 more)

### Community 11 - "Workflow Module — API Contract"
Cohesion: 0.05
Nodes (39): Endpoint: Create Workflow State, Endpoint: Create Workflow Transition, Endpoint: Delete Workflow State, Endpoint: Delete Workflow Transition, Endpoint: Get State History, Endpoint: List Workflow States, Endpoint: List Workflow Transitions, Endpoint: Update Workflow State (+31 more)

### Community 12 - "Behaviour"
Cohesion: 0.05
Nodes (39): Behaviour, Business Rules, Data Model, Relationships, Requirement: CreateTransition, Requirement: CreateWorkflowState, Requirement: DefaultTransitions, Requirement: DeleteTransition (+31 more)

### Community 13 - "Behaviour"
Cohesion: 0.05
Nodes (39): Behaviour, Business Rules, Cycle, Cycles — Business Specification, Data Model, Relationships, Requirement: ActivateCycle, Requirement: CompleteCycle (+31 more)

### Community 14 - "Workflow Module — API Contract"
Cohesion: 0.05
Nodes (39): Endpoint: Create Workflow State, Endpoint: Create Workflow Transition, Endpoint: Delete Workflow State, Endpoint: Delete Workflow Transition, Endpoint: Get State History, Endpoint: List Workflow States, Endpoint: List Workflow Transitions, Endpoint: Update Workflow State (+31 more)

### Community 15 - "Behaviour"
Cohesion: 0.05
Nodes (39): Behaviour, Business Rules, Cycle, Cycles — Business Specification, Data Model, Relationships, Requirement: ActivateCycle, Requirement: CompleteCycle (+31 more)

### Community 16 - "Behaviour"
Cohesion: 0.05
Nodes (39): Behaviour, Business Rules, Data Model, Relationships, Requirement: CreateTransition, Requirement: CreateWorkflowState, Requirement: DefaultTransitions, Requirement: DeleteTransition (+31 more)

### Community 17 - "Behaviour"
Cohesion: 0.05
Nodes (38): Behaviour, Business Rules, Data Model, `notification_preferences`, `notifications`, Notifications — Business Specification, Relationships, Requirement: Create notification on cycle completion (+30 more)

### Community 18 - "Behaviour"
Cohesion: 0.05
Nodes (38): Behaviour, Business Rules, Data Model, `notification_preferences`, `notifications`, Notifications — Business Specification, Relationships, Requirement: Create notification on cycle completion (+30 more)

### Community 19 - "OrganizationMemberRepository"
Cohesion: 0.09
Nodes (15): DeleteOrganization, DeleteOrganizationInput, GetOrganizationDetails, GetOrganizationDetailsInput, GetOrganizationDetailsOutput, ListTeamsInput, ListUserOrganizations, ListUserOrganizationsInput (+7 more)

### Community 20 - "Behaviour"
Cohesion: 0.05
Nodes (37): Auth — Business Specification, Behaviour, Business Rules, Data Model, Relationships, Requirement: Credential Validation, Requirement: Email Validation, Requirement: Expiry Check (+29 more)

### Community 21 - "Behaviour"
Cohesion: 0.05
Nodes (37): Behaviour, Business Rules, Data Model, Relationships, Requirement: Add Team Member, Requirement: Create Team, Requirement: Delete Team, Requirement: Get Team Details (+29 more)

### Community 22 - "Behaviour"
Cohesion: 0.05
Nodes (37): Behaviour, Business Rules, Data Model, Relationships, Requirement: Add Team Member, Requirement: Create Team, Requirement: Delete Team, Requirement: Get Team Details (+29 more)

### Community 23 - "project-controller.ts"
Cohesion: 0.08
Nodes (36): AddIssueRequest, AddIssueRequestSchema, ChangeProjectStatusRequest, ChangeProjectStatusRequestSchema, CreateProjectRequest, CreateProjectRequestSchema, ListProjectsQuery, ListProjectsQuerySchema (+28 more)

### Community 24 - "Project Module — API Contract"
Cohesion: 0.05
Nodes (36): Base Path, Common Auth, Endpoint: Add Issue to Project, Endpoint: Change Project Status, Endpoint: Create Project, Endpoint: Get Project, Endpoint: Get Project Progress, Endpoint: List Projects (+28 more)

### Community 25 - "Project Module — API Contract"
Cohesion: 0.05
Nodes (36): Base Path, Common Auth, Endpoint: Add Issue to Project, Endpoint: Change Project Status, Endpoint: Create Project, Endpoint: Get Project, Endpoint: Get Project Progress, Endpoint: List Projects (+28 more)

### Community 26 - "Behaviour"
Cohesion: 0.06
Nodes (35): Behaviour, Business Rules, Data Model, Issue, Issue Label (junction), Issues — Business Specification, Relationships, Requirement: AssignIssue (+27 more)

### Community 27 - "Behaviour"
Cohesion: 0.06
Nodes (35): Behaviour, Business Rules, Data Model, Project, Project Module — Business Specification, Relationships, Requirement: AddIssueToProject, Requirement: ChangeProjectStatus (+27 more)

### Community 28 - "Behaviour"
Cohesion: 0.06
Nodes (35): Behaviour, Business Rules, Data Model, Issue, Issue Label (junction), Issues — Business Specification, Relationships, Requirement: AssignIssue (+27 more)

### Community 29 - "Behaviour"
Cohesion: 0.06
Nodes (35): Behaviour, Business Rules, Data Model, Project, Project Module — Business Specification, Relationships, Requirement: AddIssueToProject, Requirement: ChangeProjectStatus (+27 more)

### Community 30 - "Behaviour"
Cohesion: 0.06
Nodes (34): Behaviour, Business Rules, Data Model, Identity — Business Specification, Organization, OrganizationMember, Relationships, Requirement: Create Organization (+26 more)

### Community 31 - "Team & Membership — Backend Design"
Cohesion: 0.06
Nodes (34): Add Team Member, AddTeamMember, API Contracts, Architecture Decisions, Business Logic, Contract Tests, Create Team, CreateTeam (+26 more)

### Community 32 - "TransitionRepository"
Cohesion: 0.09
Nodes (12): CreateTransition, CreateTransitionInput, DeleteTransition, DeleteTransitionInput, DeleteWorkflowState, DeleteWorkflowStateInput, ListTransitions, ListTransitionsInput (+4 more)

### Community 33 - "Module Contracts & Interactions"
Cohesion: 0.06
Nodes (33): 10. Module Dependency Matrix, 1. Communication Overview, 2.1 Request Format, 2.2 Response Format, 2. API Contract, 3.1 Login Request/Response, 3.2 Token Refresh Contract, 3.3 Authenticated Request (+25 more)

### Community 34 - "Identity — Backend Design"
Cohesion: 0.06
Nodes (33): API Contracts, Architecture Decisions, Authentication, Authorization, Authorization Middleware, Business Logic, Contract Tests, Create Organization (+25 more)

### Community 35 - "Behaviour"
Cohesion: 0.06
Nodes (33): Behaviour, Business Rules, Channel, Connection, Data Model, Event, Gateway — Business Specification, Requirement: AuthTimeout (+25 more)

### Community 36 - "Behaviour"
Cohesion: 0.06
Nodes (33): Behaviour, Business Rules, Channel, Connection, Data Model, Event, Gateway — Business Specification, Requirement: AuthTimeout (+25 more)

### Community 37 - "errors.ts"
Cohesion: 0.11
Nodes (12): DeleteTeamInput, GetTeamDetailsInput, ListTeamMembersInput, TeamMemberRepository, RemoveTeamMemberInput, LastAdminRemovalError, NotTeamAdminError, NotTeamMemberError (+4 more)

### Community 38 - "Labels — API Contract"
Cohesion: 0.06
Nodes (31): Data Schema: IssueLabel (junction), Data Schema: Label, Endpoint: Attach Label to Issue, Endpoint: Create Label, Endpoint: Delete Label, Endpoint: Detach Label from Issue, Endpoint: Get Issue Labels, Endpoint: List Labels (+23 more)

### Community 39 - "Issues — API Contract"
Cohesion: 0.06
Nodes (31): Endpoint: Assign Issue, Endpoint: Change Issue Status, Endpoint: Create Issue, Endpoint: Delete Issue, Endpoint: Get Issue, Endpoint: List Issues, Endpoint: Update Issue, Errors (+23 more)

### Community 40 - "Cycles — API Contract"
Cohesion: 0.06
Nodes (31): Cycle Object Schema, Cycles — API Contract, Endpoint: Activate Cycle, Endpoint: Complete Cycle, Endpoint: Create Cycle, Endpoint: Delete Cycle (Draft only), Endpoint: Get Cycle, Endpoint: List Cycles for Team (+23 more)

### Community 41 - "Cycles — API Contract"
Cohesion: 0.06
Nodes (31): Cycle Object Schema, Cycles — API Contract, Endpoint: Activate Cycle, Endpoint: Complete Cycle, Endpoint: Create Cycle, Endpoint: Delete Cycle (Draft only), Endpoint: Get Cycle, Endpoint: List Cycles for Team (+23 more)

### Community 42 - "Issues — API Contract"
Cohesion: 0.06
Nodes (31): Endpoint: Assign Issue, Endpoint: Change Issue Status, Endpoint: Create Issue, Endpoint: Delete Issue, Endpoint: Get Issue, Endpoint: List Issues, Endpoint: Update Issue, Errors (+23 more)

### Community 43 - "Labels — API Contract"
Cohesion: 0.06
Nodes (31): Data Schema: IssueLabel (junction), Data Schema: Label, Endpoint: Attach Label to Issue, Endpoint: Create Label, Endpoint: Delete Label, Endpoint: Detach Label from Issue, Endpoint: Get Issue Labels, Endpoint: List Labels (+23 more)

### Community 44 - "auth-controller.ts"
Cohesion: 0.11
Nodes (22): authRoutes(), eventPublisher, getAuthInfo(), getCurrentSessionRefreshTokenHash(), listSessions, LoginRequestSchema, loginUser, logoutUser (+14 more)

### Community 45 - "create-issue.ts"
Cohesion: 0.08
Nodes (16): CreateIssue, CreateIssueInput, CreateIssueInputType, CreateIssueOutput, ProjectQuery, TeamKeyQuery, TeamMemberQuery, ProjectQuery (+8 more)

### Community 46 - "Team — API Contract"
Cohesion: 0.06
Nodes (30): Endpoint: Add Team Member, Endpoint: Create Team, Endpoint: Delete Team, Endpoint: Get Team Details, Endpoint: List Team Members, Endpoint: List Teams, Endpoint: Remove Team Member, Errors (+22 more)

### Community 47 - "API Contracts"
Cohesion: 0.06
Nodes (30): AddIssueToProject, API Contracts, Architecture Decisions, Business Logic, ChangeProjectStatus, CreateProject, Cross-Module Integration, Data Model (+22 more)

### Community 48 - "API Contracts"
Cohesion: 0.06
Nodes (30): API Contracts, Architecture Decisions, Business Logic, Custom PostgreSQL Enum, Data Model, DELETE Delete Workflow State, DELETE Delete Workflow Transition, Dependency Direction (+22 more)

### Community 49 - "API Contracts"
Cohesion: 0.06
Nodes (30): ActivateCycle, API Contracts, Architecture Decisions, Business Logic, CompleteCycle, CreateCycle, Cross-Module Integration, Cycle Module — Backend Design (+22 more)

### Community 50 - "Notifications — Backend Design"
Cohesion: 0.06
Nodes (30): API Contracts, Architecture Decisions, Business Logic, `CreateNotification`, Data Model, Event Flow, Event Publisher Integration, Get notification preferences (+22 more)

### Community 51 - "Team — API Contract"
Cohesion: 0.06
Nodes (30): Endpoint: Add Team Member, Endpoint: Create Team, Endpoint: Delete Team, Endpoint: Get Team Details, Endpoint: List Team Members, Endpoint: List Teams, Endpoint: Remove Team Member, Errors (+22 more)

### Community 52 - "devDependencies"
Cohesion: 0.07
Nodes (29): drizzle-kit, eslint, eslint-plugin-boundaries, devDependencies, drizzle-kit, eslint, eslint-plugin-boundaries, prettier (+21 more)

### Community 53 - "cycle-controller.ts"
Cohesion: 0.10
Nodes (27): activateCycle, completeCycle, createCycle, cycleRepository, cycleRoutes(), deleteCycle, eventPublisher, getCycle (+19 more)

### Community 54 - "TeamMemberQuery"
Cohesion: 0.12
Nodes (11): ActivateCycle, NotificationService, CompleteCycle, NotificationService, CreateCycleInput, CycleEvent, CycleEventPublisher, TeamMemberQuery (+3 more)

### Community 55 - "index.ts"
Cohesion: 0.11
Nodes (15): GetUserProfile, GetUserProfileInput, GetUserProfileOutput, ListTeamMembers, UserProfileRepository, ProfileNotFoundError, organizationMembers, NewOrganization (+7 more)

### Community 56 - "dependencies"
Cohesion: 0.07
Nodes (27): bcrypt, dotenv, drizzle-orm, fastify, @fastify/cookie, @fastify/cors, @fastify/rate-limit, ioredis (+19 more)

### Community 57 - "Identity — API Contract"
Cohesion: 0.07
Nodes (26): Endpoint: Create Organization, Endpoint: Delete Organization, Endpoint: Get Organization Details, Endpoint: Get User Profile, Endpoint: List User Organizations, Endpoint: Update User Profile, Errors, Errors (+18 more)

### Community 58 - "API Contracts"
Cohesion: 0.07
Nodes (26): API Contracts, Architecture Decisions, Assign Issue, AssignIssueUseCase, Business Logic, Change Issue Status, ChangeIssueStatusUseCase, Create Issue (+18 more)

### Community 59 - "change-project-status.ts"
Cohesion: 0.12
Nodes (11): AddIssueToProjectInput, ChangeProjectStatus, ChangeProjectStatusInput, ChangeProjectStatusInputType, VALID_TRANSITIONS, ProjectEvent, ProjectEventPublisher, IssueUpdateQuery (+3 more)

### Community 60 - "Requirement: Error Response Consistency"
Cohesion: 0.08
Nodes (25): Behaviour, Business Rules, Data Model, ErrorLog (Internal — not exposed), RateLimitEntry (Internal — not exposed), Relationships, Requirement: Error Response Consistency, Requirement: Login Endpoint Rate Limiting (+17 more)

### Community 61 - "notification-controller.ts"
Cohesion: 0.12
Nodes (24): ListNotificationsQuery, ListNotificationsQuerySchema, MarkAllReadResponse, MarkReadResponse, NotificationIdParams, NotificationIdParamsSchema, NotificationListResponse, NotificationPreferencesResponse (+16 more)

### Community 62 - "Auth Module — Backend Design"
Cohesion: 0.08
Nodes (24): API Contracts, Architecture Decisions, Auth Module — Backend Design, Authentication, Business Logic, Contract Tests, Data Model, Error Handling (+16 more)

### Community 63 - "Auth — Session Management Business Specification"
Cohesion: 0.08
Nodes (24): Auth — Session Management Business Specification, Behaviour, Business Rules, Data Model, Relationships, Requirement: Automatic Session Eviction, Requirement: List Active Sessions, Requirement: Revoke a Specific Session (+16 more)

### Community 64 - "Auth — Session Management Business Specification"
Cohesion: 0.08
Nodes (24): Auth — Session Management Business Specification, Behaviour, Business Rules, Data Model, Relationships, Requirement: Automatic Session Eviction, Requirement: List Active Sessions, Requirement: Revoke a Specific Session (+16 more)

### Community 65 - "session-controller.ts"
Cohesion: 0.10
Nodes (18): ErrorResponseSchema, eventPublisher, listSessions, ListSessionsResponseSchema, TODO: This needs to be fixed to properly identify the current session., revokeAllSessions, RevokeAllSessionsResponseSchema, revokeSession (+10 more)

### Community 66 - "Notifications — API Contract"
Cohesion: 0.08
Nodes (23): Endpoint: Get notification preferences, Endpoint: List notifications, Endpoint: Mark all notifications as read, Endpoint: Mark notification as read, Endpoint: Update notification preferences, Errors, Errors, Errors (+15 more)

### Community 67 - "Notifications — API Contract"
Cohesion: 0.08
Nodes (23): Endpoint: Get notification preferences, Endpoint: List notifications, Endpoint: Mark all notifications as read, Endpoint: Mark notification as read, Endpoint: Update notification preferences, Errors, Errors, Errors (+15 more)

### Community 68 - "SessionRepository"
Cohesion: 0.13
Nodes (7): ListSessions, ListSessionsInput, ListSessionsInputType, ListSessionsOutput, SessionOutput, SessionRepository, Session

### Community 69 - "update-notification-preferences.ts"
Cohesion: 0.14
Nodes (12): DEFAULT_TYPES, GetNotificationPreferences, GetNotificationPreferencesOutput, NotificationPreferencesRepository, DEFAULT_TYPES, UpdateNotificationPreferences, UpdateNotificationPreferencesInput, UpdateNotificationPreferencesInputType (+4 more)

### Community 70 - "add-team-member.ts"
Cohesion: 0.12
Nodes (11): AddTeamMember, AddTeamMemberInput, AddTeamMemberInputType, Event, EventPublisher, UpdateUserProfile, UpdateUserProfileInput, UpdateUserProfileInputType (+3 more)

### Community 71 - "errors.ts"
Cohesion: 0.15
Nodes (9): AddIssueToProject, AddIssueToProjectInputType, IssueQuery, CannotReopenCompletedProjectError, InvalidProjectStatusTransitionError, IssueAlreadyInProjectError, NotProjectTeamMemberError, ProjectCancelNotAdminError (+1 more)

### Community 72 - "create-project.ts"
Cohesion: 0.14
Nodes (10): CreateProject, CreateProjectInput, CreateProjectInputType, CreateProjectOutput, TeamMemberQuery, UpdateProject, UpdateProjectInput, UpdateProjectInputType (+2 more)

### Community 73 - "IssueRepository"
Cohesion: 0.13
Nodes (10): ListIssues, ListIssuesQuery, ListIssuesQueryType, IssueFilters, IssueRepository, PaginatedResult, PaginationCursor, Issue (+2 more)

### Community 74 - "API Endpoints"
Cohesion: 0.09
Nodes (22): Add Team Member, API Endpoints, Create Organization, Create Team, Delete Organization, Delete Team, Get Organization Details, Get Team Details (+14 more)

### Community 75 - "TokenService"
Cohesion: 0.12
Nodes (10): TokenService, RefreshToken, RefreshTokenInput, RefreshTokenInputType, RefreshTokenOutput, TokenExpiredError, TokenRevokedError, ValidateToken (+2 more)

### Community 76 - "index.ts"
Cohesion: 0.15
Nodes (10): MarkNotificationRead, MarkNotificationReadInput, MarkNotificationReadInputType, MarkNotificationReadOutput, InvalidFilterError, InvalidNotificationTypeError, NOTIFICATION_TYPES, NotificationNotFoundError (+2 more)

### Community 77 - "compilerOptions"
Cohesion: 0.09
Nodes (21): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution (+13 more)

### Community 78 - "Auth — Session Management Backend Design"
Cohesion: 0.10
Nodes (20): API Contracts, Architecture Decisions, Auth — Session Management Backend Design, Business Logic, Contract Test Cases, Data Model, DELETE /api/v1/auth/sessions/:sessionId, GET /api/v1/auth/sessions (+12 more)

### Community 79 - "Behaviour"
Cohesion: 0.10
Nodes (20): Behaviour, Business Rules, Data Model, IssueLabel (existing junction), Label, Labels — Business Specification, Relationships, Requirement: AttachLabel (+12 more)

### Community 80 - "Auth — Backend Design (Cookie Migration)"
Cohesion: 0.10
Nodes (20): API Contracts, App Setup (`src/app.ts`), Architecture Decisions, Auth — Backend Design (Cookie Migration), Auth Controller Changes (`src/modules/auth/adapters/in/auth-controller.ts`), Business Logic, Cookie Configuration, Cookie Helper (New: `src/shared/cookie.ts`) (+12 more)

### Community 81 - "Behaviour"
Cohesion: 0.10
Nodes (20): Behaviour, Business Rules, Data Model, IssueLabel (junction), Label, Labels — Business Specification, Relationships, Requirement: AttachLabel (+12 more)

### Community 82 - "EventPublisher"
Cohesion: 0.13
Nodes (9): AssignIssue, AssignIssueInput, AssignIssueInputType, AssignIssueOutput, NotificationService, TeamMemberQuery, DeleteIssue, EventPublisher (+1 more)

### Community 83 - "StateRepository"
Cohesion: 0.11
Nodes (6): CreateWorkflowState, ListWorkflowStates, ListWorkflowStatesInput, StateRepository, UpdateWorkflowState, WorkflowState

### Community 84 - "Gateway — WebSocket Protocol Contract"
Cohesion: 0.10
Nodes (19): Auto-Subscription, Channel Types, Connection, Errors, Gateway — WebSocket Protocol Contract, Message: Authenticate, Message: Event, Message: Ping / Pong (+11 more)

### Community 85 - "Gateway — WebSocket Protocol Contract"
Cohesion: 0.10
Nodes (19): Auto-Subscription, Channel Types, Connection, Errors, Gateway — WebSocket Protocol Contract, Message: Authenticate, Message: Event, Message: Ping / Pong (+11 more)

### Community 86 - "change-issue-status.ts"
Cohesion: 0.14
Nodes (10): ChangeIssueStatus, ChangeIssueStatusInput, ChangeIssueStatusInputType, ChangeIssueStatusOutput, IssueStatusQuery, NotificationService, StatusType, StateHistoryService (+2 more)

### Community 87 - "Endpoint: List Sessions"
Cohesion: 0.11
Nodes (18): Auth — Session Management API Contract, Behavior, Endpoint: List Sessions, Endpoint: Revoke All Sessions, Endpoint: Revoke Session, Errors, Errors, Errors (+10 more)

### Community 88 - "Auth Token Refresh & Logout — Backend Design"
Cohesion: 0.11
Nodes (18): API Contracts, Architecture Decisions, Auth Token Refresh & Logout — Backend Design, Business Logic, Contract Tests, Data Model, Integration Tests, JWT Utility (+10 more)

### Community 89 - "Issue Comments — API Contract"
Cohesion: 0.11
Nodes (18): Data Schema: Comment, Endpoint: Create Comment, Endpoint: Delete Comment, Endpoint: List Comments on Issue, Endpoint: Update Comment, Errors, Errors, Errors (+10 more)

### Community 90 - "Tasks — Work Module: Comments, Labels, and Issue Watchers (Backend)"
Cohesion: 0.11
Nodes (18): API Layer, Business Logic, Comment Use Cases, Controllers, Data Layer, Domain Entities, DTOs, Events / Messaging (+10 more)

### Community 91 - "Gateway — Backend Design"
Cohesion: 0.11
Nodes (18): API Contracts, Architecture Decisions, AuthenticateConnection, BroadcastEvent, Business Logic, Connection (in-memory), Data Model, Gateway — Backend Design (+10 more)

### Community 92 - "Issue Comments — API Contract"
Cohesion: 0.11
Nodes (18): Data Schema: Comment, Endpoint: Create Comment, Endpoint: Delete Comment, Endpoint: List Comments on Issue, Endpoint: Update Comment, Errors, Errors, Errors (+10 more)

### Community 93 - "Endpoint: List Sessions"
Cohesion: 0.11
Nodes (18): Auth — Session Management API Contract, Behavior, Endpoint: List Sessions, Endpoint: Revoke All Sessions, Endpoint: Revoke Session, Errors, Errors, Errors (+10 more)

### Community 94 - "EventPublisher"
Cohesion: 0.18
Nodes (9): LogoutUser, LogoutUserInput, LogoutUserInputType, LogoutUserOutput, Event, EventPublisher, RevokeAllSessions, RevokeAllSessionsInput (+1 more)

### Community 95 - "errors.ts"
Cohesion: 0.16
Nodes (5): DeleteCycle, ActiveCycleCannotBeDeletedError, CycleNotFoundError, DraftCycleCannotBeCompletedError, EmptyCycleNameError

### Community 96 - "CycleRepository"
Cohesion: 0.18
Nodes (8): CycleFilters, CycleRepository, PaginatedResult, Cycle, cycles, cycleStatusEnum, NewCycle, CycleNotActiveForIssueAssignmentError

### Community 97 - "TeamRepository"
Cohesion: 0.12
Nodes (6): DeleteTeam, GetTeamDetails, ListTeams, TeamRepository, RemoveTeamMember, Team

### Community 98 - "Auth — API Contract"
Cohesion: 0.11
Nodes (17): Access Token, Auth — API Contract, Endpoint: Login, Endpoint: Register, Endpoint: Token Validation (Internal), Errors, Errors, Errors (+9 more)

### Community 99 - "Shared Module — Backend Design"
Cohesion: 0.11
Nodes (17): Architecture Decisions, Base Error Class, Business Logic, Error Class Hierarchy, Error Classes, Error Handler, Error Service, In-Memory Store (+9 more)

### Community 100 - "Issue Comments — Business Specification"
Cohesion: 0.11
Nodes (17): Behaviour, Business Rules, Data Model, Issue Comments — Business Specification, IssueComment, Relationships, Requirement: CreateComment, Requirement: DeleteComment (+9 more)

### Community 101 - "Issue Watchers — Business Specification"
Cohesion: 0.11
Nodes (17): Behaviour, Business Rules, Data Model, Issue Watchers — Business Specification, IssueWatcher, Relationships, Requirement: AddWatcher, Requirement: ListWatchers (+9 more)

### Community 102 - "Auth — API Contract (Cookie Migration)"
Cohesion: 0.11
Nodes (17): Auth — API Contract (Cookie Migration), Endpoint: Login, Endpoint: Logout, Endpoint: Token Refresh, Errors, Errors, Errors, Request (+9 more)

### Community 103 - "Issue Comments — Business Specification"
Cohesion: 0.11
Nodes (17): Behaviour, Business Rules, Data Model, Issue Comments — Business Specification, IssueComment, Relationships, Requirement: CreateComment, Requirement: DeleteComment (+9 more)

### Community 104 - "Issue Watchers — Business Specification"
Cohesion: 0.11
Nodes (17): Behaviour, Business Rules, Data Model, Issue Watchers — Business Specification, IssueWatcher, Relationships, Requirement: AddWatcher, Requirement: ListWatchers (+9 more)

### Community 105 - "Auth — Business Specification"
Cohesion: 0.12
Nodes (16): Auth — Business Specification, Behaviour, Business Rules, Data Model, Relationships, Requirement: Refresh Token Rotation, Requirement: Session Termination, Scenario: Idempotent logout (double call) (+8 more)

### Community 106 - "Tasks — Shared Error Types & Rate Limiting (Backend)"
Cohesion: 0.12
Nodes (16): API Layer, Business Logic, Contract Tests, Data Layer, Error Classes, Error Handler, Events / Messaging, Integration Tests (+8 more)

### Community 107 - "Auth — Business Specification (Cookie Migration)"
Cohesion: 0.12
Nodes (16): Auth — Business Specification (Cookie Migration), Behaviour, Business Rules, CookieConfig, Data Model, Requirement: LoginSetsHttpOnlyCookie, Requirement: LogoutClearsCookie, Requirement: RefreshReadsFromCookie (+8 more)

### Community 108 - "Auth — Business Specification"
Cohesion: 0.07
Nodes (27): Auth — Business Specification, Behaviour, Business Rules, CookieConfig, Data Model, Relationships, Requirement: LoginSetsHttpOnlyCookie, Requirement: LogoutClearsCookie (+19 more)

### Community 109 - "errors.ts"
Cohesion: 0.22
Nodes (8): CreateWorkflowStateInput, UpdateWorkflowStateInput, WorkflowStateType, DuplicateStateNameError, MissingCompletedStateError, MissingUnstartedStateError, MultipleCanceledStatesError, NotTeamAdminError

### Community 110 - "index.ts"
Cohesion: 0.17
Nodes (9): DuplicateTransitionError, StateInUseError, TransitionNotFoundError, NewStateHistoryEntry, stateHistory, NewWorkflowState, workflowStates, NewWorkflowTransition (+1 more)

### Community 111 - "Issue Watchers — API Contract"
Cohesion: 0.13
Nodes (14): Data Schema: Watcher (junction), Endpoint: Add Watcher to Issue, Endpoint: List Issue Watchers, Endpoint: Remove Watcher from Issue, Errors, Errors, Errors, Issue Watchers — API Contract (+6 more)

### Community 112 - "Issue Identifier Generation — Database Sequence per Team"
Cohesion: 0.13
Nodes (14): Application-level counter with Redis, Confirmation, Consequences, Considered Options, Context and Problem Statement, Database counter table with atomic increment, Database sequence per team, Decision Drivers (+6 more)

### Community 113 - "Issue Watchers — API Contract"
Cohesion: 0.13
Nodes (14): Data Schema: Watcher (junction), Endpoint: Add Watcher to Issue, Endpoint: List Issue Watchers, Endpoint: Remove Watcher from Issue, Errors, Errors, Errors, Issue Watchers — API Contract (+6 more)

### Community 114 - "dto.ts"
Cohesion: 0.13
Nodes (14): AuthResponse, AuthResponseSchema, ErrorResponse, ErrorResponseSchema, LoginRequest, LoginRequestSchema, RefreshRequest, RefreshRequestSchema (+6 more)

### Community 115 - "Hexagonal Architecture for Identity Module"
Cohesion: 0.14
Nodes (13): Clean Architecture, Confirmation, Consequences, Considered Options, Context and Problem Statement, Decision Drivers, Decision Outcome, Hexagonal Architecture for Identity Module (+5 more)

### Community 116 - "Shared Entity Ownership Between Auth and Identity Modules"
Cohesion: 0.14
Nodes (13): Confirmation, Consequences, Considered Options, Context and Problem Statement, Decision Drivers, Decision Outcome, Event-Driven Synchronization Between Separate Tables, More Information (+5 more)

### Community 117 - "Soft Deletion Strategy for All Entities"
Cohesion: 0.14
Nodes (13): Archive to Separate Table Before Deletion, Confirmation, Consequences, Considered Options, Context and Problem Statement, Decision Drivers, Decision Outcome, Hard Deletion with Audit Log (+5 more)

### Community 118 - "Soft-Delete Pattern — `deletedAt` Timestamp"
Cohesion: 0.14
Nodes (13): Confirmation, Consequences, Considered Options, Context and Problem Statement, Decision Drivers, Decision Outcome, Hard-delete with audit log, More Information (+5 more)

### Community 119 - "Cursor-based Pagination — Composite Cursor"
Cohesion: 0.14
Nodes (13): Confirmation, Consequences, Considered Options, Context and Problem Statement, Cursor-based Pagination — Composite Cursor, Cursor-based pagination (composite cursor), Decision Drivers, Decision Outcome (+5 more)

### Community 120 - "Tasks — Project Module CRUD & Progress (Backend)"
Cohesion: 0.14
Nodes (13): API Layer, Business Logic: Issue-Project Association, Business Logic: Progress Calculation, Business Logic: Project CRUD, Business Logic: Project Status Management, Cross-Module Integration, Data Layer, Events / Messaging (+5 more)

### Community 121 - "Architecture"
Cohesion: 0.14
Nodes (13): Architecture, Backend, Backend — {hexagonal / clean} architecture, Component Design, Current Decisions, Data Flow, Frontend, Frontend — {Next.js App Router} (+5 more)

### Community 122 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:generate, db:migrate, db:push, db:studio, dev, format (+6 more)

### Community 123 - "refresh-token.ts"
Cohesion: 0.24
Nodes (5): ConflictError, RegisterUser, RegisterUserInput, RegisterUserInputType, RegisterUserOutput

### Community 124 - "ProjectRepository"
Cohesion: 0.26
Nodes (7): PaginatedResult, ProjectFilters, ProjectRepository, NewProject, Project, projects, projectStatusEnum

### Community 125 - "Deployment — Linear App Clone Backend"
Cohesion: 0.15
Nodes (12): Architecture, Backend, Backup & Recovery, CI/CD, Deployment — Linear App Clone Backend, Docker Compose, Dockerfile, Environment Variables (+4 more)

### Community 126 - "Use Hexagonal Architecture"
Cohesion: 0.15
Nodes (12): Clean Architecture, Confirmation, Consequences, Considered Options, Context and Problem Statement, Decision Drivers, Decision Outcome, Hexagonal Architecture (Ports & Adapters) (+4 more)

### Community 127 - "Use JWT Dual Token Strategy"
Cohesion: 0.15
Nodes (12): Confirmation, Consequences, Considered Options, Context and Problem Statement, Decision Drivers, Decision Outcome, JWT Dual Token (access + refresh), More Information (+4 more)

### Community 128 - "Use PostgreSQL with Drizzle ORM"
Cohesion: 0.15
Nodes (12): Confirmation, Consequences, Considered Options, Context and Problem Statement, Decision Drivers, Decision Outcome, More Information, PostgreSQL with Drizzle ORM (+4 more)

### Community 129 - "Use Redis for Session Storage"
Cohesion: 0.15
Nodes (12): Confirmation, Consequences, Considered Options, Context and Problem Statement, Decision Drivers, Decision Outcome, In-memory Map, More Information (+4 more)

### Community 130 - "Use bcrypt for Password Hashing"
Cohesion: 0.15
Nodes (12): argon2, bcrypt, Confirmation, Consequences, Considered Options, Context and Problem Statement, Decision Drivers, Decision Outcome (+4 more)

### Community 131 - "Tasks — Auth Registration Login (Backend)"
Cohesion: 0.15
Nodes (12): API Layer, Business Logic, Contract Tests, Data Layer, Events / Messaging, Integration Tests, Review, Scaffold (+4 more)

### Community 132 - "Tasks — Identity User Profile & Organization (Backend)"
Cohesion: 0.15
Nodes (12): API Layer, Business Logic, Contract Tests, Data Layer, Events / Messaging, Integration Tests, Review, Scaffold (+4 more)

### Community 133 - "Tech Selection — Linear App Clone (Backend)"
Cohesion: 0.15
Nodes (12): Caching Strategy, Database Tables Required, Decision Summary, Existing Tables Modified, Generated Files, Identity Module Specific Considerations, Interactive Review Log, Next Steps (+4 more)

### Community 134 - "Use Custom Error Class Hierarchy for Standardized Error Responses"
Cohesion: 0.15
Nodes (12): Confirmation, Consequences, Considered Options, Context and Problem Statement, Custom error class hierarchy, Decision Drivers, Decision Outcome, More Information (+4 more)

### Community 135 - "Use In-Memory Rate Limit Store for MVP"
Cohesion: 0.15
Nodes (12): Confirmation, Consequences, Considered Options, Context and Problem Statement, Database-backed store, Decision Drivers, Decision Outcome, In-memory store (Map-based) (+4 more)

### Community 136 - "Team Entity Placement in Identity Module"
Cohesion: 0.15
Nodes (12): Confirmation, Consequences, Considered Options, Context and Problem Statement, Decision Drivers, Decision Outcome, Identity Module (existing), More Information (+4 more)

### Community 137 - "Team Key Uniqueness and Validation Strategy"
Cohesion: 0.15
Nodes (12): Composite unique constraint on `(organization_id, key)` with application-level validation, Confirmation, Consequences, Considered Options, Context and Problem Statement, Decision Drivers, Decision Outcome, Global unique key with organization prefix (+4 more)

### Community 138 - "Soft-Delete Cascade Strategy for Team Deletion"
Cohesion: 0.15
Nodes (12): Application-level cascade, Confirmation, Consequences, Considered Options, Context and Problem Statement, Database-level cascade, Decision Drivers, Decision Outcome (+4 more)

### Community 139 - "Tasks — Ticket 06: Identity Module — Team & Membership (Backend)"
Cohesion: 0.15
Nodes (12): API Layer, Business Logic, Contract Tests, Data Layer, Events / Messaging, Integration Tests, Review, Scaffold (+4 more)

### Community 140 - "Default Workflow Embedding — Hardcoded Status Transitions"
Cohesion: 0.15
Nodes (12): Confirmation, Consequences, Considered Options, Context and Problem Statement, Database-driven workflow configuration, Decision Drivers, Decision Outcome, Default Workflow Embedding — Hardcoded Status Transitions (+4 more)

### Community 141 - "Tasks — Work Module Issue CRUD & Status (Backend)"
Cohesion: 0.15
Nodes (12): API Layer, Business Logic, Contract Tests, Data Layer, Endpoints to implement, Integration Tests, Review, Scaffold (+4 more)

### Community 142 - "ADR-0001: Use Enum for Project Status Instead of Workflow Join Table"
Cohesion: 0.15
Nodes (12): A. Enum column, ADR-0001: Use Enum for Project Status Instead of Workflow Join Table, B. Reuse workflow_states table, C. Separate project_statuses table, Confirmation, Consequences, Considered Options, Context and Problem Statement (+4 more)

### Community 143 - "ADR-0002: Compute Project Progress on Read Instead of Storing"
Cohesion: 0.15
Nodes (12): A. Compute on read (COUNT), ADR-0002: Compute Project Progress on Read Instead of Storing, B. Denormalized counter, C. Materialized view, Confirmation, Consequences, Considered Options, Context and Problem Statement (+4 more)

### Community 144 - "ADR-0003: Canceled as Terminal Status Instead of Hard Delete"
Cohesion: 0.15
Nodes (12): A. Canceled status, ADR-0003: Canceled as Terminal Status Instead of Hard Delete, B. Soft delete (deletedAt), C. Hard delete, Confirmation, Consequences, Considered Options, Context and Problem Statement (+4 more)

### Community 145 - "ADR-0001: Embed Default Workflow in Code Rather Than Database"
Cohesion: 0.15
Nodes (12): ADR-0001: Embed Default Workflow in Code Rather Than Database, Configuration file, Confirmation, Consequences, Considered Options, Context and Problem Statement, Decision Drivers, Decision Outcome (+4 more)

### Community 146 - "ADR-0002: Append-Only State History for Audit Trail"
Cohesion: 0.15
Nodes (12): ADR-0002: Append-Only State History for Audit Trail, Append-only table with no update/delete API, Confirmation, Consequences, Considered Options, Context and Problem Statement, Decision Drivers, Decision Outcome (+4 more)

### Community 147 - "ADR-0003: Cancel State Transitions Bypass All Validation"
Cohesion: 0.15
Nodes (12): ADR-0003: Cancel State Transitions Bypass All Validation, Cancel override rule, Confirmation, Consequences, Considered Options, Context and Problem Statement, Decision Drivers, Decision Outcome (+4 more)

### Community 148 - "Tasks — Gateway WebSocket & Broadcasting (Backend)"
Cohesion: 0.15
Nodes (12): Adapters — Inbound, Adapters — Outbound, Application Layer — Ports, Application Layer — Use Cases, Domain Layer, Events / Messaging, Integration — App Setup, Review (+4 more)

### Community 149 - "Tasks — Notification Module (Backend)"
Cohesion: 0.15
Nodes (12): API Layer, Business Logic, Data Layer, Events / Messaging, Integration — Cycle Module, Integration — Gateway Module, Integration — Work Module, Review (+4 more)

### Community 150 - "index.ts"
Cohesion: 0.32
Nodes (6): UserRepository, NewSession, sessions, NewUser, User, users

### Community 151 - "NotCycleTeamMemberError"
Cohesion: 0.21
Nodes (3): GetCycle, ListCycles, NotCycleTeamMemberError

### Community 152 - "NotificationRepository"
Cohesion: 0.24
Nodes (5): NotificationRepository, PaginatedResult, NewNotification, Notification, notifications

### Community 153 - "Architecture — Linear App Clone Backend"
Cohesion: 0.17
Nodes (11): Architecture — Linear App Clone Backend, Backend, Backend — Hexagonal Architecture, Component Design, Current Decisions, Data Flow, Overview, Project Structure (+3 more)

### Community 154 - "Review — Auth Session Management"
Cohesion: 0.17
Nodes (11): Backward Compatibility, Checklist, Edge Cases, Leakage Check, Migration Rollback, Performance Bounds, Readiness Summary, Review — Auth Session Management (+3 more)

### Community 155 - "Extend existing work module with subdomains for comments, labels, and watchers"
Cohesion: 0.17
Nodes (11): Confirmation, Consequences, Considered Options, Context and Problem Statement, Create separate modules, Decision Drivers, Decision Outcome, Extend existing `work/` module (+3 more)

### Community 156 - "Soft-delete for comments and labels"
Cohesion: 0.17
Nodes (11): Confirmation, Consequences, Considered Options, Context and Problem Statement, Decision Drivers, Decision Outcome, Hard-delete, More Information (+3 more)

### Community 157 - "Flat comment threading (no nested replies)"
Cohesion: 0.17
Nodes (11): Confirmation, Consequences, Considered Options, Context and Problem Statement, Decision Drivers, Decision Outcome, Flat comment threading (no nested replies), Flat threading (+3 more)

### Community 158 - "Tasks — Cycle Module CRUD & Lifecycle (Backend)"
Cohesion: 0.17
Nodes (11): API Layer, Business Logic: Cycle CRUD, Business Logic: Cycle-Issue Integration, Business Logic: Cycle Lifecycle Management, Data Layer, Events / Messaging, Review, Scaffold (+3 more)

### Community 159 - "Use `ws` Library for WebSocket Server"
Cohesion: 0.17
Nodes (11): Confirmation, Consequences, Considered Options, Context and Problem Statement, Decision Drivers, Decision Outcome, `@fastify/websocket`, Pros and Cons of the Options (+3 more)

### Community 160 - "Store Connection and Subscription State In-Memory"
Cohesion: 0.17
Nodes (11): Confirmation, Consequences, Considered Options, Context and Problem Statement, Decision Drivers, Decision Outcome, In-memory Maps, PostgreSQL (+3 more)

### Community 161 - "Use In-Process EventEmitter for Event Broadcasting"
Cohesion: 0.17
Nodes (11): Confirmation, Consequences, Considered Options, Context and Problem Statement, Decision Drivers, Decision Outcome, Direct dependency injection, In-process EventEmitter (+3 more)

### Community 162 - "Track Online Status in Redis with TTL"
Cohesion: 0.17
Nodes (11): Confirmation, Consequences, Considered Options, Context and Problem Statement, Decision Drivers, Decision Outcome, In-memory only, PostgreSQL (+3 more)

### Community 163 - "{Domain} — Backend Design"
Cohesion: 0.17
Nodes (11): API Contracts, Architecture Decisions, Business Logic, Data Model, {Domain} — Backend Design, {Endpoint}, {Entity}, Migrations (+3 more)

### Community 164 - "Linear Clone Backend"
Cohesion: 0.17
Nodes (11): Add Watcher, Authentication, License, Linear Clone Backend, List Watchers, Project Structure, Rate Limiting, Remove Watcher (+3 more)

### Community 165 - "create-notification.ts"
Cohesion: 0.24
Nodes (6): CreateNotification, CreateNotificationInput, CreateNotificationInputType, CreateNotificationOutput, CreateNotificationEvent, NotificationService

### Community 166 - "mark-all-notifications-read.ts"
Cohesion: 0.23
Nodes (4): MarkAllNotificationsRead, MarkAllNotificationsReadOutput, NotificationEvent, NotificationEventPublisher

### Community 167 - "validate-transition.ts"
Cohesion: 0.23
Nodes (8): ValidateTransition, ValidateTransitionInput, ValidateTransitionOutput, DEFAULT_WORKFLOW_STATES, DEFAULT_WORKFLOW_TRANSITIONS, DefaultState, DefaultTransition, isCanceledType()

### Community 168 - "Atomic Parts"
Cohesion: 0.18
Nodes (11): 3.10 Issue Watchers Query, 3.1 Issue Creation, 3.2 Issue Update, 3.3 Issue Status Change, 3.4 Issue Assignment, 3.5 Issue Label Management, 3.6 Issue Deletion, 3.7 Issue Query (+3 more)

### Community 169 - "3. Work Module"
Cohesion: 0.18
Nodes (11): 3.11 Comment Creation, 3.12 Comment Update, 3.13 Comment Query, 3.14 Label Creation, 3.15 Label Query, 3. Work Module, Comment Sub-Module, Label Sub-Module (+3 more)

### Community 170 - "ADR-0001: Refresh Token Storage in Redis"
Cohesion: 0.18
Nodes (10): ADR-0001: Refresh Token Storage in Redis, Alternatives Considered, Consequences, Context, Decision, JWT with revocation list, Negative, Positive (+2 more)

### Community 171 - "Review — Auth Token Refresh & Logout"
Cohesion: 0.18
Nodes (10): Acceptance Criteria (LAG-8), Backward Compatibility, Checklist, Edge Cases, Leakage Check, Migration Rollback, Performance Bounds, Review — Auth Token Refresh & Logout (+2 more)

### Community 172 - "Endpoint: Logout"
Cohesion: 0.18
Nodes (10): Auth — API Contract, Endpoint: Logout, Endpoint: Refresh Token, Errors, Errors, Idempotency, Request, Request (+2 more)

### Community 173 - "Tech Selection — Linear App Clone Backend (Auth Token Refresh & Logout)"
Cohesion: 0.18
Nodes (10): ADR References, bcrypt (token hashing), Decision Summary, Fastify Plugins, Generated Files, JWT (jose library), Next Steps, Redis (ioredis client) (+2 more)

### Community 174 - "Shared Module — Error Contract"
Cohesion: 0.18
Nodes (10): Error Behavior, Error Response Examples, Error Response Format, Error Types, NotFoundError, Rate Limit Configuration, Rate Limiting Headers, RateLimitError (+2 more)

### Community 175 - "{Domain} — Business Specification"
Cohesion: 0.18
Nodes (10): Behaviour, Business Rules, Data Model, {Domain} — Business Specification, {Entity}, Relationships, Requirement: {RequirementName}, Scenario: {AnotherScenarioName} (+2 more)

### Community 176 - "Deployment"
Cohesion: 0.18
Nodes (10): Architecture, Backend, Backup & Recovery, CI/CD, Deployment, Frontend, Infrastructure, Monitoring (+2 more)

### Community 177 - "Endpoint: Logout"
Cohesion: 0.11
Nodes (18): Auth — API Contract, Endpoint: Login, Endpoint: Logout, Endpoint: Token Refresh, Errors, Errors, Errors, Idempotency (+10 more)

### Community 178 - "list-notifications.ts"
Cohesion: 0.24
Nodes (6): ListNotifications, ListNotificationsInput, ListNotificationsInputType, ListNotificationsOutput, NotificationItem, toItem()

### Community 179 - "Review — Auth Registration Login"
Cohesion: 0.20
Nodes (9): Backward Compatibility, Checklist, Edge Cases, Leakage Check, Migration Rollback, Performance Bounds, Review — Auth Registration Login, Spec Compliance (+1 more)

### Community 180 - "Tasks — Auth Session Management (Backend)"
Cohesion: 0.20
Nodes (9): API Layer, Business Logic, Data Layer, Events / Messaging, Review, Scaffold, Security, Tasks — Auth Session Management (Backend) (+1 more)

### Community 181 - "Review — Identity User Profile & Organization"
Cohesion: 0.20
Nodes (9): Backward Compatibility, Checklist, Edge Cases, Leakage Check, Migration Rollback, Performance Bounds, Review — Identity User Profile & Organization, Spec Compliance (+1 more)

### Community 182 - "Review — Shared Error Types & Rate Limiting"
Cohesion: 0.20
Nodes (9): Backward Compatibility, Checklist, Edge Cases, Leakage Check, Migration Rollback, Performance Bounds, Review — Shared Error Types & Rate Limiting, Spec Compliance (+1 more)

### Community 183 - "Tasks — Workflow Module: Custom Workflows & Validation (Backend)"
Cohesion: 0.20
Nodes (9): API Layer, Business Logic, Data Layer, Integration, Review, Scaffold, Security, Tasks — Workflow Module: Custom Workflows & Validation (Backend) (+1 more)

### Community 184 - "OpenSpec Schema Collection"
Cohesion: 0.20
Nodes (9): Adding a New Schema, Community Schemas, Example: Switching Schemas, From fullstack to backend-only, From fullstack to minimalist, OpenSpec Schema Collection, Quick Start, Schema Catalog (+1 more)

### Community 185 - "Tasks — {Change Title} (Backend)"
Cohesion: 0.20
Nodes (9): API Layer, Business Logic, Data Layer, Events / Messaging, Review, Scaffold, Security, Tasks — {Change Title} (Backend) (+1 more)

### Community 186 - "package.json"
Cohesion: 0.20
Nodes (9): author, description, keywords, license, main, name, packageManager, type (+1 more)

### Community 187 - "Projects API"
Cohesion: 0.20
Nodes (10): Add Issue to Project, Change Project Status, Create Project, Delete Project, Get Project, Get Project Progress, List Projects, Projects API (+2 more)

### Community 188 - "Workflow API"
Cohesion: 0.20
Nodes (10): Create Transition, Create Workflow State, Delete Transition, Delete Workflow State, Get Issue State History, List Transitions, List Workflow States, Update Workflow State (+2 more)

### Community 189 - "login-user.ts"
Cohesion: 0.22
Nodes (7): LoginUser, LoginUserInput, LoginUserInputType, LoginUserOutput, UnauthorizedError, hashToken(), verifyTokenHash()

### Community 190 - "create-organization.ts"
Cohesion: 0.24
Nodes (5): CreateOrganization, CreateOrganizationInput, CreateOrganizationInputType, CreateOrganizationOutput, OrganizationNameConflictError

### Community 191 - "create-team.ts"
Cohesion: 0.24
Nodes (5): CreateTeam, CreateTeamInput, CreateTeamInputType, CreateTeamOutput, TeamKeyConflictError

### Community 192 - "get-project-progress.ts"
Cohesion: 0.24
Nodes (3): GetProjectProgress, GetProjectProgressOutput, IssueQuery

### Community 193 - "get-state-history.ts"
Cohesion: 0.29
Nodes (4): GetStateHistory, GetStateHistoryInput, HistoryRepository, StateHistoryEntry

### Community 194 - "Atomic Parts"
Cohesion: 0.22
Nodes (9): 1.1 Registration, 1.2 Login, 1.3 Token Refresh, 1.4 Logout, 1.5 Token Validation, 1.6 Session List, 1.7 Session Revoke, 1.8 Revoke All Sessions (+1 more)

### Community 195 - "2. Identity Module"
Cohesion: 0.22
Nodes (9): 2.1 User Profile Management, 2.2 Organization Management, 2.3 Team Management, 2.4 Team Membership, 2. Identity Module, Atomic Parts, Entity Relationships, Purpose (+1 more)

### Community 196 - "Atomic Parts"
Cohesion: 0.22
Nodes (9): 5.1 Project Creation, 5.2 Project Update, 5.3 Project Status Management, 5.4 Project Progress Calculation, 5.5 Issue-Project Association, 5. Project Module, Atomic Parts, Purpose (+1 more)

### Community 197 - "Atomic Parts"
Cohesion: 0.22
Nodes (9): 6.1 Cycle Creation, 6.2 Cycle Activation, 6.3 Cycle Completion, 6.4 Cycle Issue Assignment, 6.5 Cycle Metrics, 6. Cycle Module, Atomic Parts, Purpose (+1 more)

### Community 198 - "7. Notification Module"
Cohesion: 0.22
Nodes (9): 7.1 Notification Creation, 7.2 Notification Retrieval, 7.3 Notification Read Status, 7.4 Notification Preferences, 7. Notification Module, Atomic Parts, Notification Recipients by Event, Purpose (+1 more)

### Community 199 - "Atomic Parts"
Cohesion: 0.22
Nodes (9): 9.1 Validation Helpers, 9.2 Error Types, 9.2 Rate Limiting, 9.3 Pagination Helpers, 9.4 Identifier Generation, 9. Shared Module, Atomic Parts, Purpose (+1 more)

### Community 200 - "Tasks — Auth Token Refresh & Logout (Backend)"
Cohesion: 0.22
Nodes (8): API Layer, Business Logic, Data Layer, Review, Scaffold, Security, Tasks — Auth Token Refresh & Logout (Backend), Testing

### Community 201 - "Review — Ticket 06: Identity Module — Team & Membership"
Cohesion: 0.22
Nodes (8): Backward Compatibility, Checklist, Edge Cases, Leakage Check, Migration Rollback, Performance Bounds, Review — Ticket 06: Identity Module — Team & Membership, Spec Compliance

### Community 202 - "Review — Work Module: Comments, Labels, and Issue Watchers"
Cohesion: 0.22
Nodes (8): Backward Compatibility, Checklist, Edge Cases, Leakage Check, Migration Rollback, Performance Bounds, Review — Work Module: Comments, Labels, and Issue Watchers, Spec Compliance

### Community 203 - "Tech Selection — Linear App Clone (Backend)"
Cohesion: 0.22
Nodes (8): ADR References, Decision Summary, Event Types, Generated Files, Interactive Review Log, New Database Entities, Next Steps, Tech Selection — Linear App Clone (Backend)

### Community 204 - "Review — Work Module Issue CRUD & Status"
Cohesion: 0.22
Nodes (8): Backward Compatibility, Checklist, Edge Cases, Leakage Check, Migration Rollback, Performance Bounds, Review — Work Module Issue CRUD & Status, Spec Compliance

### Community 205 - "Review — Project Module CRUD & Progress"
Cohesion: 0.22
Nodes (8): Backward Compatibility, Checklist, Edge Cases, Leakage Check, Migration Rollback, Performance Bounds, Review — Project Module CRUD & Progress, Spec Compliance

### Community 206 - "Review — Workflow Module: Custom Workflows & Validation"
Cohesion: 0.22
Nodes (8): Backward Compatibility, Checklist, Edge Cases, Leakage Check, Migration Rollback, Performance Bounds, Review — Workflow Module: Custom Workflows & Validation, Spec Compliance

### Community 207 - "Review — Cycle Module CRUD & Lifecycle"
Cohesion: 0.22
Nodes (8): Backward Compatibility, Checklist, Edge Cases, Leakage Check, Migration Rollback, Performance Bounds, Review — Cycle Module CRUD & Lifecycle, Spec Compliance

### Community 208 - "Review — Gateway WebSocket & Broadcasting"
Cohesion: 0.22
Nodes (8): Backward Compatibility, Checklist, Edge Cases, Leakage Check, Migration Rollback, Performance Bounds, Review — Gateway WebSocket & Broadcasting, Spec Compliance

### Community 209 - "Review — Notification Module: Creation & Delivery"
Cohesion: 0.22
Nodes (8): Backward Compatibility, Checklist, Edge Cases, Leakage Check, Migration Rollback, Performance Bounds, Review — Notification Module: Creation & Delivery, Spec Compliance

### Community 210 - "Review — Refresh Token Cookie Migration"
Cohesion: 0.22
Nodes (8): Backward Compatibility, Checklist, Edge Cases, Leakage Check, Migration Rollback, Performance Bounds, Review — Refresh Token Cookie Migration, Spec Compliance

### Community 211 - "Tasks — Refresh Token Cookie Migration (Backend)"
Cohesion: 0.22
Nodes (8): API Layer, Business Logic, Data Layer, Review, Scaffold, Security, Tasks — Refresh Token Cookie Migration (Backend), Testing

### Community 212 - "Review — {Change Title}"
Cohesion: 0.22
Nodes (8): Backward Compatibility, Checklist, Edge Cases, Leakage Check, Migration Rollback, Performance Bounds, Review — {Change Title}, Spec Compliance

### Community 213 - "Issues API"
Cohesion: 0.22
Nodes (9): Assign Issue, Change Issue Status, Create Issue, Delete Issue, Get Issue, Issue Response Object, Issues API, List Issues (+1 more)

### Community 214 - "create-cycle.ts"
Cohesion: 0.31
Nodes (5): CreateCycle, CreateCycleInputType, CreateCycleOutput, CycleDateValidationError, CyclePastStartDateError

### Community 215 - "README.md"
Cohesion: 0.25
Nodes (7): Appendix: Data Flow Examples, Backend Modules - Technology Agnostic Specification, Example 1: Creating an Issue, Example 2: Changing Issue Status, Example 3: Activating a Cycle, Module Interaction Map, Module Overview

### Community 216 - "4. Workflow Module"
Cohesion: 0.25
Nodes (8): 4.1 Workflow Definition, 4.2 State Transition Validation, 4.3 State History Tracking, 4. Workflow Module, Atomic Parts, Purpose, Responsibility, Storage Model

### Community 217 - "Tech Selection — Auth Session Management (Backend)"
Cohesion: 0.25
Nodes (7): ADR References, Decision Summary, Generated Files, Interactive Review Log, Next Steps, Rationale, Tech Selection — Auth Session Management (Backend)

### Community 218 - "Tech Selection — Shared Error Types & Rate Limiting"
Cohesion: 0.25
Nodes (7): Decision Summary, Error Classes, Implementation Notes, Rate Limit Storage, Rate Limiting, Tech Selection — Shared Error Types & Rate Limiting, Technology Rationale

### Community 219 - "Cycles API"
Cohesion: 0.25
Nodes (8): Activate Cycle, Complete Cycle, Create Cycle, Cycles API, Delete Cycle, Get Cycle, List Cycles for Team, Update Cycle

### Community 220 - "Labels API"
Cohesion: 0.25
Nodes (8): Attach Label, Create Label, Delete Label, Detach Label, Get Issue Labels, Labels API, List Labels, Update Label

### Community 221 - "Getting Started"
Cohesion: 0.25
Nodes (8): Build & Start (Production), Database Setup, Environment Variables, Getting Started, Installation, Prerequisites, Run Development, Run Tests

### Community 222 - "NotOrganizationMemberError"
Cohesion: 0.25
Nodes (3): organizationMemberRepository, NotOrganizationMemberError, NotOrganizationOwnerError

### Community 223 - "validators.ts"
Cohesion: 0.46
Nodes (6): CreateOrganizationSchema, DeleteOrganizationSchema, GetOrganizationDetailsSchema, GetUserProfileSchema, ListUserOrganizationsSchema, UpdateUserProfileSchema

### Community 224 - "1. Auth Module"
Cohesion: 0.29
Nodes (7): 1. Auth Module, Purpose, Responsibility, Security Policies, Storage Model, Token Structure, User Entity Ownership

### Community 225 - "8. Gateway Module"
Cohesion: 0.29
Nodes (7): 8.1 Connection Management, 8.2 Event Broadcasting, 8.3 Channel Subscription, 8. Gateway Module, Atomic Parts, Purpose, Responsibility

### Community 226 - "Stack — Linear App Clone Backend"
Cohesion: 0.29
Nodes (6): Backend, Dev & Build, Libraries, Shared, Stack — Linear App Clone Backend, Testing

### Community 227 - "Tech Selection — Linear App Clone Backend"
Cohesion: 0.29
Nodes (6): ADR References, Decision Summary, Generated Files, Interactive Review Log, Next Steps, Tech Selection — Linear App Clone Backend

### Community 228 - "Work Module — Comments, Labels, and Issue Watchers"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Motivation, Problem Statement, Scope, Work Module — Comments, Labels, and Issue Watchers

### Community 229 - "Tech Selection — Linear App Clone (Backend)"
Cohesion: 0.29
Nodes (6): ADR References, Decision Summary, Generated Files, Interactive Review Log, Next Steps, Tech Selection — Linear App Clone (Backend)

### Community 230 - "Project Module — Technology Stack"
Cohesion: 0.29
Nodes (6): ADR References, Decision Summary, Generated Files, Key Implementation Details, Next Steps, Project Module — Technology Stack

### Community 231 - "Tech Selection — Linear App Clone (Backend)"
Cohesion: 0.29
Nodes (6): ADR References, Decision Summary, Generated Files, Interactive Review Log, Next Steps, Tech Selection — Linear App Clone (Backend)

### Community 232 - "Tech Selection — Gateway WebSocket Module (Backend)"
Cohesion: 0.29
Nodes (6): Architecture Impact, Decision Summary, Existing Stack (Confirmed), References, Tech Selection — Gateway WebSocket Module (Backend), WebSocket-Specific Additions

### Community 233 - "ADR-0002: Synchronous Event Ingestion from Emitting Modules"
Cohesion: 0.29
Nodes (6): ADR-0002: Synchronous Event Ingestion from Emitting Modules, Alternatives Considered, Consequences, Context, Decision, Future Migration Path

### Community 234 - "Tech Selection — Notification Module (Backend)"
Cohesion: 0.29
Nodes (6): ADR References, Decision Summary, Generated Files, Next Steps, Notification-Specific Technology Decisions, Tech Selection — Notification Module (Backend)

### Community 235 - "Tech Selection — {Project Name} (Backend)"
Cohesion: 0.29
Nodes (6): ADR References, Decision Summary, Generated Files, Interactive Review Log, Next Steps, Tech Selection — {Project Name} (Backend)

### Community 236 - "Stack"
Cohesion: 0.29
Nodes (6): Backend, Dev & Build, Frontend, Shared, Stack, Testing

### Community 237 - "ADR Manifest — Auth Registration Login"
Cohesion: 0.33
Nodes (5): ADR Manifest — Auth Registration Login, Decisions Not Recorded, In-Force ADRs Reviewed, New Durable ADRs Created, Review Summary

### Community 238 - "Auth Module — Registration & Login"
Cohesion: 0.33
Nodes (5): Auth Module — Registration & Login, Impact, Motivation, Problem Statement, Scope

### Community 239 - "Tech Selection — Linear App Clone Backend"
Cohesion: 0.33
Nodes (5): ADR References, Decision Summary, Interactive Review Log, Next Steps, Tech Selection — Linear App Clone Backend

### Community 240 - "ADR-0006: Current Session Identification via Refresh Token Hash"
Cohesion: 0.33
Nodes (5): ADR-0006: Current Session Identification via Refresh Token Hash, Alternatives Considered, Consequences, Context, Decision

### Community 241 - "ADR-0007: Session Listing from PostgreSQL Directly"
Cohesion: 0.33
Nodes (5): ADR-0007: Session Listing from PostgreSQL Directly, Alternatives Considered, Consequences, Context, Decision

### Community 242 - "ADR-0008: Session Limit Enforcement in Use Case Layer"
Cohesion: 0.33
Nodes (5): ADR-0008: Session Limit Enforcement in Use Case Layer, Alternatives Considered, Consequences, Context, Decision

### Community 243 - "ADR Manifest — Auth Session Management"
Cohesion: 0.33
Nodes (5): ADR Manifest — Auth Session Management, Decisions Not Recorded, In-Force ADRs Reviewed, New Durable ADRs Created, Review Summary

### Community 244 - "Auth Module — Session Management"
Cohesion: 0.33
Nodes (5): Auth Module — Session Management, Impact, Motivation, Problem Statement, Scope

### Community 245 - "ADR Manifest — Auth Token Refresh & Logout"
Cohesion: 0.33
Nodes (5): ADR Manifest — Auth Token Refresh & Logout, Decisions Not Recorded, In-Force ADRs Reviewed, New Durable ADRs Created, Review Summary

### Community 246 - "Auth Module — Token Refresh & Logout"
Cohesion: 0.33
Nodes (5): Auth Module — Token Refresh & Logout, Impact, Motivation, Problem Statement, Scope

### Community 247 - "ADR Manifest — Identity User Profile & Organization"
Cohesion: 0.33
Nodes (5): ADR Manifest — Identity User Profile & Organization, Decisions Not Recorded, In-Force ADRs Reviewed, New Durable ADRs Created, Review Summary

### Community 248 - "Identity Module — User Profile & Organization"
Cohesion: 0.33
Nodes (5): Identity Module — User Profile & Organization, Impact, Motivation, Problem Statement, Scope

### Community 249 - "ADR Manifest — Shared Error Types & Rate Limiting"
Cohesion: 0.33
Nodes (5): ADR Manifest — Shared Error Types & Rate Limiting, Decisions Not Recorded, In-Force ADRs Reviewed, New Durable ADRs Created, Review Summary

### Community 250 - "Shared Module — Error Types & Rate Limiting"
Cohesion: 0.33
Nodes (5): Impact, Motivation, Problem Statement, Scope, Shared Module — Error Types & Rate Limiting

### Community 251 - "ADR Manifest — Ticket 06: Identity Module — Team & Membership"
Cohesion: 0.33
Nodes (5): ADR Manifest — Ticket 06: Identity Module — Team & Membership, Decisions Not Recorded, In-Force ADRs Reviewed, New Durable ADRs Created, Review Summary

### Community 252 - "Ticket 06: Identity Module — Team & Membership"
Cohesion: 0.33
Nodes (5): Impact, Motivation, Problem Statement, Scope, Ticket 06: Identity Module — Team & Membership

### Community 253 - "ADR Manifest — Work Module: Comments, Labels, and Issue Watchers"
Cohesion: 0.33
Nodes (5): ADR Manifest — Work Module: Comments, Labels, and Issue Watchers, Decisions Not Recorded, In-Force ADRs Reviewed, New Durable ADRs Created, Review Summary

### Community 254 - "Work Module — Issue CRUD & Status"
Cohesion: 0.33
Nodes (5): Impact, Motivation, Problem Statement, Scope, Work Module — Issue CRUD & Status

### Community 255 - "ADR Manifest — Project Module CRUD & Progress"
Cohesion: 0.33
Nodes (5): ADR Manifest — Project Module CRUD & Progress, Decisions Not Recorded, In-Force ADRs Reviewed, New Durable ADRs Created, Review Summary

### Community 256 - "Project Module — CRUD & Progress"
Cohesion: 0.33
Nodes (5): Impact, Motivation, Problem Statement, Project Module — CRUD & Progress, Scope

### Community 257 - "ADR Manifest — Workflow Module: Custom Workflows & Validation"
Cohesion: 0.33
Nodes (5): ADR Manifest — Workflow Module: Custom Workflows & Validation, Decisions Not Recorded, In-Force ADRs Reviewed, New Durable ADRs Created, Review Summary

### Community 258 - "Workflow Module — Custom Workflows & Validation"
Cohesion: 0.33
Nodes (5): Impact, Motivation, Problem Statement, Scope, Workflow Module — Custom Workflows & Validation

### Community 259 - "Tech Selection — Workflow Module (Backend)"
Cohesion: 0.33
Nodes (5): Decision Summary, Generated Files, Interactive Review Log, Next Steps, Tech Selection — Workflow Module (Backend)

### Community 260 - "ADR-0001: Cycle Auto-Complete on Activation"
Cohesion: 0.33
Nodes (5): ADR-0001: Cycle Auto-Complete on Activation, Alternatives Considered, Consequences, Context, Decision

### Community 261 - "ADR-0002: Cycle Status as Database Enum"
Cohesion: 0.33
Nodes (5): ADR-0002: Cycle Status as Database Enum, Alternatives Considered, Consequences, Context, Decision

### Community 262 - "ADR Manifest — Cycle Module CRUD & Lifecycle"
Cohesion: 0.33
Nodes (5): ADR Manifest — Cycle Module CRUD & Lifecycle, Decisions Not Recorded, In-Force ADRs Reviewed, New Durable ADRs Created, Review Summary

### Community 263 - "Cycle Module — CRUD & Lifecycle"
Cohesion: 0.33
Nodes (5): Cycle Module — CRUD & Lifecycle, Impact, Motivation, Problem Statement, Scope

### Community 264 - "ADR Manifest — Gateway WebSocket & Broadcasting"
Cohesion: 0.33
Nodes (5): ADR Manifest — Gateway WebSocket & Broadcasting, Decisions Not Recorded, In-Force ADRs Reviewed, New Durable ADRs Created, Review Summary

### Community 265 - "Gateway Module — WebSocket & Broadcasting"
Cohesion: 0.33
Nodes (5): Gateway Module — WebSocket & Broadcasting, Impact, Motivation, Problem Statement, Scope

### Community 266 - "ADR-0001: Store-and-Forward Notification Model"
Cohesion: 0.33
Nodes (5): ADR-0001: Store-and-Forward Notification Model, Alternatives Considered, Consequences, Context, Decision

### Community 267 - "ADR Manifest — Notification Module: Creation & Delivery"
Cohesion: 0.33
Nodes (5): ADR Manifest — Notification Module: Creation & Delivery, Decisions Not Recorded, In-Force ADRs Reviewed, New Durable ADRs Created, Review Summary

### Community 268 - "Notification Module — Creation & Delivery"
Cohesion: 0.33
Nodes (5): Impact, Motivation, Notification Module — Creation & Delivery, Problem Statement, Scope

### Community 269 - "ADR Manifest — Refresh Token Cookie Migration"
Cohesion: 0.33
Nodes (5): ADR Manifest — Refresh Token Cookie Migration, Decisions Not Recorded, In-Force ADRs Reviewed, New Durable ADRs Created, Review Summary

### Community 270 - "Backend: Migrate Refresh Token from Response Body to HttpOnly Cookie"
Cohesion: 0.33
Nodes (5): Backend: Migrate Refresh Token from Response Body to HttpOnly Cookie, Impact, Motivation, Problem Statement, Scope

### Community 271 - "Tech Selection — Refresh Token Cookie Migration (Backend)"
Cohesion: 0.33
Nodes (5): Decision Summary, Dependency Addition, Existing Stack References, Next Steps, Tech Selection — Refresh Token Cookie Migration (Backend)

### Community 272 - "ADR Manifest — {Change Title}"
Cohesion: 0.33
Nodes (5): ADR Manifest — {Change Title}, Decisions Not Recorded, In-Force ADRs Reviewed, New Durable ADRs Created, Review Summary

### Community 273 - "{Change Title}"
Cohesion: 0.33
Nodes (5): {Change Title}, Impact, Motivation, Problem Statement, Scope

### Community 274 - "Endpoint: {Name}"
Cohesion: 0.33
Nodes (5): {Domain} — API Contract, Endpoint: {Name}, Errors, Request, Response

### Community 275 - "Notifications API"
Cohesion: 0.33
Nodes (6): Get Notification Preferences, List Notifications, Mark All Notifications as Read, Mark Notification as Read, Notifications API, Update Notification Preferences

### Community 277 - "Linear App Backend Repository"
Cohesion: 0.33
Nodes (5): Contributing, Getting Started, Implementations, Linear App Backend Repository, Project Structure

### Community 278 - "ADR Manifest — Work Module Issue CRUD & Status"
Cohesion: 0.40
Nodes (4): ADR Manifest — Work Module Issue CRUD & Status, Decisions Not Recorded, New Durable ADRs Created, Review Summary

### Community 279 - "Comments API"
Cohesion: 0.40
Nodes (5): Comments API, Create Comment, Delete Comment, List Issue Comments, Update Comment

### Community 281 - "events.ts"
Cohesion: 0.40
Nodes (3): CHANNEL_PATTERNS, GATEWAY_EVENTS, GatewayEventEnvelope

### Community 282 - "Technology Templates — Backend Schema"
Cohesion: 0.50
Nodes (3): Customizing Templates, Fallback Behavior, Technology Templates — Backend Schema

### Community 283 - "Error Handling"
Cohesion: 0.50
Nodes (4): Error Handling, Error Response Examples, Error Types, Rate Limit Headers

### Community 284 - "contract-refresh.test.ts"
Cohesion: 0.50
Nodes (3): ErrorResponseSchema, RefreshTokenRequestSchema, RefreshTokenResponseSchema

## Knowledge Gaps
- **2795 isolated node(s):** `Review Summary`, `In-Force ADRs Reviewed`, `New Durable ADRs Created`, `Decisions Not Recorded`, `Architecture Decisions` (+2790 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `env` connect `index.ts` to `session-controller.ts`, `LabelRepository`, `TokenService`, `auth-controller.ts`, `login-user.ts`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `EventPublisher` connect `add-team-member.ts` to `TeamRepository`, `errors.ts`, `OrganizationMemberRepository`, `create-organization.ts`, `create-team.ts`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **What connects `Review Summary`, `In-Force ADRs Reviewed`, `New Durable ADRs Created` to the rest of the system?**
  _2795 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05787545787545788 - nodes in this community are weakly interconnected._
- **Should `errors.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.055288461538461536 - nodes in this community are weakly interconnected._
- **Should `comment-controller.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05478750640040963 - nodes in this community are weakly interconnected._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08941176470588236 - nodes in this community are weakly interconnected._