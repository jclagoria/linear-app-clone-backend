# Graph Report - .  (2026-07-20)

## Corpus Check
- 511 files · ~209,943 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2067 nodes · 3839 edges · 173 communities (95 shown, 78 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 87 edges (avg confidence: 0.85)
- Token cost: 48,562 input · 10,971 output

## Community Hubs (Navigation)
- WebSocket Gateway
- Comments Module
- Error Handling
- Watchers Module
- Comments Module
- Labels Module
- Comments Module
- Issue Assignment
- Workflow & State Management
- Error Handling
- Labels Module
- Workflow & State Management
- Project Configuration
- Identity & Team
- Project DTOs
- Watchers Module
- Project Module
- Identity & Team
- Identity & Team
- Error Handling
- Error Handling
- Logout-User.Ts Logoutuser .Constructor()
- Error Handling
- Session Management
- Cycle Module
- Error Handling
- Session Management
- Error Handling
- Error Handling
- Workflow & State Management
- Cycle Module
- Notifications Module
- Workflow & State Management
- Session Management
- Error Handling
- Identity & Team
- Error Handling
- Project Module
- Issue Module
- Workflow & State Management
- Project Configuration
- Comments Module
- Watchers Module
- Workflow & State Management
- Error Handling
- Session Management
- Identity & Team
- Error Handling
- Workflow & State Management
- Session Management
- Workflow & State Management
- Request/Response Schemas
- Error Handling
- Project Configuration
- Workflow & State Management
- Comments Module
- Error Handling
- Test Suites
- Error Handling
- Project Module
- Notifications Module
- Error Handling
- Workflow & State Management
- Session Management
- Workflow & State Management
- Error Handling
- Notifications Module
- Notifications Module
- Project Configuration
- Error Handling
- Error Handling
- Project Module
- Error Handling
- Identity & Team
- Architecture Patterns
- Error Handling
- WebSocket Gateway
- Error Handling
- Workflow & State Management
- Workflow & State Management
- Project Configuration
- Error Handling
- Cycle Module
- Test Suites
- Watchers Module
- Issue Module
- Error Handling
- Cycle Module
- Auth-Middleware.Ts Authmiddleware() Toke
- Notifications Module
- Dotenv Dotenv
- Project Configuration
- Cookie Management
- Ioredis Ioredis
- Jose Jose
- Cycle Module
- Connection Management Onlinestatus
- Comments Module
- Labels Module
- Comments Module
- Community 100
- Community 101
- Identity & Team
- Identity & Team
- Identity & Team
- Identity & Team
- Request/Response Schemas
- Identity & Team
- Identity & Team
- Identity & Team
- Identity & Team
- Request/Response Schemas
- WebSocket Gateway
- Docker Compose Deployment
- Backend Technology Stack
- Authenticateresult
- WebSocket Gateway
- Authenticate Message
- Event Message
- Watchers Module
- Notifications Module
- Architecture Patterns
- Project Configuration
- Adr: Redis Session
- Project Configuration
- Fastify Framework
- Test Suites
- Token Pair (Access
- Redis Session Store
- Comments Module
- Issue Module
- Issue Module
- Workflow & State Management
- Request/Response Schemas
- Project Configuration
- Validation
- Validatetoken (Use Case)
- WebSocket Gateway
- Issue Module
- Project DTOs
- Project DTOs
- Project Module
- Project Module
- Project Module
- Project Module
- Project DTOs
- Issue Module
- Issue Module
- Identity & Team
- Identity & Team
- Project Module
- Project Module
- Project Module
- Project Module
- Project Module
- Project Module
- Project Module
- Project Module
- Project Module
- Serializehistoryentry
- Workflow & State Management
- Workflow & State Management

## God Nodes (most connected - your core abstractions)
1. `SessionRepository` - 37 edges
2. `EventPublisher` - 32 edges
3. `StateRepository` - 28 edges
4. `LabelRepository` - 25 edges
5. `TransitionRepository` - 23 edges
6. `BaseError` - 23 edges
7. `CycleRepository` - 22 edges
8. `TeamMemberRepository` - 21 edges
9. `TokenService` - 20 edges
10. `OrganizationMemberRepository` - 20 edges

## Surprising Connections (you probably didn't know these)
- `Session` --conceptually_related_to--> `env`  [INFERRED]
  openspec/specs/business/sessions.md → src/shared/config/env.ts
- `WebSocketDelivery (best-effort, real-time)` --conceptually_related_to--> `GatewayEventEnvelope + GATEWAY_EVENTS constants`  [INFERRED]
  openspec/specs/business/notifications.md → src/shared/events.ts
- `Comments API Contract` --references--> `Work Module`  [INFERRED]
  openspec/specs/api/comments.md → README.md
- `Issues API Contract` --references--> `Work Module`  [INFERRED]
  openspec/specs/api/issues.md → README.md
- `Labels API Contract` --references--> `Work Module`  [INFERRED]
  openspec/specs/api/labels.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Hexagonal Architecture Module Pattern** — readme_md_auth_module, readme_md_identity_module, readme_md_work_module, readme_md_workflow_module, readme_md_project_module, readme_md_cycle_module, readme_md_notification_module [EXTRACTED 1.00]
- **Issue Domain Aggregate** — readme_md_work_module, openspec_specs_api_issues_md_issues_api, openspec_specs_api_comments_md_comments_api, openspec_specs_api_labels_md_labels_api, openspec_specs_api_watchers_md_watchers_api, openspec_specs_business_issues_md_issues_business, openspec_specs_business_comments_md_comments_business, openspec_specs_business_labels_md_labels_business [INFERRED 0.95]
- **Authentication and Security Architecture** — readme_md_jwt_auth, docs_api_openapi_yaml_bearer_auth, openspec_specs_business_auth_md_httponly_cookie, openspec_specs_business_auth_md_token_rotation, openspec_specs_api_auth_md_auth_api, openspec_specs_business_auth_md_auth_business, openspec_specs_api_sessions_md_sessions_api [EXTRACTED 1.00]
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

## Communities (173 total, 78 thin omitted)

### Community 0 - "WebSocket Gateway"
Cohesion: 0.05
Nodes (45): Session, SessionEviction (automatic on limit exceeded), SessionLimit (max 10, evict oldest by last_activity_at), app, MessageHandler, GatewayWebSocketServer, AuthenticateConnection, autoSubscribeUserChannels() (+37 more)

### Community 1 - "Comments Module"
Cohesion: 0.04
Nodes (52): AddWatcherRequest, AssignIssueRequest, AssignIssueRequestSchema, ChangeIssueStatusRequest, ChangeIssueStatusRequestSchema, CommentIdParams, CommentResponse, CreateCommentRequest (+44 more)

### Community 2 - "Error Handling"
Cohesion: 0.08
Nodes (20): BaseError (abstract error class with toJSON), BaseError, BusinessRuleError, ConflictError, errorHandler(), ForbiddenError, InternalError, NotFoundError (+12 more)

### Community 3 - "Watchers Module"
Cohesion: 0.06
Nodes (28): AddWatcherRequestSchema, WatcherIdParamsSchema, addWatcher, eventPublisher, getUserIdFromToken(), issueTeamQuery, listWatchers, removeWatcher (+20 more)

### Community 4 - "Comments Module"
Cohesion: 0.06
Nodes (47): Bearer JWT Authentication, Linear Clone API (OpenAPI 3.1), Inbound Adapters (Controllers), Outbound Adapters (Repositories), Application / Use Case Layer, Domain Layer, Modular Monolith Pattern, Port Interfaces (+39 more)

### Community 5 - "Labels Module"
Cohesion: 0.06
Nodes (30): CreateLabelRequestSchema, IssueLabelParamsSchema, LabelIdParamsSchema, UpdateLabelRequestSchema, attachLabel, createLabel, deleteLabel, detachLabel (+22 more)

### Community 6 - "Comments Module"
Cohesion: 0.08
Nodes (19): CreateComment, CreateCommentInput, CreateCommentInputType, IssueTeamQuery, NotificationService, TeamMemberQuery, DeleteComment, CommentRepository (+11 more)

### Community 7 - "Issue Assignment"
Cohesion: 0.08
Nodes (22): AssignIssue, AssignIssueInput, AssignIssueInputType, AssignIssueOutput, NotificationService, CreateIssue, CreateIssueInput, CreateIssueInputType (+14 more)

### Community 8 - "Workflow & State Management"
Cohesion: 0.07
Nodes (42): createTransition, createWorkflowState, deleteTransition, deleteWorkflowState, getUserIdFromToken, getStateHistory, getUserIdFromToken(), historyRepository (+34 more)

### Community 9 - "Error Handling"
Cohesion: 0.06
Nodes (41): AddTeamMemberRequest, AddTeamMemberRequestSchema, CreateOrganizationRequest, CreateOrganizationRequestSchema, CreateTeamRequest, CreateTeamRequestSchema, ErrorResponse, OrganizationIdParams (+33 more)

### Community 10 - "Labels Module"
Cohesion: 0.08
Nodes (18): GetIssueLabels, ListLabels, LabelRepository, issues, IssueLabel, issueLabels, NewIssueLabel, NewIssue (+10 more)

### Community 11 - "Workflow & State Management"
Cohesion: 0.11
Nodes (20): CreateTransitionInput, CreateWorkflowStateInput, DeleteTransitionInput, DeleteWorkflowStateInput, TeamAdminQuery, UpdateWorkflowStateInput, WorkflowStateType, DuplicateStateNameError (+12 more)

### Community 12 - "Project Configuration"
Cohesion: 0.05
Nodes (41): drizzle-kit, eslint, eslint-config-prettier, @eslint/js, eslint-plugin-boundaries, eslint-plugin-prettier, devDependencies, drizzle-kit (+33 more)

### Community 13 - "Identity & Team"
Cohesion: 0.09
Nodes (15): DeleteOrganization, DeleteOrganizationInput, GetOrganizationDetails, GetOrganizationDetailsInput, GetOrganizationDetailsOutput, ListTeamsInput, ListUserOrganizations, ListUserOrganizationsInput (+7 more)

### Community 14 - "Project DTOs"
Cohesion: 0.08
Nodes (36): AddIssueRequest, AddIssueRequestSchema, ChangeProjectStatusRequest, ChangeProjectStatusRequestSchema, CreateProjectRequest, CreateProjectRequestSchema, ListProjectsQuery, ListProjectsQuerySchema (+28 more)

### Community 15 - "Watchers Module"
Cohesion: 0.12
Nodes (34): MessageHandler, GatewayWebSocketServer, InMemoryConnectionRepository, InMemorySubscriptionRepository, InProcessEventEmitter, JoseTokenVerifier, RedisOnlineStatus, AuthenticateConnection (+26 more)

### Community 16 - "Project Module"
Cohesion: 0.08
Nodes (33): auth domain barrel exports, EventPublisher port interface (auth), InMemoryEventPublisher adapter (auth), CreateTeam use case, cycles table / Cycle domain model, CycleRepository port interface, db (drizzle ORM instance), DeleteTeam use case (+25 more)

### Community 17 - "Identity & Team"
Cohesion: 0.11
Nodes (12): DeleteTeamInput, GetTeamDetailsInput, ListTeamMembersInput, TeamMemberRepository, RemoveTeamMemberInput, LastAdminRemovalError, NotTeamAdminError, NotTeamMemberError (+4 more)

### Community 18 - "Identity & Team"
Cohesion: 0.10
Nodes (32): Auth Token Refresh & Logout Tech Stack, ADR 0001 — Hexagonal Architecture for Identity Module, Hexagonal Architecture (Ports and Adapters), ADR 0002 — Shared Entity Ownership Between Auth and Identity, Shared Entity Ownership (Field-Level Module Boundaries), ADR 0003 — Soft Deletion Strategy for All Entities, Soft Deletion with deletedAt Timestamp, ADR Manifest — Identity User Profile & Organization (+24 more)

### Community 19 - "Error Handling"
Cohesion: 0.12
Nodes (28): getUserIdFromToken, handleControllerError, notificationRoutes, serializeNotification, ListNotificationsQuery, ListNotificationsQuerySchema, MarkAllReadResponse, MarkReadResponse (+20 more)

### Community 20 - "Error Handling"
Cohesion: 0.09
Nodes (29): BaseError Abstract Class, RateLimitError, Custom Error Classes Pattern, Rate Limiting Framework, Team Entity Placement in Identity Module, Team Key Uniqueness and Validation Strategy, Soft-Delete Cascade Strategy for Team Deletion, Soft-Delete Pattern (+21 more)

### Community 21 - "Logout-User.Ts Logoutuser .Constructor()"
Cohesion: 0.14
Nodes (13): LogoutUser, LogoutUserInput, LogoutUserInputType, LogoutUserOutput, EventPublisher, Event, EventPublisher, RevokeAllSessions (+5 more)

### Community 22 - "Error Handling"
Cohesion: 0.10
Nodes (26): activateCycle, completeCycle, createCycle, cycleRepository, cycleRoutes(), deleteCycle, eventPublisher, getCycle (+18 more)

### Community 23 - "Session Management"
Cohesion: 0.11
Nodes (14): authRoutes, getAuthInfo, getCurrentSessionRefreshTokenHash, JoseTokenService, TokenService, RefreshToken, RefreshTokenInput, RefreshTokenInputType (+6 more)

### Community 24 - "Cycle Module"
Cohesion: 0.12
Nodes (11): ActivateCycle, NotificationService, CompleteCycle, NotificationService, CreateCycleInput, CycleEvent, CycleEventPublisher, TeamMemberQuery (+3 more)

### Community 25 - "Error Handling"
Cohesion: 0.11
Nodes (15): GetUserProfile, GetUserProfileInput, GetUserProfileOutput, ListTeamMembers, UserProfileRepository, ProfileNotFoundError, organizationMembers, NewOrganization (+7 more)

### Community 26 - "Session Management"
Cohesion: 0.11
Nodes (22): authRoutes(), eventPublisher, getAuthInfo(), getCurrentSessionRefreshTokenHash(), listSessions, LoginRequestSchema, loginUser, logoutUser (+14 more)

### Community 27 - "Error Handling"
Cohesion: 0.10
Nodes (27): cycleRoutes (Fastify plugin), getUserIdFromToken (auth helper), handleControllerError (error mapper), serializeCycle (response transform), teamMemberQuery (inline adapter), CreateCycleRequestSchema (Zod), CycleResponse, TeamIdParamsSchema (+19 more)

### Community 28 - "Error Handling"
Cohesion: 0.14
Nodes (7): GetCycle, ActiveCycleCannotBeDeletedError, CompletedCycleCannotBeActivatedError, CycleNotFoundError, DraftCycleCannotBeCompletedError, InvalidCycleStatusTransitionError, NotCycleTeamMemberError

### Community 29 - "Workflow & State Management"
Cohesion: 0.12
Nodes (11): AddIssueToProjectInput, ChangeProjectStatus, ChangeProjectStatusInput, ChangeProjectStatusInputType, VALID_TRANSITIONS, ProjectEvent, ProjectEventPublisher, IssueUpdateQuery (+3 more)

### Community 30 - "Cycle Module"
Cohesion: 0.15
Nodes (9): Cycle domain index, ListCycles, CycleFilters, CycleRepository, PaginatedResult, Cycle, cycles, cycleStatusEnum (+1 more)

### Community 31 - "Notifications Module"
Cohesion: 0.14
Nodes (12): DEFAULT_TYPES, GetNotificationPreferences, GetNotificationPreferencesOutput, NotificationPreferencesRepository, DEFAULT_TYPES, UpdateNotificationPreferences, UpdateNotificationPreferencesInput, UpdateNotificationPreferencesInputType (+4 more)

### Community 32 - "Workflow & State Management"
Cohesion: 0.09
Nodes (23): Workflow Module, Workflow Tech Stack Decision, Cycle Auto-Complete on Activation, Cycle Status as Database Enum, Activate Cycle Use Case, Complete Cycle Use Case, Create Cycle Use Case, Cycle Module (+15 more)

### Community 33 - "Session Management"
Cohesion: 0.13
Nodes (8): sessionRoutes, ListSessions, ListSessionsInput, ListSessionsInputType, ListSessionsOutput, SessionOutput, SessionRepository, Session

### Community 34 - "Error Handling"
Cohesion: 0.17
Nodes (11): UserRepository, ConflictError, RegisterUser, RegisterUserInput, RegisterUserInputType, RegisterUserOutput, NewSession, sessions (+3 more)

### Community 35 - "Identity & Team"
Cohesion: 0.12
Nodes (11): AddTeamMember, AddTeamMemberInput, AddTeamMemberInputType, Event, EventPublisher, UpdateUserProfile, UpdateUserProfileInput, UpdateUserProfileInputType (+3 more)

### Community 36 - "Error Handling"
Cohesion: 0.15
Nodes (9): AddIssueToProject, AddIssueToProjectInputType, IssueQuery, CannotReopenCompletedProjectError, InvalidProjectStatusTransitionError, IssueAlreadyInProjectError, NotProjectTeamMemberError, ProjectCancelNotAdminError (+1 more)

### Community 37 - "Project Module"
Cohesion: 0.14
Nodes (10): CreateProject, CreateProjectInput, CreateProjectInputType, CreateProjectOutput, TeamMemberQuery, UpdateProject, UpdateProjectInput, UpdateProjectInputType (+2 more)

### Community 38 - "Issue Module"
Cohesion: 0.11
Nodes (7): DeleteIssue, ListIssues, ListIssuesQuery, ListIssuesQueryType, IssueFilters, IssueRepository, Issue

### Community 39 - "Workflow & State Management"
Cohesion: 0.12
Nodes (8): CreateTransition, DeleteTransition, DeleteWorkflowState, ListTransitions, ListTransitionsInput, TeamAdminQuery, TransitionRepository, WorkflowTransition

### Community 40 - "Project Configuration"
Cohesion: 0.09
Nodes (21): dist, ES2022, node_modules, src/**/*, compilerOptions, declaration, declarationMap, esModuleInterop (+13 more)

### Community 41 - "Comments Module"
Cohesion: 0.12
Nodes (17): commentRepository, commentRoutes(), createComment, deleteComment, eventPublisher, getUserIdFromToken(), issueRepository, issueTeamQuery (+9 more)

### Community 42 - "Watchers Module"
Cohesion: 0.10
Nodes (21): Notification, NotificationExpiration (90 days), NotificationPreferences, Notification types (6 enum values), WebSocketDelivery (best-effort, real-time), IssueProjectAssociation (at most one project, same team), Project, ProjectProgress (completedIssues/totalIssues*100) (+13 more)

### Community 43 - "Workflow & State Management"
Cohesion: 0.13
Nodes (6): CreateWorkflowState, ListWorkflowStates, ListWorkflowStatesInput, StateRepository, UpdateWorkflowState, WorkflowState

### Community 44 - "Error Handling"
Cohesion: 0.17
Nodes (10): CreateNotification test, CreateNotification, CreateNotificationInput, CreateNotificationInputType, CreateNotificationOutput, CreateNotificationEvent, NotificationService, InvalidNotificationTypeError (+2 more)

### Community 45 - "Session Management"
Cohesion: 0.15
Nodes (19): PostgreSQL 16, ADR-0006: Current Session Identification via Refresh Token Hash, ADR-0007: Session Listing from PostgreSQL Directly, ADR-0008: Session Limit Enforcement in Use Case Layer, In-process EventPublisher, ListSessions Use Case, RevokeAllSessions Use Case, RevokeSession Use Case (+11 more)

### Community 46 - "Identity & Team"
Cohesion: 0.12
Nodes (6): DeleteTeam, GetTeamDetails, ListTeams, TeamRepository, RemoveTeamMember, Team

### Community 47 - "Error Handling"
Cohesion: 0.24
Nodes (7): Notification domain index, NotificationRepository, PaginatedResult, InvalidFilterError, NewNotification, Notification, notifications

### Community 48 - "Workflow & State Management"
Cohesion: 0.12
Nodes (17): Enum Project Status Decision, Computed Project Progress, No Hard Delete Policy, Issue-Project Association, Project Module, Project Module CRUD & Progress, Project API Response Schema, Project Status Lifecycle (+9 more)

### Community 49 - "Session Management"
Cohesion: 0.12
Nodes (15): ErrorResponseSchema, eventPublisher, listSessions, ListSessionsResponseSchema, TODO: This needs to be fixed to properly identify the current session., revokeAllSessions, RevokeAllSessionsResponseSchema, revokeSession (+7 more)

### Community 50 - "Workflow & State Management"
Cohesion: 0.16
Nodes (9): ChangeIssueStatus, ChangeIssueStatusInput, ChangeIssueStatusInputType, ChangeIssueStatusOutput, IssueStatusQuery, NotificationService, StatusType, StateHistoryService (+1 more)

### Community 51 - "Request/Response Schemas"
Cohesion: 0.13
Nodes (16): Cookie Helper Functions, @fastify/cookie Plugin, Refresh Token Cookie Migration Tasks, HttpOnly Cookie Auth Strategy, Refresh Token Cookie Migration Tech Stack, OpenSpec Configuration, Backend Artifact Pipeline, Backend Schema v3 (+8 more)

### Community 52 - "Error Handling"
Cohesion: 0.17
Nodes (7): CreateLabel, CreateLabelInput, CreateLabelInputType, UpdateLabel, UpdateLabelInput, UpdateLabelInputType, LabelNameConflictError

### Community 53 - "Project Configuration"
Cohesion: 0.13
Nodes (15): bcrypt, drizzle-orm, fastify, @fastify/cors, @fastify/rate-limit, dependencies, bcrypt, drizzle-orm (+7 more)

### Community 54 - "Workflow & State Management"
Cohesion: 0.15
Nodes (15): Auth Module, Cycle Module, Identity Module, Project Module, Work Module, Workflow Module, Module Dependency Matrix, ADR: JWT Dual Token Strategy (+7 more)

### Community 55 - "Comments Module"
Cohesion: 0.15
Nodes (15): Label Data Schema, Watcher Junction Schema, IssueComment Domain Entity, Label Management Feature, Auto-Subscribe Author and Assignee as Watchers, IssueWatcher Domain Entity, Issue Identifier Generation — Database Sequence per Team, Soft-Delete Pattern — deletedAt Timestamp (+7 more)

### Community 56 - "Error Handling"
Cohesion: 0.13
Nodes (14): AuthResponse, AuthResponseSchema, ErrorResponse, ErrorResponseSchema, LoginRequest, LoginRequestSchema, RefreshRequest, RefreshRequestSchema (+6 more)

### Community 57 - "Test Suites"
Cohesion: 0.14
Nodes (14): scripts, build, db:generate, db:migrate, db:push, db:studio, dev, format (+6 more)

### Community 58 - "Error Handling"
Cohesion: 0.22
Nodes (8): LoginUser, LoginUserInput, LoginUserInputType, LoginUserOutput, UnauthorizedError, Event, hashToken(), verifyTokenHash()

### Community 59 - "Project Module"
Cohesion: 0.26
Nodes (7): PaginatedResult, ProjectFilters, ProjectRepository, NewProject, Project, projects, projectStatusEnum

### Community 60 - "Notifications Module"
Cohesion: 0.22
Nodes (13): Gateway WebSocket Protocol, Gateway Business Rules, Gateway Backend Tasks, Gateway Tech Stack, Store-and-Forward Notification Model, Synchronous Event Ingestion, Notification Module Design, Notification API Contract (+5 more)

### Community 61 - "Error Handling"
Cohesion: 0.21
Nodes (6): MarkNotificationRead, MarkNotificationReadInput, MarkNotificationReadInputType, MarkNotificationReadOutput, NotificationNotFoundError, NotificationNotOwnerError

### Community 62 - "Workflow & State Management"
Cohesion: 0.23
Nodes (6): GetStateHistory, GetStateHistoryInput, HistoryRepository, NewStateHistoryEntry, stateHistory, StateHistoryEntry

### Community 63 - "Session Management"
Cohesion: 0.18
Nodes (12): bcrypt, jose JWT Library, Redis Cache/Sessions, ADR-0001: Refresh Token Storage in Redis, JWT Utility, Logout Service, RefreshToken Service, Token Refresh and Logout Feature (+4 more)

### Community 64 - "Workflow & State Management"
Cohesion: 0.23
Nodes (8): ValidateTransition, ValidateTransitionInput, ValidateTransitionOutput, DEFAULT_WORKFLOW_STATES, DEFAULT_WORKFLOW_TRANSITIONS, DefaultState, DefaultTransition, isCanceledType()

### Community 65 - "Error Handling"
Cohesion: 0.25
Nodes (6): CreateCycle, CreateCycleInputType, CreateCycleOutput, CycleDateValidationError, CyclePastStartDateError, EmptyCycleNameError

### Community 66 - "Notifications Module"
Cohesion: 0.25
Nodes (4): MarkAllNotificationsRead, MarkAllNotificationsReadOutput, NotificationEvent, NotificationEventPublisher

### Community 67 - "Notifications Module"
Cohesion: 0.24
Nodes (6): ListNotifications, ListNotificationsInput, ListNotificationsInputType, ListNotificationsOutput, NotificationItem, toItem()

### Community 68 - "Project Configuration"
Cohesion: 0.20
Nodes (9): author, description, keywords, license, main, name, packageManager, type (+1 more)

### Community 69 - "Error Handling"
Cohesion: 0.24
Nodes (5): CreateOrganization, CreateOrganizationInput, CreateOrganizationInputType, CreateOrganizationOutput, OrganizationNameConflictError

### Community 70 - "Error Handling"
Cohesion: 0.24
Nodes (5): CreateTeam, CreateTeamInput, CreateTeamInputType, CreateTeamOutput, TeamKeyConflictError

### Community 71 - "Project Module"
Cohesion: 0.24
Nodes (3): GetProjectProgress, GetProjectProgressOutput, IssueQuery

### Community 72 - "Error Handling"
Cohesion: 0.25
Nodes (3): organizationMemberRepository, NotOrganizationMemberError, NotOrganizationOwnerError

### Community 73 - "Identity & Team"
Cohesion: 0.46
Nodes (6): CreateOrganizationSchema, DeleteOrganizationSchema, GetOrganizationDetailsSchema, GetUserProfileSchema, ListUserOrganizationsSchema, UpdateUserProfileSchema

### Community 74 - "Architecture Patterns"
Cohesion: 0.33
Nodes (6): Architecture Template, Hexagonal Architecture Pattern, JWT Dual Token Authentication, Deployment Template, Technology Templates README, Stack Template

### Community 76 - "WebSocket Gateway"
Cohesion: 0.40
Nodes (3): CHANNEL_PATTERNS, GATEWAY_EVENTS, GatewayEventEnvelope

### Community 77 - "Error Handling"
Cohesion: 0.50
Nodes (4): Standardized Error Types, Rate Limiting Specification, Shared Module, Error Handling Contract

### Community 78 - "Workflow & State Management"
Cohesion: 0.50
Nodes (4): Default Workflow Embedding — Hardcoded Status Transitions, ChangeIssueStatus Use Case, Issue Status Change Feature, Issue Status Seed Data (Default Workflow)

### Community 79 - "Workflow & State Management"
Cohesion: 0.50
Nodes (4): Default Workflow, Transition Validation Service, Validate Transition Use Case, Workflow Resolution Service

### Community 80 - "Project Configuration"
Cohesion: 0.67
Nodes (4): Cookie Migration Design, Auth Cookie Migration API, Auth Cookie Migration Business Rules, CookieConfig

### Community 81 - "Error Handling"
Cohesion: 0.50
Nodes (3): ErrorResponseSchema, RefreshTokenRequestSchema, RefreshTokenResponseSchema

### Community 83 - "Test Suites"
Cohesion: 0.67
Nodes (3): CodeGraph Code Intelligence, Graphify Knowledge Graph, OpenSpec Specifications

### Community 84 - "Watchers Module"
Cohesion: 0.67
Nodes (3): AutoSubscribe, ChannelSubscription, EventBroadcasting

### Community 85 - "Issue Module"
Cohesion: 0.67
Nodes (3): Cursor-based Pagination — Composite Cursor, ListIssues Use Case, Issue Query Feature

## Knowledge Gaps
- **544 isolated node(s):** `Workflow Module`, `Project Module`, `Cycle Module`, `Notification Module`, `Gateway Module` (+539 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **78 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `env` connect `WebSocket Gateway` to `Error Handling`, `Labels Module`, `Session Management`, `Session Management`, `Session Management`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `Cycle domain index` connect `Cycle Module` to `Project Module`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `teamMembers` connect `Error Handling` to `Comments Module`, `Watchers Module`, `Labels Module`, `Workflow & State Management`, `Comments Module`, `Project DTOs`, `Identity & Team`, `Error Handling`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `Workflow Module`, `Project Module`, `Cycle Module` to the rest of the system?**
  _544 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `WebSocket Gateway` be split into smaller, more focused modules?**
  _Cohesion score 0.05442329227323628 - nodes in this community are weakly interconnected._
- **Should `Comments Module` be split into smaller, more focused modules?**
  _Cohesion score 0.04208065458796026 - nodes in this community are weakly interconnected._
- **Should `Error Handling` be split into smaller, more focused modules?**
  _Cohesion score 0.0841799709724238 - nodes in this community are weakly interconnected._