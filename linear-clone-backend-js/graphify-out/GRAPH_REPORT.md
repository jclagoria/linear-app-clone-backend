# Graph Report - .  (2026-07-20)

## Corpus Check
- Large corpus: 511 files · ~208,710 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 1924 nodes · 3562 edges · 151 communities (100 shown, 51 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Test & Message
- Error Handling
- Watcher Module
- DTO Schema
- Workflow Controller
- Dependencies & Packages
- Project DTO
- Team Member
- Comment Module
- Workflow Transitions
- Auth & Identity ADRs
- App Bootstrap
- Workflow State
- Labels & Issues
- Rate Limiting & Error Base
- Cycle Controller
- User Profile
- Issue Labels
- Cycle Notification
- Organization
- Create Issue Request
- Label Tests
- Refresh Token
- Project Association
- Project Module
- Additional DTOs
- Template Refresh
- Session
- Notification Preferences
- Cycle Use Cases
- Team Member Management
- Organization Management
- Project Tests
- Project Creation
- Issue Listing
- TypeScript Config
- User Registration
- Notification Tests
- Spec DTOs
- Workflow State Create
- Label Request Schema
- Issue Status Changes
- Session Use Cases
- Contracts & Business
- Schema & Data
- User Logout
- Cycle Tests
- Cycle Domain
- Project Module Domain
- Issue List Views
- Team Deletion
- Issue Creation
- Framework Middleware
- Label Schema
- Business DTOs
- Scripts
- Project Domain
- Issue Assignment
- Issue Updates
- Gateway Notification
- Contract Entities
- User Login
- User Domain
- Cycle CRUD
- Notification Domain
- Comment Creation
- History & State
- Redis Token Store
- Notification Delivery
- Notification Read
- Default Workflow
- Notification Lists
- Issue Statuses
- Package Config
- Team Creation
- Project Progress
- Cycle Creation
- Session Listing
- Auth Middleware
- Validators
- Cycle Activation
- Project Deletion
- Gateway Events
- Error Types
- Issue Status
- Workflow Service
- Cookie Migration
- Session Data
- Contract Refresh
- Cycle Queries
- Channel Subscriptions
- Cursor Pagination
- Contract Logout
- Auth Middleware
- Module Structure
- Drizzle ORM
- ESLint Config
- Fastify Cookie
- Ioredis
- Jose JWT
- Connection Management
- Comment Domain
- IssueLabel Schema
- OpenAPI Tech Stack
- Channel Domain
- IssueLabel Join Table
- WebSocket Library
- Zod Validation
- Contract: Add Team Member
- Contract: Create Org
- Contract: Create Team
- Contract: Get Org
- Contract: Get Profile
- Contract: Get Team Details
- Contract: List Orgs
- Contract: List Team Members
- Contract: List Teams
- Contract: Update Profile
- WebSocket Contract
- Authenticate Message
- Event Message
- Subscribe Message
- Notification Tech Stack
- Drizzle ORM Docs
- Fastify Documentation
- Vitest Testing
- JWT Token Strategy
- Redis Session Store
- Work Module Review
- Issue CRUD Manifest
- Issue CRUD Review
- Workflow State Enum
- OpenSpec Schemas
- Paginated Projects Response
- Project Progress Response
- Session Schema
- WebSocket Auto-Subscription
- Connection Data Model
- Event Data Model
- Subscription Data Model

## God Nodes (most connected - your core abstractions)
1. `EventPublisher` - 32 edges
2. `SessionRepository` - 29 edges
3. `LabelRepository` - 25 edges
4. `BaseError` - 23 edges
5. `CycleRepository` - 22 edges
6. `TeamMemberRepository` - 21 edges
7. `StateRepository` - 21 edges
8. `OrganizationMemberRepository` - 20 edges
9. `TeamRepository` - 20 edges
10. `IssueRepository` - 20 edges

## Surprising Connections (you probably didn't know these)
- `OpenAPI 3.1 Specification` --conceptually_related_to--> `Linear Clone Backend`  [EXTRACTED]
  docs/api/openapi.yaml → README.md
- `Docker Compose Deployment` --conceptually_related_to--> `Linear Clone Backend`  [EXTRACTED]
  docs/deployment.md → README.md
- `ADR: JWT Dual Token Strategy` --rationale_for--> `Linear Clone Backend`  [EXTRACTED]
  openspec/changes/archive/2026-07-12-auth-registration-login/adr/0002-jwt-dual-token-strategy.md → README.md
- `ADR: PostgreSQL with Drizzle ORM` --rationale_for--> `Linear Clone Backend`  [EXTRACTED]
  openspec/changes/archive/2026-07-12-auth-registration-login/adr/0003-postgresql-with-drizzle.md → README.md
- `ADR: Redis for Session Storage` --rationale_for--> `Linear Clone Backend`  [EXTRACTED]
  openspec/changes/archive/2026-07-12-auth-registration-login/adr/0004-redis-for-sessions.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Backend Modules Architecture** — docs_backend_readme_auth_module, docs_backend_readme_identity_module, docs_backend_readme_work_module, docs_backend_readme_workflow_module, docs_backend_readme_project_module, docs_backend_readme_cycle_module, docs_backend_readme_notification_module, docs_backend_readme_gateway_module, docs_backend_readme_shared_module [EXTRACTED 1.00]
- **Auth Registration Login Change Artifacts** — openspec_changes_archive_2026_07_12_auth_registration_login_proposal_auth_registration_login_proposal, openspec_changes_archive_2026_07_12_auth_registration_login_specs_api_auth_api_spec, openspec_changes_archive_2026_07_12_auth_registration_login_specs_business_auth_business_spec, openspec_changes_archive_2026_07_12_auth_registration_login_design_backend_auth_module_design, openspec_changes_archive_2026_07_12_auth_registration_login_tasks_backend_implementation_tasks, openspec_changes_archive_2026_07_12_auth_registration_login_review_change_review [EXTRACTED 1.00]
- **Auth Module Architecture Decision Records** — openspec_changes_archive_2026_07_12_auth_registration_login_adr_0001_hexagonal_architecture_hexagonal_architecture_decision, openspec_changes_archive_2026_07_12_auth_registration_login_adr_0002_jwt_dual_token_strategy_jwt_dual_token_decision, openspec_changes_archive_2026_07_12_auth_registration_login_adr_0003_postgresql_with_drizzle_postgresql_drizzle_decision, openspec_changes_archive_2026_07_12_auth_registration_login_adr_0004_redis_for_sessions_redis_sessions_decision, openspec_changes_archive_2026_07_12_auth_registration_login_adr_0005_bcrypt_password_hashing_bcrypt_password_hashing_decision [EXTRACTED 1.00]
- **Session Management ADR Set** — openspec_changes_archive_2026_07_13_auth_session_management_adr_0006_current_session_identification_adr0006, openspec_changes_archive_2026_07_13_auth_session_management_adr_0007_session_listing_postgresql_adr0007, openspec_changes_archive_2026_07_13_auth_session_management_adr_0008_session_limit_enforcement_adr0008 [EXTRACTED 1.00]
- **Session Management API Endpoints** — openspec_changes_archive_2026_07_13_auth_session_management_specs_api_sessions_endpoint_listsessions, openspec_changes_archive_2026_07_13_auth_session_management_specs_api_sessions_endpoint_revokesession, openspec_changes_archive_2026_07_13_auth_session_management_specs_api_sessions_endpoint_revokeall [EXTRACTED 1.00]
- **Auth Token Lifecycle Use Cases** — openspec_changes_archive_2026_07_13_auth_token_refresh_logout_design_backend_refreshtokenservice, openspec_changes_archive_2026_07_13_auth_token_refresh_logout_design_backend_logoutservice, openspec_changes_archive_2026_07_13_auth_token_refresh_logout_design_backend_jwtutility [EXTRACTED 1.00]
- **Identity Module ADR Decisions** — openspec_changes_archive_2026_07_13_identity_user_profile_org_adr_0001_hexagonal_architecture_identity_module_hexagonal_architecture, openspec_changes_archive_2026_07_13_identity_user_profile_org_adr_0002_shared_entity_ownership_users_table_shared_entity_ownership, openspec_changes_archive_2026_07_13_identity_user_profile_org_adr_0003_soft_deletion_strategy_soft_deletion [EXTRACTED 1.00]
- **Shared Error & Rate Limiting Infrastructure** — openspec_changes_archive_2026_07_13_shared_error_types_rate_limiting_adr_0001_custom_error_class_hierarchy_custom_error_hierarchy, openspec_changes_archive_2026_07_13_shared_error_types_rate_limiting_adr_0002_in_memory_rate_limit_store_in_memory_rate_limit, openspec_changes_archive_2026_07_13_shared_error_types_rate_limiting_design_backend_base_error, openspec_changes_archive_2026_07_13_shared_error_types_rate_limiting_specs_api_error_contract_standardized_error_format, openspec_changes_archive_2026_07_13_shared_error_types_rate_limiting_specs_business_error_handling_rate_limiting_feature [EXTRACTED 1.00]
- **Identity Module Team Management Use Cases** — openspec_changes_archive_2026_07_14_ticket_06_identity_team_membership_design_backend_create_team, openspec_changes_archive_2026_07_14_ticket_06_identity_team_membership_design_backend_delete_team, openspec_changes_archive_2026_07_14_ticket_06_identity_team_membership_design_backend_add_team_member, openspec_changes_archive_2026_07_14_ticket_06_identity_team_membership_design_backend_remove_team_member [EXTRACTED 1.00]
- **Work Module Subdomains** — openspec_changes_archive_2026_07_14_ticket_08_work_module_comments_labels_watchers_design_backend_comments_subdomain, openspec_changes_archive_2026_07_14_ticket_08_work_module_comments_labels_watchers_design_backend_labels_subdomain, openspec_changes_archive_2026_07_14_ticket_08_work_module_comments_labels_watchers_design_backend_watchers_subdomain [EXTRACTED 1.00]
- **Ticket 06 ADR Decisions** — openspec_changes_archive_2026_07_14_ticket_06_identity_team_membership_adr_001_team_in_identity_module_decision, openspec_changes_archive_2026_07_14_ticket_06_identity_team_membership_adr_002_team_key_uniqueness_decision, openspec_changes_archive_2026_07_14_ticket_06_identity_team_membership_adr_003_soft_delete_cascade_strategy_decision [EXTRACTED 1.00]
- **Architectural Decisions for Issue CRUD** — openspec_changes_archive_2026_07_14_work_module_issue_crud_status_adr_0001_issue_identifier_sequence_issueidentifiersequence, openspec_changes_archive_2026_07_14_work_module_issue_crud_status_adr_0002_default_workflow_embedding_defaultworkflowembedding, openspec_changes_archive_2026_07_14_work_module_issue_crud_status_adr_0003_soft_delete_pattern_softdeletepattern, openspec_changes_archive_2026_07_14_work_module_issue_crud_status_adr_0004_cursor_pagination_cursorpagination [EXTRACTED 1.00]
- **Project Module Design Decisions** — openspec_changes_archive_2026-07-15-project-module-crud-progress_adr_0001_enum_project_status_enum_project_status, openspec_changes_archive_2026-07-15-project-module-crud-progress_adr_0002_computed_progress_computed_progress, openspec_changes_archive_2026-07-15-project-module-crud-progress_adr_0003_no_hard_delete_no_hard_delete [EXTRACTED 1.00]
- **Workflow Module Design Decisions** — openspec_changes_archive_2026-07-15-workflow-module-custom-workflows-validation_adr_0001_embedded_default_workflow_embedded_default_workflow, openspec_changes_archive_2026-07-15-workflow-module-custom-workflows-validation_adr_0002_append_only_state_history_append_only_state_history, openspec_changes_archive_2026-07-15-workflow-module-custom-workflows-validation_adr_0003_cancel_override_validation_cancel_override_rule [EXTRACTED 1.00]
- **Workflow Module Core Services** — openspec_changes_archive_2026-07-15-workflow-module-custom-workflows-validation_design_backend_transition_validation_service, openspec_changes_archive_2026-07-15-workflow-module-custom-workflows-validation_design_backend_workflow_resolution_service, openspec_changes_archive_2026-07-15-workflow-module-custom-workflows-validation_specs_business_workflow_default_workflow [EXTRACTED 1.00]
- **Cycle Lifecycle Flow** — openspec_changes_archive_2026_07_16_cycle_module_crud_lifecycle_design_backend_createcycle, openspec_changes_archive_2026_07_16_cycle_module_crud_lifecycle_design_backend_activatecycle, openspec_changes_archive_2026_07_16_cycle_module_crud_lifecycle_design_backend_completecycle [EXTRACTED 1.00]
- **Gateway Architecture Decisions** — openspec_changes_archive_2026_07_16_gateway_websocket_broadcasting_adr_001_websocket_library_websocketlibrary, openspec_changes_archive_2026_07_16_gateway_websocket_broadcasting_adr_002_connection_state_strategy_connectionstateinmemory, openspec_changes_archive_2026_07_16_gateway_websocket_broadcasting_adr_003_event_broadcasting_strategy_eventemitterbroadcasting, openspec_changes_archive_2026_07_16_gateway_websocket_broadcasting_adr_004_online_status_redis_onlinestatusredis [EXTRACTED 1.00]
- **Workflow Validation Chain** — openspec_changes_archive_2026_07_15_workflow_module_custom_workflows_validation_tasks_backend_workflowresolutionservice, openspec_changes_archive_2026_07_15_workflow_module_custom_workflows_validation_tasks_backend_transitionvalidationservice, openspec_changes_archive_2026_07_15_workflow_module_custom_workflows_validation_tasks_backend_validatetransition [EXTRACTED 1.00]
- **Gateway WebSocket Broadcasting Change Artifacts** — openspec_changes_archive_2026-07-16-gateway-websocket-broadcasting_specs_api_websocket-protocol_gatewaywebsocketprotocol, openspec_changes_archive_2026-07-16-gateway-websocket-broadcasting_specs_business_gateway-business-rules_gatewaybusinessrules, openspec_changes_archive_2026-07-16-gateway-websocket-broadcasting_tasks-backend_gatewaybackendtasks, openspec_changes_archive_2026-07-16-gateway-websocket-broadcasting_tech-stack_gatewaytechstack [EXTRACTED 1.00]
- **Notification Module Change Artifacts** — openspec_changes_archive_2026-07-16-notification-module_adr_0001-store-and-forward-notifications_storeandforward, openspec_changes_archive_2026-07-16-notification-module_adr_0002-synchronous-event-ingestion_synchronouseventingestion, openspec_changes_archive_2026-07-16-notification-module_specs_api_notifications_notificationapicontract, openspec_changes_archive_2026-07-16-notification-module_specs_business_notifications_notificationbusinessspec, openspec_changes_archive_2026-07-16-notification-module_design-backend_notificationdesigndoc, openspec_changes_archive_2026-07-16-notification-module_tasks-backend_notificationbackendtasks, openspec_changes_archive_2026-07-16-notification-module_tech-stack_notificationtechstack [EXTRACTED 1.00]
- **Refresh Token Cookie Migration Change Artifacts** — openspec_changes_migrate-refresh-token-to-httponly-cookie_specs_api_auth-cookie-migration_authcookiemigrationapi, openspec_changes_migrate-refresh-token-to-httponly-cookie_specs_business_auth-cookie-migration_authcookiemigrationbusiness, openspec_changes_migrate-refresh-token-to-httponly-cookie_design-backend_cookiemigrationdesign [EXTRACTED 1.00]
- **Backend Schema Artifact Pipeline** — openspec_schemas_backend_schema_templates_proposal_changeproposaltemplate, openspec_schemas_backend_schema_templates_specs_api_apicontracttemplate, openspec_schemas_backend_schema_templates_specs_business_businessspectemplate, openspec_schemas_backend_schema_templates_tech_selection_tech_selection_techselectiontemplate, openspec_schemas_backend_schema_templates_design_backend_backenddesigntemplate, openspec_schemas_backend_schema_templates_adr_adrmanifesttemplate, openspec_schemas_backend_schema_templates_tasks_backend_backendtaskstemplate, openspec_schemas_backend_schema_templates_review_implementationreviewtemplate [EXTRACTED 1.00]
- **API Specs Contracts** — openspec_specs_api_auth_authapicontract, openspec_specs_api_comments_commentsapicontract, openspec_specs_api_cycles_cyclesapicontract, openspec_specs_api_issues_issuesapicontract, openspec_specs_api_labels_labelsapicontract, openspec_specs_api_notifications_notificationsapicontract [EXTRACTED 1.00]
- **Project Domain Entities** — openspec_specs_business_projects_business_projectdatamodel, openspec_specs_business_team_teamdatamodel, openspec_specs_business_issues_issuedatamodel [EXTRACTED 1.00]
- **Issue Domain Entities** — openspec_specs_business_issues_issuedatamodel, openspec_specs_business_comments_issuecommentdatamodel, openspec_specs_business_watchers_issuewatcherdatamodel, openspec_specs_business_labels_labeldatamodel, openspec_specs_business_workflow_workflowstatedatamodel, openspec_specs_business_cycles_cycledatamodel, openspec_specs_business_projects_business_projectdatamodel, openspec_specs_business_team_teamdatamodel [EXTRACTED 1.00]
- **WebSocket Gateway Stack** — openspec_specs_api_websocket_protocol_websocketprotocol, openspec_specs_business_gateway_business_rules_gatewaybusiness, openspec_specs_business_gateway_business_rules_connectiondatamodel, openspec_specs_business_gateway_business_rules_channeldatamodel, openspec_specs_business_gateway_business_rules_subscriptiondatamodel, openspec_specs_business_gateway_business_rules_eventdatamodel [EXTRACTED 1.00]

## Communities (151 total, 51 thin omitted)

### Community 0 - "Test & Message"
Cohesion: 0.06
Nodes (39): MessageHandler, GatewayWebSocketServer, AuthenticateConnection, autoSubscribeUserChannels(), BroadcastEvent, HandleDisconnect, ManageSubscription, AuthenticateResult (+31 more)

### Community 1 - "Error Handling"
Cohesion: 0.09
Nodes (18): BaseError, BusinessRuleError, ConflictError, errorHandler(), ForbiddenError, InternalError, NotFoundError, RateLimitError (+10 more)

### Community 2 - "Watcher Module"
Cohesion: 0.06
Nodes (28): AddWatcherRequestSchema, WatcherIdParamsSchema, addWatcher, eventPublisher, getUserIdFromToken(), issueTeamQuery, listWatchers, removeWatcher (+20 more)

### Community 3 - "DTO Schema"
Cohesion: 0.06
Nodes (41): AddTeamMemberRequest, AddTeamMemberRequestSchema, CreateOrganizationRequest, CreateOrganizationRequestSchema, CreateTeamRequest, CreateTeamRequestSchema, ErrorResponse, OrganizationIdParams (+33 more)

### Community 4 - "Workflow Controller"
Cohesion: 0.08
Nodes (40): createTransition, createWorkflowState, deleteTransition, deleteWorkflowState, getStateHistory, getUserIdFromToken(), historyRepository, listTransitions (+32 more)

### Community 5 - "Dependencies & Packages"
Cohesion: 0.05
Nodes (41): drizzle-kit, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-boundaries, eslint-plugin-prettier, devDependencies, drizzle-kit (+33 more)

### Community 6 - "Project DTO"
Cohesion: 0.08
Nodes (36): AddIssueRequest, AddIssueRequestSchema, ChangeProjectStatusRequest, ChangeProjectStatusRequestSchema, CreateProjectRequest, CreateProjectRequestSchema, ListProjectsQuery, ListProjectsQuerySchema (+28 more)

### Community 7 - "Team Member"
Cohesion: 0.11
Nodes (12): DeleteTeamInput, GetTeamDetailsInput, ListTeamMembersInput, TeamMemberRepository, RemoveTeamMemberInput, LastAdminRemovalError, NotTeamAdminError, NotTeamMemberError (+4 more)

### Community 8 - "Comment Module"
Cohesion: 0.10
Nodes (23): commentRepository, commentRoutes(), createComment, deleteComment, eventPublisher, getUserIdFromToken(), issueRepository, issueTeamQuery (+15 more)

### Community 9 - "Workflow Transitions"
Cohesion: 0.10
Nodes (11): CreateTransition, CreateTransitionInput, DeleteTransition, DeleteTransitionInput, DeleteWorkflowState, DeleteWorkflowStateInput, ListTransitions, ListTransitionsInput (+3 more)

### Community 10 - "Auth & Identity ADRs"
Cohesion: 0.10
Nodes (32): Auth Token Refresh & Logout Tech Stack, ADR 0001 — Hexagonal Architecture for Identity Module, Hexagonal Architecture (Ports and Adapters), ADR 0002 — Shared Entity Ownership Between Auth and Identity, Shared Entity Ownership (Field-Level Module Boundaries), ADR 0003 — Soft Deletion Strategy for All Entities, Soft Deletion with deletedAt Timestamp, ADR Manifest — Identity User Profile & Organization (+24 more)

### Community 11 - "App Bootstrap"
Cohesion: 0.10
Nodes (24): app, authRoutes(), eventPublisher, getAuthInfo(), getCurrentSessionRefreshTokenHash(), listSessions, LoginRequestSchema, loginUser (+16 more)

### Community 12 - "Workflow State"
Cohesion: 0.12
Nodes (16): CreateWorkflowStateInput, UpdateWorkflowStateInput, WorkflowStateType, DuplicateStateNameError, DuplicateTransitionError, MissingCompletedStateError, MissingUnstartedStateError, MultipleCanceledStatesError (+8 more)

### Community 13 - "Labels & Issues"
Cohesion: 0.10
Nodes (11): CreateLabel, CreateLabelInput, CreateLabelInputType, DeleteIssue, Event, EventPublisher, UpdateLabel, UpdateLabelInput (+3 more)

### Community 14 - "Rate Limiting & Error Base"
Cohesion: 0.09
Nodes (29): BaseError Abstract Class, RateLimitError, Custom Error Classes Pattern, Rate Limiting Framework, Team Entity Placement in Identity Module, Team Key Uniqueness and Validation Strategy, Soft-Delete Cascade Strategy for Team Deletion, Soft-Delete Pattern (+21 more)

### Community 15 - "Cycle Controller"
Cohesion: 0.10
Nodes (27): activateCycle, completeCycle, createCycle, cycleRepository, cycleRoutes(), deleteCycle, eventPublisher, getCycle (+19 more)

### Community 16 - "User Profile"
Cohesion: 0.10
Nodes (14): GetUserProfile, GetUserProfileInput, GetUserProfileOutput, ListTeamMembers, UserProfileRepository, UpdateUserProfile, UpdateUserProfileInput, UpdateUserProfileInputType (+6 more)

### Community 17 - "Issue Labels"
Cohesion: 0.13
Nodes (9): GetIssueLabels, ListLabels, LabelRepository, IssueLabel, issueLabels, NewIssueLabel, Label, labels (+1 more)

### Community 18 - "Cycle Notification"
Cohesion: 0.12
Nodes (11): ActivateCycle, NotificationService, CompleteCycle, NotificationService, CreateCycleInput, CycleEvent, CycleEventPublisher, TeamMemberQuery (+3 more)

### Community 19 - "Organization"
Cohesion: 0.11
Nodes (11): DeleteOrganization, DeleteOrganizationInput, GetOrganizationDetails, GetOrganizationDetailsInput, GetOrganizationDetailsOutput, ListTeams, ListTeamsInput, OrganizationMemberRepository (+3 more)

### Community 20 - "Create Issue Request"
Cohesion: 0.09
Nodes (27): AssignIssueRequestSchema, ChangeIssueStatusRequestSchema, CreateIssueRequestSchema, IdParamsSchema, ListIssuesQuerySchema, UpdateIssueRequestSchema, assignIssue, changeIssueStatus (+19 more)

### Community 21 - "Label Tests"
Cohesion: 0.11
Nodes (12): AttachLabel, AttachLabelInput, AttachLabelInputType, IssueTeamQuery, TeamMemberQuery, DeleteLabel, DetachLabel, DetachLabelInput (+4 more)

### Community 22 - "Refresh Token"
Cohesion: 0.11
Nodes (8): SessionRepository, RefreshToken, RefreshTokenInput, RefreshTokenInputType, RefreshTokenOutput, TokenExpiredError, TokenRevokedError, Session

### Community 23 - "Project Association"
Cohesion: 0.12
Nodes (11): AddIssueToProjectInput, ChangeProjectStatus, ChangeProjectStatusInput, ChangeProjectStatusInputType, VALID_TRANSITIONS, ProjectEvent, ProjectEventPublisher, IssueUpdateQuery (+3 more)

### Community 24 - "Project Module"
Cohesion: 0.09
Nodes (26): OpenAPI 3.1 Specification, Architecture Decision Table (Fastify, PostgreSQL, Drizzle, Redis, JWT, Vitest), Hexagonal Architecture (Ports & Adapters), Auth Module, Cycle Module, Identity Module, Project Module, Work Module (+18 more)

### Community 25 - "Additional DTOs"
Cohesion: 0.12
Nodes (24): ListNotificationsQuery, ListNotificationsQuerySchema, MarkAllReadResponse, MarkReadResponse, NotificationIdParams, NotificationIdParamsSchema, NotificationListResponse, NotificationPreferencesResponse (+16 more)

### Community 26 - "Template Refresh"
Cohesion: 0.08
Nodes (25): Cookie Helper Functions, @fastify/cookie Plugin, Refresh Token Cookie Migration Tasks, HttpOnly Cookie Auth Strategy, Refresh Token Cookie Migration Tech Stack, OpenSpec Configuration, Backend Artifact Pipeline, Backend Schema v3 (+17 more)

### Community 27 - "Session"
Cohesion: 0.10
Nodes (18): ErrorResponseSchema, eventPublisher, listSessions, ListSessionsResponseSchema, TODO: This needs to be fixed to properly identify the current session., revokeAllSessions, RevokeAllSessionsResponseSchema, revokeSession (+10 more)

### Community 28 - "Notification Preferences"
Cohesion: 0.14
Nodes (12): DEFAULT_TYPES, GetNotificationPreferences, GetNotificationPreferencesOutput, NotificationPreferencesRepository, DEFAULT_TYPES, UpdateNotificationPreferences, UpdateNotificationPreferencesInput, UpdateNotificationPreferencesInputType (+4 more)

### Community 29 - "Cycle Use Cases"
Cohesion: 0.09
Nodes (23): Workflow Module, Workflow Tech Stack Decision, Cycle Auto-Complete on Activation, Cycle Status as Database Enum, Activate Cycle Use Case, Complete Cycle Use Case, Create Cycle Use Case, Cycle Module (+15 more)

### Community 30 - "Team Member Management"
Cohesion: 0.12
Nodes (11): AddTeamMember, AddTeamMemberInput, AddTeamMemberInputType, CreateOrganization, CreateOrganizationInput, CreateOrganizationInputType, CreateOrganizationOutput, Event (+3 more)

### Community 31 - "Organization Management"
Cohesion: 0.14
Nodes (11): ListUserOrganizations, ListUserOrganizationsInput, ListUserOrganizationsOutput, OrganizationRepository, organizationMembers, NewOrganization, Organization, organizations (+3 more)

### Community 32 - "Project Tests"
Cohesion: 0.15
Nodes (9): AddIssueToProject, AddIssueToProjectInputType, IssueQuery, CannotReopenCompletedProjectError, InvalidProjectStatusTransitionError, IssueAlreadyInProjectError, NotProjectTeamMemberError, ProjectCancelNotAdminError (+1 more)

### Community 33 - "Project Creation"
Cohesion: 0.14
Nodes (10): CreateProject, CreateProjectInput, CreateProjectInputType, CreateProjectOutput, TeamMemberQuery, UpdateProject, UpdateProjectInput, UpdateProjectInputType (+2 more)

### Community 34 - "Issue Listing"
Cohesion: 0.13
Nodes (10): ListIssues, ListIssuesQuery, ListIssuesQueryType, IssueFilters, IssueRepository, PaginatedResult, PaginationCursor, Issue (+2 more)

### Community 35 - "TypeScript Config"
Cohesion: 0.09
Nodes (21): dist, ES2022, node_modules, src/**/*, compilerOptions, declaration, declarationMap, esModuleInterop (+13 more)

### Community 36 - "User Registration"
Cohesion: 0.12
Nodes (9): TokenService, ConflictError, RegisterUser, RegisterUserInput, RegisterUserInputType, RegisterUserOutput, ValidateToken, ValidateTokenInput (+1 more)

### Community 37 - "Notification Tests"
Cohesion: 0.15
Nodes (10): MarkNotificationRead, MarkNotificationReadInput, MarkNotificationReadInputType, MarkNotificationReadOutput, InvalidFilterError, InvalidNotificationTypeError, NOTIFICATION_TYPES, NotificationNotFoundError (+2 more)

### Community 38 - "Spec DTOs"
Cohesion: 0.10
Nodes (20): AddWatcherRequest, AssignIssueRequest, ChangeIssueStatusRequest, CommentIdParams, CommentResponse, CreateCommentRequest, CreateIssueRequest, CreateLabelRequest (+12 more)

### Community 39 - "Workflow State Create"
Cohesion: 0.11
Nodes (6): CreateWorkflowState, ListWorkflowStates, ListWorkflowStatesInput, StateRepository, UpdateWorkflowState, WorkflowState

### Community 40 - "Label Request Schema"
Cohesion: 0.13
Nodes (19): CreateLabelRequestSchema, IssueLabelParamsSchema, LabelIdParamsSchema, UpdateLabelRequestSchema, attachLabel, createLabel, deleteLabel, detachLabel (+11 more)

### Community 41 - "Issue Status Changes"
Cohesion: 0.14
Nodes (10): ChangeIssueStatus, ChangeIssueStatusInput, ChangeIssueStatusInputType, ChangeIssueStatusOutput, IssueStatusQuery, NotificationService, StatusType, StateHistoryService (+2 more)

### Community 42 - "Session Use Cases"
Cohesion: 0.15
Nodes (19): PostgreSQL 16, ADR-0006: Current Session Identification via Refresh Token Hash, ADR-0007: Session Listing from PostgreSQL Directly, ADR-0008: Session Limit Enforcement in Use Case Layer, In-process EventPublisher, ListSessions Use Case, RevokeAllSessions Use Case, RevokeSession Use Case (+11 more)

### Community 43 - "Contracts & Business"
Cohesion: 0.12
Nodes (19): Project API Contract, Session Management API Contract, Team API Contract, Issue Watchers API Contract, WebSocket Protocol Contract, Workflow Module API Contract, Auth Business Specification, Issue Comments Business Specification (+11 more)

### Community 44 - "Schema & Data"
Cohesion: 0.13
Nodes (19): ProjectResponse Schema, TeamMemberObject Schema, TeamObject Schema, Watcher Schema, StateHistoryEntry Schema, WorkflowState Schema, WorkflowTransition Schema, IssueComment Data Model (+11 more)

### Community 45 - "User Logout"
Cohesion: 0.18
Nodes (9): LogoutUser, LogoutUserInput, LogoutUserInputType, LogoutUserOutput, Event, EventPublisher, RevokeAllSessions, RevokeAllSessionsInput (+1 more)

### Community 46 - "Cycle Tests"
Cohesion: 0.16
Nodes (5): DeleteCycle, ActiveCycleCannotBeDeletedError, CycleNotFoundError, DraftCycleCannotBeCompletedError, EmptyCycleNameError

### Community 47 - "Cycle Domain"
Cohesion: 0.18
Nodes (8): CycleFilters, CycleRepository, PaginatedResult, Cycle, cycles, cycleStatusEnum, NewCycle, CycleNotActiveForIssueAssignmentError

### Community 48 - "Project Module Domain"
Cohesion: 0.12
Nodes (17): Enum Project Status Decision, Computed Project Progress, No Hard Delete Policy, Issue-Project Association, Project Module, Project Module CRUD & Progress, Project API Response Schema, Project Status Lifecycle (+9 more)

### Community 49 - "Issue List Views"
Cohesion: 0.19
Nodes (5): ListIssueComments, CommentRepository, IssueComment, issueComments, NewIssueComment

### Community 50 - "Team Deletion"
Cohesion: 0.15
Nodes (5): DeleteTeam, GetTeamDetails, TeamRepository, RemoveTeamMember, Team

### Community 51 - "Issue Creation"
Cohesion: 0.15
Nodes (8): CreateIssue, CreateIssueInput, CreateIssueInputType, CreateIssueOutput, ProjectQuery, TeamKeyQuery, TeamMemberQuery, EmptyTitleError

### Community 52 - "Framework Middleware"
Cohesion: 0.13
Nodes (15): bcrypt, dotenv, fastify, @fastify/cors, @fastify/rate-limit, dependencies, bcrypt, dotenv (+7 more)

### Community 53 - "Label Schema"
Cohesion: 0.15
Nodes (15): Label Data Schema, Watcher Junction Schema, IssueComment Domain Entity, Label Management Feature, Auto-Subscribe Author and Assignee as Watchers, IssueWatcher Domain Entity, Issue Identifier Generation — Database Sequence per Team, Soft-Delete Pattern — deletedAt Timestamp (+7 more)

### Community 54 - "Business DTOs"
Cohesion: 0.13
Nodes (14): AuthResponse, AuthResponseSchema, ErrorResponse, ErrorResponseSchema, LoginRequest, LoginRequestSchema, RefreshRequest, RefreshRequestSchema (+6 more)

### Community 55 - "Scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:generate, db:migrate, db:push, db:studio, dev, format (+6 more)

### Community 56 - "Project Domain"
Cohesion: 0.26
Nodes (7): PaginatedResult, ProjectFilters, ProjectRepository, NewProject, Project, projects, projectStatusEnum

### Community 57 - "Issue Assignment"
Cohesion: 0.18
Nodes (7): AssignIssue, AssignIssueInput, AssignIssueInputType, AssignIssueOutput, NotificationService, TeamMemberQuery, NotTeamMemberError

### Community 58 - "Issue Updates"
Cohesion: 0.18
Nodes (7): ProjectQuery, TeamQuery, UpdateIssue, UpdateIssueInput, UpdateIssueInputType, UpdateIssueOutput, TeamMismatchError

### Community 59 - "Gateway Notification"
Cohesion: 0.22
Nodes (13): Gateway WebSocket Protocol, Gateway Business Rules, Gateway Backend Tasks, Gateway Tech Stack, Store-and-Forward Notification Model, Synchronous Event Ingestion, Notification Module Design, Notification API Contract (+5 more)

### Community 60 - "Contract Entities"
Cohesion: 0.18
Nodes (13): Comment Entity, Issue Comments API Contract, Cycle Entity, Cycles API Contract, Issue Entity, Issues API Contract, IssueLabel Junction, Label Entity (+5 more)

### Community 61 - "User Login"
Cohesion: 0.22
Nodes (7): LoginUser, LoginUserInput, LoginUserInputType, LoginUserOutput, UnauthorizedError, hashToken(), verifyTokenHash()

### Community 62 - "User Domain"
Cohesion: 0.32
Nodes (6): UserRepository, NewSession, sessions, NewUser, User, users

### Community 63 - "Cycle CRUD"
Cohesion: 0.21
Nodes (3): GetCycle, ListCycles, NotCycleTeamMemberError

### Community 64 - "Notification Domain"
Cohesion: 0.24
Nodes (5): NotificationRepository, PaginatedResult, NewNotification, Notification, notifications

### Community 65 - "Comment Creation"
Cohesion: 0.18
Nodes (6): CreateComment, CreateCommentInput, CreateCommentInputType, IssueTeamQuery, NotificationService, TeamMemberQuery

### Community 66 - "History & State"
Cohesion: 0.22
Nodes (6): GetStateHistory, GetStateHistoryInput, HistoryRepository, NewStateHistoryEntry, stateHistory, StateHistoryEntry

### Community 67 - "Redis Token Store"
Cohesion: 0.18
Nodes (12): bcrypt, jose JWT Library, Redis Cache/Sessions, ADR-0001: Refresh Token Storage in Redis, JWT Utility, Logout Service, RefreshToken Service, Token Refresh and Logout Feature (+4 more)

### Community 68 - "Notification Delivery"
Cohesion: 0.24
Nodes (6): CreateNotification, CreateNotificationInput, CreateNotificationInputType, CreateNotificationOutput, CreateNotificationEvent, NotificationService

### Community 69 - "Notification Read"
Cohesion: 0.23
Nodes (4): MarkAllNotificationsRead, MarkAllNotificationsReadOutput, NotificationEvent, NotificationEventPublisher

### Community 70 - "Default Workflow"
Cohesion: 0.23
Nodes (8): ValidateTransition, ValidateTransitionInput, ValidateTransitionOutput, DEFAULT_WORKFLOW_STATES, DEFAULT_WORKFLOW_TRANSITIONS, DefaultState, DefaultTransition, isCanceledType()

### Community 71 - "Notification Lists"
Cohesion: 0.24
Nodes (6): ListNotifications, ListNotificationsInput, ListNotificationsInputType, ListNotificationsOutput, NotificationItem, toItem()

### Community 72 - "Issue Statuses"
Cohesion: 0.24
Nodes (7): DEFAULT_STATUSES, IssueStatus, issueStatuses, NewIssueStatus, db, pool, schema

### Community 73 - "Package Config"
Cohesion: 0.20
Nodes (9): author, description, keywords, license, main, name, packageManager, type (+1 more)

### Community 74 - "Team Creation"
Cohesion: 0.24
Nodes (5): CreateTeam, CreateTeamInput, CreateTeamInputType, CreateTeamOutput, TeamKeyConflictError

### Community 75 - "Project Progress"
Cohesion: 0.24
Nodes (3): GetProjectProgress, GetProjectProgressOutput, IssueQuery

### Community 76 - "Cycle Creation"
Cohesion: 0.31
Nodes (5): CreateCycle, CreateCycleInputType, CreateCycleOutput, CycleDateValidationError, CyclePastStartDateError

### Community 77 - "Session Listing"
Cohesion: 0.29
Nodes (5): ListSessions, ListSessionsInput, ListSessionsInputType, ListSessionsOutput, SessionOutput

### Community 78 - "Auth Middleware"
Cohesion: 0.25
Nodes (3): organizationMemberRepository, NotOrganizationMemberError, NotOrganizationOwnerError

### Community 79 - "Validators"
Cohesion: 0.46
Nodes (6): CreateOrganizationSchema, DeleteOrganizationSchema, GetOrganizationDetailsSchema, GetUserProfileSchema, ListUserOrganizationsSchema, UpdateUserProfileSchema

### Community 82 - "Gateway Events"
Cohesion: 0.40
Nodes (3): CHANNEL_PATTERNS, GATEWAY_EVENTS, GatewayEventEnvelope

### Community 83 - "Error Types"
Cohesion: 0.50
Nodes (4): Standardized Error Types, Rate Limiting Specification, Shared Module, Error Handling Contract

### Community 84 - "Issue Status"
Cohesion: 0.50
Nodes (4): Default Workflow Embedding — Hardcoded Status Transitions, ChangeIssueStatus Use Case, Issue Status Change Feature, Issue Status Seed Data (Default Workflow)

### Community 85 - "Workflow Service"
Cohesion: 0.50
Nodes (4): Default Workflow, Transition Validation Service, Validate Transition Use Case, Workflow Resolution Service

### Community 86 - "Cookie Migration"
Cohesion: 0.67
Nodes (4): Cookie Migration Design, Auth Cookie Migration API, Auth Cookie Migration Business Rules, CookieConfig

### Community 87 - "Session Data"
Cohesion: 0.50
Nodes (4): Logout Feature, Session Data Model (Auth), Token Refresh with Rotation, Session Data Model (Sessions)

### Community 88 - "Contract Refresh"
Cohesion: 0.50
Nodes (3): ErrorResponseSchema, RefreshTokenRequestSchema, RefreshTokenResponseSchema

### Community 90 - "Channel Subscriptions"
Cohesion: 0.67
Nodes (3): AutoSubscribe, ChannelSubscription, EventBroadcasting

### Community 91 - "Cursor Pagination"
Cohesion: 0.67
Nodes (3): Cursor-based Pagination — Composite Cursor, ListIssues Use Case, Issue Query Feature

## Knowledge Gaps
- **544 isolated node(s):** `name`, `version`, `type`, `description`, `main` (+539 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **51 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `env` connect `App Bootstrap` to `Test & Message`, `Issue Statuses`, `Refresh Token`, `Session`, `User Login`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `TokenService` connect `User Registration` to `User Login`, `Refresh Token`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `StateRepository` connect `Workflow State Create` to `Workflow Transitions`, `Workflow State`, `Default Workflow`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `name`, `version`, `type` to the rest of the system?**
  _544 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Test & Message` be split into smaller, more focused modules?**
  _Cohesion score 0.0612859097127223 - nodes in this community are weakly interconnected._
- **Should `Error Handling` be split into smaller, more focused modules?**
  _Cohesion score 0.08941176470588236 - nodes in this community are weakly interconnected._
- **Should `Watcher Module` be split into smaller, more focused modules?**
  _Cohesion score 0.0636734693877551 - nodes in this community are weakly interconnected._