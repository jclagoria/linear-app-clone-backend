# Architecture

> Template — replace with actual project architecture.

## Overview

{One-paragraph description of the system architecture.}

This project is a {type} built with {stack}.

The architecture follows {pattern}: {explanation of key patterns}.

## Technical Direction

- {Architecture style}: {hexagonal / clean / layered / modular monolith}
- {Backend framework}: {Spring Boot 4} with {DDD / MVC / CQRS}
- {Frontend framework}: {Next.js 14} with {App Router / Pages Router}
- {API style}: {REST} with {JSON / Protobuf}
- {Database}: {PostgreSQL} with {Flyway / Liquibase} migrations
- {Real-time}: {SSE / WebSocket} for live updates

## Project Structure

```
backend/
  src/main/java/{package}/
    adapters/       # Inbound (controllers) + outbound (repositories)
    application/    # Use cases, ports, DTOs
    domain/         # Entities, value objects, domain services
    shared/         # Cross-cutting (config, security, logging)
  src/test/
    unit/           # Service tests
    integration/    # Repository / API tests
frontend/
  src/
    app/            # Next.js App Router pages
    components/     # Shared UI components
    lib/            # API client, utils
    stores/         # State management
    types/          # TypeScript types
```

### Backend — {hexagonal / clean} architecture

| Layer | Responsibility | Examples |
|-------|---------------|----------|
| `domain/` | Business entities, rules | `User`, `Board`, `Card`, value objects |
| `application/` | Use cases, ports | `CreateBoardUseCase`, `BoardRepository` |
| `adapters/in/` | Inbound adapters | `BoardController`, `AuthFilter` |
| `adapters/out/` | Outbound adapters | `JpaBoardRepository`, `SsePublisher` |

### Frontend — {Next.js App Router}

| Directory | Responsibility |
|-----------|---------------|
| `app/` | Routes, layouts, pages |
| `components/` | Shared UI (design-system components) |
| `lib/` | API client, auth helpers, utils |
| `stores/` | Client state (Zustand / Context) |
| `types/` | Shared TypeScript types |

## Component Design

### Backend

- Follow SOLID principles with hexagonal architecture.
- Domain entities are pure Java/Kotlin — no framework annotations.
- Use cases are injectable services with explicit port interfaces.
- Adapters implement ports: controllers, repositories, event publishers.
- Validation at boundary (controller/input DTO) + domain invariants.

### Frontend

- Use {Next.js} with {App Router} for file-based routing.
- Server Components for data fetching; Client Components for interactivity.
- Design-system components are shared and co-located with tests.
- API client wraps fetch/axios with interceptors for auth, correlation IDs.
- Forms validated client-side + server-side.

## State Management

- **Server state**: {React Query / SWR} — cache, revalidation, optimistic updates.
- **Client state**: {Zustand / Context} — auth, UI state.
- **Real-time state**: SSE events update the query cache directly.

## Data Flow

```
Frontend                     Backend
   |                            |
   |-- HTTP request ----------->|
   |   (Bearer JWT +            |
   |    X-Correlation-Id)       |
   |                            |-- Auth filter (validate JWT)
   |                            |-- Controller (validate input)
   |                            |-- Use case (business rules)
   |                            |-- Repository (persist)
   |                            |-- SSE publisher (broadcast)
   |<-- JSON response ----------|
   |                            |
   |<-- SSE event --------------|
   |                            |
```

## Security

- **Auth**: JWT (RS256) dual token — access (15 min, in-memory) + refresh (24h, httpOnly cookie).
- **Authorization**: Role-based (owner, admin, member, viewer).
- **Rate limiting**: 100 req/min general, 20 req/min auth.
- **Input validation**: Bean Validation + custom domain validators.
- **Error format**: RFC 7807 Problem Details.

## Current Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | {hexagonal} | Separation of concerns, testability, domain focus |
| Backend | {Spring Boot 4} | Team expertise, ecosystem |
| Frontend | {Next.js 14} | SSR, App Router, React ecosystem |
| Database | {PostgreSQL} | Relational, ACID, JSON support |
| Real-time | {SSE} | Simpler than WebSocket for one-way events |
| Auth | {JWT dual token} | Stateless, secure refresh rotation |
