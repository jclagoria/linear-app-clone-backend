# ADR-0006: Current Session Identification via Refresh Token Hash

- Status: Accepted
- Date: 2026-07-13

## Context

When listing or revoking sessions, the system must identify which session is the "current" one (the session making the request). The access token does not currently contain a session ID claim.

## Decision

Identify the current session by matching the refresh token hash from the request context against the sessions table. The refresh token hash is already available in the session store and uniquely identifies a session.

## Consequences

- **Positive**: Stateless — no need to modify access token claims or add session ID to JWT payload.
- **Positive**: No schema changes required; refresh_token_hash already exists.
- **Negative**: Requires passing the refresh token hash through the request context from auth middleware to use cases.
- **Neutral**: If the access token is used without a refresh token context (e.g., stateless validation only), the current session cannot be identified — this is acceptable for list/revoke endpoints which always require an active session.

## Alternatives Considered

1. **Add session ID to access token claims**: More explicit, but requires JWT schema change and token rotation on all existing sessions.
2. **Store session ID in Redis keyed by access token**: Extra Redis lookup, adds latency and complexity.
3. **Pass session ID via custom header**: Client-dependent, fragile.
