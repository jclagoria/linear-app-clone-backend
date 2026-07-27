# Tasks — WebSocket Real-Time Kanban Backend

## Scaffold

- [x] No new dependencies required — using existing `ws`, `zod`, `EventEmitter`
- [x] No new database tables — in-memory storage only

## Data Layer

- [x] No migrations needed — in-memory storage only

## Business Logic

### WorkToGatewayBridge (Event Bridge)

- [ ] Create `src/modules/gateway/adapters/out/work-to-gateway-bridge.ts`
  - [ ] Implement `EventPublisher` port from work module
  - [ ] Accept `InProcessEventEmitter` as dependency
  - [ ] Map work event types to gateway event names:
    - `issue.created` → `issue.created`
    - `issue.updated` → `issue.updated`
    - `issue.deleted` → `issue.deleted`
    - `comment.created` → `comment.created`
    - `comment.updated` → `comment.updated`
    - `comment.deleted` → `comment.deleted`
    - `label.created` → `label.created`
    - `label.updated` → `label.updated`
    - `label.deleted` → `label.deleted`
    - `watcher.added` → `watcher.added`
    - `watcher.removed` → `watcher.removed`
  - [ ] Determine target channel from event data:
    - Issue events → `team:{teamId}`
    - Comment events → `issue:{issueId}`
    - Label events → `team:{teamId}`
    - Watcher events → `issue:{issueId}`
  - [ ] Create `GatewayEvent` via `createGatewayEvent()` factory
  - [ ] Call `eventEmitter.broadcast(gatewayEvent)`

### ChannelValidator (Access Control)

- [ ] Create `src/modules/gateway/application/ports/in/channel-validator.ts`
  - [ ] Define interface: `validateChannelAccess(userId: string, channel: string): Promise<boolean>`
- [ ] Create `src/modules/gateway/adapters/out/module-channel-validator.ts`
  - [ ] Accept `TeamQueryPort` and `IssueQueryPort` as dependencies
  - [ ] Implement channel type parsing via `parseChannel()`
  - [ ] For `team:{id}`: Query `teamQueryPort.isUserMember(userId, teamId)`
  - [ ] For `issue:{id}`: Query `issueQueryPort.isUserWatchingOrAssigned(userId, issueId)`
  - [ ] For `user:{id}`: Verify `id === userId`
  - [ ] Return `false` for unknown channel types

### ManageSubscription (Enhanced)

- [ ] Update `src/modules/gateway/application/manage-subscription.ts`
  - [ ] Add `ChannelValidator` as constructor dependency
  - [ ] In `execute()`: After format validation, call `channelValidator.validateChannelAccess(userId, channel)`
  - [ ] Return `{ success: false, error: 'forbidden' }` if validation fails
  - [ ] Get `userId` from `ConnectionRepository.findById(connectionId)`
  - [ ] Preserve existing idempotent behavior for subscribe
  - [ ] Preserve existing silent behavior for unsubscribe

### AuthenticateConnection (Enhanced)

- [ ] Update `src/modules/gateway/application/authenticate-connection.ts`
  - [ ] Add `TeamQueryPort` and `IssueQueryPort` as constructor dependencies
  - [ ] After JWT verification, query `teamQueryPort.getUserTeamIds(userId)`
  - [ ] After JWT verification, query `issueQueryPort.getUserIssueIds(userId)`
  - [ ] Call `autoSubscribeUserChannels(connectionId, userId, subscriptionRepo, { teamIds, issueIds })`
  - [ ] Handle query failures gracefully (log warning, continue with partial subscriptions)

## API Layer

### WebSocket Message Validation

- [ ] Create `src/modules/gateway/domain/message-schema.ts`
  - [ ] Define Zod schema for `subscribe` message: `{ type: 'subscribe', channel: string }`
  - [ ] Define Zod schema for `unsubscribe` message: `{ type: 'unsubscribe', channel: string }`
  - [ ] Define discriminated union for all inbound messages
  - [ ] Export validation function

### MessageHandler (Enhanced)

- [ ] Update `src/modules/gateway/adapters/in/message-handler.ts`
  - [ ] Add Zod validation for all inbound messages
  - [ ] Return `{ type: 'error', code: 'invalid_channel', message: '...' }` for invalid formats
  - [ ] Return `{ type: 'error', code: 'forbidden', message: '...' }` for access denied
  - [ ] Return `{ type: 'subscribed', channel: '...' }` on success
  - [ ] Return `{ type: 'unsubscribed', channel: '...' }` on unsubscribe

## Events / Messaging

### Event Bridge Integration

- [ ] Update `src/modules/gateway/setup.ts`
  - [ ] Create `InProcessEventEmitter` instance
  - [ ] Create `WorkToGatewayBridge` with `InProcessEventEmitter`
  - [ ] Inject `WorkToGatewayBridge` as work module's `EventPublisher`
  - [ ] Inject `InProcessEventEmitter` into gateway module
  - [ ] Inject `ChannelValidator` into `ManageSubscription`
  - [ ] Inject `TeamQueryPort` and `IssueQueryPort` into `AuthenticateConnection`

### Work Module Integration

- [ ] Create port interfaces for cross-module queries
  - [ ] Create `src/modules/identity/application/ports/out/team-query-port.ts`
    - [ ] Define: `getUserTeamIds(userId: string): Promise<string[]>`
    - [ ] Define: `isUserMember(userId: string, teamId: string): Promise<boolean>`
  - [ ] Create `src/modules/work/application/ports/out/issue-query-port.ts`
    - [ ] Define: `getUserIssueIds(userId: string): Promise<string[]>`
    - [ ] Define: `isUserWatchingOrAssigned(userId: string, issueId: string): Promise<boolean>`
  - [ ] Implement Drizzle adapters for each port

## Security

- [ ] Rate limiting: Add subscription rate limit (100/minute per connection)
  - [ ] Track subscribe/unsubscribe counts per connection in `InMemoryConnectionRepository`
  - [ ] Return `{ type: 'error', code: 'rate_limited', message: '...' }` when exceeded
- [ ] Input sanitization: Zod validation on all inbound messages (covered in API Layer)
- [ ] Connection limits: Enforce `WS_MAX_CONNECTIONS` (already implemented)

## Testing

### Unit Tests

- [ ] Test `WorkToGatewayBridge`
  - [ ] Test event type mapping (work event → gateway event)
  - [ ] Test channel determination (team vs issue channel)
  - [ ] Test `createGatewayEvent()` integration
- [ ] Test `ModuleChannelValidator`
  - [ ] Test team channel access (member → true, non-member → false)
  - [ ] Test issue channel access (watcher → true, non-watcher → false)
  - [ ] Test user channel access (self → true, other → false)
  - [ ] Test invalid channel format → false
- [ ] Test `ManageSubscription` (enhanced)
  - [ ] Test subscribe with valid channel → success
  - [ ] Test subscribe with invalid channel → `invalid_channel` error
  - [ ] Test subscribe with forbidden channel → `forbidden` error
  - [ ] Test idempotent subscribe → success (no error)
  - [ ] Test unsubscribe → success
- [ ] Test `AuthenticateConnection` (enhanced)
  - [ ] Test auto-subscription to user channel
  - [ ] Test auto-subscription to team channels
  - [ ] Test auto-subscription to issue channels
  - [ ] Test graceful handling of query failures

### Integration Tests

- [ ] Test full flow: Connect → Auth → Subscribe → Event broadcast
- [ ] Test channel validation flow: Auth → Subscribe to forbidden channel → Error
- [ ] Test event bridge flow: Work event published → Gateway event broadcast to subscribers
- [ ] Test auto-subscription flow: Auth → Verify team/issue channels subscribed

### Contract Tests

- [ ] Validate WebSocket message formats against `specs-api/websocket-gateway-protocol.md`
- [ ] Validate error codes match specification
- [ ] Validate event data shapes match specification

## Review

- [ ] Self-review: Verify all tasks completed
- [ ] PR checklist:
  - [ ] All unit tests pass
  - [ ] All integration tests pass
  - [ ] TypeScript compiles without errors
  - [ ] ESLint passes
  - [ ] No security vulnerabilities introduced
  - [ ] Documentation updated if needed
