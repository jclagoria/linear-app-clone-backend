# Tech Selection — Linear App Clone (Backend)

## Decision Summary

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Backend Runtime | Node.js 24 LTS | ESM-native, virtual threads support, team expertise | Single-threaded (mitigated by async I/O) |
| Backend Framework | Fastify 5 | High performance, schema validation, TypeScript-first | Smaller ecosystem than Express |
| Database | PostgreSQL 16 | Relational, ACID, JSON support, Drizzle ORM compatibility | Operational complexity vs SQLite |
| ORM | Drizzle ORM | SQL-first, compile-time safety, lighter than Prisma | Less abstraction than Prisma |
| Cache | Redis 7 | Fast, pub/sub, session management | Additional infrastructure |
| Auth | JWT (jose) + bcrypt | Stateless tokens, secure password hashing | Token revocation complexity |
| Validation | Zod | Schema validation, TypeScript-first | Runtime overhead |
| Testing | Vitest | ESM-native, faster than Jest, Jest-compatible API | Smaller ecosystem than Jest |

## Generated Files

The tech-selection skill validated these existing files in `docs/`:

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-backend.md` | `openspec/schemas/backend-schema/templates/technology/stack-templates.md` | ✅ Exists |
| `docs/architecture-backend.md` | `openspec/schemas/backend-schema/templates/technology/architecture-templates.md` | ✅ Exists |
| `docs/deployment.md` | `openspec/schemas/backend-schema/templates/technology/deployment-templates.md` | ⚠️ Not yet created |

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| 1 | Backend Runtime | Node.js 24 LTS | — | Approved (existing choice) |
| 2 | Backend Framework | Fastify 5 | — | Approved (existing choice) |
| 3 | Database | PostgreSQL 16 | — | Approved (existing choice) |
| 4 | ORM | Drizzle ORM | — | Approved (existing choice, ADR-005) |
| 5 | Cache | Redis 7 | — | Approved (existing choice) |
| 6 | Auth | JWT + bcrypt | — | Approved (existing choice) |
| 7 | Validation | Zod | — | Approved (existing choice) |
| 8 | Testing | Vitest | — | Approved (existing choice, ADR-010) |

## Tech Research Digest Alignment

| Decision | Digest Recommendation | Alignment | Notes |
|----------|----------------------|-----------|-------|
| Node.js Runtime | Node.js 20+ LTS with ESM | ✅ Aligned | Using 24 LTS (newer) |
| Backend Framework | Fastify (recommended) | ✅ Aligned | Matches recommendation |
| ORM | Drizzle ORM (recommended, ADR-005) | ✅ Aligned | Justified in ADR-005 |
| Testing | Vitest (recommended, ADR-010) | ✅ Aligned | Justified in ADR-010 |
| Lint | ESLint + @typescript-eslint | ✅ Aligned | Matches ADR-009 |
| Architecture | Hexagonal / Clean Architecture | ✅ Aligned | Mandatory per digest |
| Auth | OAuth2/OIDC with JWT | ✅ Aligned | JWT approach matches |

## Identity Module Specific Considerations

### Database Tables Required

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `organizations` | Organization entities | id, name, owner_id, created_at, updated_at, deleted_at |
| `organization_members` | Membership relationships | id, organization_id, user_id, role, created_at, deleted_at |

### Existing Tables Modified

| Table | Changes | Module Ownership |
|-------|---------|------------------|
| `users` | Add name, avatar_url, updated_at, deleted_at columns | Auth owns core (email, password_hash), Identity manages profile |

### Caching Strategy

| Data | Cache Layer | TTL | Invalidation |
|------|-------------|-----|--------------|
| User profile | Redis | 5 min | On update |
| Organization list | Redis | 10 min | On membership change |
| Organization details | Redis | 5 min | On update |

### Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| GET /api/v1/users/me | 30 req | per min |
| PATCH /api/v1/users/me | 10 req | per min |
| POST /api/v1/organizations | 5 req | per min |
| GET /api/v1/organizations | 30 req | per min |
| GET /api/v1/organizations/:id | 30 req | per min |
| DELETE /api/v1/organizations/:id | 5 req | per min |

## Validation Criteria

- [x] Every NFR in specs has an architectural response
- [x] No contradiction across generated documents
- [x] Stack choices are coherent
- [x] Architecture matches project type from proposal
- [x] Deployment is consistent with stack

## Next Steps

1. Review existing docs in `docs/`
2. Create `docs/deployment.md` if not exists
3. Proceed to design phase with tech stack now defined
4. Update ADRs if new architectural decisions emerge during design
