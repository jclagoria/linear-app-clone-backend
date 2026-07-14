---
status: "accepted"
date: 2026-07-13
decision-makers: Backend Team
consulted: Tech Lead, Security Lead
informed: Engineering
---

# Shared Entity Ownership Between Auth and Identity Modules

## Context and Problem Statement

The `users` table needs to be shared between the Auth module (handling authentication) and the Identity module (handling user profiles). We need to decide how to manage ownership of fields and operations to prevent conflicts and ensure data integrity.

## Decision Drivers

- Auth module owns authentication-critical fields (email, passwordHash, createdAt)
- Identity module owns profile-related fields (name, avatarUrl, updatedAt, deletedAt)
- Prevent unauthorized cross-module field modifications
- Maintain clear boundaries while sharing the same database table
- Support independent module evolution without breaking changes

## Considered Options

- Shared table with field ownership validation
- Separate tables with foreign key relationships
- Single module owns entire table
- Event-driven synchronization between separate user tables

## Decision Outcome

Chosen option: "Shared table with field ownership validation", because it provides efficient queries (no JOINs for user data), maintains clear module boundaries through validation, and avoids data synchronization complexity.

### Consequences

- Good, because single query retrieves complete user data without JOINs
- Good, because modules can evolve independently by owning their fields
- Good, because maintains data consistency through validation at use case level
- Bad, because requires careful validation to prevent cross-module field modifications
- Bad, because schema changes need coordination between modules
- Bad, because adds complexity to repository layer for ownership checks

### Confirmation

Compliance will be confirmed through:
- Unit tests verifying ownership validation logic
- Integration tests preventing unauthorized field updates
- Code review ensuring use cases validate ownership before updates

## Pros and Cons of the Options

### Shared Table with Field Ownership Validation

Single users table where Auth and Identity modules validate ownership before modifying their respective fields.

- Good, because efficient queries with no JOINs
- Good, because maintains single source of truth for user data
- Good, because modules can add fields without affecting each other
- Neutral, because requires clear field ownership documentation
- Bad, because validation logic adds complexity
- Bad, because schema changes need cross-module coordination

### Separate Tables with Foreign Key Relationships

Auth and Identity each have their own user-related tables linked by foreign keys.

- Good, because complete module isolation
- Good, because independent schema evolution
- Neutral, because requires JOINs for complete user data
- Bad, because data synchronization complexity
- Bad, because performance overhead from JOINs
- Bad, because foreign key constraints add overhead

### Single Module Owns Entire Table

One module (either Auth or Identity) owns all user fields and exposes operations to other modules.

- Good, because clear ownership and responsibility
- Good, because simpler validation logic
- Neutral, because one module becomes the bottleneck for user changes
- Bad, because violates module boundaries
- Bad, because creates tight coupling between modules
- Bad, because harder to maintain separation of concerns

### Event-Driven Synchronization Between Separate Tables

Each module has its own user table, synchronized via events.

- Good, because complete module independence
- Good, because each module can evolve independently
- Neutral, because eventual consistency is acceptable for some fields
- Bad, because data synchronization complexity
- Bad, because eventual consistency may not be acceptable for user profile data
- Bad, because adds infrastructure complexity (event bus, reconciliation)

## More Information

This decision follows the principle of shared database ownership where modules collaborate on a single data source but maintain clear boundaries through validation. The Auth module handles immutable authentication data, while the Identity module manages mutable profile data.

The implementation enforces ownership through use case validation:
- Auth use cases validate email/password ownership
- Identity use cases validate name/avatarUrl ownership
- Both modules respect createdAt immutability

References:
- Existing Auth module implementation
- Tech Research Digest recommendation for shared entity ownership
- Domain-Driven Design bounded context patterns
