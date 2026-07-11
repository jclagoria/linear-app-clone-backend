# Tech Research Digest

> **Generated:** 2026-07-05 | **Source:** repomix-output-backend.md + repomix-output-frontend.md
> **Status:** Ready for validation

---

## Backend Stack Evaluated

### Java

| Aspect | Details |
|--------|---------|
| **Version** | Java 21 LTS (virtual threads, records, sealed classes, pattern matching) |
| **Frameworks** | Spring Boot (recommended), Quarkus, Micronaut, Jakarta EE |
| **Architecture** | Hexagonal / Clean Architecture (mandatory) |
| **ORM** | JPA/Hibernate (Spring Data JPA, Micronaut Data, Panache for Quarkus) |
| **Reactive** | Virtual Threads preferred; WebFlux for streaming/SSE/event-driven only |
| **Databases** | PostgreSQL (primary), Redis (caching), MongoDB (document), Elasticsearch (search) |
| **Caching** | L1/L2/L3 layers; Caffeine (local), Redis (distributed); stampede protection |
| **Messaging** | Apache Kafka (event streaming), RabbitMQ (queue-based) |
| **Auth** | OAuth2/OIDC with JWT; RBAC/ABAC |
| **Security** | Secrets via Vault/K8s; bcrypt/Argon2; TLS 1.3; rate limiting |
| **Testing** | JUnit 5 + Testcontainers (real DB); ArchUnit for architecture enforcement |
| **Build** | Gradle (Kotlin DSL) preferred; Maven as alternative |

### Node.js

| Aspect | Details |
|--------|---------|
| **Frameworks** | Fastify (recommended), Express, NestJS |
| **Architecture** | Hexagonal / Clean Architecture |
| **ORM** | Drizzle ORM (recommended, ADR-005 justified); Prisma, TypeORM as alternatives |
| **Runtime** | Node.js 20+ LTS with ESM |
| **Databases** | PostgreSQL, Redis, MongoDB |
| **Testing** | Vitest (recommended, ADR-010 justified over Jest); Jest as alternative |
| **Lint** | ESLint + @typescript-eslint + eslint-plugin-boundaries (ADR-009) |
| **Auth** | OAuth2/JWT; bcrypt/Argon2 for password hashing |
| **Package Manager** | pnpm |

### Python

| Aspect | Details |
|--------|---------|
| **Frameworks** | FastAPI (recommended), Django |
| **Architecture** | Hexagonal / Clean Architecture |
| **ORM** | SQLAlchemy (standard) |
| **Testing** | pytest |
| **Databases** | PostgreSQL, Redis |
| **Async** | asyncio + async/await patterns |

### Go

| Aspect | Details |
|--------|---------|
| **Frameworks** | Fiber (recommended), Gin |
| **Architecture** | Hexagonal / Clean Architecture |
| **Testing** | go test |
| **Databases** | PostgreSQL, Redis |
| **Concurrency** | Goroutines, channels, context propagation |

### Rust

| Aspect | Details |
|--------|---------|
| **Frameworks** | Axum (recommended), Actix-web |
| **Architecture** | Hexagonal / Clean Architecture |
| **Testing** | Built-in test framework |
| **Databases** | SQLx (compile-time checked), Diesel |
| **Memory** | Ownership/borrowing; async via Tokio |

---

## Frontend Stack Evaluated

### Angular

| Aspect | Details |
|--------|---------|
| **Version** | Angular 19+ (standalone, signals, zoneless-ready) |
| **State** | SignalStore (`@ngrx/signals`) — recommended; NgRx alternative |
| **Forms** | Reactive Forms + Zod validation |
| **Styling** | SCSS + Tailwind CSS |
| **Testing** | Jest + `@testing-library/angular` + MSW + Playwright (E2E) |
| **Lint** | ESLint + `@angular-eslint` + Prettier (Biome NOT viable — no Angular template support) |
| **Architecture** | Feature-Sliced Design (FSD) with standalone components |
| **Skeletons** | Standalone (recommended), NgModule (legacy/migration) |
| **Module Boundaries** | `eslint-plugin-boundaries` enforced in CI |
| **Package Manager** | pnpm |
| **SSR** | Optional (`@angular/ssr`); CSR sufficient for most enterprise apps |

### React

| Aspect | Details |
|--------|---------|
| **Framework** | Next.js (SSR/SSG) or Vite (CSR) |
| **State** | Zustand, TanStack Query, or Redux Toolkit |
| **Routing** | React Router or TanStack Router |
| **Styling** | Tailwind CSS, CSS Modules, or styled-components |
| **Testing** | Vitest + Testing Library + MSW + Playwright |
| **Lint** | ESLint + Prettier |
| **Forms** | React Hook Form, Formik |
| **Architecture** | Feature-Sliced Design or vertical slices |

### Svelte

| Aspect | Details |
|--------|---------|
| **Framework** | SvelteKit (full-stack) or Vite (CSR) |
| **State** | Svelte 5 runes ($state, $derived, $effect) |
| **Styling** | Scoped CSS or Tailwind |
| **Testing** | Vitest + Testing Library + Playwright |
| **Lint** | ESLint + Prettier |
| **Architecture** | Feature-Sliced Design |

### Vue

| Aspect | Details |
|--------|---------|
| **Framework** | Nuxt (SSR/SSG) or Vite (CSR) |
| **State** | Pinia (recommended) |
| **Styling** | Scoped CSS or Tailwind |
| **Testing** | Vitest + Vue Test Utils + Playwright |
| **Lint** | ESLint + Prettier |
| **Architecture** | Feature-Sliced Design |

---

## Backend Architecture Patterns

| Pattern | Languages | Status |
|---------|-----------|--------|
| **Hexagonal / Clean Architecture** | All (Java, Node.js, Python, Go, Rust) | **Recommended — mandatory** |
| **Domain-Driven Design (DDD)** | All | Recommended for complex domains |
| **CQRS** | All | When read/write separation needed |
| **Event-Driven** | All | For async processing, Kafka/RabbitMQ |
| **Layered Architecture** | All | Minimum acceptable pattern |

### Clean Architecture Layer Rules (All Languages)

```
domain/     → imports NOTHING
application/ → imports domain only
infrastructure/ → imports domain + application
interface/  → imports application + domain
shared/     → imports nothing (pure utilities)
```

---

## Frontend Architecture Patterns

| Pattern | Frameworks | Status |
|---------|------------|--------|
| **Feature-Sliced Design (FSD)** | All (Angular, React, Svelte, Vue) | **Recommended — mandatory** |
| **Standalone Components** | Angular 19+ | **Default — no NgModules** |
| **Signal-based State** | Angular (SignalStore), React (signals), Svelte 5 (runes) | **Recommended** |

### FSD Layer Rules (Angular)

```
pages/      → features, shared, entities, core
features/   → shared, entities, core (NOT other features)
entities/   → shared, core (NOT features)
shared/     → itself, node_modules (NOT features, entities, core)
core/       → shared, entities (NOT features, pages)
```

---

## ORM / Database Decisions

| Language | Recommended | Alternatives | Notes |
|----------|-------------|-------------|-------|
| **Node.js** | Drizzle ORM | Prisma, TypeORM | ADR-005: Drizzle chosen for compile-time safety, SQL-first approach |
| **Java** | JPA/Hibernate (Spring Data) | jOOQ, Micronaut Data | JPA standard; Micronaut Data for compile-time validation |
| **Python** | SQLAlchemy | Django ORM | SQLAlchemy for FastAPI; Django ORM for Django apps |
| **Go** | sqlx / GORM | sqlc | sqlx for raw SQL + type safety |
| **Rust** | SQLx | Diesel | SQLx for compile-time checked queries |

---

## Testing Framework Decisions

| Language | Recommended | Alternatives | Notes |
|----------|-------------|-------------|-------|
| **Node.js** | Vitest | Jest | ADR-010: Vitest chosen for ESM-native, faster execution, Jest-compatible API |
| **Angular** | Jest + jest-preset-angular | Vitest (@analogjs) | Jest more mature for Angular; Vitest viable for new projects |
| **React/Svelte/Vue** | Vitest | Jest | Vitest preferred for ESM + Vite integration |
| **Java** | JUnit 5 + Testcontainers | TestNG | Testcontainers mandatory (no H2 in tests) |
| **Python** | pytest | unittest | pytest standard |
| **Go** | go test | — | Built-in test framework |
| **E2E (all)** | Playwright | Cypress | Playwright recommended for multi-browser |

---

## Lint Engine Decisions

| Scope | Recommended | Alternatives | Notes |
|-------|-------------|-------------|-------|
| **Angular** | ESLint + @angular-eslint + Prettier | Biome (NOT viable) | ADR-005: Biome cannot lint Angular templates or enforce FSD boundaries |
| **Node.js Backend** | ESLint + @typescript-eslint + eslint-plugin-boundaries | oxlint, Biome | ADR-009: ESLint chosen for Clean Architecture boundary enforcement |
| **React/Svelte/Vue** | ESLint + Prettier | Biome (partial support) | Biome viable for non-Angular if no boundary enforcement needed |

### Why NOT Biome for Angular

1. **No Angular HTML template linting** — cannot parse `@if`, `@for`, `formControlName`, etc.
2. **No FSD module boundary enforcement** — `eslint-plugin-boundaries` has no equivalent
3. **No Angular-specific rules** — signals, standalone, OnPush, component selectors

---

## Form Libraries

| Framework | Recommended | Alternatives |
|-----------|-------------|-------------|
| **Angular** | Reactive Forms + Zod | Template-driven (simple forms only) |
| **React** | React Hook Form | Formik |
| **Svelte** | Superforms + Zod | Native forms |
| **Vue** | VeeValidate + Zod | FormKit |

---

## Security Approach Evaluated

| Concern | Recommended | Notes |
|---------|-------------|-------|
| **Authentication** | OAuth2/OIDC with JWT | Standard across all backends |
| **Password Hashing** | bcrypt (Node.js), Argon2 (preferred), scrypt | Argon2 preferred where available |
| **Secrets Management** | Vault, K8s Secrets, env vars | NEVER commit secrets to Git |
| **CORS** | Explicit origins per environment | No wildcard with credentials |
| **Rate Limiting** | Per-tenant and global | Required for all APIs |
| **TLS** | TLS 1.3 in transit | Encryption at rest for sensitive data |
| **Frontend Auth** | HttpOnly cookies or token in memory | XSS-safe token storage |

---

## Deployment, CI/CD, Infrastructure

| Concern | Recommended | Notes |
|---------|-------------|-------|
| **Containerization** | Multi-stage Docker, distroless images, non-root user | Security hardening |
| **Orchestration** | Kubernetes with Helm | Resource limits, HPA |
| **CI/CD** | GitHub Actions / GitLab CI | Automated lint, test, build, deploy |
| **Deployment Strategy** | Blue-green or canary | Zero-downtime deploys |
| **Monitoring** | Prometheus + Grafana | OpenTelemetry for tracing |
| **Logging** | Structured JSON logging | Correlation IDs across services |
| **Environment Parity** | Dev/staging/prod parity | Docker Compose for local dev |

---

## Explicit Decisions Already Made (from ADRs)

| ADR | Decision | Rationale |
|-----|----------|-----------|
| **Backend ADR-001** | Clean Architecture (all languages) | Enforce dependency direction; testability |
| **Backend ADR-009** | ESLint + @typescript-eslint (Node.js) | Only tool with layer-aware boundary rules |
| **Backend ADR-010** | Vitest over Jest (Node.js) | ESM-native, 2-3x faster, Jest-compatible API |
| **Java ADR-001** | Spring Boot + Java 21 | Mature ecosystem, virtual threads support |
| **Java ADR-003** | JPA/Hibernate + PostgreSQL | Standard ORM, strong tooling |
| **Node.js ADR-005** | Drizzle ORM | SQL-first, compile-time safety, lighter than Prisma |
| **Angular ADR-001** | Angular 19+ Standalone | Default for all new projects |
| **Angular ADR-002** | SignalStore (`@ngrx/signals`) | Signal-native, smaller bundle than NgRx |
| **Angular ADR-003** | Jest + Testing Library + MSW | Mature Angular testing stack |
| **Angular ADR-004** | FSD with ESLint boundary rules | Enforce module isolation |
| **Angular ADR-005** | ESLint + Prettier (NOT Biome) | Biome lacks Angular template + FSD support |
| **Cross-cutting ADR-001** | Hexagonal/Clean Architecture | All backends follow same pattern |
| **Cross-cutting ADR-002** | REST + OpenAPI | Design-first API approach |

---

## Alternatives Evaluated and Discarded

| Alternative | Why Discarded |
|-------------|---------------|
| **Biome for Angular** | No Angular template linting, no FSD boundary enforcement |
| **oxlint for backend** | No layer-aware module boundary system, no custom rules |
| **Jest for Node.js** | Slower, broken ESM support, requires ts-jest (ADR-010) |
| **Prisma for Node.js** | Heavier runtime, SQL-first Drizzle preferred (ADR-005) |
| **NgRx for Angular** | SignalStore is lighter and signal-native (ADR-002) |
| **Quarkus/Micronaut over Spring** | Spring ecosystem maturity; Quarkus/Micronaut for specific needs (native-image, startup time) |
| **H2 in Java tests** | Production parity requires real PostgreSQL (Testcontainers) |
| **Reactive (WebFlux) for CRUD** | Virtual threads match performance with simpler code |

---

## Gaps and Open Questions

1. **Backend ORM for Python:** FastAPI + SQLAlchemy well-documented; Django ORM decision pending for Django projects
2. **Micro-frontends:** Nx monorepo recommended; Module Federation `@angular-architects/module-federation` evaluated but adoption deferred
3. **SSR for Angular:** Optional — CSR sufficient for most enterprise apps; evaluate `@angular/ssr` when SEO needs arise
4. **GraphQL:** Only if backend already exposes GraphQL; REST + OpenAPI preferred for new projects
5. **Mobile:** Ionic + Angular or React Native — pending mobile strategy decision
6. **Rust backend:** Axum recommended but team expertise may limit adoption; evaluate per-project
7. **CI/CD pipeline specifics:** GitHub Actions templates exist in skeletons; customize per project

---

<!-- Generated by repomix-reference skill — Setup Mode -->
