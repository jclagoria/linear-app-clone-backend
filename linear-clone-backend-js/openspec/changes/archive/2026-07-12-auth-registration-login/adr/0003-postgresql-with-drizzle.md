---
status: "accepted"
date: 2026-07-11
decision-makers: Backend Team
consulted: None
informed: None
---

# Use PostgreSQL with Drizzle ORM

## Context and Problem Statement

The backend needs a reliable relational database for storing users, sessions, and other entities with ACID compliance and type safety.

## Decision Drivers

- ACID compliance for data integrity
- Type-safe database queries
- Support for complex queries and joins
- Migration management
- Performance and scalability

## Considered Options

- PostgreSQL with Drizzle ORM
- PostgreSQL with Prisma
- PostgreSQL with TypeORM
- MongoDB with Mongoose

## Decision Outcome

Chosen option: "PostgreSQL with Drizzle ORM", because it provides the best combination of type safety, performance, and SQL-like API.

### Consequences

- Good, because Drizzle is lightweight and fast
- Good, because SQL-like API is familiar to developers
- Good, because automatic migration generation
- Good, because type-safe queries at compile time
- Bad, because Drizzle is newer than Prisma/TypeORM
- Bad, because smaller community and ecosystem

### Confirmation

- Verify database queries are type-safe
- Verify migrations are generated correctly
- Verify performance meets requirements
- Verify all required features are supported

## Pros and Cons of the Options

### PostgreSQL with Drizzle ORM

- Good, because lightweight and fast
- Good, because SQL-like API
- Good, because type-safe queries
- Neutral, because newer than alternatives
- Bad, because smaller community

### PostgreSQL with Prisma

- Good, because excellent developer experience
- Good, because large community and ecosystem
- Good, because great documentation
- Neutral, because schema-first approach
- Bad, because heavier than Drizzle
- Bad, because generated client can be large

### PostgreSQL with TypeORM

- Good, because mature and widely used
- Good, because decorator-based syntax
- Neutral, because active record pattern
- Bad, because can be verbose
- Bad, because performance overhead

## More Information

- See `docs/stack-backend.md` for stack details
- See `design-backend.md` for data model
