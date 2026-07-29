# Graph Report - .  (2026-07-28)

## Corpus Check
- Large corpus: 530 files · ~225,113 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 2020 nodes · 3768 edges · 184 communities (106 shown, 78 thin omitted)
- Extraction: 93% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 189 edges (avg confidence: 0.92)
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
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 83
- Community 84
- Community 85
- Community 86
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Community 92
- Community 93
- Community 94
- Community 95
- Community 96
- Community 97
- Community 98
- Community 99
- Community 100
- Community 101
- Community 102
- Community 103
- Community 104
- Community 105
- Community 106
- Community 107
- Community 108
- Community 109
- Community 110
- Community 111
- Community 112
- Community 113
- Community 114
- Community 115
- Community 116
- Community 117
- Community 118
- Community 119
- Community 120
- Community 121
- Community 122
- Community 123
- Community 124
- Community 125
- Community 126
- Community 127
- Community 128
- Community 129
- Community 130
- Community 131
- Community 132
- Community 134
- Community 135
- Community 136
- Community 137
- Community 138
- Community 139
- Community 140
- Community 141
- Community 142
- Community 143
- Community 144
- Community 145
- Community 146
- Community 147
- Community 148
- Community 149
- Community 150
- Community 151
- Community 152
- Community 153
- Community 154
- Community 155
- Community 156
- Community 157
- Community 158
- Community 159
- Community 160
- Community 161
- Community 162
- Community 163
- Community 164
- Community 165
- Community 166
- Community 167
- Community 168
- Community 169
- Community 172
- Community 173
- Community 183

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
- **Real-time event delivery system** — openspec_specs_api_websocket-protocol, openspec_specs_api_notifications, openspec_specs_api_issues, openspec_specs_api_comments, openspec_specs_api_labels, openspec_specs_api_watchers [INFERRED 0.92]
- **hyper_cycle_issue_team_assignment** — openspec_specs_business_cycles_cycle, openspec_specs_business_issues_issue, openspec_specs_business_team_team [INFERRED 1.00]
- **hyper_gateway_event_broadcast_flow** — business_gateway_event, business_gateway_channel, business_gateway_subscription, business_gateway_connection [INFERRED 1.00]
- **hyper_workflow_issue_status_history** — openspec_specs_business_workflow_state, openspec_specs_business_workflow_transition, openspec_specs_business_workflow_state_history, openspec_specs_business_issues_issue [INFERRED 1.00]

## Communities (184 total, 78 thin omitted)

### Community 0 - "WebSocket Gateway"
Cohesion: 0.05
Nodes (46): MessageHandler, GatewayWebSocketServer, AuthenticateConnection, autoSubscribeUserChannels(), BroadcastEvent, HandleDisconnect, ManageSubscription, AuthenticateResult (+38 more)

### Community 1 - "Authentication Architecture"
Cohesion: 0.06
Nodes (71): ADR 0002 — Use JWT Dual Token Strategy, ADR 0003 — Use PostgreSQL with Drizzle ORM, ADR 0004 — Use Redis for Session Storage, ADR 0005 — Use bcrypt for Password Hashing, Auth Registration Login Change, Auth Session Management Change, Auth Token Refresh & Logout Change, bcrypt Password Hashing (+63 more)

### Community 2 - "Error Taxonomy"
Cohesion: 0.09
Nodes (18): BaseError, BusinessRuleError, ConflictError, errorHandler(), ForbiddenError, InternalError, NotFoundError, RateLimitError (+10 more)

### Community 3 - "Issue Watchers"
Cohesion: 0.06
Nodes (28): AddWatcherRequestSchema, WatcherIdParamsSchema, addWatcher, eventPublisher, getUserIdFromToken(), issueTeamQuery, listWatchers, removeWatcher (+20 more)

### Community 4 - "Workflow Engine"
Cohesion: 0.07
Nodes (46): WorkflowController (Fastify Routes), ADR-0001: Embed Default Workflow in Code Rather Than Database, ADR-0002: Append-Only State History for Audit Trail, ADR-0003: Cancel State Transitions Bypass All Validation, Workflow API Contract, Default Workflow Definition, Workflow Module Backend Design, Comment Entity (+38 more)

### Community 5 - "Identity & Team DTOs"
Cohesion: 0.06
Nodes (41): AddTeamMemberRequest, AddTeamMemberRequestSchema, CreateOrganizationRequest, CreateOrganizationRequestSchema, CreateTeamRequest, CreateTeamRequestSchema, ErrorResponse, OrganizationIdParams (+33 more)

### Community 6 - "Soft Delete Pattern"
Cohesion: 0.08
Nodes (19): Cascade Soft-Deletion, Soft Deletion Strategy, ADR: Soft Deletion Strategy for All Entities, DeleteOrganization, DeleteOrganizationInput, GetOrganizationDetails, GetOrganizationDetailsInput, GetOrganizationDetailsOutput (+11 more)

### Community 7 - "Workflow Controller"
Cohesion: 0.08
Nodes (40): createTransition, createWorkflowState, deleteTransition, deleteWorkflowState, getStateHistory, getUserIdFromToken(), historyRepository, listTransitions (+32 more)

### Community 8 - "Dev Dependencies"
Cohesion: 0.05
Nodes (41): drizzle-kit, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-boundaries, eslint-plugin-prettier, devDependencies, drizzle-kit (+33 more)

### Community 9 - "Project DTOs"
Cohesion: 0.08
Nodes (36): AddIssueRequest, AddIssueRequestSchema, ChangeProjectStatusRequest, ChangeProjectStatusRequestSchema, CreateProjectRequest, CreateProjectRequestSchema, ListProjectsQuery, ListProjectsQuerySchema (+28 more)

### Community 10 - "Workflow Transitions"
Cohesion: 0.09
Nodes (12): CreateTransition, CreateTransitionInput, DeleteTransition, DeleteTransitionInput, DeleteWorkflowState, DeleteWorkflowStateInput, ListTransitions, ListTransitionsInput (+4 more)

### Community 11 - "Team Membership"
Cohesion: 0.09
Nodes (12): AddTeamMember, AddTeamMemberInput, AddTeamMemberInputType, GetTeamDetails, GetTeamDetailsInput, TeamMemberRepository, AlreadyTeamMemberError, NotTeamMemberError (+4 more)

### Community 12 - "Project Module"
Cohesion: 0.09
Nodes (31): DrizzleProjectRepository, ProjectController (Fastify Routes), ADR-0001: Use Enum for Project Status Instead of Workflow Join Table, ADR-0002: Compute Project Progress on Read Instead of Storing, ADR-0003: Canceled as Terminal Status Instead of Hard Delete, Projects API Contract, PRJ-DEL: No Hard Delete, PRJ-S1: Project Creation Default Status (+23 more)

### Community 13 - "Team Deletion"
Cohesion: 0.09
Nodes (14): DeleteTeam, DeleteTeamInput, Event, EventPublisher, RemoveTeamMember, RemoveTeamMemberInput, UpdateUserProfile, UpdateUserProfileInput (+6 more)

### Community 14 - "Auth Logout"
Cohesion: 0.13
Nodes (13): LogoutUser, LogoutUserInput, LogoutUserInputType, LogoutUserOutput, Event, EventPublisher, RevokeAllSessions, RevokeAllSessionsInput (+5 more)

### Community 15 - "Cycle Controller"
Cohesion: 0.10
Nodes (27): activateCycle, completeCycle, createCycle, cycleRepository, cycleRoutes(), deleteCycle, eventPublisher, getCycle (+19 more)

### Community 16 - "Cycle Lifecycle"
Cohesion: 0.12
Nodes (11): ActivateCycle, NotificationService, CompleteCycle, NotificationService, CreateCycleInput, CycleEvent, CycleEventPublisher, TeamMemberQuery (+3 more)

### Community 17 - "Issue DTOs"
Cohesion: 0.09
Nodes (27): AssignIssueRequestSchema, ChangeIssueStatusRequestSchema, CreateIssueRequestSchema, IdParamsSchema, ListIssuesQuerySchema, UpdateIssueRequestSchema, assignIssue, changeIssueStatus (+19 more)

### Community 18 - "Work Module Specs"
Cohesion: 0.10
Nodes (27): Issue Comment Entity, Issue Watcher Entity, Label Entity, Review: Work Module Comments, Labels, and Watchers, API Spec: Issue Comments, API Spec: Labels, API Spec: Issue Watchers, Business Spec: Issue Comments (+19 more)

### Community 19 - "Auth Controller"
Cohesion: 0.11
Nodes (22): authRoutes(), eventPublisher, getAuthInfo(), getCurrentSessionRefreshTokenHash(), listSessions, LoginRequestSchema, loginUser, logoutUser (+14 more)

### Community 20 - "Project Use Cases"
Cohesion: 0.12
Nodes (11): AddIssueToProjectInput, ChangeProjectStatus, ChangeProjectStatusInput, ChangeProjectStatusInputType, VALID_TRANSITIONS, ProjectEvent, ProjectEventPublisher, IssueUpdateQuery (+3 more)

### Community 21 - "Notification DTOs"
Cohesion: 0.12
Nodes (24): ListNotificationsQuery, ListNotificationsQuerySchema, MarkAllReadResponse, MarkReadResponse, NotificationIdParams, NotificationIdParamsSchema, NotificationListResponse, NotificationPreferencesResponse (+16 more)

### Community 22 - "Authorization"
Cohesion: 0.10
Nodes (13): organizationMemberRepository, Identity Controller, Identity Auth & Authorization Middleware, Identity Drizzle Repositories, CreateTeam, CreateTeamInput, CreateTeamInputType, CreateTeamOutput (+5 more)

### Community 23 - "App Entry & Sessions"
Cohesion: 0.11
Nodes (20): app, ErrorResponseSchema, eventPublisher, listSessions, ListSessionsResponseSchema, TODO: This needs to be fixed to properly identify the current session., revokeAllSessions, RevokeAllSessionsResponseSchema (+12 more)

### Community 24 - "Token Service"
Cohesion: 0.12
Nodes (10): TokenService, RefreshToken, RefreshTokenInput, RefreshTokenInputType, RefreshTokenOutput, TokenExpiredError, TokenRevokedError, ValidateToken (+2 more)

### Community 25 - "Community 25"
Cohesion: 0.14
Nodes (12): DEFAULT_TYPES, GetNotificationPreferences, GetNotificationPreferencesOutput, NotificationPreferencesRepository, DEFAULT_TYPES, UpdateNotificationPreferences, UpdateNotificationPreferencesInput, UpdateNotificationPreferencesInputType (+4 more)

### Community 26 - "Community 26"
Cohesion: 0.13
Nodes (10): ListIssues, ListIssuesQuery, ListIssuesQueryType, IssueFilters, IssueRepository, PaginatedResult, PaginationCursor, Issue (+2 more)

### Community 27 - "Community 27"
Cohesion: 0.15
Nodes (9): AddIssueToProject, AddIssueToProjectInputType, IssueQuery, CannotReopenCompletedProjectError, InvalidProjectStatusTransitionError, IssueAlreadyInProjectError, NotProjectTeamMemberError, ProjectCancelNotAdminError (+1 more)

### Community 28 - "Community 28"
Cohesion: 0.14
Nodes (10): CreateProject, CreateProjectInput, CreateProjectInputType, CreateProjectOutput, TeamMemberQuery, UpdateProject, UpdateProjectInput, UpdateProjectInputType (+2 more)

### Community 29 - "Community 29"
Cohesion: 0.12
Nodes (22): Gateway Channel, Issue Channel, Team Channel, Gateway Connection, Gateway Event, Gateway Subscription, Project Cancellation, Project (+14 more)

### Community 30 - "Community 30"
Cohesion: 0.09
Nodes (21): dist, ES2022, node_modules, src/**/*, compilerOptions, declaration, declarationMap, esModuleInterop (+13 more)

### Community 31 - "Community 31"
Cohesion: 0.13
Nodes (7): ListSessions, ListSessionsInput, ListSessionsInputType, ListSessionsOutput, SessionOutput, SessionRepository, Session

### Community 32 - "Community 32"
Cohesion: 0.14
Nodes (7): DeleteLabel, DetachLabel, DetachLabelInput, DetachLabelInputType, Event, EventPublisher, LabelNotFoundError

### Community 33 - "Community 33"
Cohesion: 0.14
Nodes (10): GetUserProfile, GetUserProfileInput, GetUserProfileOutput, ListTeamMembers, ListTeamMembersInput, UserProfileRepository, ProfileNotFoundError, NewUser (+2 more)

### Community 34 - "Community 34"
Cohesion: 0.10
Nodes (20): AddWatcherRequest, AssignIssueRequest, ChangeIssueStatusRequest, CommentIdParams, CommentResponse, CreateCommentRequest, CreateIssueRequest, CreateLabelRequest (+12 more)

### Community 35 - "Community 35"
Cohesion: 0.17
Nodes (12): IssueLabel, issueLabels, NewIssueLabel, DEFAULT_STATUSES, IssueStatus, issueStatuses, NewIssueStatus, labels (+4 more)

### Community 36 - "Community 36"
Cohesion: 0.11
Nodes (6): CreateWorkflowState, ListWorkflowStates, ListWorkflowStatesInput, StateRepository, UpdateWorkflowState, WorkflowState

### Community 37 - "Community 37"
Cohesion: 0.13
Nodes (19): CreateLabelRequestSchema, IssueLabelParamsSchema, LabelIdParamsSchema, UpdateLabelRequestSchema, attachLabel, createLabel, deleteLabel, detachLabel (+11 more)

### Community 38 - "Community 38"
Cohesion: 0.14
Nodes (10): ChangeIssueStatus, ChangeIssueStatusInput, ChangeIssueStatusInputType, ChangeIssueStatusOutput, IssueStatusQuery, NotificationService, StatusType, StateHistoryService (+2 more)

### Community 39 - "Community 39"
Cohesion: 0.13
Nodes (19): ADR: Team Entity Placement in Identity Module, ADR: Soft-Delete Cascade Strategy, Team & Membership Proposal, Team API Contract, Team Business Specification, Team & Membership Backend Tasks, Team & Membership Tech Stack, Team (+11 more)

### Community 40 - "Community 40"
Cohesion: 0.16
Nodes (5): DeleteCycle, ActiveCycleCannotBeDeletedError, CycleNotFoundError, DraftCycleCannotBeCompletedError, EmptyCycleNameError

### Community 41 - "Community 41"
Cohesion: 0.18
Nodes (8): CycleFilters, CycleRepository, PaginatedResult, Cycle, cycles, cycleStatusEnum, NewCycle, CycleNotActiveForIssueAssignmentError

### Community 42 - "Community 42"
Cohesion: 0.18
Nodes (8): MarkNotificationReadInputType, MarkNotificationReadOutput, InvalidFilterError, InvalidNotificationTypeError, NOTIFICATION_TYPES, NotificationNotFoundError, NotificationNotOwnerError, NotificationType

### Community 43 - "Community 43"
Cohesion: 0.13
Nodes (10): CreateIssue, CreateIssueInput, CreateIssueInputType, CreateIssueOutput, ProjectQuery, TeamKeyQuery, TeamMemberQuery, EmptyTitleError (+2 more)

### Community 44 - "Community 44"
Cohesion: 0.15
Nodes (4): GetIssueLabels, ListLabels, LabelRepository, Label

### Community 45 - "Community 45"
Cohesion: 0.15
Nodes (16): commentRepository, commentRoutes(), createComment, deleteComment, eventPublisher, getUserIdFromToken(), issueRepository, issueTeamQuery (+8 more)

### Community 46 - "Community 46"
Cohesion: 0.21
Nodes (7): DeleteComment, UpdateComment, UpdateCommentInput, UpdateCommentInputType, CommentNotFoundError, CommentNotOwnedByUserError, InvalidPriorityError

### Community 47 - "Community 47"
Cohesion: 0.19
Nodes (5): ListIssueComments, CommentRepository, IssueComment, issueComments, NewIssueComment

### Community 48 - "Community 48"
Cohesion: 0.20
Nodes (6): ListTeams, ListTeamsInput, TeamRepository, NewTeam, Team, teams

### Community 49 - "Community 49"
Cohesion: 0.22
Nodes (8): CreateWorkflowStateInput, UpdateWorkflowStateInput, WorkflowStateType, DuplicateStateNameError, MissingCompletedStateError, MissingUnstartedStateError, MultipleCanceledStatesError, NotTeamAdminError

### Community 50 - "Community 50"
Cohesion: 0.17
Nodes (9): DuplicateTransitionError, StateInUseError, TransitionNotFoundError, NewStateHistoryEntry, stateHistory, NewWorkflowState, workflowStates, NewWorkflowTransition (+1 more)

### Community 51 - "Community 51"
Cohesion: 0.13
Nodes (15): bcrypt, fastify, @fastify/cors, @fastify/rate-limit, ioredis, dependencies, bcrypt, fastify (+7 more)

### Community 52 - "Community 52"
Cohesion: 0.13
Nodes (14): AuthResponse, AuthResponseSchema, ErrorResponse, ErrorResponseSchema, LoginRequest, LoginRequestSchema, RefreshRequest, RefreshRequestSchema (+6 more)

### Community 53 - "Community 53"
Cohesion: 0.18
Nodes (6): MarkAllNotificationsRead, MarkAllNotificationsReadOutput, MarkNotificationRead, MarkNotificationReadInput, NotificationEvent, NotificationEventPublisher

### Community 54 - "Community 54"
Cohesion: 0.19
Nodes (7): CreateLabel, CreateLabelInput, CreateLabelInputType, UpdateLabel, UpdateLabelInput, UpdateLabelInputType, LabelNameConflictError

### Community 55 - "Community 55"
Cohesion: 0.14
Nodes (14): ADR-001: Use ws Library for WebSocket Server, ADR-002: Store Connection State In-Memory, ADR-003: In-Process EventEmitter for Broadcasting, AuthenticateConnection Use Case, BroadcastEvent Use Case, In-Memory Connection Registry, Gateway Backend Design, EventBus Port (EventEmitter adapter) (+6 more)

### Community 56 - "Community 56"
Cohesion: 0.15
Nodes (14): BaseError, BusinessRuleError, ConflictError, ForbiddenError, InternalError, NotFoundError, RateLimitError, UnauthorizedError (+6 more)

### Community 57 - "Community 57"
Cohesion: 0.14
Nodes (14): scripts, build, db:generate, db:migrate, db:push, db:studio, dev, format (+6 more)

### Community 58 - "Community 58"
Cohesion: 0.26
Nodes (7): PaginatedResult, ProjectFilters, ProjectRepository, NewProject, Project, projects, projectStatusEnum

### Community 59 - "Community 59"
Cohesion: 0.18
Nodes (7): CreateComment, CreateCommentInput, CreateCommentInputType, IssueTeamQuery, NotificationService, TeamMemberQuery, EmptyBodyError

### Community 60 - "Community 60"
Cohesion: 0.22
Nodes (7): LoginUser, LoginUserInput, LoginUserInputType, LoginUserOutput, UnauthorizedError, hashToken(), verifyTokenHash()

### Community 61 - "Community 61"
Cohesion: 0.32
Nodes (6): UserRepository, NewSession, sessions, NewUser, User, users

### Community 62 - "Community 62"
Cohesion: 0.21
Nodes (3): GetCycle, ListCycles, NotCycleTeamMemberError

### Community 63 - "Community 63"
Cohesion: 0.24
Nodes (5): NotificationRepository, PaginatedResult, NewNotification, Notification, notifications

### Community 64 - "Community 64"
Cohesion: 0.19
Nodes (6): AttachLabel, AttachLabelInput, AttachLabelInputType, IssueTeamQuery, TeamMemberQuery, LabelAlreadyAttachedError

### Community 65 - "Community 65"
Cohesion: 0.24
Nodes (6): CreateNotification, CreateNotificationInput, CreateNotificationInputType, CreateNotificationOutput, CreateNotificationEvent, NotificationService

### Community 66 - "Community 66"
Cohesion: 0.20
Nodes (6): AssignIssue, AssignIssueInput, AssignIssueInputType, AssignIssueOutput, NotificationService, TeamMemberQuery

### Community 67 - "Community 67"
Cohesion: 0.20
Nodes (6): ProjectQuery, TeamQuery, UpdateIssue, UpdateIssueInput, UpdateIssueInputType, UpdateIssueOutput

### Community 68 - "Community 68"
Cohesion: 0.23
Nodes (8): ValidateTransition, ValidateTransitionInput, ValidateTransitionOutput, DEFAULT_WORKFLOW_STATES, DEFAULT_WORKFLOW_TRANSITIONS, DefaultState, DefaultTransition, isCanceledType()

### Community 69 - "Community 69"
Cohesion: 0.24
Nodes (6): ListNotifications, ListNotificationsInput, ListNotificationsInputType, ListNotificationsOutput, NotificationItem, toItem()

### Community 70 - "Community 70"
Cohesion: 0.20
Nodes (10): Hexagonal Architecture (Ports and Adapters), Shared Entity Ownership (Field-Level), ADR: Hexagonal Architecture for Identity Module, ADR: Shared Entity Ownership Between Auth and Identity Modules, Identity User Profile & Organization Change, Identity Module Backend Design, Identity API Contract Spec, Identity Business Spec (+2 more)

### Community 71 - "Community 71"
Cohesion: 0.24
Nodes (10): ADR-0001 In-Process Event Bridge, ADR-0002 Channel Access Validation, ADR-0003 Auto-Subscription on Authentication, WebSocket Change ADR Manifest, WebSocket Backend Design, WebSocket Change Review, WebSocket Gateway Protocol API Spec, WebSocket Realtime Business Rules (+2 more)

### Community 72 - "Community 72"
Cohesion: 0.20
Nodes (9): author, description, keywords, license, main, name, packageManager, type (+1 more)

### Community 73 - "Community 73"
Cohesion: 0.24
Nodes (5): ConflictError, RegisterUser, RegisterUserInput, RegisterUserInputType, RegisterUserOutput

### Community 74 - "Community 74"
Cohesion: 0.24
Nodes (5): CreateOrganization, CreateOrganizationInput, CreateOrganizationInputType, CreateOrganizationOutput, OrganizationNameConflictError

### Community 75 - "Community 75"
Cohesion: 0.24
Nodes (3): GetProjectProgress, GetProjectProgressOutput, IssueQuery

### Community 76 - "Community 76"
Cohesion: 0.29
Nodes (4): GetStateHistory, GetStateHistoryInput, HistoryRepository, StateHistoryEntry

### Community 77 - "Community 77"
Cohesion: 0.25
Nodes (9): Default Workflow (Embedded), Workflow Module, WorkflowState Entity, Workflow State Type Enum, WorkflowTransition Entity, StateHistory Entity, Workflow Module API Endpoints, WorkflowResolutionService (+1 more)

### Community 78 - "Community 78"
Cohesion: 0.28
Nodes (9): IssueComment, IssueLabel, IssueWatcher, Label, ADR: Extend Work Module with Subdomains, ADR: Soft-Delete for Comments and Labels, ADR: Flat Comment Threading, Work Module Comments/Labels/Watchers Backend Design (+1 more)

### Community 79 - "Community 79"
Cohesion: 0.22
Nodes (9): ADR-0001: Store-and-Forward Notifications, ADR-0002: Synchronous Event Ingestion, Notification API Contract, Notification Data Model, Notification Module Backend Design, Notification Recipient Resolver, WebSocket Channel Types, Gateway Business Rules (+1 more)

### Community 80 - "Community 80"
Cohesion: 0.31
Nodes (5): CreateCycle, CreateCycleInputType, CreateCycleOutput, CycleDateValidationError, CyclePastStartDateError

### Community 81 - "Community 81"
Cohesion: 0.29
Nodes (8): Cycles API Contract, Cycle Entity, Cycle Module, Cycle Module Backend Tasks, Cycle Status Enum (draft, active, completed), Cycle Use Cases, ADR-0001: Cycle Auto-Complete on Activation, ADR-0002: Cycle Status as Database Enum

### Community 82 - "Community 82"
Cohesion: 0.46
Nodes (6): CreateOrganizationSchema, DeleteOrganizationSchema, GetOrganizationDetailsSchema, GetUserProfileSchema, ListUserOrganizationsSchema, UpdateUserProfileSchema

### Community 83 - "Community 83"
Cohesion: 0.29
Nodes (7): In-Memory Rate Limit Store (MVP), ADR: In-Memory Rate Limit Store for MVP, Shared Error Types & Rate Limiting Change, Shared Module Backend Design (Errors & Rate Limiting), Error Contract API Spec, Shared Error Class Hierarchy, Shared Rate Limiting Module

### Community 85 - "Community 85"
Cohesion: 0.33
Nodes (6): OpenSpec Config, Backend Schema Definition, ADR Template, Design Backend Template, Proposal Template, Review Template

### Community 87 - "Community 87"
Cohesion: 0.40
Nodes (5): JWT Refresh Token Rotation, Auth Token Refresh & Logout Change, Auth Token Refresh & Logout Tasks, RedisSessionStore Adapter, RefreshTokenService

### Community 88 - "Community 88"
Cohesion: 0.40
Nodes (5): Tech Selection Template, Architecture Template, Deployment Template, Technology Templates README, Stack Template

### Community 90 - "Community 90"
Cohesion: 0.40
Nodes (3): CHANNEL_PATTERNS, GATEWAY_EVENTS, GatewayEventEnvelope

### Community 91 - "Community 91"
Cohesion: 0.50
Nodes (4): Auth Cookie Migration API Spec, Auth Cookie Migration Business Spec, Auth Cookie Migration Backend Tasks, Auth Cookie Migration Tech Stack

### Community 92 - "Community 92"
Cohesion: 0.50
Nodes (3): ErrorResponseSchema, RefreshTokenRequestSchema, RefreshTokenResponseSchema

### Community 94 - "Community 94"
Cohesion: 0.67
Nodes (3): ADR-0001: HttpOnly Cookie for Refresh Token, Cookie Migration Backend Design, Cookie Security Model

### Community 95 - "Community 95"
Cohesion: 0.67
Nodes (3): OpenSpec Artifact Workflow, OpenSpec Auth Registration Login Change Config, OpenSpec Schema Collection README

### Community 96 - "Community 96"
Cohesion: 0.67
Nodes (3): Active Cycle Status, Completed Cycle Status, Draft Cycle Status

### Community 97 - "Community 97"
Cohesion: 0.67
Nodes (3): Session Eviction, Session Revocation, Session

## Knowledge Gaps
- **550 isolated node(s):** `name`, `version`, `type`, `description`, `main` (+545 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **78 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `env` connect `App Entry & Sessions` to `WebSocket Gateway`, `Community 35`, `Auth Controller`, `Token Service`, `Community 60`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `FastifyInstance` connect `App Entry & Sessions` to `WebSocket Gateway`, `Error Taxonomy`, `Issue Watchers`, `Identity & Team DTOs`, `Community 37`, `Workflow Controller`, `Project DTOs`, `Community 45`, `Cycle Controller`, `Issue DTOs`, `Auth Controller`, `Notification DTOs`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `TokenService` connect `Token Service` to `Community 73`, `Community 60`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `name`, `version`, `type` to the rest of the system?**
  _550 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `WebSocket Gateway` be split into smaller, more focused modules?**
  _Cohesion score 0.0547680412371134 - nodes in this community are weakly interconnected._
- **Should `Authentication Architecture` be split into smaller, more focused modules?**
  _Cohesion score 0.061569416498993966 - nodes in this community are weakly interconnected._
- **Should `Error Taxonomy` be split into smaller, more focused modules?**
  _Cohesion score 0.08941176470588236 - nodes in this community are weakly interconnected._