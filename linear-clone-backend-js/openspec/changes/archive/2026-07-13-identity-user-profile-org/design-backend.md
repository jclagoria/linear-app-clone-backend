# Identity — Backend Design

## Architecture Decisions

### Hexagonal Architecture for Identity Module

The identity module follows the established hexagonal architecture pattern:
- **Domain**: User profile and Organization entities with business rules
- **Application**: Use cases for profile management and organization operations
- **Adapters**: Controllers (inbound), Repositories (outbound)
- **Ports**: Interfaces for profile and organization operations

### Shared Entity Ownership

The `users` table is shared between Auth and Identity modules:
- **Auth module**: Owns email, passwordHash, createdAt (immutable after creation)
- **Identity module**: Manages name, avatarUrl, updatedAt, deletedAt
- **Enforcement**: Use cases validate ownership before updates

### Soft Deletion Strategy

All entities support soft deletion via `deletedAt` timestamp:
- Queries filter by `deletedAt IS NULL` by default
- Cascade soft-deletion for organization → teams, members
- No hard deletes for audit trail

## API Contracts

### Get User Profile

- **Method**: GET
- **Path**: `/api/v1/users/me`
- **Request**: (none)
- **Response**: `{ "data": { "user": UserProfileObject } }`
- **Status Codes**: 200, 401, 404, 500

### Update User Profile

- **Method**: PATCH
- **Path**: `/api/v1/users/me`
- **Request**: `{ "name"?: string, "avatarUrl"?: string | null }`
- **Response**: `{ "data": { "user": UserProfileObject } }`
- **Status Codes**: 200, 400, 401, 403, 404, 500

### Create Organization

- **Method**: POST
- **Path**: `/api/v1/organizations`
- **Request**: `{ "name": string }`
- **Response**: `{ "data": { "organization": OrganizationObject } }`
- **Status Codes**: 201, 400, 401, 409, 500

### List User Organizations

- **Method**: GET
- **Path**: `/api/v1/organizations`
- **Request**: (none)
- **Response**: `{ "data": { "organizations": OrganizationObject[] } }`
- **Status Codes**: 200, 401, 500

### Get Organization Details

- **Method**: GET
- **Path**: `/api/v1/organizations/:organizationId`
- **Request**: (path param: organizationId)
- **Response**: `{ "data": { "organization": OrganizationObject } }`
- **Status Codes**: 200, 401, 403, 404, 500

### Delete Organization

- **Method**: DELETE
- **Path**: `/api/v1/organizations/:organizationId`
- **Request**: (path param: organizationId)
- **Response**: (no body)
- **Status Codes**: 204, 401, 403, 404, 500

## Data Model

### Users Table (Modified)

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, NOT NULL | Existing (Auth) |
| email | varchar(255) | UNIQUE, NOT NULL | Existing (Auth) |
| passwordHash | varchar(255) | NOT NULL | Existing (Auth) |
| name | varchar(255) | NOT NULL | NEW (Identity) |
| avatarUrl | text | NULL | NEW (Identity) |
| createdAt | timestamp | NOT NULL | Existing (Auth) |
| updatedAt | timestamp | NOT NULL | NEW (Identity) |
| deletedAt | timestamp | NULL | NEW (Identity) |

### Organizations Table (New)

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, NOT NULL | Primary key |
| name | varchar(255) | UNIQUE, NOT NULL | Organization name |
| ownerId | UUID | FK → users.id, NOT NULL | Organization owner |
| createdAt | timestamp | NOT NULL | Creation timestamp |
| updatedAt | timestamp | NOT NULL | Last update timestamp |
| deletedAt | timestamp | NULL | Soft deletion timestamp |

### Organization Members Table (New)

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, NOT NULL | Primary key |
| organizationId | UUID | FK → organizations.id, NOT NULL | Organization reference |
| userId | UUID | FK → users.id, NOT NULL | User reference |
| role | varchar(50) | NOT NULL | Owner, admin, member |
| createdAt | timestamp | NOT NULL | Membership timestamp |
| deletedAt | timestamp | NULL | Soft deletion timestamp |

### Indexes

| Table | Index | Columns | Purpose |
|-------|-------|---------|---------|
| users | idx_users_email | email | Auth lookup |
| users | idx_users_deleted_at | deletedAt | Soft delete filtering |
| organizations | idx_organizations_owner_id | ownerId | Owner lookup |
| organizations | idx_organizations_deleted_at | deletedAt | Soft delete filtering |
| organization_members | idx_org_members_organization_id | organizationId | Organization membership lookup |
| organization_members | idx_org_members_user_id | userId | User membership lookup |
| organization_members | idx_org_members_deleted_at | deletedAt | Soft delete filtering |

### Migrations

| Version | Description |
|---------|-------------|
| V1 | Add name, avatarUrl, updatedAt, deletedAt to users table |
| V2 | Create organizations table with owner relationship |
| V3 | Create organization_members table with role-based membership |

## Business Logic

### User Profile Service

- **Responsibility**: Manage user profile updates
- **Rules**:
  - Users can only update their own profile
  - Avatar URL must be valid URL format or null
  - Name must be 1-255 characters
  - updatedAt timestamp must be updated on changes
- **Dependencies**: UserRepository, Redis cache

### Organization Service

- **Responsibility**: Manage organization lifecycle
- **Rules**:
  - Organization names must be unique across non-deleted orgs
  - Creator automatically becomes owner
  - Only owner can delete organization
  - Soft-deletion cascades to teams and members
- **Dependencies**: OrganizationRepository, OrganizationMemberRepository, Redis cache

### Authorization Middleware

- **Responsibility**: Enforce access control
- **Rules**:
  - Profile updates: Compare JWT user ID with target user ID
  - Organization details: Check user is member of organization
  - Organization deletion: Check user is owner of organization
- **Dependencies**: JWT validation, organization membership lookup

## Security

### Authentication

- JWT access tokens validated on every request
- Token contains user ID for ownership checks
- Refresh tokens stored in Redis for session management

### Authorization

- **Profile ownership**: User ID from JWT must match target user ID
- **Organization membership**: User must be member to view details
- **Organization ownership**: User must be owner to delete

### Input Validation

- Zod schemas at API boundary for all inputs
- Name validation: string, 1-255 characters
- Avatar URL validation: valid URL format or null
- Organization name validation: string, 1-255 characters, unique

### Rate Limiting

- GET endpoints: 30 requests/min per user
- PATCH/POST endpoints: 5-10 requests/min per user
- DELETE endpoints: 5 requests/min per user

### Error Handling

- Standardized error responses with codes
- No sensitive data in error messages
- Correlation IDs for request tracing

## Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | Services, validators, domain logic |
| Integration | Vitest + Testcontainers | Repository, full API flow |
| Contract | Vitest | API contract verification |

### Unit Tests

- **User Profile Service**: Profile update rules, avatar validation
- **Organization Service**: Name uniqueness, ownership, cascade deletion
- **Authorization Middleware**: Access control logic

### Integration Tests

- **API Endpoints**: Full request/response cycle
- **Database Operations**: Repository queries, soft deletion
- **Cache Integration**: Redis caching, invalidation

### Contract Tests

- **API Schema Validation**: Request/response schemas match specs
- **Status Code Verification**: Correct status codes for all scenarios
- **Error Response Format**: Standardized error format

## Tech Research Digest Alignment

| Pattern | Digest Recommendation | Implementation | Notes |
|---------|----------------------|----------------|-------|
| Hexagonal Architecture | Mandatory | ✅ Followed | Domain isolated from infrastructure |
| Soft Deletion | Recommended for audit | ✅ Implemented | deletedAt timestamp on all entities |
| Input Validation | Zod at boundary | ✅ Implemented | Zod schemas for all inputs |
| Rate Limiting | Required for all APIs | ✅ Implemented | Per-endpoint rate limits |
| JWT Auth | Dual token (access + refresh) | ✅ Implemented | Access 15min, refresh 7 days |
