# Tech Selection — Linear App Clone (Backend)

## Decision Summary

The existing tech stack is validated for the new comments, labels, and watchers features. No new runtime dependencies or infrastructure components are required.

| Category | Decision | Rationale | Trade-offs |
|----------|----------|-----------|------------|
| Backend Runtime | Node.js 24 LTS | Existing — fully adequate for CRUD + event publishing | — |
| Backend Framework | Fastify 5 | Existing — request validation, auth hooks, rate limiting fit all new endpoints | — |
| Database | PostgreSQL 16 | Existing — new tables (issue_comments, labels, issue_watchers) are standard relational schemas | — |
| ORM | Drizzle ORM | Existing — type-safe queries, migrations support new entities | — |
| Cache | Redis 7 | Existing — not directly needed but available for future comment caching | — |
| Messaging | In-memory EventPublisher | Existing pattern — events published for all mutations (consumers added later) | No durable message broker yet; events lost on restart |
| Auth | JWT (jose) + bcrypt | Existing — all new endpoints reuse auth middleware | — |
| Deployment | Docker Compose | Existing — no additional services needed | — |

## Generated Files

The tech-stack artifact confirmed the existing `docs/` files require no changes:

| File | Source Template | Status |
|------|----------------|--------|
| `docs/stack-backend.md` | `openspec/schemas/backend-schema/templates/technology/stack-templates.md` | ✅ Already exists, no changes needed |
| `docs/architecture-backend.md` | `openspec/schemas/backend-schema/templates/technology/architecture-templates.md` | ✅ Already exists, no changes needed |
| `docs/deployment.md` | `openspec/schemas/backend-schema/templates/technology/deployment-templates.md` | ✅ Already exists, no changes needed |

## Interactive Review Log

| Round | Category | Original | Challenged To | Result |
|-------|----------|----------|---------------|--------|
| 1 | All | Existing stack | — | Approved — existing stack fully covers new feature requirements |

## New Database Entities

The following new tables are required within the existing PostgreSQL + Drizzle ORM stack:

- **issue_comments** — id, issueId, userId, body, createdAt, updatedAt, deletedAt
- **labels** — id, name (unique), description, color, createdAt, updatedAt, deletedAt
- **issue_watchers** — id, issueId, userId, createdAt (unique on issueId + userId)

The existing `issue_labels` junction table is reused for label assignment.

## Event Types

New event types to be published through the existing `EventPublisher` port:
- `comment.created`, `comment.updated`, `comment.deleted`
- `label.created`, `label.updated`, `label.deleted`
- `issue.label.attached`, `issue.label.detached`
- `issue.watcher.added`, `issue.watcher.removed`

## ADR References

- No new architectural decisions required — the existing architecture patterns (hexagonal, modular monolith) fully accommodate these features.

## Next Steps

1. Proceed to design phase with tech stack validated
2. Design backend architecture for new entities and endpoints
3. Update ADRs if new architectural decisions emerge during design
