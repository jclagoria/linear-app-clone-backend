# Gateway Module — WebSocket & Broadcasting

## Problem Statement

The Linear App Clone currently lacks real-time capabilities. Users cannot receive live updates when issues change, team members update tasks, or personal notifications arrive. All data retrieval requires manual polling or page refresh, creating a stale, non-reactive user experience.

## Motivation

Real-time updates are a core feature of Linear. Users expect instant visibility into:
- Issues being created, updated, or assigned
- Team activity and changes
- Personal notifications and status changes

Implementing a Gateway Module with WebSocket connectivity and event broadcasting delivers the foundation for all real-time features across the application.

## Scope

- **In scope**:
  - WebSocket connection management (authenticate within 5s, multiple connections per user, online status)
  - Event broadcasting to relevant connected clients (team, issue, user channels)
  - Channel subscription system (team:{id}, issue:{id}, user:{id})
  - Auto-subscription on connection for teams, watched issues, and own user channel
  - Connection ID tracking per connection
  - Standardized event envelope format
  - Auth protocol using JWT tokens sent as first message

- **Out of scope**:
  - Specific domain event producers (issue.created, etc.) — these will be integrated separately
  - Message persistence or offline message delivery
  - Presence indicators beyond online/offline
  - Rate limiting or connection throttling (can be added later)
  - Horizontal scaling / multi-instance pub/sub (can be added later)

## Impact

This change adds a new `gateway` module following the hexagonal architecture pattern. It introduces a WebSocket server alongside the existing Fastify HTTP server. Existing modules (auth, work, identity, project, cycle, workflow) will later broadcast events through this gateway. The auth module's JWT validation is a prerequisite (blocked by LAG-7).

Affected areas:
- New module: `src/modules/gateway/` (domain, application, adapters)
- Shared: `src/shared/` may gain a WebSocket server wrapper
- Auth: JWT token verification reused from auth module
- Infrastructure: Socket.IO or ws library added as dependency
