# Cycle Module — Backend Design

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Module structure | New `src/modules/cycle/` | Follows existing hexagonal architecture pattern (cf. `work`, `identity`, `project`) |
| Cycle status enum | `cycle_status` enum with `draft`, `active`, `completed` | Type-safe, no status join table needed (simple lifecycle: Draft → Active → Completed) |
| Repository pattern | Drizzle + interface | Same as `drizzle-project-repository.ts`; testable via mock |
| Auto-complete on activate | Application-level logic in use case | Activating a cycle checks for and completes any currently `active` cycle for the same team |
| Start date override | Set to `now()` on activation when in Draft | Per spec: activation sets start date to activation time for Draft cycles |
| Event publishing | Existing `EventPublisher` port | Publish `CycleCreated`, `CycleActivated`, `CycleCompleted` events |
| Hard delete for Draft | `DELETE FROM cycles` | Draft cycles can be deleted permanently; Active/Completed cycles cannot be deleted |
| Issue assignment guard | Cycle MUST be `active` | Issues can only be assigned to Active cycles; Draft cycles reject assignment |

## API Contracts

### POST /api/v1/cycles

- **Method**: POST
- **Path**: `/api/v1/cycles`
- **Request**: `{ teamId: string (uuid), name: string (1-255), description?: string, startDate: string (ISO date), endDate: string (ISO date) }`
- **Response** (201): `CycleResponse`
- **Status Codes**: 201, 400, 401, 403, 422

### GET /api/v1/cycles/:cycleId

- **Method**: GET
- **Path**: `/api/v1/cycles/:cycleId`
- **Response** (200): `CycleResponse`
- **Status Codes**: 200, 401, 403, 404

### GET /api/v1/teams/:teamId/cycles

- **Method**: GET
- **Path**: `/api/v1/teams/:teamId/cycles?status={status}&cursor={cursor}&limit={limit}`
- **Response** (200): `{ data: CycleResponse[], nextCursor: string | null, hasMore: boolean }`
- **Status Codes**: 200, 401, 403

### PATCH /api/v1/cycles/:cycleId

- **Method**: PATCH
- **Path**: `/api/v1/cycles/:cycleId`
- **Request**: `{ name?: string, description?: string, startDate?: string, endDate?: string }`
- **Response** (200): `CycleResponse`
- **Status Codes**: 200, 400, 401, 403, 404, 422

### POST /api/v1/cycles/:cycleId/activate

- **Method**: POST
- **Path**: `/api/v1/cycles/:cycleId/activate`
- **Response** (200): `CycleResponse`
- **Status Codes**: 200, 401, 403, 404, 422

### POST /api/v1/cycles/:cycleId/complete

- **Method**: POST
- **Path**: `/api/v1/cycles/:cycleId/complete`
- **Response** (200): `CycleResponse`
- **Status Codes**: 200, 401, 403, 404, 422

### DELETE /api/v1/cycles/:cycleId

- **Method**: DELETE
- **Path**: `/api/v1/cycles/:cycleId`
- **Response** (204): No content
- **Status Codes**: 204, 401, 403, 404, 422

## Data Model

### Entity: Cycle

```sql
CREATE TYPE cycle_status AS ENUM ('draft', 'active', 'completed');

CREATE TABLE cycles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id     uuid NOT NULL REFERENCES teams(id),
  name        varchar(255) NOT NULL,
  description text,
  status      cycle_status NOT NULL DEFAULT 'draft',
  start_date  date NOT NULL,
  end_date    date NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
```

### Drizzle Schema (`src/modules/cycle/domain/cycle.ts`)

```typescript
import { pgTable, uuid, varchar, text, date, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const cycleStatusEnum = pgEnum('cycle_status', ['draft', 'active', 'completed']);

export const cycles = pgTable('cycles', {
  id: uuid('id').defaultRandom().primaryKey(),
  teamId: uuid('team_id').notNull().references(() => teams.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: cycleStatusEnum('status').notNull().default('draft'),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});
```

### Indexes

| Column(s) | Type | Purpose |
|-----------|------|---------|
| `team_id` | B-tree | Filter cycles by team |
| `team_id + status` | Composite B-tree | Find active cycle for a team |

### Migration Plan

| Version | Description |
|---------|-------------|
| V1 | Create `cycle_status` enum, `cycles` table, and indexes |

### Response Schema (CycleResponse)

```typescript
interface CycleResponse {
  id: string;
  teamId: string;
  name: string;
  description: string | null;
  status: 'draft' | 'active' | 'completed';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}
```

## Business Logic

### Use Cases

#### CreateCycle

- **File**: `src/modules/cycle/application/create-cycle.ts`
- **Responsibility**: Create a new cycle with status `draft`
- **Rules**:
  - User MUST be a team member
  - Name MUST NOT be empty
  - Start date MUST be today or future (no backdating)
  - End date MUST be after start date
  - No minimum or maximum duration
- **Dependencies**: `CycleRepository`, `TeamMemberQuery` (port)
- **Events**: `CycleCreated { cycleId, teamId, userId }`

#### UpdateCycle

- **File**: `src/modules/cycle/application/update-cycle.ts`
- **Responsibility**: Partial update of cycle metadata
- **Rules**:
  - User MUST be a team member
  - Name MUST NOT be empty if provided
  - Dates only modifiable when status is `draft`
  - Start date MUST be today or future (if provided)
  - End date MUST be after start date (if both provided or one changed)
- **Dependencies**: `CycleRepository`, `TeamMemberQuery` (port)
- **Events**: `CycleUpdated { cycleId, teamId, userId }`

#### ActivateCycle

- **File**: `src/modules/cycle/application/activate-cycle.ts`
- **Responsibility**: Activate a cycle
- **Rules**:
  - User MUST be a team member
  - Cycle MUST be in `draft` status (not already active or completed)
  - If Draft: set `startDate` to activation time (today)
  - Find any currently `active` cycle for the same team and auto-complete it
  - Set status to `active`
  - Completed cycles MUST NOT be reactivated
- **Dependencies**: `CycleRepository`, `TeamMemberQuery` (port)
- **Events**: `CycleActivated { cycleId, teamId, userId }`, `CycleCompleted { previousCycleId, teamId, userId }` (for auto-completed)

#### CompleteCycle

- **File**: `src/modules/cycle/application/complete-cycle.ts`
- **Responsibility**: Complete an active cycle
- **Rules**:
  - User MUST be a team member
  - Cycle MUST be in `active` status
  - Set status to `completed`
  - Set `completedAt` to current timestamp
- **Dependencies**: `CycleRepository`, `TeamMemberQuery` (port)
- **Events**: `CycleCompleted { cycleId, teamId, userId }`

#### DeleteCycle

- **File**: `src/modules/cycle/application/delete-cycle.ts`
- **Responsibility**: Delete a Draft cycle
- **Rules**:
  - User MUST be a team member
  - Cycle MUST be in `draft` status
  - Active and Completed cycles MUST NOT be deleted
  - Hard delete from database
- **Dependencies**: `CycleRepository`, `TeamMemberQuery` (port)
- **Events**: None

#### GetCycle

- **File**: `src/modules/cycle/application/get-cycle.ts`
- **Responsibility**: Retrieve a single cycle by ID
- **Rules**:
  - User MUST be a team member of the cycle's team
- **Dependencies**: `CycleRepository`, `TeamMemberQuery` (port)
- **Events**: None (read-only)

#### ListCycles

- **File**: `src/modules/cycle/application/list-cycles.ts`
- **Responsibility**: List cycles for a team with optional status filter
- **Rules**:
  - User MUST be a team member
  - Cursor-based pagination
  - Optional status filter
  - Sorted by start date descending
- **Dependencies**: `CycleRepository`, `TeamMemberQuery` (port)
- **Events**: None (read-only)

### Cross-Module Integration

The work module already references `cycleId` on issues. The issue controller will validate cycle assignment using the cycle repository:

```typescript
// In work module or via a query port
interface CycleQuery {
  findById(cycleId: string): Promise<Cycle | null>;
  isActive(cycleId: string): Promise<boolean>;
}
```

This will be implemented as an inline adapter (same pattern as `projectQuery` in the project module). When assigning an issue to a cycle:
1. Verify cycle exists
2. Verify cycle is `active` status
3. Verify cycle belongs to the same team as the issue

## Module Structure

```
src/modules/cycle/
├── domain/
│   ├── cycle.ts              # Drizzle schema + types
│   ├── errors.ts             # Domain error classes
│   └── index.ts              # Re-exports
├── application/
│   ├── ports/
│   │   ├── cycle-repository.ts     # Repository interface
│   │   └── team-member-query.ts    # Query port interface
│   ├── create-cycle.ts
│   ├── update-cycle.ts
│   ├── activate-cycle.ts
│   ├── complete-cycle.ts
│   ├── delete-cycle.ts
│   ├── get-cycle.ts
│   └── list-cycles.ts
├── adapters/
│   ├── in/
│   │   ├── cycle-controller.ts     # Fastify routes
│   │   └── dto.ts                  # Zod schemas + response types
│   └── out/
│       └── drizzle-cycle-repository.ts  # Drizzle implementation
└── __tests__/
    ├── create-cycle.test.ts
    ├── update-cycle.test.ts
    ├── activate-cycle.test.ts
    ├── complete-cycle.test.ts
    ├── delete-cycle.test.ts
    ├── get-cycle.test.ts
    └── list-cycles.test.ts
```

## Security

- **Authentication**: JWT Bearer token required on all endpoints (via same `getUserIdFromToken` helper pattern)
- **Authorization**: Team membership required for all cycle operations
- **Input validation**: Zod schemas at controller boundary (DPI)
- **Rate limiting**: 30 req/min for mutating endpoints, 60 req/min for read endpoints
- **Error handling**: Domain-specific errors mapped to HTTP status codes in controller

## Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest + mocks | Use case classes: business rules, validation, error cases |
| Integration | Vitest | Repository layer with test database |
| Contract | Vitest | API endpoints via Fastify `inject()` |

### Test coverage per use case

| Use Case | Test Scenarios |
|----------|---------------|
| CreateCycle | Happy path, past start date, end before start, empty name, non-member |
| UpdateCycle | Happy path, empty name, dates in Draft, dates outside Draft, partial update |
| ActivateCycle | Happy path Draft→Active, auto-complete previous, already active, completed, non-member |
| CompleteCycle | Happy path Active→Completed, Draft cannot complete, already completed |
| DeleteCycle | Happy path Draft deleted, Active cannot delete, Completed cannot delete |
| GetCycle | Happy path, not found, non-member |
| ListCycles | Happy path, status filter, pagination, non-member |
