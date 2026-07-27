# ADR-0002: Channel Access Validation via Port Queries

- Status: Accepted
- Date: 2026-07-26
- Deciders: Backend Architect

## Context

Users can subscribe to `team:{id}`, `issue:{id}`, and `user:{id}` channels. Without validation, a user could subscribe to any channel and receive unauthorized events (e.g., another team's issues). We need to validate that users have legitimate access to channels they subscribe to.

## Decision

Validate channel access at subscription time by querying module ports:
- `team:{id}` → Query `TeamQueryPort.isUserMember(userId, teamId)`
- `issue:{id}` → Query `IssueQueryPort.isUserWatchingOrAssigned(userId, issueId)`
- `user:{id}` → Verify `id === userId` (users can only subscribe to their own channel)

The `ManageSubscription` use case gains a `ChannelValidator` dependency that encapsulates these queries.

## Consequences

### Positive

- Prevents unauthorized event access
- Consistent with hexagonal architecture (uses existing ports)
- Testable via port mocks
- Fail-closed security model

### Negative

- Adds cross-module dependency at runtime (identity/work modules)
- Slight latency on subscribe (~10-50ms for DB query)
- Channel validator must stay in sync with business rules

### Risks

- If team/issue ports change, channel validation could break
- Mitigation: Port interfaces are stable; integration tests verify end-to-end

## Alternatives Considered

### Client-Side Channel Restriction

- **Pros**: No server-side validation needed
- **Cons**: Insecure — clients can be manipulated
- **Verdict**: Rejected — security must be server-side

### Token-Based Channel Claims

- **Pros**: No runtime queries needed
- **Cons**: Stale claims (team membership changes); complex token management
- **Verdict**: Rejected — real-time accuracy required

### Redis-Cached Membership

- **Pros**: Fast lookups, reduces DB load
- **Cons**: Cache invalidation complexity, eventual consistency
- **Verdict**: Considered for future optimization if subscribe latency becomes an issue

## References

- `src/modules/gateway/application/manage-subscription.ts`
- `src/modules/gateway/domain/channel.ts`
- `design-backend.md` (AD-2)
