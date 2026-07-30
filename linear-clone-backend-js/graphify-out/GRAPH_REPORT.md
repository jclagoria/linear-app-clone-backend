# Graph Report - .  (2026-07-30)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2030 nodes · 3806 edges · 182 communities (108 shown, 74 thin omitted)
- Extraction: 91% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 259 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cef126ba`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- gateway/index.ts
- Auth Module
- comment-controller.ts
- errors/index.ts
- issue-controller.ts
- LabelRepository
- identity-controller.ts
- controller.ts
- devDependencies
- identity/domain/errors.ts
- project-controller.ts
- TransitionRepository
- create-issue.ts
- work/domain/errors.ts
- Project Module Backend Design
- workflow/domain/errors.ts
- cycle-controller.ts
- TeamMemberQuery
- identity/domain/index.ts
- Backend Design: Issue CRUD & Status
- auth-controller.ts
- change-project-status.ts
- label-controller.ts
- OrganizationRepository
- notification-controller.ts
- session-controller.ts
- EventPublisher
- watcher-controller.ts
- refresh-token.ts
- update-notification-preferences.ts
- OrganizationMemberRepository
- project/domain/errors.ts
- create-project.ts
- IssueRepository
- Workflow Module Backend Design
- compilerOptions
- SessionRepository
- StateRepository
- EventPublisher
- EventPublisher
- change-issue-status.ts
- Team
- cycle/domain/errors.ts
- CycleRepository
- notification/domain/index.ts
- Issue
- add-team-member.ts
- TeamMemberRepository
- API Contract Template
- dependencies
- auth/adapters/in/dto.ts
- mark-all-notifications-read.ts
- Gateway Backend Design
- BaseError
- scripts
- ProjectRepository
- login-user.ts
- auth/domain/index.ts
- NotCycleTeamMemberError
- NotificationRepository
- add-watcher.ts
- attach-label.ts
- create-comment.ts
- get-state-history.ts
- create-team.ts
- create-notification.ts
- validate-transition.ts
- list-notifications.ts
- Identity User Profile & Organization Change
- WebSocket Backend Design
- package.json
- workflow/domain/index.ts
- get-project-progress.ts
- Workflow Module
- Comments API Contract
- register-user.ts
- Code Intelligence Priority Order
- Cycle Module
- IssueComment
- validators.ts
- In-Memory Rate Limit Store (MVP)
- Backend Schema Definition
- create-cycle.ts
- RedisSessionStore Adapter
- Notification Module Backend Design
- Tech Selection Template
- ProjectHardDeleteNotAllowedError
- events.ts
- Auth Cookie Migration Business Spec
- contract-refresh.test.ts
- CycleQuery
- Cookie Migration Backend Design
- OpenSpec Config (backend-schema)
- OpenSpec Artifact Workflow
- Active Cycle Status
- Session
- Serena IDE Project Configuration
- contract-logout.test.ts
- auth-middleware.ts
- WebSocket Protocol Contract
- Gateway WebSocket Broadcasting Proposal
- ioredis
- eslint.config.js
- @fastify/cookie
- activate-cycle.test.ts
- jose
- Issue Identifier
- Notification Preferences
- ws
- zod
- POST /api/v1/auth/logout Route
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
- OpenSpec Config: Issue CRUD & Status
- Review: Issue CRUD & Status
- Refresh Token HttpOnly Cookie Migration Proposal
- WebSocket Gateway
- WebSocket Auth Timeout
- Auto-Subscribe on Auth
- User Channel
- User Online Status
- Project Management
- Project Progress Calculation
- Project Status Lifecycle
- Notification Business Rules
- ADR: Custom Error Class Hierarchy
- ADR: Team Key Uniqueness Strategy
- Team & Membership Backend Design
- WebSocket Change OpenSpec Config
- WebSocket Real-Time Backend Proposal
- Auth Session Management OpenSpec Config
- Auth Token Refresh & Logout OpenSpec Config
- JWT (jose) + bcrypt
- Fastify 5
- Node.js 24 LTS
- PostgreSQL 16
- Redis 7
- Vitest
- Zod
- Business Cycles
- Cycle Issue Assignment Rule
- Issue Management
- Issue Priority Levels
- Issue Soft Delete
- Sub-Issues
- Label Management
- Notification System
- Notification Expiration
- WebSocket Notification Delivery
- Session Management
- Team Management
- Last Admin Protection
- Watcher Mutation Events
- Custom Workflow
- Canceled Transition Always Valid
- POST /api/v1/auth/refresh Route
- Auth Module Application Ports
- Identity Auth & Authorization Middleware
- In-Memory Event Publisher
- Identity Application Ports
- Gateway Tech Stack
- dotenv

## God Nodes (most connected - your core abstractions)
1. `EventPublisher` - 32 edges
2. `SessionRepository` - 29 edges
3. `LabelRepository` - 25 edges
4. `TeamMemberRepository` - 23 edges
5. `BaseError` - 23 edges
6. `CycleRepository` - 22 edges
7. `TeamRepository` - 22 edges
8. `StateRepository` - 21 edges
9. `OrganizationMemberRepository` - 20 edges
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
- **Technology Stack & Infrastructure Documentation** — fastify_framework, postgresql_drizzle_orm, redis_session_storage, bcrypt_password_hashing, jwt_dual_token_strategy, docker_compose_deployment, websocket_gateway_contract [EXTRACTED 1.00]
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

## Communities (182 total, 74 thin omitted)

### Community 0 - "gateway/index.ts"
Cohesion: 0.05
Nodes (50): app, MessageHandler, GatewayWebSocketServer, AuthenticateConnection, autoSubscribeUserChannels(), BroadcastEvent, HandleDisconnect, ManageSubscription (+42 more)

### Community 1 - "Auth Module"
Cohesion: 0.06
Nodes (69): ADR 0002 — Use JWT Dual Token Strategy, ADR 0003 — Use PostgreSQL with Drizzle ORM, ADR 0004 — Use Redis for Session Storage, ADR 0005 — Use bcrypt for Password Hashing, Auth Registration Login Change, Auth Session Management Change, Auth Token Refresh & Logout Change, bcrypt Password Hashing (+61 more)

### Community 2 - "comment-controller.ts"
Cohesion: 0.07
Nodes (28): commentRepository, commentRoutes(), createComment, deleteComment, eventPublisher, getUserIdFromToken(), issueRepository, issueTeamQuery (+20 more)

### Community 3 - "errors/index.ts"
Cohesion: 0.09
Nodes (18): BaseError, BusinessRuleError, ConflictError, errorHandler(), ForbiddenError, InternalError, NotFoundError, RateLimitError (+10 more)

### Community 4 - "issue-controller.ts"
Cohesion: 0.05
Nodes (47): AddWatcherRequest, AssignIssueRequest, AssignIssueRequestSchema, ChangeIssueStatusRequest, ChangeIssueStatusRequestSchema, CommentIdParams, CommentResponse, CreateCommentRequest (+39 more)

### Community 5 - "LabelRepository"
Cohesion: 0.08
Nodes (17): GetIssueLabels, ListLabels, ListWatchers, LabelRepository, WatcherRepository, IssueLabel, issueLabels, NewIssueLabel (+9 more)

### Community 6 - "identity-controller.ts"
Cohesion: 0.07
Nodes (42): AddTeamMemberRequest, AddTeamMemberRequestSchema, CreateOrganizationRequest, CreateOrganizationRequestSchema, CreateTeamRequest, CreateTeamRequestSchema, ErrorResponse, OrganizationIdParams (+34 more)

### Community 7 - "controller.ts"
Cohesion: 0.08
Nodes (40): createTransition, createWorkflowState, deleteTransition, deleteWorkflowState, getStateHistory, getUserIdFromToken(), historyRepository, listTransitions (+32 more)

### Community 8 - "devDependencies"
Cohesion: 0.05
Nodes (41): drizzle-kit, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-boundaries, eslint-plugin-prettier, devDependencies, drizzle-kit (+33 more)

### Community 9 - "identity/domain/errors.ts"
Cohesion: 0.09
Nodes (17): Identity Drizzle Repositories, DeleteTeamInput, GetTeamDetails, GetTeamDetailsInput, ListTeamMembersInput, ListTeams, ListTeamsInput, TeamRepository (+9 more)

### Community 10 - "project-controller.ts"
Cohesion: 0.08
Nodes (36): AddIssueRequest, AddIssueRequestSchema, ChangeProjectStatusRequest, ChangeProjectStatusRequestSchema, CreateProjectRequest, CreateProjectRequestSchema, ListProjectsQuery, ListProjectsQuerySchema (+28 more)

### Community 11 - "TransitionRepository"
Cohesion: 0.09
Nodes (12): CreateTransition, CreateTransitionInput, DeleteTransition, DeleteTransitionInput, DeleteWorkflowState, DeleteWorkflowStateInput, ListTransitions, ListTransitionsInput (+4 more)

### Community 12 - "create-issue.ts"
Cohesion: 0.08
Nodes (16): CreateIssue, CreateIssueInput, CreateIssueInputType, CreateIssueOutput, ProjectQuery, TeamKeyQuery, TeamMemberQuery, ProjectQuery (+8 more)

### Community 13 - "work/domain/errors.ts"
Cohesion: 0.10
Nodes (13): CreateLabel, CreateLabelInput, CreateLabelInputType, DeleteLabel, DetachLabel, DetachLabelInput, DetachLabelInputType, UpdateLabel (+5 more)

### Community 14 - "Project Module Backend Design"
Cohesion: 0.09
Nodes (31): DrizzleProjectRepository, ProjectController (Fastify Routes), ADR-0001: Use Enum for Project Status Instead of Workflow Join Table, ADR-0002: Compute Project Progress on Read Instead of Storing, ADR-0003: Canceled as Terminal Status Instead of Hard Delete, Projects API Contract, PRJ-DEL: No Hard Delete, PRJ-S1: Project Creation Default Status (+23 more)

### Community 15 - "workflow/domain/errors.ts"
Cohesion: 0.22
Nodes (8): CreateWorkflowStateInput, UpdateWorkflowStateInput, WorkflowStateType, DuplicateStateNameError, MissingCompletedStateError, MissingUnstartedStateError, MultipleCanceledStatesError, NotTeamAdminError

### Community 16 - "cycle-controller.ts"
Cohesion: 0.10
Nodes (27): activateCycle, completeCycle, createCycle, cycleRepository, cycleRoutes(), deleteCycle, eventPublisher, getCycle (+19 more)

### Community 17 - "TeamMemberQuery"
Cohesion: 0.12
Nodes (11): ActivateCycle, NotificationService, CompleteCycle, NotificationService, CreateCycleInput, CycleEvent, CycleEventPublisher, TeamMemberQuery (+3 more)

### Community 18 - "identity/domain/index.ts"
Cohesion: 0.11
Nodes (14): GetUserProfile, GetUserProfileInput, GetUserProfileOutput, UserProfileRepository, UpdateUserProfile, UpdateUserProfileInput, UpdateUserProfileInputType, UpdateUserProfileOutput (+6 more)

### Community 19 - "Backend Design: Issue CRUD & Status"
Cohesion: 0.10
Nodes (27): Issue Comment Entity, Issue Watcher Entity, Label Entity, Review: Work Module Comments, Labels, and Watchers, API Spec: Issue Comments, API Spec: Labels, API Spec: Issue Watchers, Business Spec: Issue Comments (+19 more)

### Community 20 - "auth-controller.ts"
Cohesion: 0.11
Nodes (22): authRoutes(), eventPublisher, getAuthInfo(), getCurrentSessionRefreshTokenHash(), listSessions, LoginRequestSchema, loginUser, logoutUser (+14 more)

### Community 21 - "change-project-status.ts"
Cohesion: 0.12
Nodes (11): AddIssueToProjectInput, ChangeProjectStatus, ChangeProjectStatusInput, ChangeProjectStatusInputType, VALID_TRANSITIONS, ProjectEvent, ProjectEventPublisher, IssueUpdateQuery (+3 more)

### Community 22 - "label-controller.ts"
Cohesion: 0.10
Nodes (23): CreateLabelRequestSchema, IssueLabelParamsSchema, LabelIdParamsSchema, UpdateLabelRequestSchema, attachLabel, createLabel, deleteLabel, detachLabel (+15 more)

### Community 23 - "OrganizationRepository"
Cohesion: 0.12
Nodes (12): Cascade Soft-Deletion, Soft Deletion Strategy, ADR: Soft Deletion Strategy for All Entities, DeleteOrganization, DeleteOrganizationInput, ListUserTeams, ListUserTeamsOutput, ListUserTeamsOutputTeam (+4 more)

### Community 24 - "notification-controller.ts"
Cohesion: 0.12
Nodes (24): ListNotificationsQuery, ListNotificationsQuerySchema, MarkAllReadResponse, MarkReadResponse, NotificationIdParams, NotificationIdParamsSchema, NotificationListResponse, NotificationPreferencesResponse (+16 more)

### Community 25 - "session-controller.ts"
Cohesion: 0.10
Nodes (19): ErrorResponseSchema, eventPublisher, listSessions, ListSessionsResponseSchema, TODO: This needs to be fixed to properly identify the current session., revokeAllSessions, RevokeAllSessionsResponseSchema, revokeSession (+11 more)

### Community 26 - "EventPublisher"
Cohesion: 0.12
Nodes (10): AssignIssue, AssignIssueInput, AssignIssueInputType, AssignIssueOutput, NotificationService, TeamMemberQuery, DeleteIssue, Event (+2 more)

### Community 27 - "watcher-controller.ts"
Cohesion: 0.11
Nodes (18): AddWatcherRequestSchema, WatcherIdParamsSchema, addWatcher, eventPublisher, getUserIdFromToken(), issueTeamQuery, listWatchers, removeWatcher (+10 more)

### Community 28 - "refresh-token.ts"
Cohesion: 0.12
Nodes (10): TokenService, RefreshToken, RefreshTokenInput, RefreshTokenInputType, RefreshTokenOutput, TokenExpiredError, TokenRevokedError, ValidateToken (+2 more)

### Community 29 - "update-notification-preferences.ts"
Cohesion: 0.14
Nodes (12): DEFAULT_TYPES, GetNotificationPreferences, GetNotificationPreferencesOutput, NotificationPreferencesRepository, DEFAULT_TYPES, UpdateNotificationPreferences, UpdateNotificationPreferencesInput, UpdateNotificationPreferencesInputType (+4 more)

### Community 30 - "OrganizationMemberRepository"
Cohesion: 0.13
Nodes (10): GetOrganizationDetails, GetOrganizationDetailsInput, GetOrganizationDetailsOutput, ListUserOrganizations, ListUserOrganizationsInput, ListUserOrganizationsOutput, OrganizationMemberRepository, NewOrganizationMember (+2 more)

### Community 31 - "project/domain/errors.ts"
Cohesion: 0.15
Nodes (9): AddIssueToProject, AddIssueToProjectInputType, IssueQuery, CannotReopenCompletedProjectError, InvalidProjectStatusTransitionError, IssueAlreadyInProjectError, NotProjectTeamMemberError, ProjectCancelNotAdminError (+1 more)

### Community 32 - "create-project.ts"
Cohesion: 0.14
Nodes (10): CreateProject, CreateProjectInput, CreateProjectInputType, CreateProjectOutput, TeamMemberQuery, UpdateProject, UpdateProjectInput, UpdateProjectInputType (+2 more)

### Community 33 - "IssueRepository"
Cohesion: 0.13
Nodes (10): ListIssues, ListIssuesQuery, ListIssuesQueryType, IssueFilters, IssueRepository, PaginatedResult, PaginationCursor, Issue (+2 more)

### Community 34 - "Workflow Module Backend Design"
Cohesion: 0.13
Nodes (22): WorkflowController (Fastify Routes), ADR-0001: Embed Default Workflow in Code Rather Than Database, ADR-0002: Append-Only State History for Audit Trail, ADR-0003: Cancel State Transitions Bypass All Validation, Workflow API Contract, Default Workflow Definition, Workflow Module Backend Design, StateHistory (+14 more)

### Community 35 - "compilerOptions"
Cohesion: 0.09
Nodes (21): dist, ES2022, node_modules, src/**/*, compilerOptions, declaration, declarationMap, esModuleInterop (+13 more)

### Community 36 - "SessionRepository"
Cohesion: 0.13
Nodes (7): ListSessions, ListSessionsInput, ListSessionsInputType, ListSessionsOutput, SessionOutput, SessionRepository, Session

### Community 37 - "StateRepository"
Cohesion: 0.11
Nodes (6): CreateWorkflowState, ListWorkflowStates, ListWorkflowStatesInput, StateRepository, UpdateWorkflowState, WorkflowState

### Community 38 - "EventPublisher"
Cohesion: 0.18
Nodes (9): LogoutUser, LogoutUserInput, LogoutUserInputType, LogoutUserOutput, Event, EventPublisher, RevokeAllSessions, RevokeAllSessionsInput (+1 more)

### Community 39 - "EventPublisher"
Cohesion: 0.12
Nodes (9): CreateOrganization, CreateOrganizationInput, CreateOrganizationInputType, CreateOrganizationOutput, DeleteTeam, Event, EventPublisher, RemoveTeamMember (+1 more)

### Community 40 - "change-issue-status.ts"
Cohesion: 0.14
Nodes (10): ChangeIssueStatus, ChangeIssueStatusInput, ChangeIssueStatusInputType, ChangeIssueStatusOutput, IssueStatusQuery, NotificationService, StatusType, StateHistoryService (+2 more)

### Community 41 - "Team"
Cohesion: 0.13
Nodes (19): ADR: Team Entity Placement in Identity Module, ADR: Soft-Delete Cascade Strategy, Team & Membership Proposal, Team API Contract, Team Business Specification, Team & Membership Backend Tasks, Team & Membership Tech Stack, Team (+11 more)

### Community 42 - "cycle/domain/errors.ts"
Cohesion: 0.16
Nodes (5): DeleteCycle, ActiveCycleCannotBeDeletedError, CycleNotFoundError, DraftCycleCannotBeCompletedError, EmptyCycleNameError

### Community 43 - "CycleRepository"
Cohesion: 0.18
Nodes (8): CycleFilters, CycleRepository, PaginatedResult, Cycle, cycles, cycleStatusEnum, NewCycle, CycleNotActiveForIssueAssignmentError

### Community 44 - "notification/domain/index.ts"
Cohesion: 0.18
Nodes (8): MarkNotificationReadInputType, MarkNotificationReadOutput, InvalidFilterError, InvalidNotificationTypeError, NOTIFICATION_TYPES, NotificationNotFoundError, NotificationNotOwnerError, NotificationType

### Community 45 - "Issue"
Cohesion: 0.16
Nodes (17): Gateway Channel, Issue Channel, Team Channel, Gateway Connection, Gateway Event, Gateway Subscription, Project Cancellation, Project (+9 more)

### Community 46 - "add-team-member.ts"
Cohesion: 0.13
Nodes (7): organizationMemberRepository, AddTeamMember, AddTeamMemberInput, AddTeamMemberInputType, AlreadyTeamMemberError, NotOrganizationMemberError, NotOrganizationOwnerError

### Community 47 - "TeamMemberRepository"
Cohesion: 0.18
Nodes (5): ListTeamMembers, TeamMemberRepository, NewTeamMember, TeamMember, teamMembers

### Community 48 - "API Contract Template"
Cohesion: 0.21
Nodes (16): Cycle Entity, Issue Entity, Label Entity, Notification Entity, Team Entity, User Entity, Notification API Contract, API Contract Template (+8 more)

### Community 49 - "dependencies"
Cohesion: 0.13
Nodes (15): bcrypt, drizzle-orm, fastify, @fastify/cors, @fastify/rate-limit, dependencies, bcrypt, drizzle-orm (+7 more)

### Community 50 - "auth/adapters/in/dto.ts"
Cohesion: 0.13
Nodes (14): AuthResponse, AuthResponseSchema, ErrorResponse, ErrorResponseSchema, LoginRequest, LoginRequestSchema, RefreshRequest, RefreshRequestSchema (+6 more)

### Community 51 - "mark-all-notifications-read.ts"
Cohesion: 0.18
Nodes (6): MarkAllNotificationsRead, MarkAllNotificationsReadOutput, MarkNotificationRead, MarkNotificationReadInput, NotificationEvent, NotificationEventPublisher

### Community 52 - "Gateway Backend Design"
Cohesion: 0.14
Nodes (14): ADR-001: Use ws Library for WebSocket Server, ADR-002: Store Connection State In-Memory, ADR-003: In-Process EventEmitter for Broadcasting, AuthenticateConnection Use Case, BroadcastEvent Use Case, In-Memory Connection Registry, Gateway Backend Design, EventBus Port (EventEmitter adapter) (+6 more)

### Community 53 - "BaseError"
Cohesion: 0.15
Nodes (14): BaseError, BusinessRuleError, ConflictError, ForbiddenError, InternalError, NotFoundError, RateLimitError, UnauthorizedError (+6 more)

### Community 54 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, build, db:generate, db:migrate, db:push, db:studio, dev, format (+6 more)

### Community 55 - "ProjectRepository"
Cohesion: 0.26
Nodes (7): PaginatedResult, ProjectFilters, ProjectRepository, NewProject, Project, projects, projectStatusEnum

### Community 56 - "login-user.ts"
Cohesion: 0.22
Nodes (7): LoginUser, LoginUserInput, LoginUserInputType, LoginUserOutput, UnauthorizedError, hashToken(), verifyTokenHash()

### Community 57 - "auth/domain/index.ts"
Cohesion: 0.32
Nodes (6): UserRepository, NewSession, sessions, NewUser, User, users

### Community 58 - "NotCycleTeamMemberError"
Cohesion: 0.21
Nodes (3): GetCycle, ListCycles, NotCycleTeamMemberError

### Community 59 - "NotificationRepository"
Cohesion: 0.24
Nodes (5): NotificationRepository, PaginatedResult, NewNotification, Notification, notifications

### Community 60 - "add-watcher.ts"
Cohesion: 0.19
Nodes (6): AddWatcher, AddWatcherInput, AddWatcherInputType, IssueTeamQuery, TeamMemberQuery, AlreadyWatchingError

### Community 61 - "attach-label.ts"
Cohesion: 0.19
Nodes (6): AttachLabel, AttachLabelInput, AttachLabelInputType, IssueTeamQuery, TeamMemberQuery, LabelAlreadyAttachedError

### Community 62 - "create-comment.ts"
Cohesion: 0.18
Nodes (6): CreateComment, CreateCommentInput, CreateCommentInputType, IssueTeamQuery, NotificationService, TeamMemberQuery

### Community 63 - "get-state-history.ts"
Cohesion: 0.29
Nodes (4): GetStateHistory, GetStateHistoryInput, HistoryRepository, StateHistoryEntry

### Community 64 - "create-team.ts"
Cohesion: 0.20
Nodes (6): CreateTeam, CreateTeamInput, CreateTeamInputType, CreateTeamOutput, OrganizationNotFoundError, TeamKeyConflictError

### Community 65 - "create-notification.ts"
Cohesion: 0.24
Nodes (6): CreateNotification, CreateNotificationInput, CreateNotificationInputType, CreateNotificationOutput, CreateNotificationEvent, NotificationService

### Community 66 - "validate-transition.ts"
Cohesion: 0.23
Nodes (8): ValidateTransition, ValidateTransitionInput, ValidateTransitionOutput, DEFAULT_WORKFLOW_STATES, DEFAULT_WORKFLOW_TRANSITIONS, DefaultState, DefaultTransition, isCanceledType()

### Community 67 - "list-notifications.ts"
Cohesion: 0.24
Nodes (6): ListNotifications, ListNotificationsInput, ListNotificationsInputType, ListNotificationsOutput, NotificationItem, toItem()

### Community 68 - "Identity User Profile & Organization Change"
Cohesion: 0.20
Nodes (10): Hexagonal Architecture (Ports and Adapters), Shared Entity Ownership (Field-Level), ADR: Hexagonal Architecture for Identity Module, ADR: Shared Entity Ownership Between Auth and Identity Modules, Identity User Profile & Organization Change, Identity Module Backend Design, Identity API Contract Spec, Identity Business Spec (+2 more)

### Community 69 - "WebSocket Backend Design"
Cohesion: 0.24
Nodes (10): ADR-0001 In-Process Event Bridge, ADR-0002 Channel Access Validation, ADR-0003 Auto-Subscription on Authentication, WebSocket Change ADR Manifest, WebSocket Backend Design, WebSocket Change Review, WebSocket Gateway Protocol API Spec, WebSocket Realtime Business Rules (+2 more)

### Community 70 - "package.json"
Cohesion: 0.20
Nodes (9): author, description, keywords, license, main, name, packageManager, type (+1 more)

### Community 71 - "workflow/domain/index.ts"
Cohesion: 0.17
Nodes (9): DuplicateTransitionError, StateInUseError, TransitionNotFoundError, NewStateHistoryEntry, stateHistory, NewWorkflowState, workflowStates, NewWorkflowTransition (+1 more)

### Community 72 - "get-project-progress.ts"
Cohesion: 0.24
Nodes (3): GetProjectProgress, GetProjectProgressOutput, IssueQuery

### Community 73 - "Workflow Module"
Cohesion: 0.25
Nodes (9): Default Workflow (Embedded), Workflow Module, WorkflowState Entity, Workflow State Type Enum, WorkflowTransition Entity, StateHistory Entity, Workflow Module API Endpoints, WorkflowResolutionService (+1 more)

### Community 74 - "Comments API Contract"
Cohesion: 0.31
Nodes (9): Comment Entity, Session Entity, Business Specification Template, Backend Tasks Template, Auth API Contract, Comments API Contract, Sessions API Contract, Auth Business Specification (+1 more)

### Community 75 - "register-user.ts"
Cohesion: 0.24
Nodes (5): ConflictError, RegisterUser, RegisterUserInput, RegisterUserInputType, RegisterUserOutput

### Community 76 - "Code Intelligence Priority Order"
Cohesion: 0.25
Nodes (8): Code Intelligence Priority Order, CodeGraph, Graphify, Headroom Memory MCP, Mandatory Project Rules, Memory as Primary Source of Truth, RTK (Rust Token Killer), Token-Optimized Commands Rule

### Community 77 - "Cycle Module"
Cohesion: 0.29
Nodes (8): Cycles API Contract, Cycle Entity, Cycle Module, Cycle Module Backend Tasks, Cycle Status Enum (draft, active, completed), Cycle Use Cases, ADR-0001: Cycle Auto-Complete on Activation, ADR-0002: Cycle Status as Database Enum

### Community 78 - "IssueComment"
Cohesion: 0.29
Nodes (8): IssueComment, IssueLabel, Label, ADR: Extend Work Module with Subdomains, ADR: Soft-Delete for Comments and Labels, ADR: Flat Comment Threading, Work Module Comments/Labels/Watchers Backend Design, Work Module Comments/Labels/Watchers Proposal

### Community 79 - "validators.ts"
Cohesion: 0.46
Nodes (6): CreateOrganizationSchema, DeleteOrganizationSchema, GetOrganizationDetailsSchema, GetUserProfileSchema, ListUserOrganizationsSchema, UpdateUserProfileSchema

### Community 80 - "In-Memory Rate Limit Store (MVP)"
Cohesion: 0.29
Nodes (7): In-Memory Rate Limit Store (MVP), ADR: In-Memory Rate Limit Store for MVP, Shared Error Types & Rate Limiting Change, Shared Module Backend Design (Errors & Rate Limiting), Error Contract API Spec, Shared Error Class Hierarchy, Shared Rate Limiting Module

### Community 81 - "Backend Schema Definition"
Cohesion: 0.33
Nodes (6): OpenSpec Config, Backend Schema Definition, ADR Template, Design Backend Template, Proposal Template, Review Template

### Community 82 - "create-cycle.ts"
Cohesion: 0.31
Nodes (5): CreateCycle, CreateCycleInputType, CreateCycleOutput, CycleDateValidationError, CyclePastStartDateError

### Community 83 - "RedisSessionStore Adapter"
Cohesion: 0.40
Nodes (5): JWT Refresh Token Rotation, Auth Token Refresh & Logout Change, Auth Token Refresh & Logout Tasks, RedisSessionStore Adapter, RefreshTokenService

### Community 84 - "Notification Module Backend Design"
Cohesion: 0.40
Nodes (5): ADR-0001: Store-and-Forward Notifications, ADR-0002: Synchronous Event Ingestion, Notification Data Model, Notification Module Backend Design, Notification Recipient Resolver

### Community 85 - "Tech Selection Template"
Cohesion: 0.40
Nodes (5): Tech Selection Template, Architecture Template, Deployment Template, Technology Templates README, Stack Template

### Community 87 - "events.ts"
Cohesion: 0.40
Nodes (3): CHANNEL_PATTERNS, GATEWAY_EVENTS, GatewayEventEnvelope

### Community 88 - "Auth Cookie Migration Business Spec"
Cohesion: 0.50
Nodes (4): Auth Cookie Migration API Spec, Auth Cookie Migration Business Spec, Auth Cookie Migration Backend Tasks, Auth Cookie Migration Tech Stack

### Community 89 - "contract-refresh.test.ts"
Cohesion: 0.50
Nodes (3): ErrorResponseSchema, RefreshTokenRequestSchema, RefreshTokenResponseSchema

### Community 91 - "Cookie Migration Backend Design"
Cohesion: 0.67
Nodes (3): ADR-0001: HttpOnly Cookie for Refresh Token, Cookie Migration Backend Design, Cookie Security Model

### Community 92 - "OpenSpec Config (backend-schema)"
Cohesion: 0.67
Nodes (3): Linear Clone API — OpenAPI 3.1 Specification, OpenSpec Config (backend-schema), OpenSpec Rules: proposal, specs-api, specs-business, tech-stack, adr, design-backend, tasks-backend, review

### Community 93 - "OpenSpec Artifact Workflow"
Cohesion: 0.67
Nodes (3): OpenSpec Artifact Workflow, OpenSpec Auth Registration Login Change Config, OpenSpec Schema Collection README

### Community 94 - "Active Cycle Status"
Cohesion: 0.67
Nodes (3): Active Cycle Status, Completed Cycle Status, Draft Cycle Status

### Community 95 - "Session"
Cohesion: 0.67
Nodes (3): Session Eviction, Session Revocation, Session

### Community 96 - "Serena IDE Project Configuration"
Cohesion: 0.67
Nodes (3): Serena IDE Project Configuration, linear-clone-backend-js Project, TypeScript Language Server

### Community 99 - "WebSocket Protocol Contract"
Cohesion: 0.67
Nodes (3): WebSocket Channel Types, Gateway Business Rules, WebSocket Protocol Contract

## Knowledge Gaps
- **538 isolated node(s):** `name`, `version`, `type`, `description`, `main` (+533 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **74 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `env` connect `gateway/index.ts` to `auth-controller.ts`, `label-controller.ts`, `login-user.ts`, `session-controller.ts`, `refresh-token.ts`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `FastifyInstance` connect `gateway/index.ts` to `comment-controller.ts`, `errors/index.ts`, `issue-controller.ts`, `controller.ts`, `project-controller.ts`, `cycle-controller.ts`, `auth-controller.ts`, `label-controller.ts`, `notification-controller.ts`, `session-controller.ts`, `watcher-controller.ts`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `TokenService` connect `refresh-token.ts` to `login-user.ts`, `register-user.ts`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `name`, `version`, `type` to the rest of the system?**
  _538 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `gateway/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05139920045688178 - nodes in this community are weakly interconnected._
- **Should `Auth Module` be split into smaller, more focused modules?**
  _Cohesion score 0.0639386189258312 - nodes in this community are weakly interconnected._
- **Should `comment-controller.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06823529411764706 - nodes in this community are weakly interconnected._