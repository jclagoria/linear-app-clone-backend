# Stack — Linear App Clone Backend

## Backend

- **Runtime**: Node.js 24 LTS
- **Package Manager**: pnpm
- **Framework**: Fastify 5
- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM
- **Cache**: Redis 7
- **Auth**: JWT (jose) + bcrypt

## Shared

- **Language**: TypeScript 5.x
- **API Protocol**: REST (JSON)
- **Real-time**: WebSocket (Socket.IO or ws)
- **Containerization**: Docker

## Dev & Build

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 24 LTS | Runtime |
| pnpm | 9.x | Package management |
| TypeScript | 5.x | Type checking |
| Vitest | 3.x | Testing |
| Docker | 27.x | Container |
| Docker Compose | 2.x | Orchestration |

## Testing

| Layer | Tool | Scope |
|-------|------|-------|
| Unit | Vitest | Services, utils, domain logic |
| Integration | Vitest + Testcontainers | API, database |
| E2E | Vitest | Full flows |

## Libraries

| Library | Purpose |
|---------|---------|
| fastify | HTTP framework |
| drizzle-orm | Database ORM |
| @fastify/jwt | JWT handling |
| @fastify/rate-limit | Rate limiting |
| bcrypt | Password hashing |
| ioredis | Redis client |
| zod | Schema validation |
| uuid | UUID generation |
| dotenv | Environment variables |
