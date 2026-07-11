---
name: repomix-reference
description: Validates decisions against prior technical research. Ingests Repomix output files, produces a condensed digest, then uses that digest to check any technology or architecture decisions made later in a pipeline.
---

# Repomix Reference Validation

## Description

This skill validates architectural and technology decisions against prior technical research captured in Repomix output files. It operates in two modes:

1. **Setup Mode**: Reads raw Repomix outputs, extracts and condenses into a concise digest (`tech-research-digest.md`).
2. **Validation Mode**: Uses the digest to validate decisions across categories (technology stack, ORM, testing, linting, forms, security, architecture).

The skill ensures decisions align with or justify deviations from documented research.

## Inputs

- `references/repomix-output-backend.md` — Backend technical research (Java, Node.js, Python, Go, Rust, cross-cutting).
- `references/repomix-output-frontend.md` — Frontend technical research (Angular, React, Svelte, Vue, cross-cutting).
- `references/README.md` — Explains how to regenerate repomix outputs via `./scripts/repomix-regenerate.sh`.

## Output

- `references/tech-research-digest.md` — Condensed digest (~300-500 lines) of evaluated stacks, patterns, decisions, and gaps.

## Setup Mode (first execution)

Triggered when `references/tech-research-digest.md` does not exist.

### Workflow

1. Read both repomix files from `references/`.
2. Extract and condense into `references/tech-research-digest.md` with the following sections:
   - **Backend stack evaluated** (ALL languages/frameworks):
     - Java: Spring Boot, Quarkus, Micronaut, Jakarta EE (versions, features, recommendations)
     - Node.js: Express, Fastify, NestJS (versions, features, recommendations)
     - Python: Django, FastAPI (versions, features, recommendations)
     - Go: Fiber, Gin (versions, features, recommendations)
     - Rust: Actix, Axum (versions, features, recommendations)
     - Runtimes, databases, caching, messaging, auth mechanisms for each
     - **ORM alternatives**: Prisma, TypeORM, Drizzle ORM (Node.js), SQLAlchemy (Python)
     - **Testing frameworks**: Jest, Vitest (Node.js), pytest (Python), go test (Go)
   - **Frontend stack evaluated** (ALL frameworks):
     - Angular: versions, state mgmt (SignalStore vs NgRx), styling, testing, linting
     - React: versions, Next.js vs Vite, state mgmt, routing (React Router vs TanStack)
     - Svelte: versions, SvelteKit vs Vite, state mgmt, styling, testing
     - Vue: versions, Nuxt vs Vite, state mgmt (Pinia), styling, testing
     - Cross-cutting: package managers, build tools, testing frameworks
     - **Form libraries**: React Hook Form, Formik (React), Reactive Forms (Angular)
     - **Lint engines**: ESLint + Prettier, Biome, oxlint (React/Vite alternative)
   - **Backend architecture patterns** (ALL languages): hexagonal, DDD, CQRS, event-driven, layered
   - **Frontend architecture patterns**: FSD, component design, routing, data fetching, module boundaries
   - **Explicit decisions already made** and their rationale (from all ADRs in both repomix files)
   - **Alternatives evaluated** and why they were discarded
   - **Deployment, CI/CD, infrastructure patterns** (cross-cutting, not language-specific)
   - **Security approach evaluated** (cross-cutting): OAuth2/JWT, password hashing (bcrypt, Argon2), secrets management
   - **Gaps or open questions** in the research
3. Ensure the digest is concise (~300-500 lines), in markdown format.
4. Add a header indicating the digest was generated and is ready for use.

## Validation Mode (subsequent executions)

Triggered when `references/tech-research-digest.md` exists.

### Workflow

1. Read `references/tech-research-digest.md`.
2. Do NOT re-read the raw repomix files unless the digest is missing.
3. Provide validation checklists for the requested decision category.

### Validation Checklists

#### Technology decisions (stack, runtime, framework, DB, etc.)
For each decision:
- Is it evaluated in the digest? → if not, mark as gap.
- Was it recommended? → alignment OK.
- Was it rejected? → REQUIRE divergence explanation.
- Does it not appear? → request documenting the decision and update digest.

#### ORM/database decisions
- Validate ORM choice against digest (Prisma, TypeORM, Drizzle ORM).
- If using an ORM not in the digest → document justification.
- If using a rejected ORM → REQUIRE explanation.

#### Testing framework decisions
- Validate test framework against digest (Jest, Vitest, pytest, go test).
- If using a framework not in the digest → document justification.
- If using a rejected framework → REQUIRE explanation.

#### Linting/formatting decisions
- Validate lint engine against digest (ESLint + Prettier, Biome, oxlint).
- If using a lint engine not in the digest → document justification.
- If using a rejected lint engine → REQUIRE explanation.

#### Form library decisions
- Validate form library against digest (React Hook Form, Formik, Reactive Forms).
- If using a library not in the digest → document justification.

#### Security decisions
- Validate password hashing against digest (bcrypt, Argon2, scrypt, PBKDF2).
- If using an algorithm not in the digest → document justification.
- If using a rejected algorithm → REQUIRE explanation.

#### Backend architecture decisions
- Validate that chosen architecture patterns match what was researched.
- If a pattern explicitly rejected in the digest is used → critical flag.
- If a recommended pattern is omitted → document reason.

#### Frontend architecture decisions
- Validate component, routing, state decisions against the digest.
- If the digest recommends a different approach → flag for review.

#### Durable decisions (rationale records)
- Each decision record must be cross-checked against the digest.
- If the digest already documents a decision on the topic → reference it.
- If the decision contradicts the digest → REQUIRE explanation.

## Rules

- The digest is the single source of truth for validation.
- When validation reveals a gap, prompt the user to document the decision and update the digest.
- When a decision contradicts the digest, require a written justification before proceeding.
- Do not modify the digest automatically; updates must be explicit.
- If the digest is missing, trigger Setup Mode automatically.

## Base Directory

Base directory for this skill: the folder containing this SKILL.md file.
Relative paths in this skill (e.g., references/) are relative to this base directory.