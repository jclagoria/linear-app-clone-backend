# Tasks — Identity User Profile & Organization (Backend)

## Scaffold

- [x] Create identity module directory structure: `src/modules/identity/`
- [x] Create subdirectories: `domain/`, `application/`, `adapters/in/`, `adapters/out/`, `__tests__/`
- [x] Add module barrel exports: `src/modules/identity/index.ts`
- [x] Update `src/shared/database/index.ts` to import identity schema

## Data Layer

- [x] Create `src/modules/identity/domain/user.ts` — Extend users table with profile fields (name, avatarUrl, updatedAt, deletedAt)
- [x] Create `src/modules/identity/domain/organization.ts` — Define organizations table schema (id, name, ownerId, createdAt, updatedAt, deletedAt)
- [x] Create `src/modules/identity/domain/organization-member.ts` — Define organization_members table schema (id, organizationId, userId, role, createdAt, deletedAt)
- [x] Create `src/modules/identity/domain/index.ts` — Export all domain entities and types
- [x] Create `src/modules/identity/domain/errors.ts` — Define identity-specific error types
- [x] Create migration `V1` — Add name, avatar_url, updated_at, deleted_at to users table
- [x] Create migration `V2` — Create organizations table with owner FK
- [x] Create migration `V3` — Create organization_members table with role column
- [x] Add database indexes: idx_users_deleted_at, idx_organizations_owner_id, idx_organizations_deleted_at, idx_org_members_organization_id, idx_org_members_user_id, idx_org_members_deleted_at
- [x] Create `src/modules/identity/adapters/out/drizzle-user-profile-repository.ts` — Implement UserProfileRepository for profile CRUD
- [x] Create `src/modules/identity/adapters/out/drizzle-organization-repository.ts` — Implement OrganizationRepository for organization CRUD
- [x] Create `src/modules/identity/adapters/out/drizzle-organization-member-repository.ts` — Implement OrganizationMemberRepository for membership operations

## Business Logic

- [x] Create `src/modules/identity/domain/errors.ts` — Define identity-specific error types (ProfileNotFound, OrganizationNotFound, OrganizationNameConflict, NotOrganizationMember, NotOrganizationOwner, InvalidAvatarUrl)
- [x] Create `src/modules/identity/application/ports.ts` — Define port interfaces (UserProfileRepository, OrganizationRepository, OrganizationMemberRepository, EventPublisher)
- [x] Create `src/modules/identity/application/get-user-profile.ts` — Implement get user profile use case with ownership validation
- [x] Create `src/modules/identity/application/update-user-profile.ts` — Implement update profile use case with avatar URL validation and updatedAt timestamp update
- [x] Create `src/modules/identity/application/create-organization.ts` — Implement create organization use case with name uniqueness and auto-owner assignment
- [x] Create `src/modules/identity/application/list-user-organizations.ts` — Implement list user organizations use case
- [x] Create `src/modules/identity/application/get-organization-details.ts` — Implement get organization details use case with membership validation
- [x] Create `src/modules/identity/application/delete-organization.ts` — Implement soft-delete organization use case with cascade deletion and owner validation
- [x] Create `src/modules/identity/application/validators.ts` — Implement input validation schemas (profile update, organization create)

## API Layer

- [x] Create `src/modules/identity/adapters/in/dto.ts` — Define request/response DTOs and Zod validation schemas
- [x] Create `src/modules/identity/adapters/in/identity-controller.ts` — Implement REST controllers for profile and organization endpoints
- [x] Register routes in `src/shared/routes.ts` or main app — Add `/api/v1/users/me` and `/api/v1/organizations` routes
- [x] Implement error handling middleware — Map identity errors to HTTP status codes (400, 401, 403, 404, 409, 500)
- [x] Add rate limiting configuration — Configure per-endpoint rate limits (GET: 30/min, PATCH/POST: 10/min, DELETE: 5/min)
- [x] Add response headers — Include X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset headers

## Events / Messaging

- [x] Create `src/modules/identity/adapters/out/in-memory-event-publisher.ts` — Implement EventPublisher for identity events
- [x] Define event types: UserprofileUpdated, OrganizationCreated, OrganizationDeleted
- [x] Integrate event publishing in use cases — Emit events after successful operations

## Security

- [x] Create `src/modules/identity/adapters/in/auth-middleware.ts` — Implement JWT authentication middleware for identity endpoints
- [x] Create `src/modules/identity/adapters/in/authorization-middleware.ts` — Implement ownership validation middleware
- [x] Add profile ownership check — Compare JWT user ID with target user ID for profile updates
- [x] Add organization membership check — Verify user is member before allowing access to organization details
- [x] Add organization ownership check — Verify user is owner before allowing organization deletion
- [x] Implement input sanitization — Sanitize all inputs before processing

## Testing

### Unit Tests

- [x] Create `src/modules/identity/__tests__/get-user-profile.test.ts` — Test get profile use case (success, user not found)
- [x] Create `src/modules/identity/__tests__/update-user-profile.test.ts` — Test update profile use case (success, validation errors, ownership violation)
- [x] Create `src/modules/identity/__tests__/create-organization.test.ts` — Test create organization use case (success, duplicate name, invalid input)
- [x] Create `src/modules/identity/__tests__/list-user-organizations.test.ts` — Test list organizations use case (success, empty list)
- [x] Create `src/modules/identity/__tests__/get-organization-details.test.ts` — Test get organization details (success, not member, not found)
- [x] Create `src/modules/identity/__tests__/delete-organization.test.ts` — Test delete organization (success, not owner, cascade deletion)
- [x] Create `src/modules/identity/__tests__/validators.test.ts` — Test input validation schemas

### Integration Tests

- [x] Create `src/modules/identity/__tests__/integration/profile-api.test.ts` — Test GET/PATCH /api/v1/users/me endpoints
- [x] Create `src/modules/identity/__tests__/integration/organization-api.test.ts` — Test organization CRUD endpoints
- [x] Create `src/modules/identity/__tests__/integration/cascade-deletion.test.ts` — Test organization cascade soft-deletion
- [x] Create `src/modules/identity/__tests__/integration/authorization.test.ts` — Test authorization rules across endpoints

### Contract Tests

- [x] Create `src/modules/identity/__tests__/contract/get-profile.contract.test.ts` — Verify GET /api/v1/users/me response schema
- [x] Create `src/modules/identity/__tests__/contract/update-profile.contract.test.ts` — Verify PATCH /api/v1/users/me response schema
- [x] Create `src/modules/identity/__tests__/contract/create-organization.contract.test.ts` — Verify POST /api/v1/organizations response schema
- [x] Create `src/modules/identity/__tests__/contract/list-organizations.contract.test.ts` — Verify GET /api/v1/organizations response schema
- [x] Create `src/modules/identity/__tests__/contract/get-organization.contract.test.ts` — Verify GET /api/v1/organizations/:id response schema
- [x] Create `src/modules/identity/__tests__/contract/delete-organization.contract.test.ts` — Verify DELETE /api/v1/organizations/:id response

## Review

- [x] Self-review: Verify all tasks completed and tests pass
- [x] Code review: Submit PR with all changes for team review
- [x] Documentation: Update module documentation if needed
- [x] Verify API contract matches OpenAPI spec
- [x] Verify all endpoints have rate limiting configured
- [x] Verify all error responses follow standardized format
