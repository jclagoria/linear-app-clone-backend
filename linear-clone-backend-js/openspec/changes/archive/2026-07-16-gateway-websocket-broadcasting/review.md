# Review — Gateway WebSocket & Broadcasting

## Spec Compliance

Pre-implementation — fill in after tasks are complete:

- [ ] All WebSocket protocol messages match `specs/api/websocket-protocol.md`
- [ ] Auth protocol matches specification (authenticate message within 5s)
- [ ] Channel subscription behavior matches spec (subscribe, unsubscribe, auto-subscribe)
- [ ] Event broadcasting rules match spec (team→all members, issue→watchers+assignee, user→specific)
- [ ] Online status tracking matches spec (multi-connection aware)
- [ ] All BDD scenarios from `specs/business/gateway-business-rules.md` pass

## Edge Cases

- [ ] Connection closed during authentication (before or after message)
- [ ] Malformed JSON in WebSocket message
- [ ] Subscribe to channel user does not have access to
- [ ] Multiple rapid subscribe/unsubscribe to same channel
- [ ] Very large event payload (>100KB)
- [ ] Concurrent connections: simultaneous auth, simultaneous subscribe
- [ ] Redis connection failure (online status should degrade gracefully)
- [ ] Server restart during active connections (clients reconnect)

## Leakage Check

- [ ] No implementation details leaked into specs (specs describe behavior, not code)
- [ ] Specs do not reference specific variable names, file paths, or library APIs

## Performance Bounds

- [ ] Auth processing: <50ms per authenticate message (JWT verification)
- [ ] Event broadcast: <10ms per subscriber per event (in-memory iteration)
- [ ] Connection limit: define `WS_MAX_CONNECTIONS` env var (default 1000)
- [ ] No blocking I/O in the WebSocket message processing path

## Migration Rollback

- No schema or data migrations involved (in-memory state only).
- Rollback: remove WebSocket server initialization from app composition root.

## Backward Compatibility

- New capability — no existing consumers to break.
- WebSocket server on separate port by default (no conflict with existing HTTP server).
- Environment variables have sensible defaults, no existing config changes needed.

## Checklist

- [ ] All requirements covered
- [ ] Scenarios pass
- [ ] Error states handled
- [ ] No technical detail in specs
- [ ] Performance bounds defined
- [ ] Migration rollback strategy documented
- [ ] Backward compatibility verified
