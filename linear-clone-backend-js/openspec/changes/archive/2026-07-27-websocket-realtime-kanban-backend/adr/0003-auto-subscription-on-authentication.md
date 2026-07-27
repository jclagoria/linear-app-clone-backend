# ADR-0003: Auto-Subscription on Authentication

- Status: Accepted
- Date: 2026-07-26
- Deciders: Backend Architect

## Context

When a user connects via WebSocket, they should automatically receive events for their teams and watched/assigned issues without manual subscription. The existing `autoSubscribeUserChannels()` utility supports this but is not called during authentication.

## Decision

Enhance `AuthenticateConnection` to:
1. After JWT verification, query `TeamQueryPort.getUserTeamIds(userId)` and `IssueQueryPort.getUserIssueIds(userId)`
2. Call `autoSubscribeUserChannels(connectionId, userId, subscriptionRepo, { teamIds, issueIds })`
3. This subscribes the connection to `user:{userId}`, `team:{teamIds}`, and `issue:{issueIds}` channels

## Consequences

### Positive

- Better UX — users immediately receive relevant events
- Uses existing `autoSubscribeUserChannels()` utility
- Matches Linear's behavior

### Negative

- Adds cross-module queries during authentication (latency)
- Large team/issue sets could slow authentication
- Auto-subscribed channels may include inactive teams/issues

### Risks

- Authentication latency increases by ~20-100ms (2 DB queries)
- Mitigation: Queries are simple SELECTs with indexes; can be parallelized

## Alternatives Considered

### Manual Subscription Only

- **Pros**: No auth latency increase
- **Cons**: Poor UX — users must manually subscribe to channels
- **Verdict**: Rejected — not competitive with Linear

### Background Auto-Subscription

- **Pros**: Auth not blocked
- **Cons**: Delay in receiving events after connection
- **Verdict**: Considered if latency becomes an issue

### Pre-Computed Channel List

- **Pros**: Single query, fast
- **Cons**: Stale data, complex maintenance
- **Verdict**: Overkill for current scale

## References

- `src/modules/gateway/application/auto-subscription.ts`
- `src/modules/gateway/application/authenticate-connection.ts`
- `design-backend.md` (AD-3)
