# Architecture — Linear App Clone Backend

## Overview

This project is a backend API for a Linear App clone built with Node.js, Fastify, PostgreSQL, and Redis. The architecture follows a modular monolith pattern with clear separation of concerns.

The architecture follows hexagonal architecture: domain logic is isolated from infrastructure, with ports defining interfaces and adapters implementing them.

## Technical Direction

- **Architecture style**: Hexagonal (Ports & Adapters)
- **Backend framework**: Fastify with dependency injection
- **API style**: REST with JSON
- **Database**: PostgreSQL with Drizzle ORM migrations
- **Cache**: Redis for sessions and rate limiting
- **Real-time**: WebSocket for live updates
- **Auth**: JWT dual token (access + refresh)

## Project Structure

```
src/
  modules/           # Feature modules (auth, identity, work, etc.)
    auth/
      domain/        # Entities, value objects, domain services
      application/   # Use cases, ports
      adapters/      # Controllers, repositories
    identity/
      ...
    work/
      ...
  shared/            # Cross-cutting concerns
    config/          # Environment, configuration
    database/        # Drizzle setup, migrations
    errors/          # Error types, error handler
    middleware/       # Auth, rate limiting, validation
    utils/           # Helpers, utilities
  app.ts             # Fastify app setup
  server.ts          # Server entry point
```

### Backend — Hexagonal Architecture

| Layer | Responsibility | Examples |
|-------|---------------|----------|
| `domain/` | Business entities, rules | `User`, `Session`, `Token`, value objects |
| `application/` | Use cases, ports | `RegisterUser`, `LoginUser`, `ValidateToken` |
| `adapters/in/` | Inbound adapters | `AuthController`, `AuthMiddleware` |
| `adapters/out/` | Outbound adapters | `DrizzleUserRepository`, `RedisSessionStore` |

## Component Design

### Backend

- Follow SOLID principles with hexagonal architecture.
- Domain entities are pure TypeScript — no framework annotations.
- Use cases are injectable services with explicit port interfaces.
- Adapters implement ports: controllers, repositories, event publishers.
- Validation at boundary (controller/input DTO) + domain invariants.

## State Management

- **Server state**: PostgreSQL (persistent), Redis (cache/sessions)
- **Session state**: Redis with TTL
- **Token state**: JWT (stateless), refresh tokens in Redis

## Data Flow

```
Client                    Fastify                    PostgreSQL
   |                         |                          |
   |-- HTTP request ------->|                          |
   |   (Bearer JWT)         |-- Auth middleware        |
   |                        |-- Controller             |
   |                        |-- Use case               |
   |                        |-- Repository ----------->|
   |<-- JSON response ------|                          |
   |                         |                          |
   |<-- WebSocket event -----|                          |
```

## Security

- **Auth**: JWT (jose) dual token — access (15 min, in-memory) + refresh (7 days, Redis).
- **Password hashing**: bcrypt with adaptive cost factor.
- **Rate limiting**: 5 login/min, 3 register/min per IP.
- **Input validation**: Zod schemas at API boundary.
- **Error format**: Standardized error responses with codes.

## Current Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | Hexagonal | Separation of concerns, testability, domain focus |
| Backend | Fastify | High performance, schema validation, TypeScript-first |
| Database | PostgreSQL | Relational, ACID, JSON support |
| ORM | Drizzle | Type-safe, lightweight, SQL-like API |
| Cache | Redis | Fast, pub/sub, session management |
| Auth | JWT + bcrypt | Stateless tokens, secure password hashing |
| Testing | Vitest | Fast, ESM-native, TypeScript-first |
