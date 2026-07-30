# Graph Report - /home/jlagoria/mnt/second/dev/proyects/personal-site/linear-app-clone-backend/linear-clone-backend-js  (2026-07-29)

## Corpus Check
- 2 files · ~226,339 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2021 nodes · 3777 edges · 179 communities (105 shown, 74 thin omitted)
- Extraction: 91% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 261 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- WebSocket Gateway
- Authentication Architecture
- Error Taxonomy
- Issue Watchers
- Workflow Engine
- Identity & Team DTOs
- Soft Delete Pattern
- Workflow Controller
- Dev Dependencies
- Project DTOs
- Workflow Transitions
- Team Membership
- Project Module
- Team Deletion
- Auth Logout
- Cycle Controller
- Cycle Lifecycle
- Issue DTOs
- Work Module Specs
- Auth Controller
- Project Use Cases
- Notification DTOs
- Authorization
- App Entry & Sessions
- Token Service
- Project Module
- Identity Module
- Notification Module
- Auth Module
- Auth Module
- Notification Module
- Project Module
- Project Module
- Openspec Module
- Dist
- Identity Module
- Notification Module
- Workflow Module
- Work Module
- Openspec Module
- Cycle Module
- Cycle Module
- Openspec Module
- Identity Module
- Openspec Module
- Identity Module
- Workflow Module
- Workflow Module
- Bcrypt
- Auth Module
- Openspec Module
- Openspec Module
- Scripts
- Project Module
- Auth Module
- Auth Module
- Auth Module
- Cycle Module
- Notification Module
- Notification Module
- Notification Module
- Workflow Module
- Notification Module
- Openspec Module
- Openspec Module
- Package
- Auth Module
- Identity Module
- Project Module
- Workflow Module
- Openspec Module
- Openspec Module
- Cycle Module
- Identity Module
- Priority
- Openspec Module
- Openspec Module
- Identity Module
- Identity Module
- Openspec Module
- Openspec Module
- Cycle Module
- Auth Module
- Forward
- Openspec Module
- Project Module
- Events
- Openspec Module
- Auth Module
- Cycle Module
- Identity Module
- 0001
- Openspec Module
- Openspec Module
- Openspec Module
- Config
- Auth Module
- Identity Module
- Types
- Proposal
- Dotenv
- Orm
- Config
- Ioredis
- Jose
- Openspec Module
- Openspec Module
- Ws
- Zod
- Auth Module
- Identity Module
- Identity Module
- Identity Module
- Identity Module
- Identity Module
- Identity Module
- Identity Module
- Identity Module
- Identity Module
- Identity Module
- Yaml
- Review
- Proposal
- Gateway
- Timeout
- Subscribe
- User
- Status
- Projects
- Progress
- Lifecycle
- Rules
- Hierarchy
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Openspec Module
- Auth Module
- Auth Module
- Identity Module
- Identity Module
- Stack

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
- `Backend Modules Technology Agnostic Specification` --references--> `Token Refresh Rotation (single-use)`  [EXTRACTED]
  docs/backend/README.md → openspec/changes/archive/2026-07-12-auth-registration-login/design-backend.md
- `ADR 0003 — Use PostgreSQL with Drizzle ORM` --references--> `PostgreSQL with Drizzle ORM`  [EXTRACTED]
  openspec/changes/archive/2026-07-12-auth-registration-login/adr/0003-postgresql-with-drizzle.md → docs/stack-backend.md
- `ADR 0004 — Use Redis for Session Storage` --references--> `Redis for Session Storage`  [EXTRACTED]
  openspec/changes/archive/2026-07-12-auth-registration-login/adr/0004-redis-for-sessions.md → docs/stack-backend.md
- `ADR 0005 — Use bcrypt for Password Hashing` --references--> `bcrypt Password Hashing`  [EXTRACTED]
  openspec/changes/archive/2026-07-12-auth-registration-login/adr/0005-bcrypt-password-hashing.md → docs/stack-backend.md
- `Auth Business Specification` --references--> `Session Management Pattern (10 max, evict oldest)`  [EXTRACTED]
  openspec/changes/archive/2026-07-12-auth-registration-login/specs/business/auth.md → docs/backend/README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Backend Module System under Hexagonal Architecture** — hexagonal_architecture_pattern, module_auth, module_identity, module_work, module_workflow, module_project, module_cycle, module_notification, module_gateway, module_shared [EXTRACTED 1.00]
- **Auth Module Architecture Decision Records** — openspec_changes_archive_2026_07_12_auth_registration_login_adr_0001_hexagonal_architecture, adr_0002_jwt_dual_token, adr_0003_postgresql_drizzle, adr_0004_redis_sessions, adr_0005_bcrypt, openspec_changes_archive_2026_07_12_auth_registration_login_adr_manifest, openspec_changes_archive_2026_07_12_auth_registration_login_design_backend_auth, specs_api_auth, specs_business_auth, openspec_changes_archive_2026_07_12_auth_registration_login_proposal_auth_registration, openspec_changes_archive_2026_07_12_auth_registration_login_review_auth_registration [EXTRACTED 1.00]
- **Technology Stack & Infrastructure Documentation** — fastify_framework, postgresql_drizzle_orm, redis_session_storage, bcrypt_password_hashing, jwt_dual_token_strategy, docker_compose_deployment, rest_api_contract, websocket_gateway_contract [EXTRACTED 1.00]
- **Auth Infrastructure Pattern** — postgresql_drizzle_orm, redis_session_storage, jwt_dual_token_strategy, bcrypt_password_hashing [INFERRED 0.85]
- **Session Management Implementation Flow** — openspec_changes_archive_2026_07_13_auth_session_management_proposal_2026_07_13_session, openspec_changes_archive_2026_07_13_auth_session_management_design_backend_2026_07_13_session, specs_api_sessions_2026_07_13, specs_business_sessions_2026_07_13, openspec_changes_archive_2026_07_13_auth_session_management_tasks_backend_2026_07_13_session, openspec_changes_archive_2026_07_13_auth_session_management_review_2026_07_13_session [INFERRED 0.95]
- **Token Refresh Implementation Flow** — openspec_changes_archive_2026_07_13_auth_token_refresh_logout_proposal_2026_07_13_token_refresh, openspec_changes_archive_2026_07_13_auth_token_refresh_logout_design_backend_2026_07_13_token_refresh, specs_api_auth_2026_07_13_token_refresh, specs_business_auth_2026_07_13_token_refresh, openspec_changes_archive_2026_07_13_auth_token_refresh_logout_review_2026_07_13_token_refresh [INFERRED 0.95]
- **hyper_identity_module_architecture** — concept_hexagonal_architecture, concept_shared_entity_ownership, concept_soft_deletion, concept_cascade_soft_delete, src_modules_identity, src_modules_identity_domain_user, src_modules_identity_domain_organization, src_modules_identity_domain_organization_member, src_modules_identity_application_ports, src_modules_identity_application_use_cases, src_modules_identity_adators_out_drizzle_repositories [INFERRED 1.00]
- **hyper_error_handling_infrastructure** — concept_in_memory_rate_limit, src_shared_errors, src_shared_rate_limiting, openspec/adr_custom_error_class_hierarchy, openspec/adr_in_memory_rate_limit_store, openspec_spec_api_error_contract [INFERRED 1.00]
- **hyper_auth_token_refresh_flow** — concept_jwt_refresh_rotation, src_modules_auth_application_ports, src_modules_auth_adapters_out_redis_session_store, src_modules_auth_application_refresh_token_service, src_modules_auth_application_logout_service, src_modules_auth_adators_in_refresh_route, src_modules_auth_adators_in_logout_route, openspec_changes_archive_2026_07_13_identity_user_profile_org_tech_stack_redis_7, openspec_changes_archive_2026_07_13_auth_token_refresh_logout_tech_stack_jwt_jose_bcrypt [INFERRED 1.00]
- **Team domain cluster** — team_entity, team_member_entity, team_repository, team_member_repository, use_case_create_team, use_case_delete_team [1.0]
- **Shared error taxonomy** — error_class_base_error, error_class_not_found_error, error_class_validation_error, error_class_conflict_error, error_class_unauthorized_error, error_class_forbidden_error, error_class_business_rule_error, error_class_rate_limit_error, error_class_internal_error [1.0]
- **Work module extensions** — issue_comment_entity, label_entity, issue_watcher_entity, issue_labels_junction [1.0]
- **Issue CRUD: Full Spec-to-Task Pipeline** — 2026-07-14-work-module-issue-crud-status__proposal, 2026-07-14-work-module-issue-crud-status__design_backend, 2026-07-14-work-module-issue-crud-status__specs_api_issues, 2026-07-14-work-module-issue-crud-status__specs_business_issues, 2026-07-14-work-module-issue-crud-status__tasks_backend [INFERRED]
- **ADRs: Issue CRUD Architecture Decisions** — 2026-07-14-work-module-issue-crud-status__adr_0001_issue_identifier_sequence, 2026-07-14-work-module-issue-crud-status__adr_0002_default_workflow_embedding, 2026-07-14-work-module-issue-crud-status__adr_0003_soft_delete_pattern, 2026-07-14-work-module-issue-crud-status__adr_0004_cursor_pagination [INFERRED]
- **Comments/Labels/Watchers: Full Spec-to-Task Pipeline** — 2026-07-14-ticket-08-work-module-comments-labels-watchers__specs_api_comments, 2026-07-14-ticket-08-work-module-comments-labels-watchers__specs_api_labels, 2026-07-14-ticket-08-work-module-comments-labels-watchers__specs_api_watchers, 2026-07-14-ticket-08-work-module-comments-labels-watchers__specs_business_comments, 2026-07-14-ticket-08-work-module-comments-labels-watchers__specs_business_labels, 2026-07-14-ticket-08-work-module-comments-labels-watchers__specs_business_watchers, 2026-07-14-ticket-08-work-module-comments-labels-watchers__tasks_backend [INFERRED]
- **Project Module Hexagonal Architecture** — entity_project, enum_project_status, port_project_repository, port_team_member_query, port_team_admin_query, port_issue_query, port_issue_update_query, adapter_project_controller, adapter_drizzle_project_repository, usecase_create_project, usecase_update_project, usecase_change_project_status, usecase_get_project_progress, usecase_add_issue_to_project, usecase_remove_issue_from_project [INFERRED]
- **Workflow Module Hexagonal Architecture** — entity_workflow_state, entity_workflow_transition, entity_state_history, enum_workflow_state_type, default_workflow_definition, port_state_repository, port_transition_repository, port_history_repository, service_workflow_state_service, service_workflow_transition_service, service_transition_validation_service, service_state_history_service, service_workflow_resolution_service, adapter_workflow_controller [INFERRED]
- **Workflow-Work Module Integration** — service_transition_validation_service, entity_workflow_state, entity_workflow_transition, entity_state_history, service_state_history_service [INFERRED]
- **Cycle lifecycle: Draft → Active → Completed** — cycle_module, cycle_entity, cycle_status_enum, openspec_changes_archive_2026_07_16_cycle_module_crud_lifecycle_adr_0001_cycle_auto_complete [EXTRACTED 0.97]
- **Gateway real-time architecture** — gateway_module, gateway_ws_server, gateway_connection_registry, gateway_subscription_manager, gateway_online_status_redis, gateway_event_bus [EXTRACTED 0.96]
- **Workflow transition validation flow** — openspec_changes_archive_2026_07_15_workflow_module_custom_workflows_validation_specs_business_workflow_module, workflow_resolution_service, workflow_validation_service, openspec_changes_archive_2026_07_15_workflow_module_custom_workflows_validation_specs_business_workflow_transition, state_history [EXTRACTED 0.95]
- **Notification Module - Complete Design Artifacts** — archive_2026_07_16_notification_module_proposal, notification_adr_0001_store_forward, notification_adr_0002_sync_event_ingestion, notification_design_backend, notification_data_model, notification_api_contract, notification_business_rules, notification_recipient_resolver [0.95]
- **Gateway WebSocket Broadcasting - Complete Design Artifacts** — archive_2026_07_16_gateway_ws_broadcasting_proposal, ws_websocket_protocol_contract, ws_channel_types, ws_gateway_business_rules, ws_tech_stack [0.95]
- **Auth Cookie Migration - Complete Design Artifacts** — archive_2026_07_20_cookie_migration_proposal, cookie_migration_adr_0001, cookie_migration_design, cookie_security_model [0.95]
- **he_auth_cookie_migration_pipeline** — openspec_changes_archive_2026-07-20-migrate-refresh-token-to-httponly-cookie_specs_api_auth_cookie_migration, openspec_changes_archive_2026-07-20-migrate-refresh-token-to-httponly-cookie_specs_business_auth_cookie_migration, openspec_changes_archive_2026-07-20-migrate-refresh-token-to-httponly-cookie_tech_stack, openspec_changes_archive_2026-07-20-migrate-refresh-token-to-httponly-cookie_tasks_backend [1.0]
- **he_ws_realtime_pipeline** — openspec_changes_archive_2026-07-27-websocket-realtime-kanban-backend_proposal, openspec_changes_archive_2026-07-27-websocket-realtime-kanban-backend_specs_api_websocket_gateway_protocol, openspec_changes_archive_2026-07-27-websocket-realtime-kanban-backend_specs_business_websocket_realtime_business_rules, openspec_changes_archive_2026-07-27-websocket-realtime-kanban-backend_tech_stack, openspec_changes_archive_2026-07-27-websocket-realtime-kanban-backend_design_backend, openspec_changes_archive_2026-07-27-websocket-realtime-kanban-backend_adr_0001_in_process_event_bridge, openspec_changes_archive_2026-07-27-websocket-realtime-kanban-backend_adr_0002_channel_access_validation, openspec_changes_archive_2026-07-27-websocket-realtime-kanban-backend_adr_0003_auto_subscription, openspec_changes_archive_2026-07-27-websocket-realtime-kanban-backend_adr_manifest, openspec_changes_archive_2026-07-27-websocket-realtime-kanban-backend_tasks_backend, openspec_changes_archive_2026-07-27-websocket-realtime-kanban-backend_review [1.0]
- **he_openspec_schema_system** — openspec_config_yaml, openspec_schemas_backend_schema_schema_yaml, openspec_schemas_backend_schema_templates_proposal, openspec_schemas_backend_schema_templates_design_backend, openspec_schemas_backend_schema_templates_adr, openspec_schemas_backend_schema_templates_review [1.0]
- **Authentication domain** — openspec_specs_api_auth, openspec_specs_api_sessions, openspec_specs_business_auth, entity_session, entity_user [INFERRED 0.95]
- **Comments domain** — openspec_specs_api_comments, openspec_specs_business_comments, entity_comment, entity_issue, entity_user [INFERRED 0.95]
- **Real-time event delivery system** — openspec_specs_api_websocket-protocol, openspec_specs_api_issues, openspec_specs_api_comments, openspec_specs_api_labels, openspec_specs_api_watchers [INFERRED 0.92]
- **hyper_cycle_issue_team_assignment** — openspec_specs_business_cycles_cycle, openspec_specs_business_issues_issue, openspec_specs_business_team_team [INFERRED 1.00]
- **hyper_gateway_event_broadcast_flow** — business_gateway_event, business_gateway_channel, business_gateway_subscription, business_gateway_connection [INFERRED 1.00]
- **hyper_workflow_issue_status_history** — openspec_specs_business_issues_issue [INFERRED 1.00]

## Communities (179 total, 74 thin omitted)

### Community 0 - "WebSocket Gateway"
Cohesion: 0.06
Nodes (45): MessageHandler, GatewayWebSocketServer, AuthenticateConnection, autoSubscribeUserChannels(), BroadcastEvent, HandleDisconnect, ManageSubscription, AuthenticateResult (+37 more)

### Community 1 - "Authentication Architecture"
Cohesion: 0.06
Nodes (71): ADR 0002 — Use JWT Dual Token Strategy, ADR 0003 — Use PostgreSQL with Drizzle ORM, ADR 0004 — Use Redis for Session Storage, ADR 0005 — Use bcrypt for Password Hashing, Auth Registration Login Change, Auth Session Management Change, Auth Token Refresh & Logout Change, bcrypt Password Hashing (+63 more)

### Community 2 - "Error Taxonomy"
Cohesion: 0.06
Nodes (29): AddWatcherRequestSchema, WatcherIdParamsSchema, addWatcher, eventPublisher, getUserIdFromToken(), issueTeamQuery, listWatchers, removeWatcher (+21 more)

### Community 3 - "Issue Watchers"
Cohesion: 0.09
Nodes (18): BaseError, BusinessRuleError, ConflictError, errorHandler(), ForbiddenError, InternalError, NotFoundError, RateLimitError (+10 more)

### Community 4 - "Workflow Engine"
Cohesion: 0.05
Nodes (47): AddWatcherRequest, AssignIssueRequest, AssignIssueRequestSchema, ChangeIssueStatusRequest, ChangeIssueStatusRequestSchema, CommentIdParams, CommentResponse, CreateCommentRequest (+39 more)

### Community 5 - "Identity & Team DTOs"
Cohesion: 0.06
Nodes (41): AddTeamMemberRequest, AddTeamMemberRequestSchema, CreateOrganizationRequest, CreateOrganizationRequestSchema, CreateTeamRequest, CreateTeamRequestSchema, ErrorResponse, OrganizationIdParams (+33 more)

### Community 6 - "Soft Delete Pattern"
Cohesion: 0.07
Nodes (18): AssignIssue, AssignIssueInput, AssignIssueInputType, AssignIssueOutput, NotificationService, TeamMemberQuery, DeleteIssue, ListIssues (+10 more)

### Community 7 - "Workflow Controller"
Cohesion: 0.08
Nodes (40): createTransition, createWorkflowState, deleteTransition, deleteWorkflowState, getStateHistory, getUserIdFromToken(), historyRepository, listTransitions (+32 more)

### Community 8 - "Dev Dependencies"
Cohesion: 0.05
Nodes (41): drizzle-kit, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-boundaries, eslint-plugin-prettier, devDependencies, drizzle-kit (+33 more)

### Community 9 - "Project DTOs"
Cohesion: 0.09
Nodes (17): GetIssueLabels, ListLabels, LabelRepository, issueComments, IssueLabel, issueLabels, NewIssueLabel, DEFAULT_STATUSES (+9 more)

### Community 10 - "Workflow Transitions"
Cohesion: 0.08
Nodes (36): AddIssueRequest, AddIssueRequestSchema, ChangeProjectStatusRequest, ChangeProjectStatusRequestSchema, CreateProjectRequest, CreateProjectRequestSchema, ListProjectsQuery, ListProjectsQuerySchema (+28 more)

### Community 11 - "Team Membership"
Cohesion: 0.09
Nodes (28): app, authRoutes(), eventPublisher, getAuthInfo(), getCurrentSessionRefreshTokenHash(), listSessions, LoginRequestSchema, loginUser (+20 more)

### Community 12 - "Project Module"
Cohesion: 0.09
Nodes (24): commentRepository, commentRoutes(), createComment, deleteComment, eventPublisher, getUserIdFromToken(), issueRepository, issueTeamQuery (+16 more)

### Community 13 - "Team Deletion"
Cohesion: 0.10
Nodes (14): CreateLabel, CreateLabelInput, CreateLabelInputType, DeleteLabel, DetachLabel, DetachLabelInput, DetachLabelInputType, Event (+6 more)

### Community 14 - "Auth Logout"
Cohesion: 0.09
Nodes (12): CreateTransition, CreateTransitionInput, DeleteTransition, DeleteTransitionInput, DeleteWorkflowState, DeleteWorkflowStateInput, ListTransitions, ListTransitionsInput (+4 more)

### Community 15 - "Cycle Controller"
Cohesion: 0.11
Nodes (12): DeleteTeamInput, GetTeamDetailsInput, ListTeamMembersInput, TeamMemberRepository, RemoveTeamMemberInput, LastAdminRemovalError, NotTeamAdminError, NotTeamMemberError (+4 more)

### Community 16 - "Cycle Lifecycle"
Cohesion: 0.08
Nodes (25): CreateLabelRequestSchema, IssueLabelParamsSchema, LabelIdParamsSchema, UpdateLabelRequestSchema, attachLabel, createLabel, deleteLabel, detachLabel (+17 more)

### Community 17 - "Issue DTOs"
Cohesion: 0.09
Nodes (17): GetUserProfile, GetUserProfileInput, GetUserProfileOutput, UserProfileRepository, UpdateUserProfile, UpdateUserProfileInput, UpdateUserProfileInputType, UpdateUserProfileOutput (+9 more)

### Community 18 - "Work Module Specs"
Cohesion: 0.09
Nodes (31): DrizzleProjectRepository, ProjectController (Fastify Routes), ADR-0001: Use Enum for Project Status Instead of Workflow Join Table, ADR-0002: Compute Project Progress on Read Instead of Storing, ADR-0003: Canceled as Terminal Status Instead of Hard Delete, Projects API Contract, PRJ-DEL: No Hard Delete, PRJ-S1: Project Creation Default Status (+23 more)

### Community 19 - "Auth Controller"
Cohesion: 0.08
Nodes (16): CreateIssue, CreateIssueInput, CreateIssueInputType, CreateIssueOutput, ProjectQuery, TeamKeyQuery, TeamMemberQuery, ProjectQuery (+8 more)

### Community 20 - "Project Use Cases"
Cohesion: 0.13
Nodes (13): LogoutUser, LogoutUserInput, LogoutUserInputType, LogoutUserOutput, Event, EventPublisher, RevokeAllSessions, RevokeAllSessionsInput (+5 more)

### Community 21 - "Notification DTOs"
Cohesion: 0.10
Nodes (27): activateCycle, completeCycle, createCycle, cycleRepository, cycleRoutes(), deleteCycle, eventPublisher, getCycle (+19 more)

### Community 22 - "Authorization"
Cohesion: 0.10
Nodes (10): CreateComment, CreateCommentInput, CreateCommentInputType, IssueTeamQuery, NotificationService, TeamMemberQuery, ListIssueComments, CommentRepository (+2 more)

### Community 23 - "App Entry & Sessions"
Cohesion: 0.12
Nodes (11): ActivateCycle, NotificationService, CompleteCycle, NotificationService, CreateCycleInput, CycleEvent, CycleEventPublisher, TeamMemberQuery (+3 more)

### Community 24 - "Token Service"
Cohesion: 0.10
Nodes (27): Issue Comment Entity, Issue Watcher Entity, Label Entity, Review: Work Module Comments, Labels, and Watchers, API Spec: Issue Comments, API Spec: Labels, API Spec: Issue Watchers, Business Spec: Issue Comments (+19 more)

### Community 25 - "Project Module"
Cohesion: 0.12
Nodes (11): AddIssueToProjectInput, ChangeProjectStatus, ChangeProjectStatusInput, ChangeProjectStatusInputType, VALID_TRANSITIONS, ProjectEvent, ProjectEventPublisher, IssueUpdateQuery (+3 more)

### Community 26 - "Identity Module"
Cohesion: 0.11
Nodes (13): Cascade Soft-Deletion, Soft Deletion Strategy, ADR: Soft Deletion Strategy for All Entities, GetOrganizationDetails, GetOrganizationDetailsInput, GetOrganizationDetailsOutput, ListUserOrganizations, ListUserOrganizationsInput (+5 more)

### Community 27 - "Notification Module"
Cohesion: 0.12
Nodes (24): ListNotificationsQuery, ListNotificationsQuerySchema, MarkAllReadResponse, MarkReadResponse, NotificationIdParams, NotificationIdParamsSchema, NotificationListResponse, NotificationPreferencesResponse (+16 more)

### Community 28 - "Auth Module"
Cohesion: 0.10
Nodes (19): ErrorResponseSchema, eventPublisher, listSessions, ListSessionsResponseSchema, TODO: This needs to be fixed to properly identify the current session., revokeAllSessions, RevokeAllSessionsResponseSchema, revokeSession (+11 more)

### Community 29 - "Auth Module"
Cohesion: 0.12
Nodes (10): TokenService, RefreshToken, RefreshTokenInput, RefreshTokenInputType, RefreshTokenOutput, TokenExpiredError, TokenRevokedError, ValidateToken (+2 more)

### Community 30 - "Notification Module"
Cohesion: 0.14
Nodes (12): DEFAULT_TYPES, GetNotificationPreferences, GetNotificationPreferencesOutput, NotificationPreferencesRepository, DEFAULT_TYPES, UpdateNotificationPreferences, UpdateNotificationPreferencesInput, UpdateNotificationPreferencesInputType (+4 more)

### Community 31 - "Project Module"
Cohesion: 0.15
Nodes (9): AddIssueToProject, AddIssueToProjectInputType, IssueQuery, CannotReopenCompletedProjectError, InvalidProjectStatusTransitionError, IssueAlreadyInProjectError, NotProjectTeamMemberError, ProjectCancelNotAdminError (+1 more)

### Community 32 - "Project Module"
Cohesion: 0.14
Nodes (10): CreateProject, CreateProjectInput, CreateProjectInputType, CreateProjectOutput, TeamMemberQuery, UpdateProject, UpdateProjectInput, UpdateProjectInputType (+2 more)

### Community 33 - "Openspec Module"
Cohesion: 0.13
Nodes (22): WorkflowController (Fastify Routes), ADR-0001: Embed Default Workflow in Code Rather Than Database, ADR-0002: Append-Only State History for Audit Trail, ADR-0003: Cancel State Transitions Bypass All Validation, Workflow API Contract, Default Workflow Definition, Workflow Module Backend Design, StateHistory (+14 more)

### Community 34 - "Dist"
Cohesion: 0.09
Nodes (21): dist, ES2022, node_modules, src/**/*, compilerOptions, declaration, declarationMap, esModuleInterop (+13 more)

### Community 35 - "Identity Module"
Cohesion: 0.14
Nodes (8): DeleteOrganization, DeleteOrganizationInput, ListTeams, ListTeamsInput, OrganizationMemberRepository, OrganizationNotFoundError, NewOrganizationMember, OrganizationMember

### Community 36 - "Notification Module"
Cohesion: 0.15
Nodes (10): MarkNotificationRead, MarkNotificationReadInput, MarkNotificationReadInputType, MarkNotificationReadOutput, InvalidFilterError, InvalidNotificationTypeError, NOTIFICATION_TYPES, NotificationNotFoundError (+2 more)

### Community 37 - "Workflow Module"
Cohesion: 0.11
Nodes (6): CreateWorkflowState, ListWorkflowStates, ListWorkflowStatesInput, StateRepository, UpdateWorkflowState, WorkflowState

### Community 38 - "Work Module"
Cohesion: 0.14
Nodes (10): ChangeIssueStatus, ChangeIssueStatusInput, ChangeIssueStatusInputType, ChangeIssueStatusOutput, IssueStatusQuery, NotificationService, StatusType, StateHistoryService (+2 more)

### Community 39 - "Openspec Module"
Cohesion: 0.13
Nodes (19): ADR: Team Entity Placement in Identity Module, ADR: Soft-Delete Cascade Strategy, Team & Membership Proposal, Team API Contract, Team Business Specification, Team & Membership Backend Tasks, Team & Membership Tech Stack, Team (+11 more)

### Community 40 - "Cycle Module"
Cohesion: 0.16
Nodes (5): DeleteCycle, ActiveCycleCannotBeDeletedError, CycleNotFoundError, DraftCycleCannotBeCompletedError, EmptyCycleNameError

### Community 41 - "Cycle Module"
Cohesion: 0.18
Nodes (8): CycleFilters, CycleRepository, PaginatedResult, Cycle, cycles, cycleStatusEnum, NewCycle, CycleNotActiveForIssueAssignmentError

### Community 42 - "Openspec Module"
Cohesion: 0.16
Nodes (17): Gateway Channel, Issue Channel, Team Channel, Gateway Connection, Gateway Event, Gateway Subscription, Project Cancellation, Project (+9 more)

### Community 43 - "Identity Module"
Cohesion: 0.15
Nodes (8): CreateOrganization, CreateOrganizationInput, CreateOrganizationInputType, CreateOrganizationOutput, Event, EventPublisher, RemoveTeamMember, OrganizationNameConflictError

### Community 44 - "Openspec Module"
Cohesion: 0.21
Nodes (16): Cycle Entity, Issue Entity, Label Entity, Notification Entity, Team Entity, User Entity, Notification API Contract, API Contract Template (+8 more)

### Community 45 - "Identity Module"
Cohesion: 0.15
Nodes (5): DeleteTeam, GetTeamDetails, ListTeamMembers, TeamRepository, Team

### Community 46 - "Workflow Module"
Cohesion: 0.22
Nodes (8): CreateWorkflowStateInput, UpdateWorkflowStateInput, WorkflowStateType, DuplicateStateNameError, MissingCompletedStateError, MissingUnstartedStateError, MultipleCanceledStatesError, NotTeamAdminError

### Community 47 - "Workflow Module"
Cohesion: 0.17
Nodes (9): DuplicateTransitionError, StateInUseError, TransitionNotFoundError, NewStateHistoryEntry, stateHistory, NewWorkflowState, workflowStates, NewWorkflowTransition (+1 more)

### Community 48 - "Bcrypt"
Cohesion: 0.13
Nodes (15): bcrypt, fastify, @fastify/cookie, @fastify/cors, @fastify/rate-limit, dependencies, bcrypt, fastify (+7 more)

### Community 49 - "Auth Module"
Cohesion: 0.13
Nodes (14): AuthResponse, AuthResponseSchema, ErrorResponse, ErrorResponseSchema, LoginRequest, LoginRequestSchema, RefreshRequest, RefreshRequestSchema (+6 more)

### Community 50 - "Openspec Module"
Cohesion: 0.14
Nodes (14): ADR-001: Use ws Library for WebSocket Server, ADR-002: Store Connection State In-Memory, ADR-003: In-Process EventEmitter for Broadcasting, AuthenticateConnection Use Case, BroadcastEvent Use Case, In-Memory Connection Registry, Gateway Backend Design, EventBus Port (EventEmitter adapter) (+6 more)

### Community 51 - "Openspec Module"
Cohesion: 0.15
Nodes (14): BaseError, BusinessRuleError, ConflictError, ForbiddenError, InternalError, NotFoundError, RateLimitError, UnauthorizedError (+6 more)

### Community 52 - "Scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:generate, db:migrate, db:push, db:studio, dev, format (+6 more)

### Community 53 - "Project Module"
Cohesion: 0.26
Nodes (7): PaginatedResult, ProjectFilters, ProjectRepository, NewProject, Project, projects, projectStatusEnum

### Community 54 - "Auth Module"
Cohesion: 0.22
Nodes (7): LoginUser, LoginUserInput, LoginUserInputType, LoginUserOutput, UnauthorizedError, hashToken(), verifyTokenHash()

### Community 56 - "Auth Module"
Cohesion: 0.32
Nodes (6): UserRepository, NewSession, sessions, NewUser, User, users

### Community 57 - "Cycle Module"
Cohesion: 0.21
Nodes (3): GetCycle, ListCycles, NotCycleTeamMemberError

### Community 58 - "Notification Module"
Cohesion: 0.24
Nodes (5): NotificationRepository, PaginatedResult, NewNotification, Notification, notifications

### Community 59 - "Notification Module"
Cohesion: 0.24
Nodes (6): CreateNotification, CreateNotificationInput, CreateNotificationInputType, CreateNotificationOutput, CreateNotificationEvent, NotificationService

### Community 60 - "Notification Module"
Cohesion: 0.23
Nodes (4): MarkAllNotificationsRead, MarkAllNotificationsReadOutput, NotificationEvent, NotificationEventPublisher

### Community 61 - "Workflow Module"
Cohesion: 0.23
Nodes (8): ValidateTransition, ValidateTransitionInput, ValidateTransitionOutput, DEFAULT_WORKFLOW_STATES, DEFAULT_WORKFLOW_TRANSITIONS, DefaultState, DefaultTransition, isCanceledType()

### Community 62 - "Notification Module"
Cohesion: 0.24
Nodes (6): ListNotifications, ListNotificationsInput, ListNotificationsInputType, ListNotificationsOutput, NotificationItem, toItem()

### Community 63 - "Openspec Module"
Cohesion: 0.20
Nodes (10): Hexagonal Architecture (Ports and Adapters), Shared Entity Ownership (Field-Level), ADR: Hexagonal Architecture for Identity Module, ADR: Shared Entity Ownership Between Auth and Identity Modules, Identity User Profile & Organization Change, Identity Module Backend Design, Identity API Contract Spec, Identity Business Spec (+2 more)

### Community 64 - "Openspec Module"
Cohesion: 0.24
Nodes (10): ADR-0001 In-Process Event Bridge, ADR-0002 Channel Access Validation, ADR-0003 Auto-Subscription on Authentication, WebSocket Change ADR Manifest, WebSocket Backend Design, WebSocket Change Review, WebSocket Gateway Protocol API Spec, WebSocket Realtime Business Rules (+2 more)

### Community 65 - "Package"
Cohesion: 0.20
Nodes (9): author, description, keywords, license, main, name, packageManager, type (+1 more)

### Community 66 - "Auth Module"
Cohesion: 0.24
Nodes (5): ConflictError, RegisterUser, RegisterUserInput, RegisterUserInputType, RegisterUserOutput

### Community 67 - "Identity Module"
Cohesion: 0.24
Nodes (5): CreateTeam, CreateTeamInput, CreateTeamInputType, CreateTeamOutput, TeamKeyConflictError

### Community 68 - "Project Module"
Cohesion: 0.24
Nodes (3): GetProjectProgress, GetProjectProgressOutput, IssueQuery

### Community 69 - "Workflow Module"
Cohesion: 0.29
Nodes (4): GetStateHistory, GetStateHistoryInput, HistoryRepository, StateHistoryEntry

### Community 70 - "Openspec Module"
Cohesion: 0.25
Nodes (9): Default Workflow (Embedded), Workflow Module, WorkflowState Entity, Workflow State Type Enum, WorkflowTransition Entity, StateHistory Entity, Workflow Module API Endpoints, WorkflowResolutionService (+1 more)

### Community 71 - "Openspec Module"
Cohesion: 0.31
Nodes (9): Comment Entity, Session Entity, Business Specification Template, Backend Tasks Template, Auth API Contract, Comments API Contract, Sessions API Contract, Auth Business Specification (+1 more)

### Community 72 - "Cycle Module"
Cohesion: 0.31
Nodes (5): CreateCycle, CreateCycleInputType, CreateCycleOutput, CycleDateValidationError, CyclePastStartDateError

### Community 73 - "Identity Module"
Cohesion: 0.28
Nodes (4): AddTeamMember, AddTeamMemberInput, AddTeamMemberInputType, AlreadyTeamMemberError

### Community 74 - "Priority"
Cohesion: 0.25
Nodes (8): Code Intelligence Priority Order, CodeGraph, Graphify, Headroom Memory MCP, Mandatory Project Rules, Memory as Primary Source of Truth, RTK (Rust Token Killer), Token-Optimized Commands Rule

### Community 75 - "Openspec Module"
Cohesion: 0.29
Nodes (8): Cycles API Contract, Cycle Entity, Cycle Module, Cycle Module Backend Tasks, Cycle Status Enum (draft, active, completed), Cycle Use Cases, ADR-0001: Cycle Auto-Complete on Activation, ADR-0002: Cycle Status as Database Enum

### Community 76 - "Openspec Module"
Cohesion: 0.29
Nodes (8): IssueComment, IssueLabel, Label, ADR: Extend Work Module with Subdomains, ADR: Soft-Delete for Comments and Labels, ADR: Flat Comment Threading, Work Module Comments/Labels/Watchers Backend Design, Work Module Comments/Labels/Watchers Proposal

### Community 77 - "Identity Module"
Cohesion: 0.25
Nodes (3): organizationMemberRepository, NotOrganizationMemberError, NotOrganizationOwnerError

### Community 78 - "Identity Module"
Cohesion: 0.46
Nodes (6): CreateOrganizationSchema, DeleteOrganizationSchema, GetOrganizationDetailsSchema, GetUserProfileSchema, ListUserOrganizationsSchema, UpdateUserProfileSchema

### Community 79 - "Openspec Module"
Cohesion: 0.29
Nodes (7): In-Memory Rate Limit Store (MVP), ADR: In-Memory Rate Limit Store for MVP, Shared Error Types & Rate Limiting Change, Shared Module Backend Design (Errors & Rate Limiting), Error Contract API Spec, Shared Error Class Hierarchy, Shared Rate Limiting Module

### Community 80 - "Openspec Module"
Cohesion: 0.33
Nodes (6): OpenSpec Config, Backend Schema Definition, ADR Template, Design Backend Template, Proposal Template, Review Template

### Community 82 - "Auth Module"
Cohesion: 0.40
Nodes (5): JWT Refresh Token Rotation, Auth Token Refresh & Logout Change, Auth Token Refresh & Logout Tasks, RedisSessionStore Adapter, RefreshTokenService

### Community 83 - "Forward"
Cohesion: 0.40
Nodes (5): ADR-0001: Store-and-Forward Notifications, ADR-0002: Synchronous Event Ingestion, Notification Data Model, Notification Module Backend Design, Notification Recipient Resolver

### Community 84 - "Openspec Module"
Cohesion: 0.40
Nodes (5): Tech Selection Template, Architecture Template, Deployment Template, Technology Templates README, Stack Template

### Community 86 - "Events"
Cohesion: 0.40
Nodes (3): CHANNEL_PATTERNS, GATEWAY_EVENTS, GatewayEventEnvelope

### Community 87 - "Openspec Module"
Cohesion: 0.50
Nodes (4): Auth Cookie Migration API Spec, Auth Cookie Migration Business Spec, Auth Cookie Migration Backend Tasks, Auth Cookie Migration Tech Stack

### Community 88 - "Auth Module"
Cohesion: 0.50
Nodes (3): ErrorResponseSchema, RefreshTokenRequestSchema, RefreshTokenResponseSchema

### Community 90 - "Identity Module"
Cohesion: 0.50
Nodes (4): Identity Controller, Identity Auth & Authorization Middleware, Identity Drizzle Repositories, Identity Use Cases

### Community 91 - "0001"
Cohesion: 0.67
Nodes (3): ADR-0001: HttpOnly Cookie for Refresh Token, Cookie Migration Backend Design, Cookie Security Model

### Community 92 - "Openspec Module"
Cohesion: 0.67
Nodes (3): OpenSpec Artifact Workflow, OpenSpec Auth Registration Login Change Config, OpenSpec Schema Collection README

### Community 93 - "Openspec Module"
Cohesion: 0.67
Nodes (3): Active Cycle Status, Completed Cycle Status, Draft Cycle Status

### Community 94 - "Openspec Module"
Cohesion: 0.67
Nodes (3): Session Eviction, Session Revocation, Session

### Community 95 - "Config"
Cohesion: 0.67
Nodes (3): Serena IDE Project Configuration, linear-clone-backend-js Project, TypeScript Language Server

### Community 98 - "Types"
Cohesion: 0.67
Nodes (3): WebSocket Channel Types, Gateway Business Rules, WebSocket Protocol Contract

## Knowledge Gaps
- **550 isolated node(s):** `name`, `version`, `type`, `description`, `main` (+545 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **74 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `env` connect `Team Membership` to `WebSocket Gateway`, `Project DTOs`, `Auth Module`, `Auth Module`, `Auth Module`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `FastifyInstance` connect `Team Membership` to `WebSocket Gateway`, `Error Taxonomy`, `Issue Watchers`, `Workflow Engine`, `Identity & Team DTOs`, `Workflow Controller`, `Workflow Transitions`, `Project Module`, `Cycle Lifecycle`, `Notification DTOs`, `Notification Module`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `TokenService` connect `Auth Module` to `Auth Module`, `Auth Module`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `name`, `version`, `type` to the rest of the system?**
  _550 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `WebSocket Gateway` be split into smaller, more focused modules?**
  _Cohesion score 0.05742393045069778 - nodes in this community are weakly interconnected._
- **Should `Authentication Architecture` be split into smaller, more focused modules?**
  _Cohesion score 0.061569416498993966 - nodes in this community are weakly interconnected._
- **Should `Error Taxonomy` be split into smaller, more focused modules?**
  _Cohesion score 0.06108597285067873 - nodes in this community are weakly interconnected._