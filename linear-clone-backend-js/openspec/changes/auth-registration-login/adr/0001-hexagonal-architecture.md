---
status: "accepted"
date: 2026-07-11
decision-makers: Backend Team
consulted: None
informed: None
---

# Use Hexagonal Architecture

## Context and Problem Statement

The backend needs a clear separation of concerns to enable testability, maintainability, and flexibility in swapping infrastructure components (databases, caches, external services).

## Decision Drivers

- Enable testing domain logic without infrastructure dependencies
- Support swapping implementations (e.g., Redis → PostgreSQL for sessions)
- Maintain clear boundaries between business logic and adapters
- Follow industry best practices for backend architecture

## Considered Options

- Hexagonal Architecture (Ports & Adapters)
- Layered Architecture (MVC)
- Clean Architecture
- Modular Monolith without explicit pattern

## Decision Outcome

Chosen option: "Hexagonal Architecture (Ports & Adapters)", because it provides the best balance of testability, flexibility, and clear boundaries.

### Consequences

- Good, because domain logic is isolated from infrastructure concerns
- Good, because adapters can be swapped without changing domain code
- Good, because testing is simplified with mock adapters
- Bad, because initial setup requires more boilerplate (ports, adapters)
- Bad, because team needs to learn the pattern

### Confirmation

- Verify that domain entities have no framework imports
- Verify that use cases depend only on port interfaces
- Verify that adapters implement port interfaces
- Verify that unit tests can run without database or Redis

## Pros and Cons of the Options

### Hexagonal Architecture (Ports & Adapters)

- Good, because domain logic is pure and testable
- Good, because infrastructure can be swapped independently
- Good, because clear separation of concerns
- Neutral, because requires more initial structure
- Bad, because more files and interfaces to maintain

### Layered Architecture (MVC)

- Good, because widely understood and documented
- Good, because simpler initial setup
- Neutral, because good for CRUD-heavy applications
- Bad, because business logic often leaks into controllers
- Bad, because harder to swap infrastructure

### Clean Architecture

- Good, because similar to hexagonal with explicit dependency rule
- Good, because emphasizes use cases
- Neutral, because more prescriptive than hexagonal
- Bad, because more complex than hexagonal for most backend APIs

## More Information

- See `docs/architecture-backend.md` for project structure
- See `design-backend.md` for component design details
